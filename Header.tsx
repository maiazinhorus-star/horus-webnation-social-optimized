import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import {
  Eye, Home, User, MessageCircle, LogOut, Menu, X, Shield, Users,
  Search, Crown
} from 'lucide-react';

interface Props {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: Props) {
  const { user, logout } = useAuth();
  const { onlineCount } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'users', label: 'Usuários', icon: Users },
    ...(user.isAdmin ? [{ id: 'admin', label: 'Painel Admin', icon: Shield }] : []),
  ];

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <header className="bg-dark-900/95 border-b border-gold-600/20 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('feed')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
              <Eye className="w-5 h-5 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold gold-text">Horus WebNation</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar no Horus..."
                className="w-full bg-dark-800 border border-gold-600/20 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 transition-all"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Online count */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {onlineCount} online
            </div>

            {/* Nav Links - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    currentPage === item.id
                      ? 'bg-gold-600/20 text-gold-400'
                      : 'text-gray-400 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* WhatsApp Channel Button */}
            <a
              href="https://whatsapp.com/channel/0029Vb7gwc9CRs1wLPWKrf3B"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-green-600/20 border border-green-600/30 text-green-400 px-3 py-1.5 rounded-full text-xs hover:bg-green-600/30 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              Canal
            </a>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 hover:bg-dark-800 rounded-lg p-1.5 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-black" />
                  )}
                </div>
                <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">
                  {user.nickname}
                </span>
                {user.isAdmin && <Crown className="w-3 h-3 text-gold-400 hidden sm:block" />}
              </button>

              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-gold-600/20 rounded-xl shadow-2xl z-20 overflow-hidden">
                    <div className="p-3 border-b border-gold-600/10">
                      <p className="text-sm font-semibold text-white">{user.nickname}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-flex items-center gap-1 text-xs text-gold-400 mt-1">
                          <Crown className="w-3 h-3" /> Administrador
                        </span>
                      )}
                    </div>
                    <div className="p-1">
                      <button
                        onClick={() => { onNavigate('profile'); setProfileMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-dark-700 rounded-lg transition-all"
                      >
                        <User className="w-4 h-4" /> Meu Perfil
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Sair
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-400 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gold-600/10 py-2 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all ${
                  currentPage === item.id
                    ? 'bg-gold-600/20 text-gold-400'
                    : 'text-gray-400 hover:text-white hover:bg-dark-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
            <a
              href="https://whatsapp.com/channel/0029Vb7gwc9CRs1wLPWKrf3B"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-green-400 hover:bg-green-400/10 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              Canal Oficial WhatsApp
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
