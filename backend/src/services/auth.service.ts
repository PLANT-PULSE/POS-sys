import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../middlewares/error.middleware';

const prisma = new PrismaClient();

const signToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const signRefreshToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
};

export const registerUser = async (data: any) => {
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
    });

    const accessToken = signToken(newUser.id, newUser.role);
    const refreshToken = signRefreshToken(newUser.id, newUser.role);

    // Strip password from output
    const { password, ...userWithoutPassword } = newUser;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const loginUser = async (data: any) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    if (!user.isActive) {
        throw new AppError('User account is deactivated', 403);
    }

    const accessToken = signToken(user.id, user.role);
    const refreshToken = signRefreshToken(user.id, user.role);

    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshAuthToken = async (token: string) => {
    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET as string
        );

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user || !user.isActive) {
            throw new Error();
        }

        const accessToken = signToken(user.id, user.role);
        return { accessToken };
    } catch (error) {
        throw new AppError('Invalid refresh token or token expired', 401);
    }
};
