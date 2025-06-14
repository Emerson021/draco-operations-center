
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/AuthPage';
import RealDashboard from '@/components/RealDashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-draco-black flex items-center justify-center">
        <div className="text-draco-gold-400 text-lg">Carregando DRACO...</div>
      </div>
    );
  }

  // If user is not authenticated, show auth page
  if (!user) {
    return <AuthPage />;
  }

  // If user is authenticated, show dashboard
  return <RealDashboard />;
};

export default Index;
