import { userModel } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * @desc Registrar un nuevo usuario
 * @route POST /api/usuarios/register
 */
export const register = async (req, res) => {
    const { full_name, email, password, role } = req.body;

    try {
        // Verificar si el email ya existe antes de insertar
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hashear contraseña y delegar la inserción al modelo
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserId = await userModel.create({
            full_name,
            email,
            password: hashedPassword,
            role: role || 'buyer'
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: { id: newUserId, full_name, email, role: role || 'buyer' }
        });

    } catch (error) {
        // Doble protección: si por alguna razón el email duplicado llega hasta la DB
        if (error.errno === 1062) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * @desc Iniciar sesión y obtener token JWT
 * @route POST /api/usuarios/login
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email usando el modelo
        const user = await userModel.findByEmail(email);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Comparar contraseña con el hash guardado
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Generar token JWT con id y rol
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};