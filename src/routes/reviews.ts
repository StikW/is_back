import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// GET todas las reseñas de una propiedad
router.get('/property/:propertyId', async (req, res) => {
  res.json({ message: `Endpoint de reseñas para propiedad ${req.params.propertyId} - GET` });
});

// GET todas las reseñas de un usuario
router.get('/user/:userId', async (req, res) => {
  res.json({ message: `Endpoint de reseñas para usuario ${req.params.userId} - GET` });
});

// POST nueva reseña (protegido)
router.post('/', authenticateToken, async (req, res) => {
  res.json({ message: 'Endpoint de reseñas - POST' });
});

// PUT actualizar reseña (protegido)
router.put('/:id', authenticateToken, async (req, res) => {
  res.json({ message: `Endpoint de reseña ${req.params.id} - PUT` });
});

// DELETE eliminar reseña (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  res.json({ message: `Endpoint de reseña ${req.params.id} - DELETE` });
});

export default router; 