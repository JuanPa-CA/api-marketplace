import { Router } from "express";
import { 
    getCategories, 
    getCategoryById, 
    getCategoryProducts, 
    generateCategoryAI, 
    getCategoryStats,
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; 

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.get("/:id/productos", getCategoryProducts);

router.post("/ia/generar", [verifyToken, isAdmin], generateCategoryAI);
router.get("/:id/estadisticas", [verifyToken, isAdmin], getCategoryStats);


router.post("/", [verifyToken, isAdmin, upload.single('imagen_icono')], createCategory);
router.put("/:id", [verifyToken, isAdmin, upload.single('imagen_icono')], updateCategory);

router.delete("/:id", [verifyToken, isAdmin], deleteCategory);

export default router;