import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import logger from '../utils/logger';

// interface will be updated once User model is ready
export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        let token;

        // 1) Getting token and check of it's there
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        // 2) Verification token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // 3) We will check if user still exists later when prisma is connected
        // For now we just attach the decoded payload to req
        req.user = decoded;

        next();
    } catch (error) {
        logger.error('Auth error', error);
        next(new AppError('Invalid token or token has expired', 401));
    }
};
