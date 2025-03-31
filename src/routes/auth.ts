import { Router } from 'express';
import { login, register, verifyToken } from '../controllers/auth';

const router = Router();

// Ruta para registro de usuarios
router.post('/register', register);

// Ruta para login
router.post('/login', login);

// Ruta para verificar token
router.get('/verify', verifyToken);

export default router; 