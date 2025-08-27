import React, { useState } from 'react';
import { User, Star, Package, MapPin, Clock, Edit, Shield, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfilePageProps {
  user: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Use actual user data from auth
  const userData = {
    name: authUser?.profile ? `${authUser.profile.first_name || ''} ${authUser.profile.last_name || ''}`.trim() : authUser?.email?.split('@')[0] || 'Utilisateur',
    email: authUser?.email || 'user@example.com',
    phone: authUser?.profile?.phone || '',
    role: authUser?.profile?.role || 'client',
    verified: authUser?.profile?.is_verified || false,
    rating: 0,
    completedDeliveries: 0,
    totalEarnings: 0,
    joinDate: authUser?.created_at || new Date().toISOString(),
    avatar: authUser?.profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
  };

  const recentDeliveries = [
    {
      id: 1,
      from: 'Casablanca',
      to: 'Dakar',
      date: '15 Jan 2024',
      status: 'completed',
      rating: 5,
      price: 450
    },
    {
      id: 2,
      from: 'Rabat',
      to: 'Paris',
      date: '12 Jan 2024',
      status: 'completed',
      rating: 4,
      price: 280
    },
    {
      id: 3,
      from: 'Marrakech',
      to: 'Madrid',
      date: '08 Jan 2024',
      status: 'in-progress',
      price: 320
    }
  ];

  const achievements = [
    { icon: <Star className="h-6 w-6" />, title: 'Top Rated', description: 'Plus de 4.5 étoiles' },
    { icon: <Shield className="h-6 w-6" />, title: 'Verified Pro', description: 'Compte vérifié' },
    { icon: <Award className="h-6 w-6" />, title: '100+ Deliveries', description: 'Expert confirmé' },
    { icon: <TrendingUp className="h-6 w-6" />, title: 'Rising Star', description: 'Croissance rapide' }
  ];

  const renderOverview = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-6 rounded-xl text-white">
          <div className="text-3xl font-bold">{userData.completedDeliveries || 0}</div>
          <div className="text-emerald-100">Livraisons réussies</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-xl text-white">
          <div className="text-3xl font-bold">{userData.rating || 0}</div>
          <div className="text-blue-100">Note moyenne</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl text-white col-span-2">
          <div className="text-3xl font-bold">{(userData.totalEarnings || 0).toLocaleString()} MAD</div>
          <div className="text-orange-100">Revenus totaux</div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Badges obtenus</h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-center"
            >
              <div className="text-emerald-500 mb-2 flex justify-center">
                {achievement.icon}
              </div>
              <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {achievement.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {achievement.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="space-y-4">
      {recentDeliveries.map((delivery) => (
        <div
          key={delivery.id}
          className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">
                {delivery.from} → {delivery.to}
              </span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              delivery.status === 'completed'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            }`}>
              {delivery.status === 'completed' ? 'Terminé' : 'En cours'}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{delivery.date}</span>
              </div>
              {delivery.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{delivery.rating}/5</span>
                </div>
              )}
            </div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {delivery.price} MAD
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-emerald-200"
              />
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {userData.name}
                  </h1>
                  {userData.verified && (
                    <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium dark:bg-emerald-900/30 dark:text-emerald-300">
                      Vérifié
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {userData.email}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>Membre depuis {new Date(userData.joinDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{userData.rating || 0} étoiles</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Edit className="h-4 w-4" />
              <span>Modifier</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('deliveries')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'deliveries'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Mes livraisons
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'settings'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Paramètres
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'deliveries' && renderDeliveries()}
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Paramètres en cours de développement
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;