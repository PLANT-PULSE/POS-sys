import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({ status: 'success', data: { products } });
    } catch (error) {
        next(error);
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
