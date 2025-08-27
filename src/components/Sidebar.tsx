import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Package
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

  const menuItems = [
    { icon: Home, label: 'Accueil', path: '/', show: true },
    { icon: Search, label: 'Rechercher', path: '/search', show: true },
    { 
      icon: userRole === 'transporteur' ? Truck : Package, 
      label: userRole === 'transporteur' ? 'Mes Transports' : 'Mes Colis', 
      path: '/tracking', 
      show: true 
    },
    { icon: MessageSquare, label: 'Messages', path: '/chat', show: true },
    { icon: PlusCircle, label: 'Créer un trajet', path: '/create-route', show: userRole === 'transporteur' },
    { icon: Wallet, label: 'Portefeuille', path: '/wallet', show: userRole === 'transporteur' },
    { icon: Bell, label: 'Notifications', path: '/notifications', show: true },
    { icon: User, label: 'Profil', path: '/profile', show: true },
    { icon: Settings, label: 'Paramètres', path: '/settings', show: true },
    { icon: HelpCircle, label: 'Aide', path: '/help', show: true },
    { icon: Shield, label: 'Admin', path: '/admin', show: user?.profile?.role === 'admin' },
  ].filter(item => item.show);

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? '0%' : '-100%' }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className={`fixed inset-y-0 left-0 z-50 w-64 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg border-r ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">KoliGo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.profile?.first_name || 'Utilisateur'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Quick Actions */}
      {userRole === 'transporteur' && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleNavigation('/create-route')}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
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
  );
};

export default Sidebar;