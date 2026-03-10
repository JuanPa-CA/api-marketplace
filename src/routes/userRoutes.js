import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { register, login } from '../controllers/userController.js';
import { validateResult } from '../middlewares/validateMiddleware.js';

const router = express.Router();

// ─────────────────────────────────────────────
// Rate Limiters
// ─────────────────────────────────────────────

/**
 * Limita los intentos de LOGIN a 10 por IP cada 15 minutos.
 * Protege contra ataques de fuerza bruta a contraseñas.
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10,
    message: {
        success: false,
        message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.'
    },
    standardHeaders: true,  // Incluye info del límite en headers (RateLimit-*)
    legacyHeaders: false
});

/**
 * Limita el REGISTRO a 5 cuentas por IP cada hora.
 * Evita la creación masiva de cuentas falsas.
 */
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5,
    message: {
        success: false,
        message: 'Demasiados registros desde esta IP. Intenta de nuevo en 1 hora.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// ─────────────────────────────────────────────
// Rutas
// ─────────────────────────────────────────────

/**
 * @route   POST /api/usuarios/register
 * @desc    Registrar un nuevo usuario (buyer/seller)
 * @access  Público (con rate limit: 5 registros/hora por IP)
 */
router.post(
    '/register',
    registerLimiter,
    [
        body('full_name').notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['buyer', 'seller', 'admin']).withMessage('Invalid role'),
        validateResult
    ],
    register
);

/**
 * @route   POST /api/usuarios/login
 * @desc    Autenticar usuario y obtener token JWT
 * @access  Público (con rate limit: 10 intentos/15min por IP)
 */
router.post(
    '/login',
    loginLimiter,
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        validateResult
    ],
    login
);

export default router;