"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminRole } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export interface ProductFilterParams {
  categorySlug?: string;
  productType?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "sales" | "discount";
  inStockOnly?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Get Filtered Products for Catalog & Shop
 */
export async function getProducts(params: ProductFilterParams = {}) {
  const {
    categorySlug,
    productType,
    search,
    minPrice,
    maxPrice,
    isFeatured,
    isBestSeller,
    isLimited,
    sortBy = "newest",
    inStockOnly = false,
    page = 1,
    limit = 24,
  } = params;

  const where: any = {
    isActive: true,
  };

  if (categorySlug && categorySlug !== "all") {
    where.category = { slug: categorySlug };
  }

  if (productType && productType !== "ALL") {
    where.productType = productType;
  }

  if (search && search.trim()) {
    where.OR = [
      { name: { contains: search.trim() } },
      { description: { contains: search.trim() } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = Number(minPrice);
    if (maxPrice !== undefined) where.price.lte = Number(maxPrice);
  }

  if (isFeatured !== undefined) where.isFeatured = isFeatured;
  if (isBestSeller !== undefined) where.isBestSeller = isBestSeller;
  if (isLimited !== undefined) where.isLimited = isLimited;

  if (inStockOnly) {
    where.OR = [
      { stockType: "UNLIMITED" },
      { stockQuantity: { gt: 0 } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  else if (sortBy === "price_desc") orderBy = { price: "desc" };
  else if (sortBy === "sales") orderBy = { totalSales: "desc" };
  else if (sortBy === "discount") orderBy = { discountPercent: "desc" };

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: {
            where: { isApproved: true, isHidden: false },
            select: { rating: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const items = products.map((prod) => {
      const ratings = prod.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5;

      let imagesArray: string[] = [];
      try {
        imagesArray = JSON.parse(prod.images || "[]");
      } catch {
        imagesArray = [prod.images];
      }

      return {
        ...prod,
        imagesArray,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: ratings.length,
      };
    });

    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("getProducts error:", error);
    return { items: [], totalCount: 0, totalPages: 0, currentPage: page };
  }
}

/**
 * Get Random Active Products for Hero Showcase Slider
 */
export async function getRandomProducts(count: number = 5) {
  try {
    const allActiveProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true, isHidden: false },
          select: { rating: true },
        },
      },
    });

    if (allActiveProducts.length === 0) return [];

    // Shuffle randomly
    const shuffled = [...allActiveProducts].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return selected.map((prod) => {
      const ratings = prod.reviews.map((r) => r.rating);
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5;

      let imagesArray: string[] = [];
      try {
        imagesArray = JSON.parse(prod.images || "[]");
      } catch {
        imagesArray = [prod.images];
      }

      return {
        ...prod,
        imagesArray,
        avgRating: Number(avgRating.toFixed(1)),
        reviewCount: ratings.length,
      };
    });
  } catch (error) {
    console.error("getRandomProducts error:", error);
    return [];
  }
}

/**
 * Get Single Product by Slug
 */
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true, isHidden: false },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product || !product.isActive) return null;

    let imagesArray: string[] = [];
    try {
      imagesArray = JSON.parse(product.images || "[]");
    } catch {
      imagesArray = [product.images];
    }

    let specs: any = null;
    try {
      specs = product.detailedSpecs ? JSON.parse(product.detailedSpecs) : null;
    } catch {
      specs = null;
    }

    const ratings = product.reviews.map((r) => r.rating);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 5;

    return {
      ...product,
      imagesArray,
      specs,
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: ratings.length,
    };
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

/**
 * Get Categories
 */
export async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  } catch (error) {
    console.error("getCategories error:", error);
    return [];
  }
}

