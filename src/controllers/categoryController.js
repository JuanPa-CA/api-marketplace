import { CategoryModel } from '../models/categoryModel.js';
import { generateProductDescription } from '../../aiService.js';
import fs from 'fs';
import path from 'path';

/**
 * Elimina un archivo físico del disco si existe.
 * Recibe la ruta relativa guardada en DB (ej: /uploads/imagen.jpg)
 */
const deleteFileIfExists = (relativeUrl) => {
    if (!relativeUrl) return;
    try {
        // Convierte "/uploads/archivo.jpg" a "uploads/archivo.jpg" para fs
        const filePath = path.join(process.cwd(), relativeUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`🗑️  Archivo eliminado: ${filePath}`);
        }
    } catch (err) {
        // No rompemos el flujo si falla la limpieza del archivo
        console.error(`⚠️  No se pudo eliminar el archivo: ${relativeUrl}`, err.message);
    }
};

export const getCategories = async (req, res) => {
    try {
        const {
            name,
            startDate,
            endDate,
            sortBy = 'id',
            order = 'ASC',
            page = 1,
            limit = 10
        } = req.query;

        const validSortFields = ['id', 'name', 'created_at'];
        const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'id';
        const finalOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const currentPage = Math.max(1, parseInt(page) || 1);
        const itemsPerPage = Math.max(1, parseInt(limit) || 10);

        const { categories, totalItems } = await CategoryModel.getAll({
            name,
            startDate,
            endDate,
            sortBy: finalSortBy,
            order: finalOrder,
            page: currentPage,
            limit: itemsPerPage
        });

        res.json({
            success: true,
            data: categories,
            meta: {
                totalItems,
                itemCount: categories.length,
                itemsPerPage,
                totalPages: Math.ceil(totalItems / itemsPerPage),
                currentPage
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await CategoryModel.getById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: "Categoría no encontrada" });
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
        if (!name) return res.status(400).json({ success: false, message: "El nombre es requerido" });

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

        let imagen_icono = currentCategory.imagen_icono;

        // Si llega una imagen nueva, eliminar la anterior del disco
        if (req.file) {
            deleteFileIfExists(currentCategory.imagen_icono);
            imagen_icono = `/uploads/${req.file.filename}`;
        }

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
        const { id } = req.params;

        // Obtener la categoría antes de borrar para saber si tiene imagen
        const category = await CategoryModel.getById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Categoría no encontrada" });
        }

        const deleted = await CategoryModel.delete(id);
        if (!deleted) {
            return res.status(500).json({ success: false, message: "No se pudo eliminar la categoría" });
        }

        // Eliminar imagen del disco DESPUÉS de confirmar que se borró de la DB
        deleteFileIfExists(category.imagen_icono);

        res.json({ success: true, message: `Categoría "${category.name}" eliminada correctamente` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};