import { useState, useRef, useEffect } from 'react';
import { Music2, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const tabs = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'mapa', label: 'Mapa' },
    { id: 'eventos', label: 'Eventos' },
  ];

  return (
    <>
      <nav className="h-16 border-b border-white/10 bg-[#0A0A0A] backdrop-blur-xl flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="text-sm md:text-base font-semibold text-white tracking-tight">MusicSpot</span>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`text-xs md:text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
              )}
            </button>
          ))}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            id="user-avatar-btn"
            onClick={() => {
              if (isAuthenticated) {
                setShowDropdown(!showDropdown);
              } else {
                setShowAuthModal(true);
              }
            }}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-violet-500 hover:ring-offset-2 hover:ring-offset-[#121212] transition-all"
          >
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>

          {showDropdown && isAuthenticated && (
            <div className="absolute right-0 top-12 w-48 rounded-lg bg-[#1A1A1A] border border-white/10 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-white/10">
                <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { logout(); setShowDropdown(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
