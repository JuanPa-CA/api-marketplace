import { ProductModel } from '../models/productModel.js';
import { generateProductDescription } from '../../aiService.js';

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

/**
 * @desc Crear un producto con soporte de IA para descripción
 * @route POST /api/productos
 */
export const createProduct = async (req, res) => {
    try {
        let { name, description, price, stock, category_id } = req.body;

        // Si no viene descripción, la genera Gemini automáticamente
        if (!description || description.trim() === "") {
            console.log(`🤖 Generando descripción inteligente para: ${name}...`);
            try {
                description = await generateProductDescription(name, "Producto");
            } catch (aiError) {
                console.error("Fallo al generar con IA, usando descripción por defecto:", aiError.message);
                description = "Producto de excelente calidad disponible en nuestro catálogo.";
            }
        }

        const newProduct = await ProductModel.create({
            seller_id: req.user.id,
            category_id: category_id ? parseInt(category_id) : null,
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            image_url: req.file ? `/uploads/${req.file.filename}` : null
        });

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            data: newProduct
        });

    } catch (error) {
        console.error("Error en POST productos:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Actualizar un producto existente
 * @route PUT /api/productos/:id
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el producto existe antes de actualizar
        const existing = await ProductModel.getById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        const { name, description, price, stock, category_id } = req.body;

        // Si sube una imagen nueva la usamos, si no conservamos la anterior
        const image_url = req.file
            ? `/uploads/${req.file.filename}`
            : existing.image_url;

        const updated = await ProductModel.update(id, {
            category_id: category_id ? parseInt(category_id) : existing.category_id,
            name: name || existing.name,
            description: description || existing.description,
            price: price ? parseFloat(price) : existing.price,
            stock: stock !== undefined ? parseInt(stock) : existing.stock,
            image_url
        });

        if (!updated) {
            return res.status(400).json({ success: false, message: "No se realizaron cambios" });
        }

        const updatedProduct = await ProductModel.getById(id);
        res.json({
            success: true,
            message: "Producto actualizado correctamente",
            data: updatedProduct
        });

    } catch (error) {
        console.error("Error en PUT productos:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Eliminar un producto
 * @route DELETE /api/productos/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await ProductModel.getById(id);
        if (!existing) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        const deleted = await ProductModel.delete(id);
        if (!deleted) {
            return res.status(500).json({ success: false, message: "No se pudo eliminar el producto" });
        }

        res.json({ success: true, message: `Producto "${existing.name}" eliminado correctamente` });

    } catch (error) {
        console.error("Error en DELETE productos:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};