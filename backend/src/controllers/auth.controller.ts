import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.refreshAuthToken(req.body.token);
        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
