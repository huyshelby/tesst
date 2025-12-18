"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
class ProductController {
    // Get all products with filters
    static async getProducts(req, res) {
        const { category, brand, minPrice, maxPrice, search, sortBy, order, page, limit, } = req.query;
        const result = await product_service_1.ProductService.getProducts({
            category: category,
            brand: brand,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            search: search,
            sortBy: sortBy,
            order: order || "desc",
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
        res.json(result);
    }
    // Get product by ID
    static async getProductById(req, res) {
        const { id } = req.params;
        const product = await product_service_1.ProductService.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    // Get product by slug
    static async getProductBySlug(req, res) {
        const { slug } = req.params;
        const product = await product_service_1.ProductService.getProductBySlug(slug);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    // Create product (admin only)
    static async createProduct(req, res) {
        const product = await product_service_1.ProductService.createProduct(req.body);
        res.status(201).json(product);
    }
    // Update product (admin only)
    static async updateProduct(req, res) {
        const { id } = req.params;
        const product = await product_service_1.ProductService.updateProduct(id, req.body);
        res.json(product);
    }
    // Delete product (admin only)
    static async deleteProduct(req, res) {
        const { id } = req.params;
        await product_service_1.ProductService.deleteProduct(id);
        res.json({ message: "Product deleted successfully" });
    }
}
exports.ProductController = ProductController;
