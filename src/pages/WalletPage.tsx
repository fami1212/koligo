import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Clock
} from 'lucide-react';
import { useReservations } from '../hooks/useReservations';
import { useMemo } from 'react';

interface WalletPageProps {
  user: any;
}

const WalletPage: React.FC<WalletPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState('all');
  const { reservations, loading: reservationsLoading } = useReservations(user?.id, user?.profile?.role);

  // Calculate real wallet data from reservations
  const walletData = useMemo(() => {
    if (!reservations.length) {
      return {
        balance: 0,
        pendingEarnings: 0,
        totalEarnings: 0,
        totalSpent: 0
      };
    }

    const isTransporteur = user?.profile?.role === 'transporteur';
    
    let totalEarnings = 0;
    let pendingEarnings = 0;
    let totalSpent = 0;

    reservations.forEach(reservation => {
      const amount = parseFloat(reservation.total_price || '0');
      
      if (isTransporteur && reservation.transporteur_id === user.id) {
        // Transporteur earnings
        if (reservation.status === 'delivered') {
          totalEarnings += amount * 0.9; // 90% after 10% commission
        } else if (['confirmed', 'in_transit'].includes(reservation.status)) {
          pendingEarnings += amount * 0.9;
        }
      } else if (!isTransporteur && reservation.client_id === user.id) {
        // Client spending
        if (['confirmed', 'in_transit', 'delivered'].includes(reservation.status)) {
          totalSpent += amount;
        }
      }
    });

    return {
      balance: totalEarnings - (totalEarnings * 0.1), // Available balance
      pendingEarnings,
      totalEarnings,
      totalSpent
    };
  }, [reservations, user]);

  // Generate transactions from reservations
  const transactions = useMemo(() => {
    if (!reservations.length) return [];
    
    const isTransporteur = user?.profile?.role === 'transporteur';
    
    return reservations.map((reservation, index) => {
      const amount = parseFloat(reservation.total_price || '0');
      const isEarning = isTransporteur && reservation.transporteur_id === user.id;
      
      return {
        id: index + 1,
        type: isEarning ? 'earning' : 'payment',
        amount: isEarning ? amount * 0.9 : -amount, // 90% for transporteur, negative for client
        description: `${isEarning ? 'Transport' : 'Expédition'} ${reservation.departure_city} → ${reservation.destination_city}`,
        date: reservation.created_at.split('T')[0],
        status: ['delivered'].includes(reservation.status) ? 'completed' : 'pending',
        reference: reservation.tracking_code
      };
    }).filter(t => t.amount !== 0);
  }, [reservations, user]);

  const getTransactionIcon = (type: string) => {
    return type === 'earning' ? ArrowUpRight : ArrowDownLeft;
  };

  const getTransactionColor = (type: string) => {
    return type === 'earning' 
      ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300'
      : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-8"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Mon Portefeuille
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400"
          >
            Gérez vos finances et suivez vos transactions
          </motion.p>
        </motion.div>

        {/* Balance Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-xl text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <Wallet className="h-8 w-8" />
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="text-3xl font-bold mb-1">
              {walletData.balance.toLocaleString()} MAD
            </div>
            <div className="text-emerald-100">Solde disponible</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {walletData.pendingEarnings.toLocaleString()} MAD
            </div>
            <div className="text-gray-600 dark:text-gray-400">En attente</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {walletData.totalEarnings.toLocaleString()} MAD
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total gagné</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {walletData.totalSpent.toLocaleString()} MAD
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total dépensé</div>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <motion.button
            variants={itemVariants}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Recharger</span>
          </motion.button>
          <motion.button
            variants={itemVariants}
            className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Minus className="h-5 w-5" />
            <span>Retirer</span>
          </motion.button>
          <motion.button
            variants={itemVariants}
            className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            <span>Exporter</span>
          </motion.button>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Historique des transactions
              </h3>
              <div className="flex items-center space-x-2">
                {['all', 'earning', 'payment'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterType
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {filterType === 'all' ? 'Tous' : filterType === 'earning' ? 'Gains' : 'Paiements'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.map((transaction, index) => {
              const Icon = getTransactionIcon(transaction.type);
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getTransactionColor(transaction.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <span>{transaction.reference}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} MAD
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {transaction.status === 'completed' ? 'Terminé' : 'En attente'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          ) : (
            <div className="text-center py-12">
              <Wallet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Aucune transaction
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.profile?.role === 'transporteur' 
                  ? 'Créez votre premier trajet pour commencer à gagner'
                  : 'Effectuez votre première réservation'
                }
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;