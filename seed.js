import { pool } from './src/config/database.js';
import bcrypt from 'bcrypt';

const seedAdmin = async () => {
    try {
        const email = 'admin@marketplace.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
const query = `
    INSERT IGNORE INTO users (nombre, email, password)
    VALUES (?, ?, ?);
`;

await pool.query(query, ['Administrador', email, hashedPassword]);
        console.log('Usuario administrador procesado (creado o ya existía).');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear el administrador:', error);
        process.exit(1);
    }
};

seedAdmin();