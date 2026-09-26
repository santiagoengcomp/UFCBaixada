import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Target, Dices, CreditCard, Trophy, HandMetal, Calendar, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { getSettings } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export default function Layout({ children, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const settings = getSettings();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/players', label: 'Jogadores', icon: Users },
    { path: '/admin/positions', label: 'Posições', icon: Target },
    { path: '/admin/virtual-field', label: 'Campo Virtual', icon: MapPin },
    { path: '/admin/draw', label: 'Sorteio', icon: Dices },
    { path: '/admin/payments', label: 'Pagamentos', icon: CreditCard },
    { path: '/admin/goals', label: 'Artilharia', icon: Trophy },
    { path: '/admin/assists', label: 'Assistências', icon: HandMetal },
    { path: '/admin/matches', label: 'Partidas', icon: Calendar },
    { path: '/admin/settings', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="text-white p-2">
          <Menu size={24} />
        </button>
        <h1 className="text-lg font-bold" style={{ color: settings.primaryColor }}>
          {settings.teamName}
        </h1>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: settings.primaryColor }}>⚽</div>
            )}
            <div>
              <h2 className="font-bold text-white text-sm">{settings.teamName}</h2>
              <p className="text-xs text-gray-400">{settings.seasonName}</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-140px)]">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}`}
                style={isActive ? { backgroundColor: settings.primaryColor + '22', color: settings.primaryColor } : {}}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-700">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 w-full transition-colors">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
