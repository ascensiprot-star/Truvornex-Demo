import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 200);
        const t2 = setTimeout(() => setPhase(2), 600);
        const t3 = setTimeout(() => setPhase(3), 1100);
        const t4 = setTimeout(() => onComplete(), 1400);
        return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }, []);

    return (
        <div className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${phase === 3 ? 'opacity-0' : 'opacity-100'}`}>
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
            }} />

            {/* Glowing orb */}
            <div className={`absolute w-96 h-96 rounded-full transition-all duration-1000 ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

            {/* Logo mark */}
            <div className={`relative mb-8 transition-all duration-700 delay-100 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M8 8h16M8 16h10M8 24h13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="24" cy="24" r="5" fill="white" fillOpacity="0.9" />
                    </svg>
                </div>

                <div className={`text-center transition-all duration-700 delay-300 ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight">Truvornex</h1>
                    <p className="text-white/30 text-sm mt-2 tracking-[0.2em] uppercase font-mono-premium">Powered by Simon AI</p>
                </div>
            </div>

            {/* Loading bar */}
            <div className={`w-32 h-px bg-white/10 relative overflow-hidden mt-4 transition-all duration-500 delay-500 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-y-0 left-0 bg-white/60 animate-[loading_1.2s_ease-in-out_forwards]"
                    style={{ animation: 'splashLoad 1.2s ease-in-out forwards' }} />
            </div>

            <style>{`
        @keyframes splashLoad {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
}