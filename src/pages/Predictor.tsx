import { useState } from 'react';
import { TrendingUp, BarChart2, Calculator, AlertTriangle, History, Users } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface GWRecord {
  gwNumber: number;
  date: string;
  element: ElementKey;
  elementEs: string;
  top5500Honor: number;
}

type ElementKey = 'Dark' | 'Earth' | 'Wind' | 'Water' | 'Light' | 'Fire';

// ─── Constants ────────────────────────────────────────────────────────────────
const ELEMENTS: ElementKey[] = ['Dark', 'Earth', 'Wind', 'Water', 'Light', 'Fire'];

const ELEMENT_NAMES: Record<ElementKey, string> = {
  Dark: 'Oscuridad', Earth: 'Tierra', Wind: 'Viento',
  Water: 'Agua', Light: 'Luz', Fire: 'Fuego',
};

const ELEMENT_STYLES: Record<ElementKey, {
  emoji: string; gradient: string; text: string;
  border: string; badge: string; glow: string;
}> = {
  Dark:  { emoji: '🌑', gradient: 'from-purple-950/70 to-purple-900/20', text: 'text-purple-300',  border: 'border-purple-700/50',  badge: 'bg-purple-800/80 text-purple-100',  glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]' },
  Earth: { emoji: '🌿', gradient: 'from-amber-950/70  to-amber-900/20',  text: 'text-amber-300',   border: 'border-amber-700/50',   badge: 'bg-amber-800/80 text-amber-100',   glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]' },
  Wind:  { emoji: '💨', gradient: 'from-green-950/70  to-green-900/20',  text: 'text-green-300',   border: 'border-green-700/50',   badge: 'bg-green-800/80 text-green-100',   glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]'  },
  Water: { emoji: '💧', gradient: 'from-blue-950/70   to-blue-900/20',   text: 'text-blue-300',    border: 'border-blue-700/50',    badge: 'bg-blue-800/80 text-blue-100',     glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]' },
  Light: { emoji: '☀️', gradient: 'from-yellow-950/70 to-yellow-900/20', text: 'text-yellow-200',  border: 'border-yellow-600/50',  badge: 'bg-yellow-700/80 text-yellow-50',  glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]'  },
  Fire:  { emoji: '🔥', gradient: 'from-red-950/70    to-red-900/20',    text: 'text-red-300',     border: 'border-red-700/50',     badge: 'bg-red-800/80 text-red-100',       glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]'  },
};

// ─── Real Historical Data (U&F73 – U&F82) — Top 5,500 Crew Cutoff ─────────
const historicalData: GWRecord[] = [
  { gwNumber: 73, date: 'Jun 2024', element: 'Dark',  elementEs: 'Oscuridad', top5500Honor: 24_330_000_000 },
  { gwNumber: 74, date: 'Sep 2024', element: 'Earth', elementEs: 'Tierra',    top5500Honor: 30_000_000_000 },
  { gwNumber: 75, date: 'Nov 2024', element: 'Wind',  elementEs: 'Viento',    top5500Honor: 30_000_000_000 },
  { gwNumber: 76, date: 'Ene 2025', element: 'Water', elementEs: 'Agua',      top5500Honor: 36_000_000_000 },
  { gwNumber: 77, date: 'Abr 2025', element: 'Light', elementEs: 'Luz',       top5500Honor: 44_160_000_000 },
  { gwNumber: 78, date: 'Jun 2025', element: 'Fire',  elementEs: 'Fuego',     top5500Honor: 31_330_000_000 },
  { gwNumber: 79, date: 'Sep 2025', element: 'Dark',  elementEs: 'Oscuridad', top5500Honor: 41_110_000_000 },
  { gwNumber: 80, date: 'Nov 2025', element: 'Wind',  elementEs: 'Viento',    top5500Honor: 42_250_000_000 },
  { gwNumber: 81, date: 'Ene 2026', element: 'Earth', elementEs: 'Tierra',    top5500Honor: 62_000_000_000 },
  { gwNumber: 82, date: 'Abr 2026', element: 'Water', elementEs: 'Agua',      top5500Honor: 87_000_000_000 },
];

