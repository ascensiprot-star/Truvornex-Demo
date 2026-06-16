import { useState, useRef, useEffect } from 'react';
import {
    ArrowRight, Zap, Shield, Users, Cpu, Star, Globe, CheckCircle2,
    Sparkles, Briefcase, MapPin, Clock, Building2, Home, Handshake,
    Rocket, Heart, TrendingUp, Wrench, Leaf, Award, Lock,
} from 'lucide-react';

const SLIDES = [
    {
        id: 0,
        badge: 'Welcome to Truvornex',
        title: 'Your Neighborhood\nOS Has Arrived',
        subtitle: 'Find, book, and manage every local service with AI — trusted by your community, built for Pakistan.',
        accentColor: '#ffffff',
        bgGradient: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(255,255,255,0.07) 0%, transparent 65%)',
        stats: [
            { value: '2,400+', label: 'Verified Providers' },
            { value: '15k+', label: 'Reviews'             },
            { value: '4.9★', label: 'Avg Rating'          },
        ],
        features: [
            { icon: Zap,    text: 'Book any service in 60 seconds' },
            { icon: Shield, text: 'Every booking is insured & guaranteed' },
            { icon: Cpu,    text: 'Simon AI personalises your experience' },
        ],
    },
    {
        id: 1,
        badge: 'What It Does',
        title: 'One App for\nEvery Home Need',
        subtitle: 'Plumber at 2am? Cleaner every week? Tutor for your kids? Book any local service, 24/7, in seconds.',
        accentColor: '#93c5fd',
        bgGradient: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(147,197,253,0.08) 0%, transparent 65%)',
        categories: [
            { icon: Wrench,    label: 'Plumbing'   },
            { icon: Sparkles,  label: 'Cleaning'   },
            { icon: Zap,       label: 'Electric'   },
            { icon: Leaf,      label: 'Gardening'  },
            { icon: Cpu,       label: 'Tech Help'  },
            { icon: Heart,     label: 'Healthcare' },
            { icon: Briefcase, label: 'Tutoring'   },
            { icon: Home,      label: '+ More'     },
        ],
        features: [
            { icon: Clock,  text: 'Same-day & emergency bookings' },
            { icon: MapPin, text: 'Hyperlocal providers on your street' },
            { icon: Star,   text: '4.9 avg rating across 15,000+ reviews' },
        ],
    },
    {
        id: 2,
        badge: 'Why We Built It',
        title: 'Community-First\nService Platform',
        subtitle: "Finding trustworthy help shouldn't take hours. Neighbors vouch for every provider — your safety is guaranteed.",
        accentColor: '#6ee7b7',
        bgGradient: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(110,231,183,0.07) 0%, transparent 65%)',
        highlights: [
            { icon: Users,    title: 'Neighbor Trust',   desc: 'Every provider vouched by real neighbors'  },
            { icon: TrendingUp,title: 'Group Savings',   desc: 'Buy together and save up to 35%'           },
            { icon: Award,    title: 'Time Credits',     desc: 'Earn credits by helping your community'    },
            { icon: Lock,     title: 'Dispute System',   desc: 'AI-powered jury if anything goes wrong'    },
        ],
        features: [
            { icon: Globe,    text: 'Group buy deals — save up to 35%'    },
            { icon: Sparkles, text: 'Skill swaps & community time credits' },
            { icon: Shield,   text: 'AI-powered dispute resolution'        },
        ],
    },
    {
        id: 3,
        badge: 'Get Started',
        title: 'Ready to Transform\nYour Neighborhood?',
        subtitle: 'Join thousands of households across Pakistan already using Truvornex. Getting started takes just 30 seconds.',
        accentColor: '#fcd34d',
        bgGradient: 'radial-gradient(ellipse 120% 80% at 50% -10%, rgba(252,211,77,0.07) 0%, transparent 65%)',
        finalStats: [
            { value: '98%',    label: 'Satisfaction rate' },
            { value: '< 2min', label: 'Avg response time'  },
            { value: 'Free',   label: 'To get started'     },
        ],
        features: [
            { icon: CheckCircle2, text: 'Free to join — no hidden fees'   },
            { icon: Briefcase,    text: 'Providers earn more, stress less' },
            { icon: Lock,         text: 'Your data is always private'       },
        ],
        isCta: true,
    },
];

