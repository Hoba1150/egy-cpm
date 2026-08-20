"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireAdminRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Customer: Submit Product Review
 */
export async function submitProductReview(data: {
  productId: string;
  rating: number;
  comment?: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("يجب تسجيل الدخول لإضافة تقييم.");

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    throw new Error("يرجى تحديد تقييم من 1 إلى 5 نجوم.");
  }

  // Check if product exists
  const product = await prisma.product.findUnique({ where: { id: data.productId } });
  if (!product) throw new Error("المنتج غير موجود.");

  const review = await prisma.review.create({
    data: {
      userId: user.id,
      productId: data.productId,
      rating: Number(data.rating),
      comment: data.comment?.trim() || null,
      isApproved: true,
      isHidden: false,
    },
  });

  revalidatePath(`/product/${product.slug}`);
  revalidatePath("/admin/reviews");
  return { success: true, review };
}

/**
 * Admin: Moderate Review (Hide / Delete)
 */
export async function moderateReview(reviewId: string, action: "HIDE" | "UNHIDE" | "DELETE") {
  await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  if (action === "DELETE") {
    await prisma.review.delete({ where: { id: reviewId } });
  } else {
    await prisma.review.update({
      where: { id: reviewId },
      data: { isHidden: action === "HIDE" },
    });
  }

  revalidatePath("/admin/reviews");
  return { success: true };
}