// ─── Inflation Model ──────────────────────────────────────────────────────────
/** Average per-GW inflation from elements that have 2 or more data points */
const AVG_PER_GW_RATE: number = (() => {
  const rates: number[] = [];
  ELEMENTS.forEach(el => {
    const recs = historicalData.filter(d => d.element === el);
    if (recs.length >= 2) {
      const first = recs[0], last = recs[recs.length - 1];
      rates.push(Math.pow(last.top5500Honor / first.top5500Honor, 1 / (last.gwNumber - first.gwNumber)));
    }
  });
  return rates.reduce((a, b) => a + b, 0) / rates.length;
})();

function getPerGWRate(element: ElementKey): { rate: number; isEstimated: boolean } {
  const recs = historicalData.filter(d => d.element === element);
  if (recs.length >= 2) {
    const first = recs[0], last = recs[recs.length - 1];
    return {
      rate: Math.pow(last.top5500Honor / first.top5500Honor, 1 / (last.gwNumber - first.gwNumber)),
      isEstimated: false,
    };
  }
  return { rate: AVG_PER_GW_RATE, isEstimated: true };
}

function predictCutoff(element: ElementKey, nextGWNumber: number): number {
  const recs = historicalData.filter(d => d.element === element);
  if (!recs.length) return 0;
  const last = recs[recs.length - 1];
  const { rate } = getPerGWRate(element);
  return Math.floor(last.top5500Honor * Math.pow(rate, nextGWNumber - last.gwNumber));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatHonor(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)}M`;
  return n.toLocaleString();
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Predictor() {
  const [selectedElement, setSelectedElement] = useState<ElementKey>('Fire');
  const [nextGWNumber, setNextGWNumber]       = useState<number>(83);
  const [memberCount, setMemberCount]         = useState<number>(30);
  const [showHistory, setShowHistory]         = useState(false);

  const elementRecs  = historicalData.filter(d => d.element === selectedElement);
  const lastRec      = elementRecs[elementRecs.length - 1];
  const { rate: perGWRate, isEstimated } = getPerGWRate(selectedElement);
  const gwsSinceLast = lastRec ? nextGWNumber - lastRec.gwNumber : 1;

  const strictCutoff    = predictCutoff(selectedElement, nextGWNumber);
  const safeCutoff      = Math.floor(strictCutoff * 1.10);
  const perMemberTarget = memberCount > 0 ? Math.ceil(safeCutoff / memberCount) : 0;

  const styles = ELEMENT_STYLES[selectedElement];

  return (
    <div className="animate-fade-in space-y-6">

      {/* ── Header ── */}
      <div className="bg-[#1A2534] p-6 rounded-xl border border-[#BDA054]/30 shadow-lg">
        <h2 className="text-3xl font-bold text-[#E8C468] tracking-wide flex items-center gap-3">
          <Calculator className="text-[#BDA054]" size={32} />
          Predicción Unite &amp; Fight
        </h2>
        <p className="text-gray-400 mt-2">
          Modelo matemático basado en datos reales U&amp;F73–82.
          Predice el corte <strong className="text-white">Top 5,500 de la Crew</strong> para asegurar el Ticket SSR.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Config Panel ── */}
        <div className={`lg:col-span-1 bg-[#0A1526]/90 backdrop-blur-md p-6 rounded-xl border ${styles.border} space-y-5`}>
          <h3 className="text-xl font-bold text-white">Config U&amp;F {nextGWNumber}</h3>

          {/* Element Picker */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wide">
              Elemento enemigo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ELEMENTS.map(el => {
                const s = ELEMENT_STYLES[el as ElementKey];
                const active = selectedElement === el;
                return (
                  <button
                    key={el}
                    onClick={() => setSelectedElement(el as ElementKey)}
                    className={`py-2 px-1 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-all duration-200
                      ${active
                        ? `${s.badge} ${s.border} scale-105 ${s.glow}`
                        : 'bg-[#1A2534] border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                      }`}
                  >
                    <span className="text-base">{s.emoji}</span>
                    <span>{ELEMENT_NAMES[el as ElementKey]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* GW Number */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wide">
              Número de U&amp;F
            </label>
            <input
              type="number"
              value={nextGWNumber}
              onChange={e => setNextGWNumber(Math.max(83, Number(e.target.value)))}
              min={83}
              className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-3 outline-none focus:border-[#E8C468] text-center font-bold text-xl"
            />
          </div>

          {/* Member Count */}
          <div>
            <label className="text-xs text-gray-400 block mb-2 uppercase tracking-wide flex items-center gap-1">
              <Users size={12}/> Miembros activos
            </label>
            <input
              type="number"
              value={memberCount}
              onChange={e => setMemberCount(Math.max(1, Math.min(30, Number(e.target.value))))}
              min={1} max={30}
              className="w-full bg-[#1A2534] border border-[#BDA054]/50 rounded-lg text-white px-4 py-3 outline-none focus:border-[#E8C468]"
            />
          </div>

          {/* Model Info */}
          <div className="p-4 bg-[#1A2534] rounded-lg border border-[#BDA054]/20 text-xs space-y-2">
            <p className="text-gray-400 font-semibold">📊 Parámetros del modelo:</p>
            {lastRec && (
              <div className="flex justify-between">
                <span className="text-gray-400">Último {ELEMENT_NAMES[selectedElement]}</span>
                <span className="text-[#E8C468] font-mono font-bold">U&F{lastRec.gwNumber} ({lastRec.date})</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">GWs de distancia</span>
              <span className="text-white font-bold">{gwsSinceLast}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Inflación por GW</span>
              <span className={`font-bold ${styles.text}`}>+{((perGWRate - 1) * 100).toFixed(1)}%</span>
            </div>
            {isEstimated && (
              <p className="text-yellow-500/80 mt-1">⚠️ Solo 1 registro de {ELEMENT_NAMES[selectedElement]}, usando tasa promedio.</p>
            )}
          </div>

          <div className="flex items-start gap-2 p-3 bg-yellow-900/20 text-yellow-500 rounded text-xs border border-yellow-900/50">
            <AlertTriangle size={13} className="mt-0.5 shrink-0"/>
            <span>Los valores pueden variar por cambios de meta, nuevas armas o modificaciones de Cygames al formato.</span>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Main result card */}
          <div className={`bg-gradient-to-br ${styles.gradient} backdrop-blur-md p-7 rounded-xl border ${styles.border} ${styles.glow}`}>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
              Meta Segura — Top 5,500 Crew · U&amp;F{nextGWNumber} {styles.emoji}
            </p>
            <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#E8C468] to-[#4EA0D8] font-mono leading-none py-3">
              {formatHonor(safeCutoff)}
            </div>
            <p className="text-sm text-gray-300">
              Corte matemático estimado:{' '}
              <span className={`font-mono font-bold ${styles.text}`}>{formatHonor(strictCutoff)}</span>
              {' '}+ 10% margen de seguridad para evitar snipers de último momento.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A2534] p-5 rounded-xl border border-[#BDA054]/30">
              <p className="text-xs text-gray-400 flex items-center gap-2 mb-2">
                <BarChart2 size={13}/> Último corte real ({ELEMENT_NAMES[selectedElement]})
              </p>
              <p className={`text-3xl font-bold font-mono ${styles.text}`}>
                {lastRec ? formatHonor(lastRec.top5500Honor) : '—'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                U&amp;F{lastRec?.gwNumber} · {lastRec?.date}
              </p>
            </div>

            <div className="bg-[#2b172a] p-5 rounded-xl border-2 border-[#E8C468]/50 shadow-[inset_0_0_20px_rgba(213,180,80,0.06)]">
              <p className="text-xs text-[#E8C468] font-bold mb-2 flex items-center gap-1">
                <Users size={12}/> Cuota por miembro ({memberCount} activos)
              </p>
              <p className="text-3xl font-bold text-white font-mono">
                ~{formatHonor(perMemberTarget)}
              </p>
              <p className="text-xs text-gray-400 mt-1">honor individual para alcanzar la meta</p>
            </div>
          </div>

          {/* Trend card */}
          <div className="bg-[#0A1526]/90 p-5 rounded-xl border border-[#4EA0D8]/30 flex items-center gap-5">
            <TrendingUp size={44} className={`shrink-0 ${styles.text}`}/>
            <div className="flex-1">
              <p className="text-sm text-gray-400">
                Multiplicador proyectado sobre el último U&amp;F de {ELEMENT_NAMES[selectedElement]}
              </p>
              <p className="text-2xl font-bold text-white mt-1 font-mono">
                ×{Math.pow(perGWRate, gwsSinceLast).toFixed(3)}
                <span className="text-sm font-normal text-gray-400 ml-2 font-sans">
                  ({gwsSinceLast} GW{gwsSinceLast !== 1 ? 's' : ''} de distancia · +{((perGWRate - 1) * 100).toFixed(1)}%/GW)
                </span>
              </p>
              {!isEstimated
                ? <p className="text-xs text-green-400 mt-1">✅ Tasa calculada con 2 ocurrencias reales de {ELEMENT_NAMES[selectedElement]}</p>
                : <p className="text-xs text-yellow-400 mt-1">⚠️ Una sola ocurrencia registrada — usando tasa promedio general ({((AVG_PER_GW_RATE - 1) * 100).toFixed(1)}%/GW)</p>
              }
            </div>
          </div>
        </div>
      </div>

      {/* ── Historical Data Table ── */}
      <div className="bg-[#0A1526]/90 rounded-xl border border-[#BDA054]/30 overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-[#1A2534]/50 transition-colors"
        >
          <span className="text-lg font-bold text-[#E8C468] flex items-center gap-2">
            <History size={20}/> Historial Real de Cortes Top 5,500 (U&amp;F73 – U&amp;F82)
          </span>
          <span className={`text-gray-400 transition-transform duration-300 inline-block ${showHistory ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showHistory && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1A2534] text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-5 py-3 text-left">U&amp;F #</th>
                  <th className="px-5 py-3 text-left">Fecha</th>
                  <th className="px-5 py-3 text-left">Elemento</th>
                  <th className="px-5 py-3 text-right">Corte Top 5,500</th>
                  <th className="px-5 py-3 text-right">vs GW anterior</th>
                </tr>
              </thead>
              <tbody>
                {[...historicalData].reverse().map((rec, idx, arr) => {
                  const prev  = arr[idx + 1];
                  const change = prev
                    ? ((rec.top5500Honor - prev.top5500Honor) / prev.top5500Honor) * 100
                    : null;
                  const s = ELEMENT_STYLES[rec.element];
                  return (
                    <tr
                      key={rec.gwNumber}
                      className="border-t border-gray-800/60 hover:bg-[#1A2534]/40 transition-colors"
                    >
                      <td className="px-5 py-3 font-bold text-white">U&amp;F{rec.gwNumber}</td>
                      <td className="px-5 py-3 text-gray-400">{rec.date}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${s.badge}`}>
                          {s.emoji} {rec.elementEs}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-[#E8C468]">
                        {formatHonor(rec.top5500Honor)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-sm">
                        {change !== null
                          ? <span className={change >= 0 ? 'text-red-400' : 'text-green-400'}>
                              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                          : <span className="text-gray-600">—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-600 text-center py-3">
              Fuente: datos proporcionados manualmente por el líder de crew · U&amp;F73 (Jun 2024) – U&amp;F82 (Abr 2026)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
