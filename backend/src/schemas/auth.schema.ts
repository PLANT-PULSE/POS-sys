import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string({ required_error: 'Name is required' }),
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email address'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be more than 6 characters'),
        role: z.enum(['Admin', 'Manager', 'Cashier']).optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email address'),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

export const refreshTokenSchema = z.object({
    body: z.object({
        token: z.string({ required_error: 'Refresh token is required' }),
    }),
});
