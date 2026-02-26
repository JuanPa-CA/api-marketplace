import { pool } from '../config/database.js';
import { analyzeReviews } from '../services/aiService.js';

export const addReview = async (req, res) => {
    try {
        const { product_id, rating, comment } = req.body;
        const user_id = req.user.id;

        await pool.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [product_id, user_id, rating, comment]
        );

        res.status(201).json({ success: true, message: "Reseña añadida" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductAiAnalysis = async (req, res) => {
    try {
        const { productId } = req.params;
        const [product] = await pool.query('SELECT name FROM products WHERE id = ?', [productId]);
        const [reviews] = await pool.query('SELECT comment FROM reviews WHERE product_id = ?', [productId]);

        if (reviews.length === 0) {
            return res.json({ success: true, analysis: "No hay reseñas suficientes para analizar." });
        }

        const reviewTexts = reviews.map(r => r.comment);
        const analysis = await analyzeReviews(product[0].name, reviewTexts);

        res.json({ success: true, analysis });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};