import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import LoginForm from '@/components/auth/LoginForm';
import BookParcel from '@/components/customer/BookParcel';
import TrackParcel from '@/components/customer/TrackParcel';
import BookingHistory from '@/components/customer/BookingHistory';
import Dashboard from '@/components/admin/Dashboard';
import AssignedParcels from '@/components/agent/AssignedParcels';
const MainApp: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeView, setActiveView] = useState(() => {
    switch (user?.role) {
      case 'admin': return 'dashboard';
      case 'agent': return 'assigned';
      default: return 'book';
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'book': return <BookParcel />;
      case 'track': return <TrackParcel />;
      case 'dashboard': return <Dashboard />;
      case 'assigned': return <AssignedParcels />;
      case 'history': return <BookingHistory />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to SwiftCourier</h1>
            <p className="text-gray-600">Select an option from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView} 
          isOpen={sidebarOpen} 
        />
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <main className="flex-1 lg:ml-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;