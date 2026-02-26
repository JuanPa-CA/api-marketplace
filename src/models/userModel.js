import { pool } from '../config/database.js';

export const userModel = {
    create: async (userData) => {
        const { full_name, email, password, role } = userData;
        
        const query = `
            INSERT INTO users (full_name, email, password, role) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.execute(query, [
            full_name, 
            email, 
            password, 
            role || 'buyer' 
        ]);
        
        return result.insertId;
    },

    findByEmail: async (email) => {
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await pool.execute(query, [email]);
        return rows[0];
    }
};