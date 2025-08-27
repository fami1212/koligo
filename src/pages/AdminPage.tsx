import React, { useState } from 'react';
import { Users, Package, TrendingUp, AlertCircle, Eye, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminPageProps {
  user: any;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Utilisateurs actifs', value: '2,847', change: '+12%', color: 'text-blue-600' },
    { title: 'Livraisons totales', value: '15,642', change: '+8%', color: 'text-green-600' },
    { title: 'Revenus (MAD)', value: '1,247,850', change: '+15%', color: 'text-purple-600' },
    { title: 'Litiges', value: '23', change: '-5%', color: 'text-red-600' }
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'Youssef Alami',
      type: 'Transporteur',
      submitted: '2024-01-15',
      documents: ['ID', 'Permis', 'Assurance'],
      status: 'pending'
    },
    {
      id: 2,
      name: 'Logistics Pro SARL',
      type: 'Entreprise',
      submitted: '2024-01-14',
      documents: ['RC', 'Patente', 'Assurance'],
      status: 'pending'
    }
  ];

  const recentDeliveries = [
    {
      id: 'KLG-001234',
      route: 'Casablanca → Dakar',
      transporter: 'Ahmed Benali',
      client: 'Fatima Zahra',
      status: 'delivered',
      date: '2024-01-15'
    },
    {
      id: 'KLG-001235',
      route: 'Rabat → Paris',
      transporter: 'Hassan Transport',
      client: 'Mohamed Tazi',
      status: 'in-transit',
      date: '2024-01-15'
    },
    {
      id: 'KLG-001236',
      route: 'Marrakech → Madrid',
      transporter: 'Express Logistic',
      client: 'Aicha Benali',
      status: 'pending',
      date: '2024-01-14'
    }
  ];

  const disputes = [
    {
      id: 'DIS-001',
      delivery: 'KLG-001230',
      client: 'Omar Hassani',
      transporter: 'Quick Transport',
      issue: 'Colis endommagé',
      status: 'open',
      date: '2024-01-13'
    },
    {
      id: 'DIS-002',
      delivery: 'KLG-001228',
      client: 'Laila Amrani',
      transporter: 'Safe Delivery',
      issue: 'Retard de livraison',
      status: 'resolved',
      date: '2024-01-12'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Vérifications en attente
          </h3>
          <div className="space-y-3">
            {pendingVerifications.map((verification) => (
              <div key={verification.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{verification.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{verification.type} • {verification.submitted}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <XCircle className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Litiges récents
          </h3>
          <div className="space-y-3">
            {disputes.slice(0, 3).map((dispute) => (
              <div key={dispute.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{dispute.delivery}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dispute.status === 'open'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {dispute.status === 'open' ? 'Ouvert' : 'Résolu'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{dispute.issue}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{dispute.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h3>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {[
            { name: 'Ahmed Benali', email: 'ahmed@example.com', role: 'Transporteur', status: 'Actif' },
            { name: 'Fatima Zahra', email: 'fatima@example.com', role: 'Client', status: 'Actif' },
            { name: 'Hassan Transport', email: 'hassan@example.com', role: 'Transporteur', status: 'En attente' }
          ].map((user, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email} • {user.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Actif' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                }`}>
                  {user.status}
                </span>
                <button 
                  onClick={() => toast.info('Fonctionnalité en développement')}
                  className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Livraisons récentes
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID Livraison
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Trajet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Transporteur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentDeliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {delivery.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {delivery.route}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {delivery.transporter}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {delivery.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    delivery.status === 'delivered'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      : delivery.status === 'in-transit'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                  }`}>
                    {delivery.status === 'delivered' ? 'Livré' : 
                     delivery.status === 'in-transit' ? 'En cours' : 'En attente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  {delivery.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Administration KoliGo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez votre plateforme de livraison internationale
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-6">
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
              onClick={() => setActiveTab('users')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Utilisateurs
            </button>
            <button
              onClick={() => setActiveTab('deliveries')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'deliveries'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Livraisons
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'disputes'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Litiges
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'deliveries' && renderDeliveries()}
        {activeTab === 'disputes' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gestion des litiges
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{dispute.delivery}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dispute.status === 'open'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {dispute.status === 'open' ? 'Ouvert' : 'Résolu'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{dispute.issue}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-500">{dispute.client} vs {dispute.transporter}</p>
                      <button 
                        onClick={() => toast.info('Fonctionnalité en développement')}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Voir détails
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;