function StatPill({ value, label, color }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '10px 16px', borderRadius: 12, flex: 1,
            backgroundColor: 'var(--color-surface-high)',
            border: '1px solid var(--color-border-strong)',
        }}>
            <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.04em', color: color || 'var(--color-primary)' }}>{value}</span>
            <span style={{ fontSize: 12, color: 'var(--color-text-subtle)', marginTop: 1, fontWeight: 500 }}>{label}</span>
        </div>
    );
}

function CategoryChip({ icon: Icon, label, index }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            padding: '12px 8px', borderRadius: 14,
            backgroundColor: 'var(--color-surface-high)',
            border: '1px solid var(--color-border-strong)',
            animation: `fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) ${index * 0.04 + 0.1}s both`,
        }}>
            <div style={{
                width: 32, height: 32, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
            }}>
                <Icon style={{ width: 15, height: 15, color: '#93c5fd' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.01em' }}>{label}</span>
        </div>
    );
}

function HighlightCard({ icon: Icon, title, desc, color, index }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '12px 14px', borderRadius: 12,
            backgroundColor: 'var(--color-surface-high)',
            border: '1px solid var(--color-border-strong)',
            animation: `fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) ${index * 0.06 + 0.1}s both`,
        }}>
            <div style={{
                width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
            }}>
                <Icon style={{ width: 14, height: 14, color: color || '#6ee7b7' }} />
            </div>
            <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.01em', marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: 13, color: 'var(--color-text-subtle)', lineHeight: 1.4 }}>{desc}</p>
            </div>
        </div>
    );
}

