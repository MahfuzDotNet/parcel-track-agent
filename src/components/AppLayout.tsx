import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import MainApp from '@/components/MainApp';

const AppLayout: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default AppLayout;
