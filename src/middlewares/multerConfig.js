import { ProductModel } from '../models/productModel.js';
import gemini from '../services/a.js';

/**
 * @desc Obtener todos los productos con filtros
 */
export const getProducts = async (req, res) => {
    try {
        const { name, category_id, minPrice, maxPrice } = req.query;
        const products = await ProductModel.getAll({ name, category_id, minPrice, maxPrice });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Obtener un producto por ID
 */
export const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.getById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Crear producto con imagen e IA
 */
export const createProduct = async (req, res) => {
    try {
        let { name, description, price, stock, category_id } = req.body;
        
        // 1. Capturar imagen de Multer
        const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

        // 2. IA: Si no hay descripción, Gemini la crea
        if (!description || description.trim() === "") {
            try {
                // Usamos el método que definimos en gemini.js
                description = await gemini.generateProductDescription(name, "Producto");
            } catch (aiError) {
                console.error("⚠️ IA Error:", aiError.message);
                description = "Descripción pendiente de revisión.";
            }
        }

        // 3. Guardar en DB
        const newProduct = await ProductModel.create({
            seller_id: req.user.id, // Viene del verifyToken
            category_id: category_id ? parseInt(category_id) : null,
            name,
            description,
            price: parseFloat(price) || 0,
            stock: parseInt(stock) || 0,
            image_url
        });

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("❌ Error createProduct:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Actualizar producto
 */
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category_id } = req.body;
        const image_url = req.file ? `/uploads/products/${req.file.filename}` : undefined;

        const updated = await ProductModel.update(req.params.id, {
            name,
            description,
            price: price ? parseFloat(price) : undefined,
            stock: stock ? parseInt(stock) : undefined,
            category_id: category_id ? parseInt(category_id) : undefined,
            image_url
        });

        if (!updated) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        
        res.json({ success: true, message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Eliminar producto
 */
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await ProductModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Producto no encontrado" });
        res.json({ success: true, message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};