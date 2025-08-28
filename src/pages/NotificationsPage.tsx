import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Package, MessageCircle, Star, AlertCircle, CheckCircle, Clock, Trash2, Settings, Filter, BookMarked as MarkAsRead } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationsPageProps {
  user: any;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ user }) => {
  const [filter, setFilter] = useState('all');
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications(user?.id);

  const filterOptions = [
    { value: 'all', label: 'Toutes', count: notifications.length },
    { value: 'unread', label: 'Non lues', count: notifications.filter(n => !n.read).length },
    { value: 'delivery', label: 'Livraisons', count: notifications.filter(n => n.type === 'delivery').length },
    { value: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
    { value: 'booking', label: 'Réservations', count: notifications.filter(n => n.type === 'booking').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getTimeAgo = (time: string) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays}j`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delivery': return Package;
      case 'message': return MessageCircle;
      case 'rating': return Star;
      case 'booking': return CheckCircle;
      case 'alert': return AlertCircle;
      default: return Bell;
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Notifications
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400"
          >
            Restez informé de toutes vos activités KoliGo
          </motion.p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === option.value
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                  {option.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      filter === option.value
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Tout marquer lu</span>
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-4"
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              return (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md ${
                    !notification.read ? 'ring-2 ring-emerald-500/20' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full flex-shrink-0">
                        <Icon className="h-5 w-5 text-emerald-500" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                              )}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500 dark:text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{getTimeAgo(notification.created_at)}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                title="Marquer comme lu"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' 
                  ? 'Vous n\'avez aucune notification pour le moment.'
                  : `Aucune notification dans la catégorie "${filterOptions.find(f => f.value === filter)?.label}".`
                }
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Settings Card */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="mt-8 bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Paramètres de notification
              </h3>
              <p className="text-emerald-100">
                Personnalisez vos préférences de notification
              </p>
            </div>
            <button className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors">
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage;