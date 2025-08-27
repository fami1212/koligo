import { useState, useEffect } from 'react';
import { supabase, Reservation } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useReservations = (userId?: string, userRole?: 'client' | 'transporteur') => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && userRole) {
      fetchReservations();
    }
  }, [userId, userRole]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('reservations_extended')
        .select('*')
        .order('created_at', { ascending: false });

      if (userRole === 'client') {
        query = query.eq('client_id', userId);
      } else if (userRole === 'transporteur') {
        query = query.eq('transporteur_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setReservations(data || []);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (reservationData: {
    trip_id: string;
    client_id: string;
    transporteur_id: string;
    total_price: number;
    pickup_address?: string;
    delivery_address?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          expedition_id: null, // Will be set when expedition system is implemented
          ...reservationData,
          status: 'pending',
          tracking_code: `KLG${Date.now()}`,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReservations(); // Refresh the list
      toast.success('Réservation créée avec succès!');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la réservation');
      return { data: null, error };
    }
  };

  const updateReservationStatus = async (id: string, status: string, updates?: any) => {
    try {
      const updateData = { status, ...updates };
      
      const { data, error } = await supabase
        .from('reservations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchReservations(); // Refresh the list
      toast.success('Statut mis à jour');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  const cancelReservation = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchReservations(); // Refresh the list
      toast.success('Réservation annulée');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'annulation');
      return { data: null, error };
    }
  };

  return {
    reservations,
    loading,
    createReservation,
    updateReservationStatus,
    cancelReservation,
    refetch: fetchReservations,
  };
};