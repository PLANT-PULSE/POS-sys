import { Router } from 'express';
import { getAuditLogs } from '../controllers/log.controller';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';

const router = Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('Admin')); // Only admins can view audit logs

router.get('/', getAuditLogs);

export default router;