export default function IntroFlow({ onComplete }) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [animKey, setAnimKey] = useState(0);
    const touchStartX = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { const t = setTimeout(() => setMounted(true), 30); return () => clearTimeout(t); }, []);

    const slide = SLIDES[current];
    const isLast = current === SLIDES.length - 1;

    const goTo = (idx) => {
        if (idx === current || idx < 0 || idx >= SLIDES.length) return;
        setDirection(idx > current ? 1 : -1);
        setCurrent(idx);
        setAnimKey(k => k + 1);
    };

    const next = () => isLast ? finish() : goTo(current + 1);
    const finish = () => { localStorage.setItem('truvornex-intro-seen', '1'); onComplete(); };

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (delta < -50) next();
        else if (delta > 50 && current > 0) goTo(current - 1);
    };

    return (
        <div
            className="fixed inset-0 z-[9998] flex flex-col overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg)' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(32px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-32px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%       { opacity: 0.7; transform: scale(1.05); }
                }
                .intro-slide-enter {
                    animation: ${direction > 0 ? 'slideInRight' : 'slideInLeft'} 0.36s cubic-bezier(0.19,1,0.22,1) forwards;
                }
            `}</style>

            {/* Ambient bg gradient */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: slide.bgGradient, transition: 'background 0.6s ease' }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
                opacity: 0.6,
            }} />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-0">
                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        backgroundColor: 'var(--color-surface-high)',
                        border: '1px solid var(--color-border-strong)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Building2 style={{ width: 13, height: 13, color: 'var(--color-primary)' }} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-primary)' }}>Truvornex</span>
                </div>

                {/* Skip */}
                <button onClick={finish} style={{
                    fontSize: 13, fontWeight: 600, letterSpacing: '0.02em',
                    color: 'var(--color-text-subtle)', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '5px 10px', borderRadius: 8,
                    touchAction: 'manipulation',
                }}>
                    Skip
                </button>
            </div>

            {/* Progress bar */}
            <div className="relative z-10 px-5 mt-3">
                <div style={{
                    height: 2, backgroundColor: 'var(--color-surface-high)',
                    borderRadius: 999, overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%', borderRadius: 999,
                        width: `${((current + 1) / SLIDES.length) * 100}%`,
                        backgroundColor: slide.accentColor,
                        transition: 'width 0.4s cubic-bezier(0.25,1,0.5,1), background-color 0.4s ease',
                        boxShadow: `0 0 8px ${slide.accentColor}60`,
                    }} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 pb-2 relative z-10 overflow-hidden">
                <div
                    key={animKey}
                    className="intro-slide-enter"
                    style={{ width: '100%', maxWidth: 400 }}
                >
                    {/* Badge */}
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                        <span style={{
                            display: 'inline-block',
                            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: slide.accentColor,
                            backgroundColor: `${slide.accentColor}12`,
                            border: `1px solid ${slide.accentColor}30`,
                            padding: '4px 12px', borderRadius: 999,
                            transition: 'all 0.3s ease',
                        }}>
                            {slide.badge}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 5.5vw, 2rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.05em',
                        lineHeight: 1.08,
                        color: 'var(--color-primary)',
                        textAlign: 'center',
                        marginBottom: 10,
                        whiteSpace: 'pre-line',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) 0.05s both',
                    }}>
                        {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 15, lineHeight: 1.6,
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                        margin: '0 auto 18px',
                        maxWidth: 340,
                        letterSpacing: '-0.01em',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) 0.09s both',
                    }}>
                        {slide.subtitle}
                    </p>

                    {/* Slide 0: Stats row */}
                    {slide.stats && (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14, animation: 'fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) 0.12s both' }}>
                            {slide.stats.map((s, i) => <StatPill key={i} {...s} color={slide.accentColor} />)}
                        </div>
                    )}

                    {/* Slide 3: Final stats */}
                    {slide.finalStats && (
                        <div style={{ display: 'flex', gap: 8, marginBottom: 14, animation: 'fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) 0.12s both' }}>
                            {slide.finalStats.map((s, i) => <StatPill key={i} {...s} color={slide.accentColor} />)}
                        </div>
                    )}

                    {/* Slide 1: Category grid */}
                    {slide.categories && (
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
                            marginBottom: 14,
                        }}>
                            {slide.categories.map((c, i) => <CategoryChip key={i} {...c} index={i} />)}
                        </div>
                    )}

                    {/* Slide 2: Highlights */}
                    {slide.highlights && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                            {slide.highlights.map((h, i) => <HighlightCard key={i} {...h} color={slide.accentColor} index={i} />)}
                        </div>
                    )}

                    {/* Feature list */}
                    <div style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border-strong)',
                        borderRadius: 14,
                        padding: '2px 0',
                        boxShadow: 'var(--shadow-sm)',
                        animation: 'fadeInUp 0.4s cubic-bezier(0.19,1,0.22,1) 0.16s both',
                    }}>
                        {slide.features.map(({ icon: Icon, text }, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '10px 14px',
                                borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
                            }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: `${slide.accentColor}12`,
                                    border: `1px solid ${slide.accentColor}25`,
                                }}>
                                    <Icon style={{ width: 13, height: 13, color: slide.accentColor }} />
                                </div>
                                <span style={{
                                    fontSize: 14, lineHeight: 1.45,
                                    color: 'var(--color-text-muted)',
                                    fontWeight: 500,
                                    letterSpacing: '-0.01em',
                                }}>
                                    {text}
                                </span>
                                <CheckCircle2 style={{ width: 13, height: 13, color: slide.accentColor, marginLeft: 'auto', flexShrink: 0, opacity: 0.7 }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom nav */}
            <div style={{ padding: '0 20px 32px', position: 'relative', zIndex: 10 }}>
                {/* Dot indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginBottom: 14 }}>
                    {SLIDES.map((s, i) => (
                        <button key={i} onClick={() => goTo(i)} style={{
                            height: 5,
                            width: i === current ? 22 : 5,
                            borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                            backgroundColor: i === current ? s.accentColor : 'var(--color-border-strong)',
                            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                            boxShadow: i === current ? `0 0 6px ${s.accentColor}60` : 'none',
                            touchAction: 'manipulation',
                        }} />
                    ))}
                </div>

                {/* CTA button */}
                <button onClick={next} style={{
                    width: '100%', height: 48, borderRadius: 13,
                    fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                    border: 'none', cursor: 'pointer',
                    boxShadow: `0 4px 20px ${slide.accentColor === '#ffffff' ? 'rgba(255,255,255,0.15)' : slide.accentColor + '30'}, var(--shadow-md)`,
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'all 0.2s var(--ease-out-expo)',
                }}>
                    {isLast
                        ? <><Rocket style={{ width: 15, height: 15 }} /> Get Started — It's Free</>
                        : <>Next <ArrowRight style={{ width: 14, height: 14 }} /></>
                    }
                </button>

                <p style={{
                    textAlign: 'center', fontSize: 12, marginTop: 10,
                    color: 'var(--color-text-subtle)', fontWeight: 500,
                    letterSpacing: '0.03em',
                }}>
                    {current + 1} of {SLIDES.length} · Swipe to navigate
                </p>
            </div>
        </div>
    );
}
