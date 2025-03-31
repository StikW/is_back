export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: 'owner' | 'interested';
  created_at?: Date;
  updated_at?: Date;
}

export interface Property {
  id?: number;
  owner_id: number;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  status: 'available' | 'rented' | 'sold';
  created_at?: Date;
  updated_at?: Date;
}

export interface Favorite {
  id?: number;
  user_id: number;
  property_id: number;
  created_at?: Date;
}

export interface Message {
  id?: number;
  sender_id: number;
  receiver_id: number;
  property_id: number;
  content: string;
  is_read: boolean;
  created_at?: Date;
}

export interface Review {
  id?: number;
  property_id: number;
  reviewer_id: number;
  rating: number;
  comment?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'created_at' | 'updated_at'> {
  password: string;
} 