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
      
      // For now, use mock data since notifications table doesn't exist yet
      const mockNotifications: Notification[] = [
        {
          id: '1',
          user_id: userId || '',
          type: 'delivery',
          title: 'Colis livré avec succès',
          message: 'Votre colis KLG-001234 a été livré à Dakar',
          read: false,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          user_id: userId || '',
          type: 'message',
          title: 'Nouveau message',
          message: 'Ahmed Benali vous a envoyé un message',
          read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          user_id: userId || '',
          type: 'booking',
          title: 'Nouvelle réservation',
          message: 'Fatima Zahra a réservé votre trajet',
          read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      setNotifications(mockNotifications);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      toast.success('Notification marquée comme lue');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification supprimée');
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};