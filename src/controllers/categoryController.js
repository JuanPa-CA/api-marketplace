import { CategoryModel } from '../models/categoryModel.js';
import { generateProductDescription } from '../services/aiService.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.getAll();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await CategoryModel.getById(req.params.id);
        if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategoryProducts = async (req, res) => {
    try {
        const products = await CategoryModel.getProducts(req.params.id);
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategoryStats = async (req, res) => {
    try {
        const stats = await CategoryModel.getStats(req.params.id);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const generateCategoryAI = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "El nombre es requerido" });
        
        const description = await generateProductDescription(name, "Categoría de tienda");
        res.json({ success: true, description });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error con el servicio de IA" });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const imagen_icono = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name) {
            return res.status(400).json({ success: false, message: "El nombre es obligatorio" });
        }

        const newCategory = await CategoryModel.create(name, description, imagen_icono);
        
        res.status(201).json({ 
            success: true, 
            message: "Categoría creada correctamente",
            data: newCategory 
        });
    } catch (error) {
        console.error("Error al crear categoría:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const currentCategory = await CategoryModel.getById(id);
        if (!currentCategory) {
            return res.status(404).json({ success: false, message: "Categoría no encontrada" });
        }

        const imagen_icono = req.file ? `/uploads/${req.file.filename}` : currentCategory.imagen_icono;

        const updated = await CategoryModel.update(id, name, description, imagen_icono);
        
        if (!updated) {
            return res.status(400).json({ success: false, message: "No se realizaron cambios" });
        }

        res.json({ 
            success: true, 
            message: "Categoría actualizada correctamente",
            data: { id, name, description, imagen_icono }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const deleted = await CategoryModel.delete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Categoría no encontrada" });
        res.json({ success: true, message: "Eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};