import { pool } from '../config/database.js';

export const ProductModel = {
    getAll: async (filters = {}) => {
        const { name, category_id, minPrice, maxPrice } = filters;
        
        let query = `
            SELECT 
                p.id, p.seller_id, p.category_id, p.name, 
                p.description, p.price, p.stock, p.image_url,
                p.created_at, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        
        const params = [];

        if (name) {
            query += ` AND p.name LIKE ?`;
            params.push(`%${name}%`);
        }
        if (category_id) {
            query += ` AND p.category_id = ?`;
            params.push(category_id);
        }
        if (minPrice) {
            query += ` AND p.price >= ?`;
            params.push(minPrice);
        }
        if (maxPrice) {
            query += ` AND p.price <= ?`;
            params.push(maxPrice);
        }

        query += ` ORDER BY p.created_at DESC`;

        const [rows] = await pool.query(query, params);
        return rows;
    },

    getById: async (id) => {
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        `;
        const [rows] = await pool.query(query, [id]);
        return rows[0];
    },

    create: async (data) => {
        const query = `
            INSERT INTO products (seller_id, category_id, name, description, price, stock, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            data.seller_id, data.category_id, data.name, 
            data.description, data.price, data.stock, data.image_url
        ];

        const [result] = await pool.query(query, values);
        return { id: result.insertId, ...data };
    },

    update: async (id, data) => {
        const query = `
            UPDATE products 
            SET category_id = ?, name = ?, description = ?, price = ?, stock = ?, image_url = ?
            WHERE id = ?
        `;
        const values = [
            data.category_id, data.name, data.description, 
            data.price, data.stock, data.image_url, id
        ];

        const [result] = await pool.query(query, values);
        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};