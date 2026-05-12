import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { PageLoader } from '@/components/LoadingSpinner';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';

// Placeholder pages
const CarsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">🚗 Мои автомобили</h1></div>;
const AppointmentsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">📅 Записи на сервис</h1></div>;
const TendersPage = () => <div className="p-6"><h1 className="text-2xl font-bold">📋 Тендеры</h1></div>;
const ChatPage = () => <div className="p-6"><h1 className="text-2xl font-bold">💬 Чат</h1></div>;
const NotificationsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">🔔 Уведомления</h1></div>;
const ProfilePage = () => <div className="p-6"><h1 className="text-2xl font-bold">👤 Профиль</h1></div>;
const SettingsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">⚙️ Настройки</h1></div>;

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppStore();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Layout with Sidebar and Header
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSidebarOpen, toggleSidebar } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { isAuthenticated, loadUser } = useAppStore();

  React.useEffect(() => {
    loadUser();
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars"
        element={
          <ProtectedRoute>
            <MainLayout><CarsPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <MainLayout><AppointmentsPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tenders"
        element={
          <ProtectedRoute>
            <MainLayout><TendersPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <MainLayout><ChatPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <MainLayout><NotificationsPage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout><ProfilePage /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout><SettingsPage /></MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
