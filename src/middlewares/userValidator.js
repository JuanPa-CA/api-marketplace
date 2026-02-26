import { body, validationResult } from 'express-validator';

export const validateRegister = [
    body('full_name')
        .notEmpty().withMessage('El nombre completo es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    
    body('email')
        .isEmail().withMessage('Debe ser un correo electrónico válido'),
    
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('role')
        .optional()
        .isIn(['buyer', 'seller', 'admin']).withMessage('Rol no válido'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errores: errors.array() });
        }
        next(); 
    }
];

export const validateLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errores: errors.array() });
        }
        next();
    }
];