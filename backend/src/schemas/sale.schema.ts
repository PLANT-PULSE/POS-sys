import { z } from 'zod';

export const createSaleSchema = z.object({
    body: z.object({
        items: z.array(
            z.object({
                productId: z.string().uuid(),
                quantity: z.number().int().positive(),
                price: z.number().positive()
            })
        ).min(1, 'Sale must have at least one item'),
        discount: z.number().min(0).default(0).optional(),
        tax: z.number().min(0).default(0).optional(),
        paymentMethod: z.enum(['CASH', 'CARD', 'ONLINE'])
    }),
});

export const getSaleSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid sale ID'),
    }),
});
