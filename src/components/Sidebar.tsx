import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  User, 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Shield, 
  Wallet, 
  Bell, 
  Truck,
  Package,
  BarChart3,
  Users,
  Globe,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const userRole = user?.profile?.role || 'client';

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  // Menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { icon: Home, label: 'Accueil', path: '/' },
      { icon: Search, label: 'Rechercher', path: '/search' },
      { icon: MessageSquare, label: 'Messages', path: '/chat' },
      { icon: Bell, label: 'Notifications', path: '/notifications' },
      { icon: User, label: 'Profil', path: '/profile' },
      { icon: Settings, label: 'Paramètres', path: '/settings' },
      { icon: HelpCircle, label: 'Aide', path: '/help' }
    ];

    if (userRole === 'transporteur') {
      return [
        ...commonItems.slice(0, 2), // Home, Search
        { icon: Truck, label: 'Mes Transports', path: '/tracking' },
        { icon: PlusCircle, label: 'Créer un Trajet', path: '/create-route' },
        { icon: Wallet, label: 'Portefeuille', path: '/wallet' },
        { icon: BarChart3, label: 'Statistiques', path: '/stats' },
        ...commonItems.slice(2) // Messages, Notifications, Profile, Settings, Help
      ];
    } else if (userRole === 'client') {
      return [
        ...commonItems.slice(0, 2), // Home, Search
        { icon: Package, label: 'Mes Colis', path: '/tracking' },
        ...commonItems.slice(2) // Messages, Notifications, Profile, Settings, Help
      ];
    } else if (userRole === 'admin') {
      return [
        ...commonItems.slice(0, 2), // Home, Search
        { icon: Shield, label: 'Administration', path: '/admin' },
        { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
        { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
        ...commonItems.slice(2) // Messages, Notifications, Profile, Settings, Help
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-xl border-r ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        } flex flex-col lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">KoliGo</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {userRole}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src={user?.profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.profile?.first_name} {user?.profile?.last_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
            {user?.profile?.is_verified && (
              <Shield className="h-4 w-4 text-emerald-500" />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                isActivePath(item.path)
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions for Transporteur */}
        {userRole === 'transporteur' && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleNavigation('/create-route')}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="font-medium">Nouveau Trajet</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-red-400 hover:bg-red-900/20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;