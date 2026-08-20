"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdminRole } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { encryptData, decryptData } from "@/lib/encryption";
import { revalidatePath } from "next/cache";

interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

interface CreateOrderInput {
  items: CheckoutItemInput[];
  couponCode?: string | null;
  gameUsername?: string | null;
  gamePassword?: string | null;
  gamePlayerId?: string | null;
  customerNotes?: string | null;
}

/**
 * Create Order with Atomic Wallet Payment & Cryptographic Security
 */
export async function createOrder(input: CreateOrderInput) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("يجب تسجيل الدخول لإتمام عملية الشراء.");
  }

  if (!input.items || input.items.length === 0) {
    throw new Error("سلة الشراء فارغة.");
  }

  // 1. Fetch fresh products from database (Zero client trust)
  const productIds = input.items.map((i) => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (dbProducts.length !== input.items.length) {
    throw new Error("بعض المنتجات المطلوبة غير متوفرة أو تم إيقافها.");
  }

  // Check stock & calculate subtotal
  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    productName: string;
    productPrice: number;
    quantity: number;
    total: number;
    deliveredDataEncrypted?: string | null;
  }[] = [];

  for (const item of input.items) {
    const prod = dbProducts.find((p) => p.id === item.productId);
    if (!prod) throw new Error("منتج غير صالح.");

    // Check unique digital stock
    if (prod.stockType === "UNIQUE_DIGITAL" && prod.stockQuantity <= 0) {
      throw new Error(`المنتج "${prod.name}" تم بيعه بالفعل وغير متوفر.`);
    }

    if (prod.stockType === "QUANTITY" && prod.stockQuantity < item.quantity) {
      throw new Error(`الكمية المطلوبة من "${prod.name}" غير متوفرة بالمخزون.`);
    }

    const itemTotal = prod.price * item.quantity;
    subtotal += itemTotal;

    orderItemsData.push({
      productId: prod.id,
      productName: prod.name,
      productPrice: prod.price,
      quantity: item.quantity,
      total: itemTotal,
      deliveredDataEncrypted: prod.accountDetailsEncrypted || null,
    });
  }

  // 2. Validate Coupon if provided
  let discount = 0;
  let validatedCoupon: any = null;

  if (input.couponCode && input.couponCode.trim()) {
    const code = input.couponCode.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code, isActive: true },
    });

    if (coupon) {
      const now = new Date();
      const isExpired = coupon.expiresAt && coupon.expiresAt < now;
      const isMaxed = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
      const meetsMin = !coupon.minOrderValue || subtotal >= coupon.minOrderValue;

      if (!isExpired && !isMaxed && meetsMin) {
        if (coupon.discountType === "PERCENTAGE") {
          let calculated = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && calculated > coupon.maxDiscount) {
            calculated = coupon.maxDiscount;
          }
          discount = calculated;
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
        validatedCoupon = coupon;
      }
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  // 3. Encrypt game credentials if provided
  const encryptedPassword = input.gamePassword ? encryptData(input.gamePassword) : null;
  const orderNumber = generateOrderNumber();

  // 4. Execute ATOMIC PRISMA TRANSACTION (Zero double-spending)
  const result = await prisma.$transaction(async (tx) => {
    // A. Fetch current user wallet with lock
    const wallet = await tx.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      throw new Error("لم يتم العثور على محفظتك. يرجى إعادة تسجيل الدخول.");
    }

    const totalAvailable = wallet.balance + wallet.giftBalance;
    if (totalAvailable < finalTotal) {
      throw new Error("رصيد المحفظة غير كافٍ لإتمام عملية الشراء. يرجى شحن محفظتك أولاً.");
    }

    // Deduct from gift balance first, then main balance
    let giftDeduction = 0;
    let mainDeduction = 0;

    if (wallet.giftBalance >= finalTotal) {
      giftDeduction = finalTotal;
      mainDeduction = 0;
    } else {
      giftDeduction = wallet.giftBalance;
      mainDeduction = finalTotal - giftDeduction;
    }

    const beforeBalance = wallet.balance;
    const afterBalance = beforeBalance - mainDeduction;
    const beforeGift = wallet.giftBalance;
    const afterGift = beforeGift - giftDeduction;

    // B. Update Wallet
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: afterBalance,
        giftBalance: afterGift,
        totalSpent: wallet.totalSpent + finalTotal,
      },
    });

    // C. Create Initial Timeline
    const initialTimeline = JSON.stringify([
      {
        status: "PAID",
        title: "تم إنشاء الطلب وتأكيد الدفع",
        description: `تم دفع ${finalTotal} ج.م من رصيد المحفظة بنجاح`,
        timestamp: new Date().toISOString(),
      },
      {
        status: "PROCESSING",
        title: "جاري تجهيز الطلب",
        description: "تم تحويل الطلب لفريق العمل للتنفيذ",
        timestamp: new Date().toISOString(),
      },
    ]);

    // D. Create Order
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        subtotal,
        discount,
        couponCode: validatedCoupon ? validatedCoupon.code : null,
        total: finalTotal,
        status: "PROCESSING",
        paymentMethod: "WALLET",
        gameUsername: input.gameUsername || null,
        gamePasswordEncrypted: encryptedPassword,
        gamePlayerId: input.gamePlayerId || null,
        customerNotes: input.customerNotes || null,
        timeline: initialTimeline,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // E. Decrement Stock and Increment Sales
    for (const item of input.items) {
      const prod = dbProducts.find((p) => p.id === item.productId)!;
      let newStock = prod.stockQuantity;
      let newActive = prod.isActive;

      if (prod.stockType === "UNIQUE_DIGITAL") {
        newStock = 0;
        newActive = false; // digital unique account sold
      } else if (prod.stockType === "QUANTITY") {
        newStock = Math.max(0, prod.stockQuantity - item.quantity);
      }

      await tx.product.update({
        where: { id: prod.id },
        data: {
          stockQuantity: newStock,
          isActive: newActive,
          totalSales: prod.totalSales + item.quantity,
        },
      });
    }

    // F. Record Coupon Usage
    if (validatedCoupon) {
      await tx.coupon.update({
        where: { id: validatedCoupon.id },
        data: { usedCount: validatedCoupon.usedCount + 1 },
      });

      await tx.couponUsage.create({
        data: {
          couponId: validatedCoupon.id,
          userId: user.id,
          orderId: order.id,
          discountAmount: discount,
        },
      });
    }

    // G. Create Transaction Record
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "PURCHASE",
        amount: finalTotal,
        beforeBalance,
        afterBalance,
        beforeGiftBalance: beforeGift,
        afterGiftBalance: afterGift,
        description: `شراء طلب جديد #${orderNumber} (${orderItemsData.length} عناصر)`,
        referenceId: orderNumber,
      },
    });

    // H. Create Notification
    await tx.notification.create({
      data: {
        userId: user.id,
        title: "تم إنشاء طلبك بنجاح! 🚀",
        message: `تم استلام طلبك رقم ${orderNumber} بمبلغ ${finalTotal} ج.م وجاري تنفيذه من قبل المتخصصين.`,
        type: "ORDER_STATUS",
        link: `/orders/${orderNumber}`,
      },
    });

    return order;
  });

  revalidatePath("/wallet");
  revalidatePath("/orders");
  revalidatePath("/admin/orders");

  return { success: true, order: result };
}

