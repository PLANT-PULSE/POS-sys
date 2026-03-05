import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getAllProducts = async () => {
    return await prisma.product.findMany({
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};

export const getProductById = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: { select: { id: true, name: true } },
        },
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    return product;
};

export const createProduct = async (data: any) => {
    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
    });

    if (existingSku) {
        throw new AppError('Product with this SKU already exists', 400);
    }

    // Ensure category exists
    const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
    });

    if (!categoryExists) {
        throw new AppError('Category does not exist', 404);
    }

    return await prisma.product.create({
        data,
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};

export const updateProduct = async (id: string, data: any) => {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    if (data.sku && data.sku !== product.sku) {
        const existingSku = await prisma.product.findUnique({
            where: { sku: data.sku },
        });
        if (existingSku) {
            throw new AppError('Product with this SKU already exists', 400);
        }
    }

    if (data.categoryId && data.categoryId !== product.categoryId) {
        const categoryExists = await prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!categoryExists) {
            throw new AppError('Category does not exist', 404);
        }
    }

    return await prisma.product.update({
        where: { id },
        data,
        include: {
            category: { select: { id: true, name: true } },
        },
    });
};

export const deleteProduct = async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Soft delete
    return await prisma.product.update({
        where: { id },
        data: { isActive: false },
    });
};
