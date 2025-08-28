import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  Plus, 
  TrendingUp, 
  ArrowRight, 
  Star, 
  Shield, 
  Clock,
  Package,
  Users,
  Globe,
  Zap,
  Award,
  Truck
} from 'lucide-react';

interface HomePageProps {
  user: any;
  onShowAuth: (show: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ user, onShowAuth }) => {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');

  // If user is logged in, show their dashboard instead of landing page
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 rounded-xl p-8 text-white mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Bienvenue, {user.profile?.first_name || 'Utilisateur'} !
            </h1>
            <p className="text-emerald-100">
              {user.profile?.role === 'transporteur' 
                ? 'Gérez vos trajets et maximisez vos revenus'
                : 'Expédiez vos colis en toute sécurité'
              }
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {user.profile?.role === 'transporteur' ? 'Transports actifs' : 'Colis en cours'}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">4.9</div>
                  <div className="text-gray-600 dark:text-gray-400">Note moyenne</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {user.profile?.role === 'transporteur' ? 'Revenus ce mois' : 'Économies réalisées'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                {user.profile?.role === 'transporteur' ? (
                  <>
                    <Link
                      to="/create-route"
                      className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      <Plus className="h-5 w-5 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-300">Créer un nouveau trajet</span>
                    </Link>
                    <Link
                      to="/tracking"
                      className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Truck className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">Voir mes transports</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/search"
                      className="flex items-center space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      <Search className="h-5 w-5 text-emerald-600" />
                      <span className="text-emerald-700 dark:text-emerald-300">Rechercher un transporteur</span>
                    </Link>
                    <Link
                      to="/tracking"
                      className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Package className="h-5 w-5 text-blue-600" />
                      <span className="text-blue-700 dark:text-blue-300">Suivre mes colis</span>
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Activité récente
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <p>Aucune activité récente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const popularRoutes = [
    { 
      from: 'Casablanca', 
      to: 'Dakar', 
      price: '450 MAD', 
      time: '8h', 
      transporters: 12,
      flag1: '🇲🇦',
      flag2: '🇸🇳'
    },
    { 
      from: 'Paris', 
      to: 'Rabat', 
      price: '280€', 
      time: '12h', 
      transporters: 8,
      flag1: '🇫🇷',
      flag2: '🇲🇦'
    },
    { 
      from: 'Madrid', 
      to: 'Agadir', 
      price: '190€', 
      time: '6h', 
      transporters: 5,
      flag1: '🇪🇸',
      flag2: '🇲🇦'
    },
    { 
      from: 'Marrakech', 
      to: 'Bamako', 
      price: '380 MAD', 
      time: '15h', 
      transporters: 7,
      flag1: '🇲🇦',
      flag2: '🇲🇱'
    }
  ];

  const features = [
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Recherche Intelligente',
      description: 'Trouvez le meilleur transporteur pour votre colis en quelques clics',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Sécurité Garantie',
      description: 'Tous nos transporteurs sont vérifiés et assurés',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Suivi Temps Réel',
      description: 'Suivez votre colis en temps réel avec notifications automatiques',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: 'Transporteurs Notés',
      description: 'Système de notation et avis pour choisir les meilleurs',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Colis livrés', icon: Package },
    { number: '15K+', label: 'Utilisateurs actifs', icon: Users },
    { number: '25+', label: 'Pays couverts', icon: Globe },
    { number: '4.9', label: 'Note moyenne', icon: Star }
  ];

  const handleSearch = () => {
    if (!user) {
      onShowAuth(true);
      return;
    }
    // Navigate to search with params
    window.location.href = `/search?from=${searchFrom}&to=${searchTo}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-500 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-blue-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-orange-500 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Expédiez vos colis
              <motion.span 
                variants={itemVariants}
                className="bg-gradient-to-r from-emerald-600 via-blue-600 to-orange-600 bg-clip-text text-transparent block"
              >
                partout dans le monde
              </motion.span>
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8"
            >
              Connectez-vous avec des transporteurs vérifiés pour envoyer vos colis rapidement, 
              en toute sécurité et à prix abordable.
            </motion.p>
          </motion.div>

          {/* Search Form */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ville de départ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    placeholder="Ex: Casablanca, Paris..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 text-lg"
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ville d'arrivée
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    placeholder="Ex: Dakar, Madrid..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200 text-lg"
                  />
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-200 flex items-center justify-center space-x-3"
            >
              <Search className="h-6 w-6" />
              <span>Rechercher des transporteurs</span>
            </motion.button>
          </motion.div>

          {/* Quick Actions */}
          {user && (
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center space-x-4 mt-8"
            >
              <Link
                to="/create-route"
                className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl border border-white/20 dark:border-gray-600/20 hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Proposer un trajet</span>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 text-white p-4 rounded-full w-fit mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Pourquoi choisir KoliGo ?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Notre plateforme révolutionne l'expédition de colis en connectant directement 
              expéditeurs et transporteurs à travers le monde.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className={`bg-gradient-to-r ${feature.color} text-white p-4 rounded-full w-fit mx-auto mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <motion.h2 
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              >
                Trajets populaires
              </motion.h2>
              <motion.p 
                variants={itemVariants}
                className="text-xl text-gray-600 dark:text-gray-300"
              >
                Découvrez les trajets les plus demandés
              </motion.p>
            </div>
            <motion.div variants={itemVariants}>
              <TrendingUp className="h-12 w-12 text-emerald-500" />
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {popularRoutes.map((route, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={handleSearch}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{route.flag1}</span>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {route.from}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl">{route.flag2}</span>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {route.to}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Prix dès:</span>
                    <span className="font-semibold text-emerald-600">{route.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Durée:</span>
                    <span className="text-gray-900 dark:text-white">{route.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Transporteurs:</span>
                    <span className="text-gray-900 dark:text-white">{route.transporters}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Prêt à expédier votre colis ?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/90 mb-8"
            >
              Rejoignez des milliers d'utilisateurs qui font confiance à KoliGo 
              pour leurs expéditions internationales.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
              >
                Envoyer un colis
              </motion.button>
              {!user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onShowAuth(true)}
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-emerald-600 transition-all duration-200"
                >
                  S'inscrire gratuitement
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;