import { useState } from 'react';
import { Save, Trophy, Target, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  const [savedData, setSavedData] = useState<GWRecord | null>(null);

  // Estas metas ahora provienen de la lógica predictiva / Administrador
  // U&F Fuego: (Honor Base Crew U&F 80: 36 Billones * Inflación 1.24) * Margen de Seguridad 1.08
  const predictedTotalHonor = 36000000000 * 1.24 * 1.08;
  const adminQuotas = {
    honor: Math.floor(predictedTotalHonor / 30), // Cuota por Jugador
    meat: 8000 // Meta de farmeo base de carnes
  };

  const handleSave = () => {
    setSavedData({ ...record });
    alert("¡Datos guardados localmente! Más adelante se enviarán a la base de datos.");
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

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      <div className="bg-[#1A2534] p-6 rounded-xl border border-[#BDA054]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-[#E8C468] tracking-wide">Unite and Fight (GW)</h2>
          <p className="text-gray-400 mt-1">Registra tu contribución en la guerra actual.</p>
        </div>
        <div className="bg-[#0A1526] px-6 py-3 rounded-lg border border-[#E8C468]/20 text-center shadow-[0_0_15px_rgba(213,230,141,0.1)] min-w-[200px]">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 flex justify-center items-center gap-1"><Trophy size={14} className="text-[#E8C468]"/> Honor Total</p>
          <p className="text-3xl font-bold text-[#E8C468]">{totalHonor.toLocaleString()}</p>
        </div>
      </div>

      {/* --- SECCIÓN DE CUOTAS Y METAS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="flex justify-end pt-6 border-t border-[#BDA054]/30">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#4EA0D8] hover:bg-[#E8C468] hover:text-[#1A2534] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(71,160,37,0.4)]"
        >
          <Save size={20} />
          Guardar Progreso
        </button>
      </div>

      {/* Historial de Guild Wars */}
      <div className="mt-8 bg-[#0A1526]/90 backdrop-blur-md rounded-xl border border-[#C62828]/50 overflow-hidden shadow-2xl">
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
              <tr className="border-b border-[#C62828]/30 hover:bg-[#1A2534]/60 transition-colors">
                <td className="p-4 border-r border-[#C62828]/20 font-medium">U&F 81</td>
                <td className="p-4 border-r border-[#C62828]/20 text-orange-400 font-bold">Tierra</td>
                <td className="p-4 border-r border-[#C62828]/20 text-right">8,400</td>
                <td className="p-4 border-r border-[#C62828]/20 text-right text-[#4EA0D8] font-bold">1,250,500,000</td>
                <td className="p-4 text-center">85,210</td>
              </tr>
              <tr className="border-b border-[#C62828]/30 hover:bg-[#1A2534]/60 transition-colors">
                <td className="p-4 border-r border-[#C62828]/20 font-medium">U&F 80</td>
                <td className="p-4 border-r border-[#C62828]/20 text-red-500 font-bold">Fuego</td>
                <td className="p-4 border-r border-[#C62828]/20 text-right">10,200</td>
                <td className="p-4 border-r border-[#C62828]/20 text-right text-[#4EA0D8] font-bold">1,840,000,000</td>
                <td className="p-4 text-center text-[#E8C468] font-bold">12,400</td>
              </tr>
              <tr className="hover:bg-[#1A2534]/60 transition-colors text-gray-500">
                <td className="p-4 border-r border-[#C62828]/20 font-medium">U&F 79</td>
                <td className="p-4 border-r border-[#C62828]/20 text-green-400 font-bold">Viento</td>
                <td className="p-4 border-r border-[#C62828]/20 text-right">2,100</td>
                <td className="p-4 border-r border-[#C62828]/20 text-right">450,000,000</td>
                <td className="p-4 text-center">152,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
