import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { addReview, getProductAiAnalysis } from "../controllers/reviewController.js";

const router = Router();

router.post("/", verifyToken, addReview);

router.get("/analysis/:productId", getProductAiAnalysis);

export default router;