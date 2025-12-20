import { prisma } from "../utils/prisma";
import type { Prisma } from "@prisma/client";

export class ProductService {
  static async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  }

  static async getProducts(filters: {
    categoryId?: string;
    categorySlug?: string;
    brand?: string;
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    ram?: number[];
    storage?: number[];
    sortBy?: "price" | "rating" | "createdAt";
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) {
    const {
      categoryId,
      categorySlug,
      brand,
      brands,
      minPrice,
      maxPrice,
      search,
      ram,
      storage,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 20,
    } = filters;

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) where.categoryId = categoryId;
    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }
    if (brands && brands.length) {
      (where as any).brand = { in: brands };
    } else if (brand) {
      (where as any).brand = { contains: brand, mode: "insensitive" };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (ram && ram.length) {
      where.ram = { in: ram } as any;
    }
    if (storage && storage.length) {
      where.storage = { in: storage } as any;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { [sortBy]: order },
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  static async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  }

  static async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  static async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stock: { increment: quantity } },
    });
  }
}


  static async getHomeSections(categorySlugs: string[], limit: number) {
    const queries = categorySlugs.map((slug) =>
      this.getProducts({
        categorySlug: slug,
        limit,
        sortBy: "createdAt",
        order: "desc",
      }).then((res) => ({ [slug]: res.products }))
    );

    const results = await Promise.all(queries);
    return Object.assign({}, ...results);
  }
        where: {
          category: {
            slug: section.slug,
          },
          isActive: true,
        },
        include: {
          category: true,
        },
        orderBy: { createdAt: "desc" },
        take: section.limit,
      })
    );

    const results = await Promise.all(sectionPromises);

    const homeData: Record<string, any[]> = {};
    sections.forEach((section, index) => {
      homeData[section.slug] = results[index];
    });

    return homeData;
  }
