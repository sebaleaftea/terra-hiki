import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/login-bg.png';
import { API_BASE } from '../config';

type Tab = 'login' | 'register';

interface ApiResponse {
  message?: string;
  error?: string;
  token?: string;
  user?: { id: string; username: string };
}

export default function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [discordNick, setDiscordNick] = useState('');
  const [gameNick, setGameNick] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('terra-token');
    if (token) navigate('/home', { replace: true });
  }, [navigate]);

  const reset = () => {
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDiscordNick('');
    setGameNick('');
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !password) {
      setError('Completa todos los campos.');
      return;
    }

    if (tab === 'register') {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint =
        tab === 'login' ? '/auth/login' : '/auth/register';

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          password,
          discordNick: discordNick.trim(),
          gameNick: gameNick.trim()
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        setError(data.error || 'Algo salió mal.');
      } else {
        if (data.token) {
          localStorage.setItem('terra-token', data.token);
          localStorage.setItem('terra-user', JSON.stringify(data.user));
          setSuccess(data.message || '¡Éxito!');
          // Redirect after short delay so user sees the success message
          setTimeout(() => navigate('/home', { replace: true }), 800);
        } else {
          setSuccess(data.message || '¡Éxito!');
        }
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
      {/* ── Background Image ── */}
      <img
        src={loginBg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ zIndex: 0 }}
      />

      {/* ── Navy Color Overlay (matches app BG) ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(10,21,38,0.82) 0%, rgba(17,35,58,0.75) 50%, rgba(10,21,38,0.88) 100%)',
          zIndex: 1,
        }}
      />

      {/* ── Animated Magic Circles ── */}
      <div
        className="absolute pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <div
          className="w-[700px] h-[700px] border-2 border-[#BDA054]/15 rounded-full flex items-center justify-center"
          style={{ animation: 'spin 60s linear infinite' }}
        >
          <div
            className="w-[500px] h-[500px] border border-[#E8C468]/10 rounded-full"
            style={{ animation: 'spin 40s linear infinite reverse' }}
          />
        </div>
      </div>

      {/* ── Main Card ── */}
      <div
        className="relative w-full max-w-md mx-4 text-center"
        style={{ zIndex: 3 }}
      >
        <div className="bg-[#0A1526]/75 backdrop-blur-2xl p-8 rounded-2xl border border-[#BDA054]/40 shadow-[0_0_60px_rgba(163,50,11,0.25),0_0_120px_rgba(10,21,38,0.8)]">

          {/* Logo */}
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#E8C468] via-[#4EA0D8] to-[#BDA054] pb-1 drop-shadow-sm">
            Terra Hiki
          </h1>
          <p className="text-[#BDA054] uppercase tracking-[0.35em] text-[10px] font-bold mb-8">
            Crew Management
          </p>

          {/* ── Tabs ── */}
          <div className="flex rounded-lg overflow-hidden border border-[#BDA054]/30 mb-7">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                onClick={() => handleTabChange(t)}
                className={`flex-1 py-2.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                  tab === t
                    ? 'bg-gradient-to-r from-[#BDA054] to-[#E8C468] text-[#0A1526]'
                    : 'text-[#BDA054]/60 hover:text-[#BDA054] bg-transparent'
                }`}
              >
                {t === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#BDA054]/80 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <input
                id="input-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                autoComplete="username"
                className="w-full bg-[#11233A]/80 border border-[#BDA054]/25 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-[#E8C468]/60 focus:shadow-[0_0_0_2px_rgba(232,196,104,0.15)] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#BDA054]/80 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                id="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                className="w-full bg-[#11233A]/80 border border-[#BDA054]/25 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-[#E8C468]/60 focus:shadow-[0_0_0_2px_rgba(232,196,104,0.15)] transition-all"
              />
            </div>

            {/* Confirm Password (register only) */}
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#BDA054]/80 uppercase tracking-wider mb-1.5">
                    Confirmar Contraseña
                  </label>
                  <input
                    id="input-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="w-full bg-[#11233A]/80 border border-[#BDA054]/25 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-[#E8C468]/60 focus:shadow-[0_0_0_2px_rgba(232,196,104,0.15)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDA054]/80 uppercase tracking-wider mb-1.5">
                    ¿Cuál es tu nick en Discord?
                  </label>
                  <input
                    id="input-discord-nick"
                    type="text"
                    value={discordNick}
                    onChange={(e) => setDiscordNick(e.target.value)}
                    placeholder="ej: usuario#1234"
                    className="w-full bg-[#11233A]/80 border border-[#BDA054]/25 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-[#E8C468]/60 focus:shadow-[0_0_0_2px_rgba(232,196,104,0.15)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#BDA054]/80 uppercase tracking-wider mb-1.5">
                    ¿Cuál es tu nick en el juego?
                  </label>
                  <input
                    id="input-game-nick"
                    type="text"
                    value={gameNick}
                    onChange={(e) => setGameNick(e.target.value)}
                    placeholder="Tu nombre en Granblue"
                    className="w-full bg-[#11233A]/80 border border-[#BDA054]/25 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 text-sm outline-none focus:border-[#E8C468]/60 focus:shadow-[0_0_0_2px_rgba(232,196,104,0.15)] transition-all"
                  />
                </div>
              </>
            )}

            {/* Error / Success Messages */}
            {error && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/40 rounded-lg px-4 py-2.5 text-red-300 text-xs">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/40 rounded-lg px-4 py-2.5 text-emerald-300 text-xs">
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#BDA054] to-[#E8C468] text-[#0A1526] hover:shadow-[0_0_20px_rgba(232,196,104,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading
                ? 'Procesando...'
                : tab === 'login'
                ? 'Entrar a la Crew'
                : 'Crear Cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#BDA054]/20" />
            <span className="text-[#BDA054]/40 text-xs">o</span>
            <div className="flex-1 h-px bg-[#BDA054]/20" />
          </div>

          {/* Google Login */}
          <button
            id="btn-google"
            className="w-full bg-white/5 border border-white/10 text-gray-300 px-6 py-3 rounded-lg flex items-center justify-center gap-3 font-semibold text-sm hover:bg-white/10 transition-all duration-300 hover:border-white/20"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Ingresar con Google
          </button>

          <p className="mt-6 text-xs text-gray-600">
            Solo los miembros de la crew pueden acceder a la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
