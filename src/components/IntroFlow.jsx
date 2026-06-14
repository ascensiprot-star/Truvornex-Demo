import { useState, useRef } from 'react';
import { ArrowRight, Zap, Shield, Users, Cpu, Star, Globe, CheckCircle2, Sparkles, Briefcase, MapPin, Clock } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

const SLIDES = [
    {
        id: 0,
        badge: 'Welcome',
        title: 'Your Neighborhood\nOS Has Arrived',
        subtitle: 'Truvornex connects you with trusted local service providers — powered by Simon AI, built for your community.',
        accent: '#7c6fcd',
        accentLight: 'rgba(124,111,205,0.12)',
        features: [
            { icon: Zap,     text: '2,400+ verified providers in your area' },
            { icon: Shield,  text: 'Every booking is insured & guaranteed'   },
            { icon: Cpu,     text: 'Simon AI personalises your experience'   },
        ],
        visual: '🏙️',
    },
    {
        id: 1,
        badge: 'What It Is',
        title: 'One App for\nEvery Home Need',
        subtitle: 'From emergency plumbing at 2am to weekly cleaning — book any local service in 60 seconds, 24/7.',
        accent: '#10b981',
        accentLight: 'rgba(16,185,129,0.12)',
        features: [
            { icon: Clock,   text: 'Same-day & emergency bookings'           },
            { icon: MapPin,  text: 'Hyperlocal providers in your street'     },
            { icon: Star,    text: '4.9★ average — 15,000+ reviews'          },
        ],
        visual: '⚡',
    },
    {
        id: 2,
        badge: 'Why It Exists',
        title: 'Community-First\nService Platform',
        subtitle: 'We built Truvornex because finding trustworthy help shouldn\'t take hours of Googling, calling, and hoping.',
        accent: '#f59e0b',
        accentLight: 'rgba(245,158,11,0.12)',
        features: [
            { icon: Users,    text: 'Neighbors vouching for every provider'  },
            { icon: Globe,    text: 'Group buy deals — save up to 35%'        },
            { icon: Sparkles, text: 'Skill swaps & community time credits'   },
        ],
        visual: '🤝',
    },
    {
        id: 3,
        badge: 'Get Started',
        title: 'Ready to Transform\nYour Neighborhood?',
        subtitle: 'Join 2,400+ households already using Truvornex. It only takes 30 seconds to get started.',
        accent: '#7c6fcd',
        accentLight: 'rgba(124,111,205,0.12)',
        features: [
            { icon: CheckCircle2, text: 'Free to join — no hidden fees'      },
            { icon: Briefcase,    text: 'Providers earn more, stress less'   },
            { icon: Shield,       text: 'Your data is always private'        },
        ],
        visual: '🚀',
        isCta: true,
    },
];