/**
 * Admin: Create Product
 */
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number;
  categoryId: string;
  productType: any;
  stockType: any;
  stockQuantity: number;
  images: string[];
  detailedSpecs?: any;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isLimited?: boolean;
  deliveryTimeMinutes?: number;
  serviceRequirements?: string;
  accountDetailsEncrypted?: string;
}) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  const slug = `${slugify(data.name)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      discountPercent: data.discountPercent ? Number(data.discountPercent) : 0,
      categoryId: data.categoryId,
      productType: data.productType || "STOCK_CAR",
      stockType: data.stockType || "UNLIMITED",
      stockQuantity: Number(data.stockQuantity || 999),
      images: JSON.stringify(data.images || []),
      detailedSpecs: data.detailedSpecs ? JSON.stringify(data.detailedSpecs) : null,
      isFeatured: Boolean(data.isFeatured),
      isBestSeller: Boolean(data.isBestSeller),
      isLimited: Boolean(data.isLimited),
      deliveryTimeMinutes: Number(data.deliveryTimeMinutes || 15),
      serviceRequirements: data.serviceRequirements || null,
      accountDetailsEncrypted: data.accountDetailsEncrypted || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "CREATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: product.id,
      afterValue: JSON.stringify(product),
    },
  });

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { success: true, product };
}

/**
 * Admin: Update Product
 */
export async function updateProduct(id: string, data: Partial<any>) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  const oldProduct = await prisma.product.findUnique({ where: { id } });
  if (!oldProduct) throw new Error("المنتج غير موجود.");

  const updatePayload: any = { ...data };
  if (data.images && Array.isArray(data.images)) {
    updatePayload.images = JSON.stringify(data.images);
  }
  if (data.detailedSpecs && typeof data.detailedSpecs === "object") {
    updatePayload.detailedSpecs = JSON.stringify(data.detailedSpecs);
  }
  if (data.price !== undefined) updatePayload.price = Number(data.price);
  if (data.originalPrice !== undefined) updatePayload.originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
  if (data.stockQuantity !== undefined) updatePayload.stockQuantity = Number(data.stockQuantity);

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: updatePayload,
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "UPDATE_PRODUCT",
      targetType: "PRODUCT",
      targetId: id,
      beforeValue: JSON.stringify(oldProduct),
      afterValue: JSON.stringify(updatedProduct),
    },
  });

  revalidatePath("/shop");
  revalidatePath(`/product/${updatedProduct.slug}`);
  revalidatePath("/admin/products");
  return { success: true, product: updatedProduct };
}

/**
 * Admin: Delete / Archive Product
 */
export async function deleteProduct(id: string) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  // Soft delete by deactivating to preserve financial audit trail
  const product = await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "ARCHIVE_PRODUCT",
      targetType: "PRODUCT",
      targetId: id,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return { success: true };
}

/**
 * Admin: Create Category
 */
export async function createCategory(data: {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
  order?: number;
}) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  if (!data.name || !data.name.trim()) {
    throw new Error("يرجى إدخال اسم القسم.");
  }

  const baseSlug = slugify(data.name);
  const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

  const category = await prisma.category.create({
    data: {
      name: data.name.trim(),
      slug,
      description: data.description?.trim() || null,
      image: data.image?.trim() || "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800",
      icon: data.icon?.trim() || "FolderTree",
      order: Number(data.order || 0),
      isActive: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "CREATE_CATEGORY",
      targetType: "CATEGORY",
      targetId: category.id,
      afterValue: JSON.stringify(category),
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/cars");
  return { success: true, category };
}

/**
 * Admin: Update Category
 */
export async function updateCategory(id: string, data: {
  name?: string;
  description?: string;
  image?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
}) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  const oldCategory = await prisma.category.findUnique({ where: { id } });
  if (!oldCategory) throw new Error("القسم غير موجود.");

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: {
      name: data.name !== undefined ? data.name.trim() : undefined,
      description: data.description !== undefined ? data.description.trim() : undefined,
      image: data.image !== undefined ? data.image.trim() : undefined,
      icon: data.icon !== undefined ? data.icon.trim() : undefined,
      order: data.order !== undefined ? Number(data.order) : undefined,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "UPDATE_CATEGORY",
      targetType: "CATEGORY",
      targetId: id,
      beforeValue: JSON.stringify(oldCategory),
      afterValue: JSON.stringify(updatedCategory),
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/cars");
  return { success: true, category: updatedCategory };
}

/**
 * Admin: Delete Category
 */
export async function deleteCategory(id: string) {
  const admin = await requireAdminRole(["SUPER_ADMIN", "ADMIN"]);

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    // If category has products, deactivate it rather than throwing foreign key error
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  } else {
    await prisma.category.delete({ where: { id } });
  }

  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      adminEmail: admin.email,
      action: "DELETE_CATEGORY",
      targetType: "CATEGORY",
      targetId: id,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  revalidatePath("/cars");
  return { success: true };
}

