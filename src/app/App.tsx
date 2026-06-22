import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { MapView } from './components/MapView';
import { Events } from './components/Events';

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Home onNavigate={setActiveTab} />;
      case 'mapa':
        return <MapView />;
      case 'eventos':
        return <Events />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <AuthProvider>
      <div className="h-screen w-screen bg-[#121212] dark flex flex-col overflow-hidden">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </AuthProvider>
  );
}
