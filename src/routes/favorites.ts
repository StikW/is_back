import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { 
  getFavorites,
  addFavorite,
  removeFavorite,
  toggleFavorite
} from '../controllers/favorites';

const router = Router();

// Obtener favoritos del usuario
router.get('/', authenticateToken, getFavorites);

// Agregar a favoritos
router.post('/:propertyId', authenticateToken, addFavorite);

// Eliminar de favoritos
router.delete('/:propertyId', authenticateToken, removeFavorite);

// Toggle favorito (agregar/eliminar)
router.post('/toggle/:propertyId', authenticateToken, toggleFavorite);

export default router; 