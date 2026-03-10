import { Router } from "express";
import { body } from "express-validator";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { upload } from "../config/multer.js";
import { validateResult } from "../middlewares/validateMiddleware.js";

const router = Router();

/**
 * @route GET /api/productos
 * @desc Listar todos los productos con filtros opcionales (Público)
 * @query name, category_id, minPrice, maxPrice
 */
router.get("/", getProducts);

/**
 * @route GET /api/productos/:id
 * @desc Obtener un producto por ID (Público)
 */
router.get("/:id", getProductById);

/**
 * @route POST /api/productos
 * @desc Crear un producto con imagen y descripción IA (Privado - requiere token)
 * @body name, price, stock, category_id, description (opcional, lo genera la IA)
 * @file image (campo del archivo en multipart/form-data)
 */
router.post(
    "/",
    [
        verifyToken,
        upload.single("image"),
        body("name").notEmpty().withMessage("El nombre del producto es obligatorio"),
        body("price").isNumeric().withMessage("El precio debe ser un número"),
        body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser un entero positivo"),
        validateResult
    ],
    createProduct
);

/**
 * @route PUT /api/productos/:id
 * @desc Actualizar un producto existente (Privado - requiere token)
 * @body name, description, price, stock, category_id (todos opcionales)
 * @file image (opcional, reemplaza la imagen actual)
 */
router.put(
    "/:id",
    [
        verifyToken,
        upload.single("image"),
        body("price").optional().isNumeric().withMessage("El precio debe ser un número"),
        body("stock").optional().isInt({ min: 0 }).withMessage("El stock debe ser un entero positivo"),
        validateResult
    ],
    updateProduct
);

/**
 * @route DELETE /api/productos/:id
 * @desc Eliminar un producto (Privado - requiere token)
 */
router.delete("/:id", verifyToken, deleteProduct);

export default router;