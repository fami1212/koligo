import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  MessageCircle,
  Star
} from 'lucide-react';
import { useReservations } from '../hooks/useReservations';

interface TrackingPageProps {
  user: any;
}

const TrackingPage: React.FC<TrackingPageProps> = ({ user }) => {
  const { reservations, loading, updateReservationStatus } = useReservations(user?.id, user?.profile?.role);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
      reservation.expedition_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.departure_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.destination_city?.toLowerCase().includes(searchQuery.toLowerCase());
    
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
                  placeholder="Rechercher par code de suivi, ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'in_transit', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                          {reservation.departure_city} → {reservation.destination_city}
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
                      <MapPin className="h-4 w-4" />
                      <span>
                        {user?.profile?.role === 'transporteur' 
                          ? `Client: ${reservation.client_first_name} ${reservation.client_last_name}`
                          : `Transporteur: ${reservation.transporteur_first_name} ${reservation.transporteur_last_name}`
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4" />
                      <span>{reservation.total_price} MAD</span>
                    </div>
                  </div>

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