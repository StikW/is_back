import { Request, Response } from 'express';
import pool from '../config/database';
import { Property, User } from '../types';

interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  state?: string;
  status?: 'available' | 'rented' | 'sold';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AuthRequest extends Request {
  user?: Omit<User, 'password'>;
}

export const searchProperties = async (req: Request, res: Response) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      city,
      state,
      status = 'available',
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Construir la consulta base
    let query = `
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email,
        (SELECT image_url FROM property_images WHERE property_id = p.id AND is_main = true LIMIT 1) as main_image
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];

    // Agregar condiciones de búsqueda
    if (search) {
      query += ` AND (p.title LIKE ? OR p.description LIKE ? OR p.address LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (minPrice) {
      query += ` AND p.price >= ?`;
      queryParams.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`;
      queryParams.push(maxPrice);
    }

    if (city) {
      query += ` AND p.city LIKE ?`;
      queryParams.push(`%${city}%`);
    }

    if (state) {
      query += ` AND p.state LIKE ?`;
      queryParams.push(`%${state}%`);
    }

    if (status) {
      query += ` AND p.status = ?`;
      queryParams.push(status);
    }

    // Agregar ordenamiento
    const validSortFields = ['price', 'created_at', 'title'];
    const validSortOrders = ['asc', 'desc'];
    
    const finalSortBy = validSortFields.includes(sortBy as string) ? sortBy : 'created_at';
    const finalSortOrder = validSortOrders.includes(sortOrder as string) ? sortOrder : 'desc';
    
    query += ` ORDER BY p.${finalSortBy} ${finalSortOrder}`;

    // Agregar paginación
    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(Number(limit), offset);

    // Ejecutar la consulta
    const [properties] = await pool.execute(query, queryParams);
    
    // Obtener el total de resultados para la paginación
    const [countResult]: any = await pool.execute(
      `SELECT COUNT(*) as total FROM properties p WHERE 1=1`,
      []
    );
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      properties,
      pagination: {
        total,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });

  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ message: 'Error searching properties' });
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [properties] = await pool.execute(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!Array.isArray(properties) || properties.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Obtener imágenes de la propiedad
    const [images] = await pool.execute(
      'SELECT * FROM property_images WHERE property_id = ?',
      [id]
    );

    const property = properties[0];
    return res.json({
      ...property,
      images: images
    });

  } catch (error) {
    console.error('Error getting property:', error);
    res.status(500).json({ message: 'Error getting property details' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      state,
      zip_code,
      status = 'available'
    } = req.body;

    const [result]: any = await pool.execute(`
      INSERT INTO properties (
        owner_id, title, description, price, 
        address, city, state, zip_code, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [userId, title, description, price, address, city, state, zip_code, status]);

    res.status(201).json({
      message: 'Property created successfully',
      propertyId: result.insertId
    });

  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property' });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verificar que la propiedad pertenezca al usuario
    const [properties]: any = await pool.execute(
      'SELECT * FROM properties WHERE id = ? AND owner_id = ?',
      [id, userId]
    );

    if (properties.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      state,
      zip_code,
      status
    } = req.body;

    await pool.execute(`
      UPDATE properties 
      SET title = ?, description = ?, price = ?, 
          address = ?, city = ?, state = ?, 
          zip_code = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, description, price, address, city, state, zip_code, status, id]);

    res.json({ message: 'Property updated successfully' });

  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verificar que la propiedad pertenezca al usuario
    const [properties]: any = await pool.execute(
      'SELECT * FROM properties WHERE id = ? AND owner_id = ?',
      [id, userId]
    );

    if (properties.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await pool.execute('DELETE FROM properties WHERE id = ?', [id]);

    res.json({ message: 'Property deleted successfully' });

  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
}; 