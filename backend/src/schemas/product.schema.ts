import { z } from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        sku: z.string({ required_error: 'SKU is required' }),
        description: z.string().optional(),
        price: z.number({ required_error: 'Price is required' }).min(0),
        stock: z.number().int().min(0).optional(),
        categoryId: z.string().uuid({ message: 'Invalid Category ID' }),
    }),
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        sku: z.string().optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        stock: z.number().int().min(0).optional(),
        categoryId: z.string().uuid().optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().uuid('Invalid product ID'),
    }),
});
