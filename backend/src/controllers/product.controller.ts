import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  // Get all products with filters
  static async getProducts(req: Request, res: Response) {
    const {
      categoryId,
      categorySlug,
      brand,
      minPrice,
      maxPrice,
      search,
      sortBy,
      order,
      page,
      limit,
    } = req.query;

    const result = await ProductService.getProducts({
      categoryId: categoryId as string,
      categorySlug: categorySlug as string,
      brand: brand as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      search: search as string,
      sortBy: sortBy as "price" | "rating" | "createdAt",
      order: (order as "asc" | "desc") || "desc",
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });

    res.json(result);
  }

  // Get product by ID
  static async getProductById(req: Request, res: Response) {
    const { id } = req.params;

    const product = await ProductService.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  }

  // Get product by slug
  static async getProductBySlug(req: Request, res: Response) {
    const { slug } = req.params;

    const product = await ProductService.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  }

  // Create product (admin only)
  static async createProduct(req: Request, res: Response) {
    console.log("Creating product with data:", req.body);

    const { categoryId, ...productData } = req.body;

    const product = await ProductService.createProduct({
      ...productData,
      category: {
        connect: { id: categoryId },
      },
    });

    res.status(201).json(product);
  }

  // Update product (admin only)
  static async updateProduct(req: Request, res: Response) {
    const { id } = req.params;
    console.log("Updating product", id, "with data:", req.body);

    const { categoryId, ...productData } = req.body;

    const updateData: any = { ...productData };

    // Transform categoryId to nested connect if provided
    if (categoryId) {
      updateData.category = {
        connect: { id: categoryId },
      };
    }

    const product = await ProductService.updateProduct(id, updateData);
    res.json(product);
  }

  // Delete product (admin only)
  static async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;

    await ProductService.deleteProduct(id);
    res.json({ message: "Product deleted successfully" });
  }
}
