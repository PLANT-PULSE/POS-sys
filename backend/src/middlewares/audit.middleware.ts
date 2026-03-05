import { Request, Response, NextFunction } from 'express';
import { createAuditLog } from '../services/log.service';
import { AuthRequest } from './auth.middleware';

export const logAction = (entity: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        // We want to log the action after the response is sent successfully
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                let action = 'UNKNOWN';
                switch (req.method) {
                    case 'POST':
                        action = 'CREATE';
                        break;
                    case 'PATCH':
                    case 'PUT':
                        action = 'UPDATE';
                        break;
                    case 'DELETE':
                        action = 'DELETE';
                        break;
                    default:
                        return; // Don't log GET requests by default
                }

                if (req.user && req.user.id) {
                    const entityId = req.params?.id;
                    createAuditLog(req.user.id, action, entity, entityId, req.body);
                }
            }
        });

        next();
    };
};
