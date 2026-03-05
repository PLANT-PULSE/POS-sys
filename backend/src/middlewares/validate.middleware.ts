import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './error.middleware';

export const validate =
    (schema: AnyZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorMessages = error.errors.map((issue: any) => ({
                        message: `${issue.path.join('.')} is ${issue.message}`,
                    }));
                    res.status(400).json({
                        status: 'fail',
                        message: 'Invalid data provided',
                        errors: errorMessages,
                    });
                } else {
                    next(new AppError('Validation failed', 400));
                }
            }
        };
