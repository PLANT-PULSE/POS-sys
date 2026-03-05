import { PrismaClient } from '@prisma/client';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getAllCategories = async () => {
    return await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });
};

export const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true },
    });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    return category;
};

export const createCategory = async (data: any) => {
    const existing = await prisma.category.findUnique({
        where: { name: data.name },
    });

    if (existing) {
        throw new AppError('Category with this name already exists', 400);
    }

    return await prisma.category.create({ data });
};

export const updateCategory = async (id: string, data: any) => {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    if (data.name && data.name !== category.name) {
        const existing = await prisma.category.findUnique({
            where: { name: data.name },
        });
        if (existing) {
            throw new AppError('Category with this name already exists', 400);
        }
    }

    return await prisma.category.update({
        where: { id },
        data,
    });
};

export const deleteCategory = async (id: string) => {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
        throw new AppError('Category not found', 404);
    }

    // Soft delete
    return await prisma.category.update({
        where: { id },
        data: { isActive: false },
    });
};
