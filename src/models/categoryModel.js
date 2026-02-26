import { pool } from '../config/database.js';

export const CategoryModel = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM categories');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    },

    getProducts: async (categoryId) => {
        const [rows] = await pool.query('SELECT * FROM products WHERE category_id = ?', [categoryId]);
        return rows;
    },

    getStats: async (id) => {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) as total_productos, 
                AVG(price) as precio_promedio,
                SUM(stock) as stock_total
            FROM products WHERE category_id = ?`, [id]);
        return rows[0];
    },

    create: async (name, description, imagen_icono = null) => {
        const [result] = await pool.query(
            'INSERT INTO categories (name, description, imagen_icono) VALUES (?, ?, ?)',
            [name, description, imagen_icono]
        );
        return { id: result.insertId, name, description, imagen_icono };
    },

    update: async (id, name, description, imagen_icono = null) => {
        const [result] = await pool.query(
            'UPDATE categories SET name = ?, description = ?, imagen_icono = ? WHERE id = ?',
            [name, description, imagen_icono, id]
        );
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};