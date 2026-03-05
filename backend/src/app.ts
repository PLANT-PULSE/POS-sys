import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler, AppError } from './middlewares/error.middleware';
import logger from './utils/logger';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import saleRoutes from './routes/sale.routes';
import inventoryRoutes from './routes/inventory.routes';
import reportRoutes from './routes/report.routes';
import logRoutes from './routes/log.routes';
import { logAction } from './middlewares/audit.middleware';

export const buildApp = (): Express => {
    const app = express();

    // Security Middlewares
    app.use(helmet());
    app.use(
        cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        })
    );

    // Rate Limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    });
    app.use('/api', limiter);

    // Body Parsing
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Logging
    app.use(
        morgan('combined', {
            stream: { write: (message) => logger.http(message.trim()) },
        })
    );

    // Health Check Endpoint
    app.get('/api/health', (req: Request, res: Response) => {
        res.status(200).json({ status: 'success', message: 'Server is healthy' });
    });

    // API Routes
    app.use('/api/auth', authRoutes);

    // Apply audit logging to specific routes that mutate state
    app.use('/api/users', logAction('User'), userRoutes);
    app.use('/api/products', logAction('Product'), productRoutes);
    app.use('/api/categories', logAction('Category'), categoryRoutes);
    app.use('/api/sales', logAction('Sale'), saleRoutes);
    app.use('/api/inventory', logAction('Inventory'), inventoryRoutes);
    app.use('/api/reports', reportRoutes); // GET operations
    app.use('/api/logs', logRoutes); // GET operations

    // Handle Undefined Routes
    app.all('*', (req: Request, res: Response, next) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });

    // Global Error Handler
    app.use(errorHandler);

    return app;
};
