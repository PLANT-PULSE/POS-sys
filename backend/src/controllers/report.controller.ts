import { Request, Response, NextFunction } from 'express';
import * as reportService from '../services/report.service';

export const getDailyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await reportService.getDailyReport(req.query.date as string);
        res.status(200).json({ status: 'success', data: report });
    } catch (error) {
        next(error);
    }
};

export const getWeeklyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await reportService.getWeeklyReport();
        res.status(200).json({ status: 'success', data: report });
    } catch (error) {
        next(error);
    }
};

export const getMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const report = await reportService.getMonthlyReport();
        res.status(200).json({ status: 'success', data: report });
    } catch (error) {
        next(error);
    }
};

export const getTopSellingProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
        const report = await reportService.getTopSellingProducts(limit);
        res.status(200).json({ status: 'success', data: report });
    } catch (error) {
        next(error);
    }
};
