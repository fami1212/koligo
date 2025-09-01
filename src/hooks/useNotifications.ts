import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  user_id: string;
  type: 'delivery' | 'message' | 'booking' | 'rating' | 'alert' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      
      // Subscribe to real-time notifications
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          }, 
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Get user's reservations to generate dynamic notifications
      const { data: reservations, error } = await supabase
        .from('reservations_extended')
        .select('*')
        .or(`client_id.eq.${userId},transporteur_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Generate notifications from reservations
      const dynamicNotifications: Notification[] = [];
      
      reservations?.forEach((reservation, index) => {
        const isTransporteur = reservation.transporteur_id === userId;
        const isClient = reservation.client_id === userId;
        
        // Notification for reservation creation
        if (isTransporteur) {
          dynamicNotifications.push({
            id: `booking-${reservation.id}`,
            user_id: userId || '',
            type: 'booking',
            title: 'Nouvelle réservation',
            message: `${reservation.client_first_name} ${reservation.client_last_name} a réservé votre trajet ${reservation.departure_city} → ${reservation.destination_city}`,
            read: index > 2, // First 3 unread
            created_at: reservation.created_at
          });
        }
        
        // Status change notifications
        if (reservation.status === 'delivered') {
          dynamicNotifications.push({
            id: `delivery-${reservation.id}`,
            user_id: userId || '',
            type: 'delivery',
            title: isClient ? 'Colis livré' : 'Transport terminé',
            message: `${isClient ? 'Votre colis' : 'Votre transport'} ${reservation.tracking_code} a été livré avec succès`,
            read: index > 1,
            created_at: reservation.delivery_date || reservation.updated_at
          });
        } else if (reservation.status === 'in_transit') {
          dynamicNotifications.push({
            id: `transit-${reservation.id}`,
            user_id: userId || '',
            type: 'delivery',
            title: isClient ? 'Colis en transit' : 'Transport en cours',
            message: `${isClient ? 'Votre colis' : 'Votre transport'} ${reservation.tracking_code} est en cours de livraison`,
            read: index > 0,
            created_at: reservation.pickup_date || reservation.updated_at
          });
        }
      });

      // Add some system notifications
      if (dynamicNotifications.length > 0) {
        dynamicNotifications.push({
          id: 'welcome',
          user_id: userId || '',
          type: 'system',
          title: 'Bienvenue sur KoliGo!',
          message: `Votre compte ${userRole} est maintenant actif. Commencez à ${userRole === 'transporteur' ? 'proposer vos trajets' : 'envoyer vos colis'}.`,
          read: true,
          created_at: user?.created_at || new Date().toISOString()
        });
      }

      setNotifications(dynamicNotifications);
      setUnreadCount(dynamicNotifications.filter(n => !n.read).length);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty array on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};