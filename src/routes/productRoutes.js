import { Router } from "express";
import { body } from "express-validator";
import { getProducts, createProduct } from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";
import { validateResult } from "../middlewares/validateMiddleware.js";

const router = Router();

/**
 * @route GET /api/products
 * @desc Get all products (Public)
 */
router.get("/", getProducts);

/**
 * @route POST /api/products
 * @desc Create a product with image and AI (Private)
 * Field name for the file: 'image'
 */
router.post(
    "/", 
    [
        verifyToken, 
        upload.single('image'), 
        body('name').notEmpty().withMessage('Product name is required'),
        body('price').isNumeric().withMessage('Price must be a number'),
        validateResult
    ], 
    createProduct
);

export default router;