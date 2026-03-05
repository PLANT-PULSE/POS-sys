import { Router } from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/category.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';
import { deleteUserSchema, getUserSchema } from '../schemas/user.schema'; // Reuse ID validator

const router = Router();

// Protect all category routes
router.use(protect);

router.route('/')
    .get(getCategories)
    .post(restrictTo('Admin', 'Manager'), validate(createCategorySchema), createCategory);

router.route('/:id')
    .get(validate(getUserSchema), getCategory)
    .patch(restrictTo('Admin', 'Manager'), validate(updateCategorySchema), updateCategory)
    .delete(restrictTo('Admin', 'Manager'), validate(deleteUserSchema), deleteCategory);

export default router;
