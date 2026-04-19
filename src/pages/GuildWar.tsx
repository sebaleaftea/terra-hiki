import { useState, useEffect } from 'react';
import { Save, Trophy, Target, AlertCircle, CheckCircle2, Loader2, Lock, Unlock, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../config';

interface GWRecord {
  prelimsHonor: number;
  meatCount: number;
  round1Honor: number;
  round2Honor: number;
  round3Honor: number;
  round4Honor: number;
}

export default function GuildWar() {
  const [record, setRecord] = useState<GWRecord>({
    prelimsHonor: 0,
    meatCount: 0,
    round1Honor: 0,
    round2Honor: 0,
    round3Honor: 0,
    round4Honor: 0,
  });

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Admin & Config state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGWActive, setIsGWActive] = useState(true);
  const [configLoading, setConfigLoading] = useState(true);

  const currentEdition = "U&F 82"; 
  const currentElement = "Tierra"; 

  // Estas metas ahora provienen de la lógica predictiva / Administrador
  const predictedTotalHonor = 36000000000 * 1.24 * 1.08;
  const adminQuotas = {
    honor: Math.floor(predictedTotalHonor / 30),
    meat: 8000
  };

  // Fetch data on mount
  useEffect(() => {
    // Check if admin
    const userData = localStorage.getItem('terra-user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.role === 'admin') setIsAdmin(true);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    fetchConfig();
    fetchStats();
  }, []);

  const fetchConfig = async () => {
    setConfigLoading(true);
    try {
      const res = await fetch(`${API_BASE}/config`);
      const data = await res.json();
      if (res.ok) {
        setIsGWActive(data.isGWActive);
      }
    } catch (err) {
      console.error("Error fetching config:", err);
    } finally {
      setConfigLoading(false);
    }
  };

  const toggleGWStatus = async () => {
    const token = localStorage.getItem('terra-token');
    try {
      const res = await fetch(`${API_BASE}/admin/config`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isGWActive: !isGWActive })
      });
      const data = await res.json();
      if (res.ok) {
        setIsGWActive(data.config.isGWActive);
        setMessage({ type: 'success', text: `GW ${data.config.isGWActive ? 'activada' : 'desactivada'} para miembros.` });
      }
    } catch (err) {
      console.error("Error toggling GW status:", err);
    } finally {
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    const token = localStorage.getItem('terra-token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/gw/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setHistory(data);
        const current = data.find((r: any) => r.edition === currentEdition);
        if (current) {
          setRecord({
            prelimsHonor: current.prelimsHonor,
            meatCount: current.meatCount,
            round1Honor: current.round1Honor,
            round2Honor: current.round2Honor,
            round3Honor: current.round3Honor,
            round4Honor: current.round4Honor,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('terra-token');
    
    try {
      const res = await fetch(`${API_BASE}/gw/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          edition: currentEdition,
          element: currentElement,
          ...record
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: '¡Progreso guardado en la base de datos!' });
        fetchStats();
      } else {
        setMessage({ type: 'error', text: data.error || 'Error al guardar.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'No se pudo conectar con el servidor.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const totalHonor = 
    (record.prelimsHonor || 0) + 
    (record.round1Honor || 0) + 
    (record.round2Honor || 0) + 
    (record.round3Honor || 0) + 
    (record.round4Honor || 0);

  const missingHonor = Math.max(0, adminQuotas.honor - totalHonor);
  const missingMeat = Math.max(0, adminQuotas.meat - (record.meatCount || 0));
  
  const honorProgress = Math.min(100, (totalHonor / adminQuotas.honor) * 100);
  const meatProgress = Math.min(100, ((record.meatCount || 0) / adminQuotas.meat) * 100);

  const isLocked = !isGWActive && !isAdmin;

  if (configLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#E8C468]">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-bold tracking-widest uppercase text-sm">Sincronizando con el servidor...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 pb-12 relative">
      
      {/* --- ADMIN TOOLS --- */}
      {isAdmin && (
        <div className="bg-[#BDA054]/10 border border-[#BDA054]/30 p-4 rounded-xl flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isGWActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {isGWActive ? <Unlock size={20} /> : <Lock size={20} />}
            </div>
            <div>
              <p className="text-white font-bold text-sm">Panel de Administrador</p>
              <p className="text-xs text-gray-400">Estado de la GW: <span className={isGWActive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{isGWActive ? 'ACTIVA' : 'INACTIVA'}</span></p>
            </div>
          </div>
          <button 
            onClick={toggleGWStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
              isGWActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            } border ${isGWActive ? 'border-red-500/40' : 'border-emerald-500/40'}`}
          >
            {isGWActive ? <EyeOff size={16} /> : <Eye size={16} />}
            {isGWActive ? 'Desactivar para Miembros' : 'Activar para Miembros'}
          </button>
        </div>
      )}

      {/* --- BLOCKING OVERLAY FOR NON-ADMINS --- */}
      {isLocked && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md bg-[#0A1526]/40 rounded-2xl pointer-events-auto overflow-hidden">
          <div className="bg-[#1A2534] border-2 border-[#C62828] p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(198,40,40,0.3)] animate-pop-in">
            <div className="w-20 h-20 bg-[#C62828]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C62828]/40">
              <Lock size={40} className="text-[#C62828] animate-pulse" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#E8C468] mb-4 uppercase tracking-tighter">Sección Restringida</h3>
            <p className="text-gray-300 leading-relaxed font-medium">
              "Aun falta para que comience esta GW, por favor revisa la sección de Inicio para más información"
            </p>
            <div className="mt-8 pt-6 border-t border-[#C62828]/20 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
              Terra Hiki • Protocolo de Seguridad
            </div>
          </div>
        </div>
      )}

      <div className={`bg-[#1A2534] p-6 rounded-xl border border-[#BDA054]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg ${isLocked ? 'blur-[2px] pointer-events-none grayscale-[0.5]' : ''}`}>
        <div>
          <h2 className="text-3xl font-bold text-[#E8C468] tracking-wide">Unite and Fight (GW)</h2>
          <p className="text-gray-400 mt-1">Registra tu contribución en la guerra actual.</p>
        </div>
        <div className="bg-[#0A1526] px-6 py-3 rounded-lg border border-[#E8C468]/20 text-center shadow-[0_0_15px_rgba(213,230,141,0.1)] min-w-[200px]">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex justify-center items-center gap-1"><Trophy size={14} className="text-[#E8C468]"/> Honor Total</p>
          <p className="text-3xl font-bold text-[#E8C468]">{totalHonor.toLocaleString()}</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg border flex items-center gap-2 animate-fade-in z-[60] relative ${
          message.type === 'success' ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-300' : 'bg-red-900/30 border-red-500/50 text-red-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* --- SECCIÓN DE CUOTAS Y METAS --- */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isLocked ? 'blur-[2px] pointer-events-none grayscale-[0.5]' : ''}`}>
        {/* Meta de Honor */}
        <div className="bg-[#1A2534]/60 backdrop-blur-md p-6 rounded-xl border border-[#BDA054]/30 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target size={20} className="text-[#BDA054]" /> Cuota Individual (Predictiva)
            </h3>
            <span className="text-sm font-semibold text-gray-400">Meta: {adminQuotas.honor.toLocaleString()}</span>
          </div>

          <div className="w-full bg-[#0A1526] rounded-full h-4 mb-3 border border-[#C62828]/50 relative z-10 overflow-hidden">
            <div className={`h-4 rounded-full transition-all duration-500 ${honorProgress === 100 ? 'bg-[#E8C468]' : 'bg-[#BDA054]'}`} style={{ width: `${honorProgress}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-sm relative z-10">
            {honorProgress === 100 ? (
              <span className="text-[#E8C468] font-bold flex items-center gap-1"><CheckCircle2 size={16} /> ¡Cuota superada!</span>
            ) : (
              <span className="text-gray-400 flex items-center gap-1"><AlertCircle size={16} className="text-[#BDA054]" /> Te faltan <strong className="text-white">{missingHonor.toLocaleString()}</strong></span>
            )}
            <span className="text-white font-bold">{honorProgress.toFixed(1)}%</span>
          </div>
        </div>

        {/* Meta de Carnes */}
        <div className="bg-[#1A2534]/60 backdrop-blur-md p-6 rounded-xl border border-[#BDA054]/30 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target size={20} className="text-[#BDA054]" /> Objetivo de Carnes
            </h3>
            <span className="text-sm font-semibold text-gray-400">Meta: {adminQuotas.meat.toLocaleString()}</span>
          </div>

          <div className="w-full bg-[#0A1526] rounded-full h-4 mb-3 border border-[#C62828]/50 relative z-10 overflow-hidden">
            <div className={`h-4 rounded-full transition-all duration-500 ${meatProgress === 100 ? 'bg-[#E8C468]' : 'bg-[#BDA054]'}`} style={{ width: `${meatProgress}%` }}></div>
          </div>

          <div className="flex justify-between items-center text-sm relative z-10">
            {meatProgress === 100 ? (
              <span className="text-[#E8C468] font-bold flex items-center gap-1"><CheckCircle2 size={16} /> ¡Meta de farm lograda!</span>
            ) : (
              <span className="text-gray-400 flex items-center gap-1"><AlertCircle size={16} className="text-[#BDA054]" /> Te faltan <strong className="text-white">{missingMeat.toLocaleString()}</strong></span>
            )}
            <span className="text-white font-bold">{meatProgress.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      {/* ---------------------------------- */}


      {/* CARGAS / RONDAS */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isLocked ? 'blur-[2px] pointer-events-none grayscale-[0.5]' : ''}`}>
        {/* Preliminares */}
        <div className="p-6 rounded-xl bg-[#0A1526]/80 backdrop-blur-sm border border-[#4EA0D8]/30 group hover:border-[#4EA0D8] transition-colors relative overflow-hidden hover:shadow-[0_0_20px_rgba(71,160,37,0.15)]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4EA0D8]/10 to-transparent rounded-bl-full pointer-events-none"></div>
          <h3 className="text-xl font-bold text-[#4EA0D8] mb-4">Preliminares</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wide">Honor Logrado</label>
              <input 
                type="number" 
                value={record.prelimsHonor || ''}
                onChange={(e) => setRecord({...record, prelimsHonor: parseInt(e.target.value) || 0})}
                placeholder="Ej: 10000000" 
                className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-3 outline-none focus:border-[#E8C468] transition-colors" 
              />
            </div>
            <div>
              <label className="text-xs text-[#BDA054] block mb-2 uppercase tracking-wide font-bold">Carnes Farmeadas (Meat)</label>
              <input 
                type="number" 
                value={record.meatCount || ''}
                onChange={(e) => setRecord({...record, meatCount: parseInt(e.target.value) || 0})}
                placeholder="Ej: 5000" 
                className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-[#BDA054] font-bold px-4 py-3 outline-none focus:border-[#BDA054] transition-colors" 
              />
            </div>
          </div>
        </div>

        {/* Rondas 1 al 4 */}
        {[
          { id: 'round1Honor', label: 'Ronda 1' },
          { id: 'round2Honor', label: 'Ronda 2' },
          { id: 'round3Honor', label: 'Ronda 3' },
          { id: 'round4Honor', label: 'Ronda 4' }
        ].map((ron) => (
          <div key={ron.id} className="p-6 rounded-xl bg-[#0A1526]/80 backdrop-blur-sm border border-[#4EA0D8]/30 group hover:border-[#4EA0D8] transition-colors relative overflow-hidden hover:shadow-[0_0_20px_rgba(71,160,37,0.15)] flex flex-col">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4EA0D8]/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <h3 className="text-xl font-bold text-[#4EA0D8] mb-4">{ron.label}</h3>
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wide">Honor Logrado</label>
                <input 
                  type="number" 
                  value={record[ron.id as keyof GWRecord] || ''}
                  onChange={(e) => setRecord({...record, [ron.id]: parseInt(e.target.value) || 0})}
                  placeholder="Ej: 30000000" 
                  className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-3 outline-none focus:border-[#E8C468] transition-colors" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className={`flex justify-end pt-6 border-t border-[#BDA054]/30 ${isLocked ? 'blur-[2px] pointer-events-none' : ''}`}>
        <button 
          onClick={handleSave}
          disabled={saving || isLocked}
          className="flex items-center gap-2 bg-[#4EA0D8] hover:bg-[#E8C468] hover:text-[#1A2534] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(71,160,37,0.4)] disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Guardando...' : 'Guardar Progreso'}
        </button>
      </div>

      {/* Historial de Guild Wars */}
      <div className={`mt-8 bg-[#0A1526]/90 backdrop-blur-md rounded-xl border border-[#C62828]/50 overflow-hidden shadow-2xl ${isLocked ? 'blur-[2px] pointer-events-none' : ''}`}>
        <div className="bg-[#1A2534] p-6 border-b border-[#BDA054]/50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold text-[#E8C468]">Tus Registros Históricos</h3>
            <p className="text-sm text-gray-400 mt-1">Comparativa de tu desempeño en guerras anteriores.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#BDA054]/20 text-[#E8C468] text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-[#BDA054]/30">Edición</th>
                <th className="p-4 font-semibold border-b border-[#BDA054]/30">Elemento Enemigo</th>
                <th className="p-4 font-semibold border-b border-[#BDA054]/30 text-right">Carnes Farmeadas</th>
                <th className="p-4 font-semibold border-b border-[#BDA054]/30 text-right">Honor Total</th>
                <th className="p-4 font-semibold border-b border-[#BDA054]/30 text-center">Rango Individual</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Loader2 className="animate-spin inline-block mr-2" /> Cargando historial...
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No hay registros previos. ¡Empieza a farmear para ver tus estadísticas!
                  </td>
                </tr>
              ) : history.map((row: any) => (
                <tr key={row._id} className="border-b border-[#C62828]/30 hover:bg-[#1A2534]/60 transition-colors">
                  <td className="p-4 border-r border-[#C62828]/20 font-medium">{row.edition}</td>
                  <td className={`p-4 border-r border-[#C62828]/20 font-bold ${
                    row.element === 'Fuego' ? 'text-red-500' : 
                    row.element === 'Tierra' ? 'text-orange-400' :
                    row.element === 'Viento' ? 'text-green-400' : 'text-blue-400'
                  }`}>{row.element}</td>
                  <td className="p-4 border-r border-[#C62828]/20 text-right">{row.meatCount?.toLocaleString()}</td>
                  <td className="p-4 border-r border-[#C62828]/20 text-right text-[#4EA0D8] font-bold">
                    {(row.prelimsHonor + row.round1Honor + row.round2Honor + row.round3Honor + row.round4Honor).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs text-gray-500">En desarrollo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
