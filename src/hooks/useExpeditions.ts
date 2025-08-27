import { useState, useEffect } from 'react';
import { supabase, Expedition } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useExpeditions = (userId?: string) => {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchExpeditions();
    }
  }, [userId]);

  const fetchExpeditions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('expeditions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('client_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setExpeditions(data || []);
    } catch (error: any) {
      console.error('Error fetching expeditions:', error);
      toast.error('Erreur lors du chargement des expéditions');
    } finally {
      setLoading(false);
    }
  };

  const createExpedition = async (expeditionData: Omit<Expedition, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('expeditions')
        .insert(expeditionData)
        .select()
        .single();

      if (error) throw error;

      setExpeditions(prev => [data, ...prev]);
      toast.success('Expédition créée avec succès!');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
      return { data: null, error };
    }
  };

  const updateExpedition = async (id: string, updates: Partial<Expedition>) => {
    try {
      const { data, error } = await supabase
        .from('expeditions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setExpeditions(prev => 
        prev.map(exp => exp.id === id ? data : exp)
      );
      
      toast.success('Expédition mise à jour');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  const deleteExpedition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expeditions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpeditions(prev => prev.filter(exp => exp.id !== id));
      toast.success('Expédition supprimée');
      return { error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
      return { error };
    }
  };

  return {
    expeditions,
    loading,
    createExpedition,
    updateExpedition,
    deleteExpedition,
    refetch: fetchExpeditions,
  };
};