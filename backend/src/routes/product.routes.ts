import { Router } from 'express';
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { validate } from '../middlewares/validate.middleware';
import { protect } from '../middlewares/auth.middleware';
import { restrictTo } from '../middlewares/role.middleware';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';
import { getUserSchema, deleteUserSchema } from '../schemas/user.schema'; // Reuse ID validator

const router = Router();

// Protect all product routes
router.use(protect);

router.route('/')
    .get(getProducts)
    .post(restrictTo('Admin', 'Manager'), validate(createProductSchema), createProduct);

router.route('/:id')
    .get(validate(getUserSchema), getProduct)
    .patch(restrictTo('Admin', 'Manager'), validate(updateProductSchema), updateProduct)
    .delete(restrictTo('Admin', 'Manager'), validate(deleteUserSchema), deleteProduct);

export default router;
