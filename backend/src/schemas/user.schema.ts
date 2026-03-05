import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be more than 6 characters'),
        role: z.enum(['Admin', 'Manager', 'Cashier']).optional(),
    }),
});

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().email('Invalid email address').optional(),
        role: z.enum(['Admin', 'Manager', 'Cashier']).optional(),
        isActive: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string().uuid('Invalid user ID format'),
    }),
});

export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID format'),
    }),
});

export const getUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID format'),
    }),
});
