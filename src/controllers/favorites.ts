import { Request, Response } from 'express';
import pool from '../config/database';
import { User } from '../types';

interface AuthRequest extends Request {
  user?: Omit<User, 'password'>;
}

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const [rows] = await pool.execute(`
      SELECT p.*, f.createdAt as favoriteDate 
      FROM properties p 
      INNER JOIN favorites f ON p.id = f.propertyId 
      WHERE f.userId = ?
      ORDER BY f.createdAt DESC
    `, [userId]);

    res.json(rows);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Error getting favorites' });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { propertyId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verificar si ya existe el favorito
    const [existing] = await pool.execute(
      'SELECT * FROM favorites WHERE userId = ? AND propertyId = ?',
      [userId, propertyId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }

    await pool.execute(
      'INSERT INTO favorites (userId, propertyId) VALUES (?, ?)',
      [userId, propertyId]
    );

    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { propertyId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await pool.execute(
      'DELETE FROM favorites WHERE userId = ? AND propertyId = ?',
      [userId, propertyId]
    );

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { propertyId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verificar si ya existe el favorito
    const [existing] = await pool.execute(
      'SELECT * FROM favorites WHERE userId = ? AND propertyId = ?',
      [userId, propertyId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Si existe, lo eliminamos
      await pool.execute(
        'DELETE FROM favorites WHERE userId = ? AND propertyId = ?',
        [userId, propertyId]
      );
      res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      // Si no existe, lo agregamos
      await pool.execute(
        'INSERT INTO favorites (userId, propertyId) VALUES (?, ?)',
        [userId, propertyId]
      );
      res.json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ message: 'Error updating favorites' });
  }
}; 