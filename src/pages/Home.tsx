import { useState, useEffect } from 'react';
import { CalendarDays, Shield, Bell } from 'lucide-react';

export default function Home() {
  const [userNick, setUserNick] = useState('Gran');
  
  useEffect(() => {
    const userData = localStorage.getItem('terra-user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.gameNick) setUserNick(user.gameNick);
        else if (user.username) setUserNick(user.username);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, []);

  // Configuración de la próxima Guild War (Unite and Fight)
  const targetDate = new Date('2026-06-21T19:00:00+09:00'); // Horario JST para inicio de prelims
  
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number }>({ 
    days: 0, 
    hours: 0, 
    minutes: 0 
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60)
        });
      }
    };

    calculateTimeLeft(); // Initial call
    const timer = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-wide">Bienvenido, {userNick}</h2>
        <p className="text-gray-400 mt-2">Panel general de comando de Terra Hiki.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tarjeta de la Próxima U&F (Guild War) */}
        <div className="p-6 rounded-xl bg-[#1A2534]/80 backdrop-blur-md border-[2px] border-[#C62828] relative overflow-hidden group shadow-[0_0_25px_rgba(198,40,40,0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C62828]/20 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CalendarDays className="text-[#E8C468]" size={20} />
              Próxima Unite & Fight
            </h3>
            <span className="animate-pulse w-3 h-3 bg-[#C62828] rounded-full shadow-[0_0_8px_#C62828]"></span>
          </div>
          
          <div className="relative z-10">
            {/* Elemento Enemigo */}
            <h4 className="text-4xl font-extrabold text-[#C62828] tracking-widest uppercase text-shadow-sm">Fuego</h4>
            
            {/* Rango de Fechas */}
            <div className="mt-3 bg-[#0A1526]/80 border border-[#BDA054]/40 px-3 py-2 rounded-lg inline-block">
              <p className="text-xs text-[#E8C468]/70 font-semibold mb-1 uppercase tracking-wider">🗓️ Rango de Fechas Oficial</p>
              <p className="text-sm text-white font-bold">21 Junio - 28 Junio, 2026</p>
            </div>
            
            {/* Countdown Interactivo */}
            <div className="mt-5 pt-5 border-t border-[#C62828]/30">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Tiempo para Preliminares</p>
              <div className="flex items-end gap-2 mt-2">
                <div className="text-3xl font-bold text-white leading-none">{timeLeft.days}<span className="text-sm text-gray-500 ml-1 font-medium">d</span></div>
                <div className="text-3xl font-bold text-white leading-none">{timeLeft.hours}<span className="text-sm text-gray-500 ml-1 font-medium">h</span></div>
                <div className="text-3xl font-bold text-white leading-none">{timeLeft.minutes}<span className="text-sm text-[#C62828] ml-1 font-bold animate-pulse">m</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta del Rango de la Crew */}
        <div className="p-6 rounded-xl bg-[#1A2534]/60 backdrop-blur-sm border border-[#BDA054]/50 relative overflow-hidden group shadow-lg flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E8C468]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          <div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Shield className="text-[#E8C468]" size={20} />
              <h3 className="text-lg font-bold text-white">Objetivo Crew Rank</h3>
            </div>
            <div className="relative z-10">
              <p className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#E8C468] to-[#BDA054]">
                A
              </p>
            </div>
          </div>
          <div className="relative z-10 mt-4 bg-[#0A1526]/50 p-3 rounded border border-[#BDA054]/20">
            <p className="text-sm text-gray-300">
              Estado Actual: <strong className="text-[#E8C468]">En Preparación</strong> para asegurar el Top 5.5K (Ticket SSR).
            </p>
          </div>
        </div>

        {/* Tarjeta de Última Noticia */}
        <div className="p-6 rounded-xl bg-[#1A2534]/60 backdrop-blur-sm border border-[#4EA0D8]/40 relative overflow-hidden group shadow-lg flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#4EA0D8]/10 to-transparent rounded-bl-full pointer-events-none"></div>
           <div>
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Bell className="text-[#4EA0D8]" size={20} />
              <h3 className="text-lg font-bold text-white">Últimas Noticias</h3>
            </div>
            <div className="relative z-10 border-l-4 border-[#4EA0D8] pl-4">
              <p className="text-xl font-bold text-white mt-1 leading-tight">Asignación de roles y cuotas de Carne</p>
              <p className="text-xs text-[#4EA0D8] font-bold mt-2 tracking-wider">HACE 2 HORAS • ADMIN</p>
            </div>
          </div>
          <button className="relative z-10 mt-6 w-full text-center bg-[#0A1526] hover:bg-[#4EA0D8]/20 border border-[#4EA0D8]/30 py-2 rounded text-sm text-[#4EA0D8] font-semibold transition-colors">
            Ir a Bitácora
          </button>
        </div>
      </div>
    </div>
  );
}