/**
 * Get Orders for Customer
 */
export async function getMyOrders() {
  const user = await getCurrentUser();
  if (!user) return [];

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { slug: true, images: true, productType: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

/**
 * Get Single Order by Order Number (with security check)
 */
export async function getOrderByNumber(orderNumber: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!order) return null;

  // Only the owner or Admins can view the order
  const isAdmin = ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ORDER_MANAGER"].includes(user.role);
  if (order.userId !== user.id && !isAdmin) {
    throw new Error("غير مصرح لك بمشاهدة هذا الطلب.");
  }

  // Decrypt delivered data or password for authorized viewing
  let decryptedGamePassword = null;
  if (isAdmin && order.gamePasswordEncrypted) {
    decryptedGamePassword = decryptData(order.gamePasswordEncrypted);
  }

  return {
    ...order,
    decryptedGamePassword,
  };
}

/**
 * Admin: Update Order Status & Progress Timeline
 */
export async function updateOrderStatus(data: {
  orderId: string;
  status: "PENDING" | "PAID" | "PROCESSING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "REJECTED";
  adminNotes?: string;
  customStepTitle?: string;
}) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN", "ORDER_MANAGER"]);

  const order = await prisma.order.findUnique({
    where: { id: data.orderId },
  });

  if (!order) throw new Error("الطلب غير موجود.");

  let timelineArray: any[] = [];
  try {
    timelineArray = JSON.parse(order.timeline || "[]");
  } catch {
    timelineArray = [];
  }

  const statusTitles: Record<string, string> = {
    PROCESSING: "جاري تجهيز الطلب",
    IN_PROGRESS: "جاري تنفيذ الخدمة داخل اللعبة",
    COMPLETED: "تم إكمال وتسليم الطلب بنجاح ✅",
    CANCELLED: "تم إلغاء الطلب",
    REJECTED: "تم رفض الطلب",
  };

  timelineArray.push({
    status: data.status,
    title: data.customStepTitle || statusTitles[data.status] || data.status,
    description: data.adminNotes || `تحديث حالة الطلب إلى ${data.status}`,
    timestamp: new Date().toISOString(),
  });

  const updatedOrder = await prisma.order.update({
    where: { id: data.orderId },
    data: {
      status: data.status,
      adminNotes: data.adminNotes || order.adminNotes,
      timeline: JSON.stringify(timelineArray),
    },
  });

  // Send Notification to customer
  await prisma.notification.create({
    data: {
      userId: order.userId,
      title: data.status === "COMPLETED" ? "اكتمل طلبك بنجاح! 🎉" : "تحديث في حالة طلبك 🔔",
      message: `تم تحديث حالة طلبك رقم ${order.orderNumber} إلى: ${statusTitles[data.status] || data.status}.`,
      type: "ORDER_STATUS",
      link: `/orders/${order.orderNumber}`,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "UPDATE_ORDER_STATUS",
      targetType: "ORDER",
      targetId: order.id,
      beforeValue: JSON.stringify({ status: order.status }),
      afterValue: JSON.stringify({ status: data.status, notes: data.adminNotes }),
    },
  });

  revalidatePath(`/orders/${order.orderNumber}`);
  revalidatePath("/admin/orders");
  return { success: true, order: updatedOrder };
}

