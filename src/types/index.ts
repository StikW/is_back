export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'owner' | 'interested';
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  ownerId: string;
  type: 'apartment' | 'house' | 'room';
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  isAvailable: boolean;
  images: string[];
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
  password: string;
} 