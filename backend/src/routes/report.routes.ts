import { Router } from 'express';
import {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getTopSellingProducts
} from '../controllers/report.controller';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';

const router = Router();

// Protect all routes - Reports only visible to Admin and Manager
router.use(protect);
router.use(restrictTo('Admin', 'Manager'));

router.get('/daily', getDailyReport);
router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);
router.get('/top-products', getTopSellingProducts);

export default router;
