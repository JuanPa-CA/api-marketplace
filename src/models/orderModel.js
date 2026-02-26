import { pool } from '../config/database.js';

export const orderModel = {
    getByUserId: async (userId) => {
        const query = `
            SELECT 
                o.id AS order_id, o.total, o.status, o.shipping_address, o.created_at,
                od.product_id, p.name AS product_name, od.quantity, od.unit_price, od.subtotal
            FROM orders o
            JOIN order_details od ON o.id = od.order_id
            JOIN products p ON od.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    },

    getOrderStatus: async (orderId, userId) => {
        const query = `
            SELECT id, status, total, created_at 
            FROM orders 
            WHERE id = ? AND user_id = ?
        `;
        const [rows] = await pool.query(query, [orderId, userId]);
        return rows[0];
    },

    updateStatus: async (orderId, newStatus) => {
        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [newStatus, orderId]
        );
        return result.affectedRows > 0;
    },

    create: async ({ user_id, items, total, shipping_address }) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const safeTotal = isNaN(Number(total)) ? 0 : Number(total);

            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total, status, shipping_address) VALUES (?, ?, "pending", ?)',
                [user_id, safeTotal, shipping_address || 'Not specified']
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                const price = isNaN(Number(item.price)) ? 0 : Number(item.price);
                const qty = isNaN(Number(item.quantity)) ? 0 : Number(item.quantity);
                const subtotal = price * qty;

                await connection.query(
                    'INSERT INTO order_details (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.product_id, qty, price, subtotal]
                );

                const [updateResult] = await connection.query(
                    'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
                    [qty, item.product_id, qty]
                );

                if (updateResult.affectedRows === 0) {
                    throw new Error(`Stock insuficiente para el producto ID: ${item.product_id}`);
                }
            }

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};