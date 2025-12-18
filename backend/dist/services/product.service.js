"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../utils/prisma");
class ProductService {
    static async createProduct(data) {
        return prisma_1.prisma.product.create({ data });
    }
    static async getProducts(filters) {
        const { category, brand, minPrice, maxPrice, search, sortBy = "createdAt", order = "desc", page = 1, limit = 20, } = filters;
        const where = {};
        if (category)
            where.category = category;
        if (brand)
            where.brand = { contains: brand, mode: "insensitive" };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price.gte = minPrice;
            if (maxPrice)
                where.price.lte = maxPrice;
        }
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            prisma_1.prisma.product.findMany({
                where,
                orderBy: { [sortBy]: order },
                skip,
                take: limit,
            }),
            prisma_1.prisma.product.count({ where }),
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
    static async getProductById(id) {
        return prisma_1.prisma.product.findUnique({ where: { id } });
    }
    static async getProductBySlug(slug) {
        return prisma_1.prisma.product.findUnique({ where: { slug } });
    }
    static async updateProduct(id, data) {
        return prisma_1.prisma.product.update({
            where: { id },
            data,
        });
    }
    static async deleteProduct(id) {
        return prisma_1.prisma.product.delete({ where: { id } });
    }
    static async updateStock(id, quantity) {
        return prisma_1.prisma.product.update({
            where: { id },
            data: { stock: { increment: quantity } },
        });
    }
}
exports.ProductService = ProductService;
