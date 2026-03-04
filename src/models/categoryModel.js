import { pool } from '../config/database.js';

export const CategoryModel = {
    // 1. Método getAll actualizado con filtros y paginación
    getAll: async (filters = {}) => {
        const { 
            name, 
            startDate, 
            endDate, 
            sortBy = 'id', 
            order = 'ASC', 
            page = 1, 
            limit = 10 
        } = filters;

        const offset = (page - 1) * limit;
        let query = 'SELECT * FROM categories';
        let countQuery = 'SELECT COUNT(*) as total FROM categories';
        let params = [];
        let conditions = [];

        // Filtro por nombre (Búsqueda)
        if (name) {
            conditions.push("name LIKE ?");
            params.push(`%${name}%`);
        }

        // Filtro por rango de fechas
        if (startDate && endDate) {
            conditions.push("created_at BETWEEN ? AND ?");
            params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
        }

        // Construir el WHERE si hay condiciones
        if (conditions.length > 0) {
            const whereClause = ` WHERE ${conditions.join(" AND ")}`;
            query += whereClause;
            countQuery += whereClause;
        }

        // Ordenamiento y Paginación (Se usan valores ya saneados en el controlador)
        query += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
        
        // Ejecutamos ambas consultas: una para los datos y otra para el total
        const [rows] = await pool.query(query, [...params, parseInt(limit), offset]);
        const [countResult] = await pool.query(countQuery, params);

        return {
            categories: rows,
            totalItems: countResult[0].total
        };
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