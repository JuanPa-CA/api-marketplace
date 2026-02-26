import { ProductModel } from '../models/productModel.js';
import { generateProductDescription } from '../services/aiService.js';

/**
 * @desc Obtener lista de productos con soporte para filtros y búsqueda
 * @route GET /api/productos
 */
export const getProducts = async (req, res) => {
    try {
        const { name, category_id, minPrice, maxPrice } = req.query;

        const filters = {
            name,
            category_id: category_id ? parseInt(category_id) : null,
            minPrice: minPrice ? parseFloat(minPrice) : null,
            maxPrice: maxPrice ? parseFloat(maxPrice) : null
        };

        const products = await ProductModel.getAll(filters);
        
        res.json({ 
            success: true, 
            count: products.length,
            data: products 
        });
    } catch (error) {
        console.error("Error en GET products:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Crear un producto con soporte de IA para descripción
 * @route POST /api/productos
 */
export const createProduct = async (req, res) => {
    try {
        let { name, description, price, stock, category_id } = req.body;

        if (!description || description.trim() === "") {
            console.log(`🤖 Generando descripción inteligente para: ${name}...`);
            
            try {
                const aiDescription = await generateProductDescription(name, "Producto");
                description = aiDescription; 
            } catch (aiError) {
                console.error("Fallo al generar con IA, usando descripción por defecto:", aiError.message);
                description = "Producto de excelente calidad disponible en nuestro catálogo.";
            }
        }

        // --- INSERCIÓN EN BASE DE DATOS ---
        const newProduct = await ProductModel.create({
            seller_id: req.user.id, // Obtenido del token por verifyToken
            category_id: category_id ? parseInt(category_id) : null,
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            image_url: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente con IA",
            data: newProduct
        });

    } catch (error) {
        console.error("Error en POST productos:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Obtener un producto por ID
 * @route GET /api/productos/:id
 */
export const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.getById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};