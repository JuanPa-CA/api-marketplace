import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { 
    createOrder, 
    getUserOrders, 
    getOrderStatus, 
    updateOrderStatus 
} from "../controllers/orderController.js";

const router = Router();

// Obtener todas las órdenes del usuario logueado
router.get("/my-orders", verifyToken, getUserOrders);

/**
 * @openapi
 * /api/ordenes/status/{id}:
 * get:
 * summary: Obtener el estado de un pedido específico
 * tags: [Ordenes]
 * parameters:
 * - in: header
 * name: authorization
 * required: true
 * schema:
 * type: string
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID de la orden
 * responses:
 * 200:
 * description: Información del estado del pedido
 * 404:
 * description: Pedido no encontrado
 */
router.get("/status/:id", verifyToken, getOrderStatus);

/**
 * @openapi
 * /api/ordenes/status/{id}:
 * put:
 * summary: Actualizar el estado de un pedido (Admin)
 * tags: [Ordenes]
 * parameters:
 * - in: header
 * name: authorization
 * required: true
 * schema:
 * type: string
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * status:
 * type: string
 * enum: [pending, shipped, delivered, cancelled]
 * example: "shipped"
 * responses:
 * 200:
 * description: Estado actualizado con éxito
 * 400:
 * description: Estado no válido
 */
router.put("/status/:id", verifyToken, updateOrderStatus);

/**
 * @openapi
 * /api/ordenes/:
 * post:
 * summary: Crear una nueva orden (El total se calcula automáticamente)
 * tags: [Ordenes]
 * parameters:
 * - in: header
 * name: authorization
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * shipping_address:
 * type: string
 * items:
 * type: array
 * items:
 * type: object
 * properties:
 * product_id:
 * type: integer
 * quantity:
 * type: integer
 * price:
 * type: number
 * example:
 * shipping_address: "Calle Falsa 123"
 * items:
 * - product_id: 4
 * quantity: 2
 * price: 5.00
 * responses:
 * 201:
 * description: Orden creada con éxito
 */
router.post("/", verifyToken, createOrder);

export default router;