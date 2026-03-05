import { z } from 'zod';

export const createTransactionSchema = z.object({
    body: z.object({
        productId: z.string().uuid({ message: 'Invalid Product ID' }),
        type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
        remarks: z.string().optional(),
    }),
});

export const getTransactionsSchema = z.object({
    query: z.object({
        productId: z.string().uuid().optional(),
        type: z.enum(['IN', 'OUT', 'ADJUSTMENT']).optional(),
    }).optional()
});
