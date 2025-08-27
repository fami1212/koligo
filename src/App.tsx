import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import AuthModal from './components/AuthModal';

// Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import CreateRoutePage from './pages/CreateRoutePage';
import AdminPage from './pages/AdminPage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import WalletPage from './pages/WalletPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

// Hooks
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

function App() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only show loading spinner on initial app load
  if (loading && !user) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
      }`}>
        <Header
          user={user}
          onLogout={logout}
          onShowAuth={setShowAuth}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <div className="flex">
          <AnimatePresence>
            {user && (
              <Sidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                theme={theme}
              />
            )}
          </AnimatePresence>

          <main className={`flex-1 transition-all duration-300 ${
            user && sidebarOpen ? 'lg:ml-64' : ''
          }`}>
            <Routes>
              <Route path="/" element={<HomePage user={user} onShowAuth={setShowAuth} />} />
              <Route path="/search" element={<SearchPage user={user} />} />
              <Route path="/booking/:id" element={
                user ? <BookingPage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/tracking" element={
                user ? <TrackingPage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/profile" element={
                user ? <ProfilePage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/chat" element={
                user ? <ChatPage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/create-route" element={
                user ? <CreateRoutePage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/wallet" element={
                user ? <WalletPage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/notifications" element={
                user ? <NotificationsPage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/settings" element={
                user ? <SettingsPage user={user} /> : <Navigate to="/" />
              } />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/admin" element={
                user?.profile?.role === 'admin' ? <AdminPage user={user} /> : <Navigate to="/" replace />
              } />
            </Routes>
          </main>
        </div>

        <AnimatePresence>
          {showAuth && (
            <AuthModal
              mode={authMode}
              onClose={() => setShowAuth(false)}
              onSwitchMode={setAuthMode}
              theme={theme}
            />
          )}
        </AnimatePresence>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;