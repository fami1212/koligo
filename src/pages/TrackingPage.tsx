import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Search,
  Eye,
  MessageCircle,
  User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface TrackingPageProps {
  user: any;
}

interface Reservation {
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
  trip?: {
    departure_city: string;
    destination_city: string;
    departure_date: string;
  };
  client?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  transporteur?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
  expedition?: {
    description: string;
    weight_kg: number;
  };
}

const TrackingPage: React.FC<TrackingPageProps> = ({ user }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('reservations')
        .select(`
          *,
          trip:trips(departure_city, destination_city, departure_date),
          client:client_id(first_name, last_name, phone),
          transporteur:transporteur_id(first_name, last_name, phone),
          expedition:expeditions(description, weight_kg)
        `)
        .order('created_at', { ascending: false });

      if (user?.profile?.role === 'client') {
        query = query.eq('client_id', user.id);
      } else if (user?.profile?.role === 'transporteur') {
        query = query.eq('transporteur_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reservations:', error);
        throw error;
      }

      console.log('Fetched reservations:', data);
      setReservations(data || []);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast.error('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
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

      // Mettre à jour localement
      setReservations(prev => prev.map(res => 
        res.id === id ? { ...res, ...updateData } : res
      ));
      
      toast.success('Statut mis à jour');
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
      return { data: null, error };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'in_transit': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livré';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesFilter = filter === 'all' || reservation.status === filter;
    const matchesSearch = !searchQuery || 
      reservation.tracking_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.trip?.departure_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.trip?.destination_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.profile?.role === 'transporteur' 
        ? `${reservation.client?.first_name} ${reservation.client?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
        : `${reservation.transporteur?.first_name} ${reservation.transporteur?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {user?.profile?.role === 'transporteur' ? 'Mes transports' : 'Mes colis'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez l'état de vos {user?.profile?.role === 'transporteur' ? 'transports' : 'expéditions'}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={
                    user?.profile?.role === 'transporteur' 
                      ? "Rechercher par code, ville, nom client..."
                      : "Rechercher par code, ville, nom transporteur..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'all' ? 'Tous' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reservations List */}
        <div className="space-y-6">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation, index) => (
              <motion.div
                key={reservation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-lg text-white">
                        <Package className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {reservation.tracking_code}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {reservation.trip?.departure_city || 'Inconnu'} → {reservation.trip?.destination_city || 'Inconnu'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Créé le {new Date(reservation.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>
                        {user?.profile?.role === 'transporteur' 
                          ? `Client: ${reservation.client?.first_name || 'Inconnu'} ${reservation.client?.last_name || ''}`
                          : `Transporteur: ${reservation.transporteur?.first_name || 'Inconnu'} ${reservation.transporteur?.last_name || ''}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4" />
                      <span>{reservation.total_price} MAD</span>
                    </div>
                  </div>

                  {reservation.expedition && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Contenu:</strong> {reservation.expedition.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Poids:</strong> {reservation.expedition.weight_kg} kg
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {reservation.status === 'delivered' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Livré avec succès</span>
                        </div>
                      )}
                      {user?.profile?.role === 'transporteur' && reservation.status === 'confirmed' && (
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'in_transit')}
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Marquer en transit
                        </button>
                      )}
                      {user?.profile?.role === 'transporteur' && reservation.status === 'in_transit' && (
                        <button
                          onClick={() => updateReservationStatus(reservation.id, 'delivered', { delivery_date: new Date().toISOString() })}
                          className="text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Marquer livré
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Aucune {user?.profile?.role === 'transporteur' ? 'transport' : 'expédition'} trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' 
                  ? `Vous n'avez pas encore de ${user?.profile?.role === 'transporteur' ? 'transports' : 'colis'}.`
                  : `Aucune ${user?.profile?.role === 'transporteur' ? 'transport' : 'expédition'} avec le statut "${getStatusText(filter)}".`
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;