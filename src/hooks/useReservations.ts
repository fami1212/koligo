import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
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

      // Test simple d'abord - juste les réservations sans jointures
      let query = supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (userRole === 'client') {
        query = query.eq('client_id', userId);
      } else if (userRole === 'transporteur') {
        query = query.eq('transporteur_id', userId);
      }

      const { data: reservationsData, error: reservationsError } = await query;

      if (reservationsError) {
        console.error('Error fetching basic reservations:', reservationsError);
        throw reservationsError;
      }

      console.log('Basic reservations fetched:', reservationsData);

      // Si on a des réservations, on enrichit les données
      if (reservationsData && reservationsData.length > 0) {
        const enrichedReservations = await Promise.all(
          reservationsData.map(async (reservation) => {
            try {
              let tripData = null;
              let expeditionData = null;
              let clientData = null;
              let transporteurData = null;

              // Récupérer les informations du trajet
              try {
                const { data: trip } = await supabase
                  .from('trips')
                  .select('departure_city, destination_city, departure_date')
                  .eq('id', reservation.trip_id)
                  .single();
                tripData = trip;
              } catch (tripError) {
                console.error('Error fetching trip:', tripError);
              }

              // Récupérer les informations de l'expédition
              try {
                const { data: expedition } = await supabase
                  .from('expeditions')
                  .select('description, weight_kg')
                  .eq('id', reservation.expedition_id)
                  .single();
                expeditionData = expedition;
              } catch (expeditionError) {
                console.error('Error fetching expedition:', expeditionError);
              }

              // Récupérer les informations du client
              try {
                const { data: client } = await supabase
                  .from('profiles')
                  .select('first_name, last_name, phone')
                  .eq('user_id', reservation.client_id)
                  .single();
                clientData = client;
              } catch (clientError) {
                console.error('Error fetching client:', clientError);
              }

              // Récupérer les informations du transporteur
              try {
                const { data: transporteur } = await supabase
                  .from('profiles')
                  .select('first_name, last_name, phone')
                  .eq('user_id', reservation.transporteur_id)
                  .single();
                transporteurData = transporteur;
              } catch (transporteurError) {
                console.error('Error fetching transporteur:', transporteurError);
              }

              return {
                ...reservation,
                trip: tripData,
                expedition: expeditionData,
                client: clientData,
                transporteur: transporteurData
              };
            } catch (error) {
              console.error('Error enriching reservation:', error);
              return reservation;
            }
          })
        );

        setReservations(enrichedReservations);
      } else {
        setReservations([]);
      }
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const createReservation = async (
    reservationData: {
      trip_id: string;
      client_id: string;
      transporteur_id: string;
      total_price: number;
      pickup_address?: string;
      delivery_address?: string;
      pickup_date?: string;
    },
    expeditionData: {
      weight: string;
      description: string;
      departure_city: string;
      destination_city: string;
      content_type: string;
    }
  ) => {
    try {
      console.log('Creating expedition first...');

      // Préparer les données pour l'expédition
      const expeditionInsertData = {
        client_id: reservationData.client_id,
        title: `Expédition ${new Date().toLocaleDateString()}`,
        description: expeditionData.description,
        weight_kg: parseFloat(expeditionData.weight) || 0,
        content_type: expeditionData.content_type,
        departure_city: expeditionData.departure_city,
        destination_city: expeditionData.destination_city,
        preferred_date: reservationData.pickup_date ? new Date(reservationData.pickup_date).toISOString().split('T')[0] : null,
        status: 'pending' as const
      };

      // D'abord créer l'expédition
      const { data: expedition, error: expeditionError } = await supabase
        .from('expeditions')
        .insert(expeditionInsertData)
        .select()
        .single();

      if (expeditionError) {
        console.error('Error creating expedition:', expeditionError);
        throw expeditionError;
      }

      console.log('Expedition created:', expedition);

      // Maintenant créer la réservation
      const { data, error } = await supabase
        .from('reservations')
        .insert({
          expedition_id: expedition.id,
          trip_id: reservationData.trip_id,
          client_id: reservationData.client_id,
          transporteur_id: reservationData.transporteur_id,
          total_price: reservationData.total_price,
          pickup_address: reservationData.pickup_address,
          delivery_address: reservationData.delivery_address,
          pickup_date: reservationData.pickup_date,
          status: 'pending',
          tracking_code: `GC${Date.now()}`,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Reservation created successfully:', data);

      await fetchReservations();
      toast.success('Réservation créée avec succès!');
      return { data, error: null };
    } catch (error: any) {
      console.error('Error in createReservation:', error);
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

      await fetchReservations();
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

      await fetchReservations();
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