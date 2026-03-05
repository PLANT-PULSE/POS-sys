import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });
    return users;
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};

export const createUser = async (data: any) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new AppError('Email already in use', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || Role.Cashier,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    return newUser;
};

export const updateUser = async (id: string, data: any) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
        const existingEmail = await prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingEmail) {
            throw new AppError('Email already in use by another user', 400);
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            updatedAt: true,
        },
    });

    return updatedUser;
};

export const deleteUser = async (id: string) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Soft delete by setting isActive to false
    await prisma.user.update({
        where: { id },
        data: { isActive: false },
    });

    return null;
};
