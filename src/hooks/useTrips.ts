import { useState, useEffect } from 'react';
import { supabase, Trip } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useTrips = (transporteurId?: string) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, [transporteurId]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('trips')
        .select('*')
        .order('departure_date', { ascending: true });

      if (transporteurId) {
        query = query.eq('transporteur_id', transporteurId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTrips(data || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast.error('Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Ensure transporteur_id is set correctly
      const tripWithTransporteur = {
        ...tripData,
        transporteur_id: tripData.transporteur_id
      };
      
      const { data, error } = await supabase
        .from('trips')
        .insert(tripWithTransporteur)
        .select()
        .single();

      if (error) throw error;

      setTrips(prev => [data, ...prev]);
      toast.success('Trajet créé avec succès!');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
      return { data: null, error };
    }
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTrips(prev => 
        prev.map(trip => trip.id === id ? data : trip)
      );
      
      toast.success('Trajet mis à jour');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrips(prev => prev.filter(trip => trip.id !== id));
      toast.success('Trajet supprimé');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
      return { error };
    }
  };

  const searchTrips = async (filters: {
    departure_city?: string;
    destination_city?: string;
    departure_date?: string;
    transport_type?: string;
  }) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('trips')
        .select('*')
        .eq('status', 'open')
        .order('departure_date', { ascending: true });

      if (filters.departure_city) {
        query = query.ilike('departure_city', `%${filters.departure_city}%`);
      }
      
      if (filters.destination_city) {
        query = query.ilike('destination_city', `%${filters.destination_city}%`);
      }
      
      if (filters.departure_date) {
        query = query.gte('departure_date', filters.departure_date);
      }
      
      if (filters.transport_type) {
        query = query.eq('transport_type', filters.transport_type);
      }

      const { data, error } = await query;

      if (error) throw error;

      setTrips(data || []);
      return { data, error: null };
    } catch (error: any) {
      console.error('Search error:', error);
      // Don't show error toast for empty results
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading,
    createTrip,
    updateTrip,
    deleteTrip,
    searchTrips,
    refetch: fetchTrips,
  };
};