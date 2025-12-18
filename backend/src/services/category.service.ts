import { prisma } from "../utils/prisma";
import type { Prisma } from "@prisma/client";

export class CategoryService {
  // Get all categories
  static async getCategories(filters?: {
    parentId?: string | null;
    isActive?: boolean;
  }) {
    const where: Prisma.CategoryWhereInput = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.parentId === null) {
      // Get root categories only
      where.parentId = null;
    } else if (filters?.parentId) {
      where.parentId = filters.parentId;
    }

    return prisma.category.findMany({
      where,
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
  }

  // Get category by ID
  static async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  // Create category
  static async createCategory(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  // Update category
  static async updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  // Delete category
  static async deleteCategory(id: string) {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category._count.products > 0) {
      throw new Error(
        "Cannot delete category with existing products. Please reassign or delete products first."
      );
    }

    return prisma.category.delete({
      where: { id },
    });
  }

  // Get category tree (hierarchical structure)
  static async getCategoryTree() {
    const rootCategories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { displayOrder: "asc" },
            },
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    return rootCategories;
  }
}
