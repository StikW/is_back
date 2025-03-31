import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { 
  searchProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/properties';

const router = Router();

// GET buscar propiedades con filtros
router.get('/search', searchProperties);

// GET todas las propiedades
router.get('/', searchProperties);

// GET una propiedad específica
router.get('/:id', getPropertyById);

// POST nueva propiedad (protegido)
router.post('/', authenticateToken, createProperty);

// PUT actualizar propiedad (protegido)
router.put('/:id', authenticateToken, updateProperty);

// DELETE eliminar propiedad (protegido)
router.delete('/:id', authenticateToken, deleteProperty);

export default router; 