import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { 
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
} from '../controllers/favorites';

const router = Router();

// GET todos los favoritos del usuario
router.get('/', authenticateToken, async (req, res) => {
  res.json({ message: 'Endpoint de favoritos - GET' });
});

// POST agregar a favoritos
router.post('/:propertyId', authenticateToken, async (req, res) => {
  res.json({ message: `Endpoint para agregar propiedad ${req.params.propertyId} a favoritos - POST` });
});

// DELETE eliminar de favoritos
router.delete('/:propertyId', authenticateToken, async (req, res) => {
  res.json({ message: `Endpoint para eliminar propiedad ${req.params.propertyId} de favoritos - DELETE` });
});

// Toggle favorito (agregar/eliminar)
router.post('/toggle/:propertyId', authenticateToken, toggleFavorite);

export default router; 