import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  // Get all categories
  static async getCategories(req: Request, res: Response) {
    const { parentId, isActive } = req.query;

    const filters: any = {};

    if (parentId === "null" || parentId === "") {
      filters.parentId = null;
    } else if (parentId) {
      filters.parentId = parentId as string;
    }

    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }

    const categories = await CategoryService.getCategories(filters);
    res.json(categories);
  }

  // Get category tree
  static async getCategoryTree(req: Request, res: Response) {
    const tree = await CategoryService.getCategoryTree();
    res.json(tree);
  }

  // Get category by ID
  static async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;

    const category = await CategoryService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  }

  // Get category by slug
  static async getCategoryBySlug(req: Request, res: Response) {
    const { slug } = req.params;

    const category = await CategoryService.getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  }

  // Create category (Admin only)
  static async createCategory(req: Request, res: Response) {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  }

  // Update category (Admin only)
  static async updateCategory(req: Request, res: Response) {
    const { id } = req.params;

    const category = await CategoryService.updateCategory(id, req.body);
    res.json(category);
  }

  // Delete category (Admin only)
  static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await CategoryService.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
