import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Swords, LogOut, BarChart } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('terra-token');
    localStorage.removeItem('terra-user');
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { path: '/home', label: 'Inicio', icon: Home },
    { path: '/blog', label: 'Bitácora (Blog)', icon: BookOpen },
    { path: '/guildwar', label: 'Unite and Fight (GW)', icon: Swords },
    { path: '/predictor', label: 'Predictor', icon: BarChart },
  ];

  return (
    <aside className="w-64 relative z-20 flex flex-col h-full bg-[#0A1526]/80 backdrop-blur-md border-r border-[#C62828]/50 shadow-[4px_0_24px_rgba(36,16,35,0.8)]">
      <div className="p-6 pb-2 border-b border-[#BDA054]/30">
        <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#E8C468] to-[#4EA0D8] pb-2 drop-shadow-md">
          Terra Hiki
        </h1>
        <p className="text-xs text-[#BDA054] tracking-widest font-semibold uppercase mb-4">Crew Management</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
                isActive 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-[#E8C468]'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#BDA054]/40 to-transparent pointer-events-none rounded-lg border-l-4 border-[#BDA054]"></div>
              )}
              
              <Icon size={20} className={`relative z-10 ${isActive ? 'text-[#E8C468]' : ''} group-hover:scale-110 transition-transform`} />
              <span className="relative z-10 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#C62828]/30">
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-400 hover:text-red-400 rounded-lg hover:bg-black/20 transition-colors group"
        >
          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
