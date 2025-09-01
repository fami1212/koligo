import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Filter, 
  Star, 
  Shield, 
  Clock,
  Package,
  Plane,
  Car,
  Truck
} from 'lucide-react';
import { useTrips } from '../hooks/useTrips';

interface SearchPageProps {
  user: any;
}

const SearchPage: React.FC<SearchPageProps> = ({ user }) => {
  const { trips, loading, searchTrips } = useTrips();
  const [filters, setFilters] = useState({
    departure: '',
    destination: '',
    date: '',
    transport: ''
  });

  useEffect(() => {
    // Load initial trips
    searchTrips({});
  }, []);

  const handleSearch = () => {
    searchTrips({
      departure_city: filters.departure,
      destination_city: filters.destination,
      departure_date: filters.date,
      transport_type: filters.transport
    });
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'avion': return <Plane className="h-5 w-5" />;
      case 'camion': return <Truck className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Rechercher un transporteur
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Trouvez le transporteur idéal pour votre colis
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
          >
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Départ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={filters.departure}
                    onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
                    placeholder="Ville de départ"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={filters.destination}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                    placeholder="Ville d'arrivée"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transport
                </label>
                <select
                  value={filters.transport}
                  onChange={(e) => setFilters({ ...filters, transport: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Tous</option>
                  <option value="voiture">Voiture</option>
                  <option value="camion">Camion</option>
                  <option value="avion">Avion</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
            >
              <Search className="h-5 w-5 inline mr-2" />
              Rechercher
            </button>
          </motion.div>

          {/* Results */}
          <motion.div variants={itemVariants}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-4">Recherche en cours...</p>
              </div>
            ) : trips.length > 0 ? (
              <div className="space-y-6">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-3 rounded-lg text-white">
                          {getTransportIcon(trip.transport_type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {trip.departure_city} → {trip.destination_city}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(trip.departure_date).toLocaleDateString()}</span>
                            </div>
                            {trip.departure_time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{trip.departure_time}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {trip.price_per_kg} {trip.currency || 'MAD'}/kg
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Capacité: {trip.available_weight_kg}kg
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">4.8</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Vérifié</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {trip.transport_type}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={user ? `/booking/${trip.id}` : '#'}
                        onClick={!user ? () => alert('Veuillez vous connecter') : undefined}
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Aucun trajet trouvé
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;