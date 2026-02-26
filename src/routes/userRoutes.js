import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/userController.js';
import { validateResult } from '../middlewares/validateMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user (buyer/seller)
 */
router.post(
    '/register', 
    [
        body('full_name').notEmpty().withMessage('Full name is required'),
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        validateResult
    ], 
    register
);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate user & get token
 */
router.post(
    '/login', 
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        validateResult
    ], 
    login
);

export default router;