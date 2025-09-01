import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Menu, 
  Sun, 
  Moon, 
  User, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onShowAuth: (show: boolean) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onShowAuth,
  theme,
  onToggleTheme,
  onToggleSidebar
}) => {
  const { unreadCount } = useNotifications(user?.id);
  
  const userName = user?.profile ? 
    `${user.profile.first_name || ''} ${user.profile.last_name || ''}`.trim() || 
    user.email?.split('@')[0] : 
    'Utilisateur';

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-orange-500 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
                KoliGo
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Rechercher</span>
            </Link>
            <Link
              to="/help"
              className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Aide
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="flex items-center space-x-2">
                  <img
                    src={user.profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                    alt={userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userName}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onShowAuth(true)}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;