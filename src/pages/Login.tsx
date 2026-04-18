export default function Login() {
  return (
    <div className="min-h-screen bg-[#0A1526] flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background magic circle effect */}
      <div className="absolute w-[800px] h-[800px] border-4 border-[#BDA054]/20 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] border-[1px] border-[#E8C468]/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      <div className="bg-[#1A2534]/80 backdrop-blur-xl p-10 rounded-2xl border border-[#BDA054]/50 shadow-[0_0_40px_rgba(163,50,11,0.2)] w-full max-w-md relative z-10 text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#E8C468] via-[#4EA0D8] to-[#BDA054] pb-2 drop-shadow-sm mb-2">
          Terra Hiki
        </h1>
        <p className="text-[#BDA054] uppercase tracking-[0.3em] text-xs font-bold mb-10">Crew Management</p>

        <button className="w-full bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-lg flex items-center justify-center gap-3 font-semibold hover:bg-gray-100 transition-colors shadow-md">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Ingresar con Gmail
        </button>

        <p className="mt-8 text-xs text-gray-500">
          Solo los miembros de la crew pueden acceder a la plataforma.
        </p>
      </div>
    </div>
  );
}