export default function IntroFlow({ onComplete }) {
    const [current, setCurrent] = useState(0);
    const [exiting, setExiting] = useState(false);
    const [direction, setDirection] = useState(1);
    const touchStartX = useRef(null);
    const { theme } = useTheme();
    const isDark = theme !== 'light';

    const slide = SLIDES[current];
    const isLast = current === SLIDES.length - 1;

    const goTo = (idx) => {
        if (idx === current || idx < 0 || idx >= SLIDES.length) return;
        setDirection(idx > current ? 1 : -1);
        setExiting(true);
        setTimeout(() => {
            setCurrent(idx);
            setExiting(false);
        }, 180);
    };

    const next = () => {
        if (isLast) {
            finish();
        } else {
            goTo(current + 1);
        }
    };

    const finish = () => {
        localStorage.setItem('truvornex-intro-seen', '1');
        onComplete();
    };

    const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (delta < -50) next();
        else if (delta > 50 && current > 0) goTo(current - 1);
    };

    const bg = isDark ? '#080808' : '#ffffff';
    const cardBg = isDark ? '#111111' : '#f7f7f7';
    const textPrimary = isDark ? '#ffffff' : '#080808';
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)';
    const textBody = isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)';
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    return (
        <div
            className="fixed inset-0 z-[9998] flex flex-col overflow-hidden"
            style={{ backgroundColor: bg }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
            }} />

            {/* Accent glow behind content */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-700" style={{
                width: 500, height: 400,
                background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${slide.accentLight} 0%, transparent 70%)`,
            }} />

            {/* Skip button */}
            <div className="absolute top-5 right-5 z-10">
                <button
                    onClick={finish}
                    style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
                        color: textMuted, background: 'none', border: 'none',
                        cursor: 'pointer', padding: '6px 10px', borderRadius: 8,
                        touchAction: 'manipulation',
                    }}>
                    Skip
                </button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4 relative z-10">
                <div
                    style={{
                        width: '100%', maxWidth: 420,
                        opacity: exiting ? 0 : 1,
                        transform: exiting
                            ? `translateX(${direction > 0 ? '-32px' : '32px'})`
                            : 'translateX(0)',
                        transition: 'opacity 0.18s ease, transform 0.18s ease',
                    }}
                >
                    {/* Emoji visual */}
                    <div style={{ fontSize: 52, textAlign: 'center', marginBottom: 20, lineHeight: 1 }}>
                        {slide.visual}
                    </div>

                    {/* Badge */}
                    <div style={{ textAlign: 'center', marginBottom: 14 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: slide.accent,
                            backgroundColor: slide.accentLight,
                            border: `1px solid ${slide.accent}30`,
                            padding: '4px 12px', borderRadius: 999,
                        }}>
                            {slide.badge}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: 'clamp(1.7rem, 7vw, 2.4rem)',
                        fontWeight: 900,
                        letterSpacing: '-0.04em',
                        lineHeight: 1.08,
                        color: textPrimary,
                        textAlign: 'center',
                        marginBottom: 14,
                        whiteSpace: 'pre-line',
                    }}>
                        {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontSize: 13, lineHeight: 1.65, color: textBody,
                        textAlign: 'center', marginBottom: 28, maxWidth: 360, margin: '0 auto 28px',
                    }}>
                        {slide.subtitle}
                    </p>

                    {/* Feature list */}
                    <div style={{
                        background: cardBg,
                        border: `1px solid ${borderColor}`,
                        borderRadius: 18, padding: '16px 18px',
                        marginBottom: 28,
                    }}>
                        {slide.features.map(({ icon: Icon, text }, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                paddingTop: i === 0 ? 0 : 12,
                                marginTop: i === 0 ? 0 : 12,
                                borderTop: i === 0 ? 'none' : `1px solid ${borderColor}`,
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: slide.accentLight,
                                    border: `1px solid ${slide.accent}25`,
                                }}>
                                    <Icon style={{ width: 15, height: 15, color: slide.accent }} />
                                </div>
                                <span style={{ fontSize: 13, color: textBody, fontWeight: 500, lineHeight: 1.4 }}>
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom nav */}
            <div style={{ padding: '0 24px 36px', position: 'relative', zIndex: 10 }}>
                {/* Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 20 }}>
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                height: 6, width: i === current ? 22 : 6,
                                borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0,
                                backgroundColor: i === current ? slide.accent : (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.15)'),
                                transition: 'all 0.28s cubic-bezier(0.34,1.56,0.64,1)',
                                touchAction: 'manipulation',
                            }}
                        />
                    ))}
                </div>

                {/* CTA button */}
                <button
                    onClick={next}
                    style={{
                        width: '100%', height: 52, borderRadius: 16,
                        fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        border: 'none', cursor: 'pointer',
                        backgroundColor: slide.accent,
                        color: '#ffffff',
                        boxShadow: `0 4px 24px ${slide.accent}50`,
                        transition: 'all 0.2s ease',
                        touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                    {isLast ? (
                        <>
                            Get Started
                            <ArrowRight style={{ width: 16, height: 16 }} />
                        </>
                    ) : (
                        <>
                            Next
                            <ArrowRight style={{ width: 15, height: 15 }} />
                        </>
                    )}
                </button>

                {/* Page counter */}
                <p style={{
                    textAlign: 'center', fontSize: 11, marginTop: 14,
                    color: textMuted, fontWeight: 500,
                }}>
                    {current + 1} of {SLIDES.length}
                </p>
            </div>
        </div>
    );
}
