import { useEffect, useState } from 'react';

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: 10 + Math.floor((i * 73 + 17) % 80),
    y: 10 + Math.floor((i * 47 + 31) % 80),
    size: 1 + (i % 3),
    delay: (i * 0.15) % 1.8,
    duration: 2.5 + (i % 4) * 0.5,
}));

export default function SplashScreen({ onComplete }) {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 100);
        const t2 = setTimeout(() => setPhase(2), 500);
        const t3 = setTimeout(() => setPhase(3), 900);
        const t4 = setTimeout(() => setPhase(4), 1500);
        const t5 = setTimeout(() => onComplete(), 1900);
        return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: '#05070f',
                transition: 'opacity 0.45s cubic-bezier(0.19,1,0.22,1), transform 0.45s cubic-bezier(0.19,1,0.22,1)',
                opacity: phase === 4 ? 0 : 1,
                transform: phase === 4 ? 'scale(1.03)' : 'scale(1)',
            }}>

            {/* Deep grid */}
            <div className="absolute inset-0" style={{
                backgroundImage: `
                    linear-gradient(rgba(139,124,246,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(139,124,246,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
            }} />

            {/* Radial vignette */}
            <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,124,246,0.06) 0%, transparent 70%)',
            }} />

            {/* Ambient glow blobs */}
            <div className="absolute" style={{
                width: 600, height: 600,
                left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(139,124,246,0.08) 0%, transparent 65%)',
                animation: 'pulseGlow 3s ease-in-out infinite',
            }} />
            <div className="absolute" style={{
                width: 300, height: 300,
                left: '30%', top: '30%',
                background: 'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 65%)',
                animation: 'pulseGlow 4s ease-in-out 1s infinite',
            }} />

            {/* Floating particles */}
            {PARTICLES.map(p => (
                <div key={p.id} className="absolute rounded-full" style={{
                    width: p.size + 1,
                    height: p.size + 1,
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    backgroundColor: p.id % 3 === 0 ? 'rgba(139,124,246,0.4)' : p.id % 3 === 1 ? 'rgba(96,165,250,0.3)' : 'rgba(52,211,153,0.25)',
                    opacity: phase >= 1 ? 1 : 0,
                    transition: `opacity 0.8s ${p.delay}s ease`,
                    animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                }} />
            ))}

            {/* Logo mark */}
            <div style={{
                opacity: phase >= 1 ? 1 : 0,
                transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                transition: 'all 0.7s cubic-bezier(0.19,1,0.22,1)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                marginBottom: 32,
            }}>
                {/* Icon ring */}
                <div className="relative mb-8" style={{ width: 80, height: 80 }}>
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                        background: 'linear-gradient(135deg, rgba(139,124,246,0.2) 0%, rgba(96,165,250,0.1) 100%)',
                        border: '1px solid rgba(139,124,246,0.2)',
                        animation: 'spin-slow 12s linear infinite',
                    }} />
                    {/* Inner glow */}
                    <div className="absolute inset-0 rounded-2xl" style={{
                        background: 'radial-gradient(circle at center, rgba(139,124,246,0.15) 0%, transparent 70%)',
                    }} />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{
                        background: 'linear-gradient(135deg, rgba(139,124,246,0.15) 0%, rgba(13,17,23,0.8) 100%)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(139,124,246,0.25)',
                    }}>
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                            <path d="M9 10h18M9 18h13M9 26h15" stroke="rgba(139,124,246,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
                            <circle cx="27" cy="26" r="5" fill="rgba(139,124,246,0.85)" />
                        </svg>
                    </div>
                </div>

                {/* Brand name */}
                <div style={{
                    opacity: phase >= 2 ? 1 : 0,
                    transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.6s cubic-bezier(0.19,1,0.22,1) 0.2s',
                    textAlign: 'center',
                }}>
                    <h1 style={{
                        fontSize: 32,
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        color: '#fff',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 1,
                        marginBottom: 8,
                    }}>
                        Truvornex
                    </h1>
                    <p style={{
                        color: 'rgba(139,124,246,0.7)',
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        opacity: phase >= 3 ? 1 : 0,
                        transition: 'opacity 0.5s ease 0.3s',
                    }}>
                        Powered by Simon AI
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                width: 120,
                height: 2,
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderRadius: 999,
                overflow: 'hidden',
                opacity: phase >= 2 ? 1 : 0,
                transition: 'opacity 0.4s ease 0.4s',
                position: 'relative',
            }}>
                <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(139,124,246,0.8), rgba(96,165,250,0.8))',
                    borderRadius: 999,
                    width: phase >= 3 ? '100%' : '30%',
                    transition: 'width 0.8s cubic-bezier(0.19,1,0.22,1)',
                    boxShadow: '0 0 8px rgba(139,124,246,0.5)',
                }} />
            </div>

            <style>{`
                @keyframes float {
                    0%,100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulseGlow {
                    0%,100% { opacity: 0.4; }
                    50% { opacity: 0.9; }
                }
            `}</style>
        </div>
    );
}
