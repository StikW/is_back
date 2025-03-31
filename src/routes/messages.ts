import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// GET todos los mensajes del usuario
router.get('/', authenticateToken, async (req, res) => {
  res.json({ message: 'Endpoint de mensajes - GET' });
});

// GET conversación específica
router.get('/:conversationId', authenticateToken, async (req, res) => {
  res.json({ message: `Endpoint de conversación ${req.params.conversationId} - GET` });
});

// POST nuevo mensaje
router.post('/', authenticateToken, async (req, res) => {
  res.json({ message: 'Endpoint de mensajes - POST' });
});

// PUT marcar mensaje como leído
router.put('/:id/read', authenticateToken, async (req, res) => {
  res.json({ message: `Endpoint de mensaje ${req.params.id} - PUT (marcar como leído)` });
});

export default router; 