/**
 * Admin: 1-Click Order Refund back to Customer Wallet
 */
export async function refundOrder(orderId: string, reason: string, customAmount?: number) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { include: { wallet: true } } },
  });

  if (!order) throw new Error("الطلب غير موجود.");
  if (order.status === "REFUNDED") throw new Error("تم استرجاع هذا الطلب مسبقاً.");

  const refundAmount = customAmount !== undefined && customAmount > 0 ? customAmount : order.total;

  const result = await prisma.$transaction(async (tx) => {
    // 1. Get or create wallet
    let wallet = await tx.wallet.findUnique({ where: { userId: order.userId } });
    if (!wallet) {
      wallet = await tx.wallet.create({
        data: {
          userId: order.userId,
          balance: 0.0,
          giftBalance: 0.0,
          totalDeposited: 0.0,
          totalSpent: 0.0,
        },
      });
    }

    const beforeBalance = wallet.balance;
    const afterBalance = beforeBalance + refundAmount;

    // 2. Return funds to wallet
    const updatedWallet = await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: afterBalance,
        totalSpent: Math.max(0, wallet.totalSpent - refundAmount),
      },
    });

    // 3. Update timeline
    let timelineArray: any[] = [];
    try {
      timelineArray = JSON.parse(order.timeline || "[]");
    } catch {
      timelineArray = [];
    }

    timelineArray.push({
      status: "REFUNDED",
      title: "تم استرجاع مبلغ الطلب للمحفظة 💰",
      description: `تم رد مبلغ ${refundAmount} ج.م إلى رصيد محفظتك. السبب: ${reason || "استرجاع من الإدارة"}`,
      timestamp: new Date().toISOString(),
    });

    // 4. Update order
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "REFUNDED",
        refundedAmount: refundAmount,
        adminNotes: `تم الاسترجاع: ${reason}`,
        timeline: JSON.stringify(timelineArray),
      },
    });

    // 5. Create REFUND Transaction
    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "REFUND",
        amount: refundAmount,
        beforeBalance,
        afterBalance,
        beforeGiftBalance: wallet.giftBalance,
        afterGiftBalance: wallet.giftBalance,
        description: `استرجاع مالي للطلب #${order.orderNumber} - ${reason || "بواسطة الإدارة"}`,
        referenceId: order.orderNumber,
      },
    });

    // 6. Notify customer
    await tx.notification.create({
      data: {
        userId: order.userId,
        title: "تم استرجاع المبلغ لمحفظتك 💰",
        message: `تم رد مبلغ ${refundAmount} ج.م للطلب رقم ${order.orderNumber} إلى رصيد محفظتك بنجاح.`,
        type: "SYSTEM",
        link: "/wallet",
      },
    });

    // 7. Audit log
    await tx.auditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action: "REFUND_ORDER",
        targetType: "ORDER",
        targetId: order.id,
        beforeValue: JSON.stringify({ status: order.status, total: order.total }),
        afterValue: JSON.stringify({ status: "REFUNDED", refundAmount, reason }),
      },
    });

    return { updatedOrder, updatedWallet };
  });

  revalidatePath(`/orders/${order.orderNumber}`);
  revalidatePath("/admin/orders");
  revalidatePath("/wallet");
  return { success: true, result };
}
