
import { useState } from 'react';
import Header from '@/components/Header';
import Homepage from '@/components/Homepage';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard'>('home');

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Homepage />;
      case 'login':
        return <Login />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' && <Header />}
      {renderView()}
      
      {/* Navigation for demo purposes */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <div className="bg-draco-gray-800 p-3 rounded-lg border border-draco-gray-700">
          <p className="text-draco-gold-400 text-sm font-medium mb-2">Demo Navigation:</p>
          <div className="space-y-1">
            <button
              onClick={() => setCurrentView('home')}
              className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                currentView === 'home' 
                  ? 'bg-draco-gold-500 text-draco-black' 
                  : 'text-draco-gray-300 hover:text-draco-gold-400'
              }`}
            >
              Homepage
            </button>
            <button
              onClick={() => setCurrentView('login')}
              className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                currentView === 'login' 
                  ? 'bg-draco-gold-500 text-draco-black' 
                  : 'text-draco-gray-300 hover:text-draco-gold-400'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`block w-full text-left px-3 py-1 rounded text-sm transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-draco-gold-500 text-draco-black' 
                  : 'text-draco-gray-300 hover:text-draco-gold-400'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
