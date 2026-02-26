import { orderModel } from '../models/orderModel.js';

export const createOrder = async (req, res) => {
    try {
        const { items, shipping_address } = req.body;
        const user_id = req.user.id;

        if (!Array.isArray(items)) {
            return res.status(400).json({ success: false, message: "Items debe ser un arreglo []." });
        }

        const totalCalculado = items.reduce((acc, item) => {
            const precio = Number(item.price) || 0;
            const cantidad = Number(item.quantity) || 0;
            return acc + (precio * cantidad);
        }, 0);

        const orderId = await orderModel.create({ 
            user_id, 
            items, 
            total: totalCalculado, 
            shipping_address 
        });

        res.status(201).json({ 
            success: true, 
            message: "Orden procesada con éxito", 
            orderId,
            total: totalCalculado 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await orderModel.getByUserId(userId);

        const orders = rows.reduce((acc, curr) => {
            const { order_id, total, status, shipping_address, created_at, ...product } = curr;
            if (!acc[order_id]) {
                acc[order_id] = { order_id, total, status, shipping_address, created_at, items: [] };
            }
            acc[order_id].items.push(product);
            return acc;
        }, {});

        res.json({ success: true, data: Object.values(orders) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; 
        const userId = req.user.id; 

        const order = await orderModel.getOrderStatus(id, userId);

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Pedido no encontrado o no tienes permiso para verlo." 
            });
        }

        res.json({
            success: true,
            data: {
                order_id: order.id,
                status: order.status,
                total: order.total,
                created_at: order.created_at
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                success: false, 
                message: "Estado no válido. Use: pending, shipped, delivered o cancelled." 
            });
        }

        const updated = await orderModel.updateStatus(id, status);

        if (!updated) {
            return res.status(404).json({ 
                success: false, 
                message: "No se pudo actualizar. Verifique si el ID de la orden existe." 
            });
        }

        res.json({ 
            success: true, 
            message: `El estado de la orden #${id} ahora es: ${status}` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};