import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  user_id: string;
  role: 'client' | 'transporteur' | 'admin';
  first_name?: string;
  last_name?: string;
  phone?: string;
  whatsapp?: string;
  avatar_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Expedition {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  weight_kg: number;
  dimensions_cm?: string;
  content_type: string;
  departure_city: string;
  destination_city: string;
  preferred_date?: string;
  transport_type?: 'avion' | 'voiture' | 'camion' | 'bus';
  max_budget?: number;
  photos?: string[];
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  transporteur_id: string;
  departure_city: string;
  destination_city: string;
  departure_date: string;
  departure_time?: string;
  transport_type: 'avion' | 'voiture' | 'camion' | 'bus';
  available_weight_kg: number;
  available_volume_m3?: number;
  price_per_kg: number;
  currency: string;
  vehicle_info?: string;
  status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  expedition_id: string;
  trip_id: string;
  client_id: string;
  transporteur_id: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_code: string;
  pickup_address?: string;
  delivery_address?: string;
  pickup_date?: string;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  reservation_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  reservation_id: string;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Helper functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return null;
  }

  return data;
};