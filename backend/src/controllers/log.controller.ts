import { Request, Response, NextFunction } from 'express';
import * as logService from '../services/log.service';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await logService.getAuditLogs();
        res.status(200).json({ status: 'success', data: { logs } });
    } catch (error) {
        next(error);
    }
};
