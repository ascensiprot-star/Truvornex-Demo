import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@/lib/ThemeContext';
import {
    Search, Sparkles, MapPin, ChevronRight, Star,
    Sparkle, Zap, Wrench, Droplets, ChefHat, Truck,
    Heart, GraduationCap, Camera, Monitor, PawPrint, Dumbbell,
    CalendarDays, Leaf, ArrowRight, CheckCircle2, Shield, Navigation
} from 'lucide-react';

const SERVICE_CATEGORIES = [
    { slug: 'cleaning',    label: 'Cleaning',     icon: Sparkle   },
    { slug: 'plumbing',    label: 'Plumbing',      icon: Droplets  },
    { slug: 'electrical',  label: 'Electrical',    icon: Zap       },
    { slug: 'moving',      label: 'Moving',        icon: Truck     },
    { slug: 'beauty',      label: 'Beauty',        icon: Heart     },
    { slug: 'chef',        label: 'Personal Chef', icon: ChefHat   },
    { slug: 'fitness',     label: 'Fitness',       icon: Dumbbell  },
    { slug: 'tutoring',    label: 'Tutoring',      icon: GraduationCap },
    { slug: 'pet-care',    label: 'Pet Care',      icon: PawPrint  },
    { slug: 'photography', label: 'Photography',   icon: Camera    },
    { slug: 'tech',        label: 'Tech Support',  icon: Monitor   },
    { slug: 'garden',      label: 'Gardening',     icon: Leaf      },
];

const FEATURED_PROVIDERS = [
    { id: 1, name: 'Marcus V.',  role: 'Private Concierge', rating: 4.9, reviews: 142, badge: 'Top Rated', location: 'Upper East Side', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', online: true  },
    { id: 2, name: 'Elena Rose', role: 'Personal Chef',     rating: 4.8, reviews: 98,  badge: 'Premium',   location: 'Chelsea',         image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', online: true  },
    { id: 3, name: 'David Chen', role: 'Wellness Coach',    rating: 5.0, reviews: 61,  badge: 'Rising',    location: 'Midtown',         image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', online: false },
    { id: 4, name: 'Sarah K.',   role: 'Interior Designer', rating: 4.7, reviews: 203, badge: 'Verified',  location: 'Brooklyn',        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80', online: true  },
];

const STATS = [
    { value: '2,400+', label: 'Verified Providers' },
    { value: '98%',    label: 'Satisfaction Rate'  },
    { value: '15K+',   label: 'Jobs Completed'     },
    { value: '4.9★',   label: 'Avg Rating'         },
];

const HOW_IT_WORKS = [
    { icon: Search,       num: '01', title: 'Discover', desc: 'Browse verified providers across every category — AI-ranked for your needs.' },
    { icon: CalendarDays, num: '02', title: 'Book',     desc: 'Instantly book with real-time availability. No calls, no waiting.'         },
    { icon: CheckCircle2, num: '03', title: 'Done',     desc: 'Provider shows up, job gets done. Rate & earn loyalty points.'             },
];

export default function Home() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [search, setSearch]           = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [visible, setVisible]         = useState(false);
    const [city, setCity]               = useState(null);
    const [cityLoading, setCityLoading] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) return;
        setCityLoading(true);
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const res  = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await res.json();
                    const name =
                        data.address?.city       ||
                        data.address?.town       ||
                        data.address?.village    ||
                        data.address?.county     ||
                        null;
                    setCity(name);
                } catch { /* silent */ }
                finally { setCityLoading(false); }
            },
            () => setCityLoading(false),
            { timeout: 6000 }
        );
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/services?q=${encodeURIComponent(search.trim())}`);
    };

    const anim = (delay = 0) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `all 0.55s cubic-bezier(0.19,1,0.22,1) ${delay}s`,
    });

    const gradientText = isDark
        ? { background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.4) 100%)' }
        : { background: 'linear-gradient(135deg, #080808 0%, rgba(8,8,8,0.45) 100%)' };

    return (
        <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="pt-1 relative">
                <div className="absolute -top-12 -left-12 w-60 h-60 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.018) 0%, transparent 70%)', filter: 'blur(28px)' }} />

                {/* AI pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3"
                    style={{ ...anim(0), backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-strong)' }}>
                    <Sparkles style={{ width: 10, height: 10 }} />
                    AI-powered neighborhood services
                </div>

                {/* Headline */}
                <h1 style={{ ...anim(0.04), fontSize: 'clamp(1.85rem, 4.5vw, 2.6rem)', letterSpacing: '-0.045em', fontWeight: 900, lineHeight: 1.06, marginBottom: 10, color: 'var(--color-primary)' }}>
                    Every service,<br />
                    <span style={{
                        ...gradientText,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        at your fingertips.
                    </span>
                </h1>

                {/* Subtitle with city */}
                <p style={{ ...anim(0.08), color: 'var(--color-text-muted)', fontSize: 13, lineHeight: 1.65, marginBottom: 16, maxWidth: 440 }}>
                    {cityLoading ? (
                        <>Connect with trusted providers near you — instantly.</>
                    ) : city ? (
                        <>
                            Connect with trusted providers in{' '}
                            <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{city}</span>
                            {' '}— available right now.
                        </>
                    ) : (
                        <>Connect with trusted, verified service providers in your neighborhood — instantly.</>
                    )}
                </p>

                {/* Location chip (shown when city detected) */}
                {city && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-3"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-subtle)', border: '1px solid var(--color-border)' }}>
                        <Navigation style={{ width: 9, height: 9 }} />
                        {city}
                    </div>
                )}

                {/* Search */}
                <form onSubmit={handleSearch} className="relative" style={{ maxWidth: 480, ...anim(0.12) }}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ width: 14, height: 14, color: 'var(--color-text-subtle)' }} />
                    <input
                        type="text"
                        placeholder="Search cleaning, plumbing, chef…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        style={{
                            width: '100%', height: 40,
                            paddingLeft: 36, paddingRight: 80,
                            fontSize: 13,
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: `1px solid ${searchFocused ? 'var(--color-border-accent)' : 'var(--color-border-strong)'}`,
                            borderRadius: 9,
                            boxShadow: searchFocused ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                            outline: 'none',
                            transition: 'all 0.18s',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '-0.01em',
                        }}
                    />
                    <button type="submit"
                        style={{
                            position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)',
                            height: 30, padding: '0 12px',
                            backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                            borderRadius: 7, fontSize: 12, fontWeight: 600,
                            border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
                            transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.82')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                        Search
                    </button>
                </form>

                {/* Quick tags */}
                <div className="flex flex-wrap gap-1.5 mt-2.5" style={anim(0.16)}>
                    {['Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness'].map(tag => (
                        <button key={tag}
                            onClick={() => navigate(`/services?q=${encodeURIComponent(tag)}`)}
                            style={{
                                padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500,
                                backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)',
                                border: '1px solid var(--color-border)', cursor: 'pointer', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.color = 'var(--color-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Stats ────────────────────────────────────────────────── */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {STATS.map((stat, i) => (
                    <div key={stat.label}
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 10, padding: '12px 14px',
                            position: 'relative', overflow: 'hidden',
                            animation: `fadeInUp 0.45s cubic-bezier(0.19,1,0.22,1) ${i * 0.05}s both`,
                        }}>
                        <div style={{
                            position: 'absolute', top: 0, right: 0, width: 52, height: 52,
                            background: isDark
                                ? 'radial-gradient(circle at top right, rgba(255,255,255,0.04) 0%, transparent 70%)'
                                : 'radial-gradient(circle at top right, rgba(0,0,0,0.03) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }} />
                        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-primary)', marginBottom: 2 }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Categories ───────────────────────────────────────────── */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.03em', margin: 0 }}>
                        Browse by Category
                    </h2>
                    <Link to="/services"
                        style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 500, color: 'var(--color-text-subtle)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                        See all <ChevronRight style={{ width: 13, height: 13 }} />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                    {SERVICE_CATEGORIES.map((cat, i) => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                padding: '10px 6px', borderRadius: 10, textAlign: 'center', textDecoration: 'none',
                                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                transition: 'all 0.18s',
                                animation: `fadeInUp 0.45s cubic-bezier(0.19,1,0.22,1) ${i * 0.022}s both`,
                            }}
                            onMouseEnter={e => (
                                e.currentTarget.style.borderColor = 'var(--color-border-accent)',
                                e.currentTarget.style.backgroundColor = 'var(--color-surface-high)',
                                e.currentTarget.style.transform = 'translateY(-2px)'
                            )}
                            onMouseLeave={e => (
                                e.currentTarget.style.borderColor = 'var(--color-border)',
                                e.currentTarget.style.backgroundColor = 'var(--color-surface)',
                                e.currentTarget.style.transform = 'translateY(0)'
                            )}>
                            <div style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: 'var(--color-surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <cat.icon style={{ width: 15, height: 15, color: 'var(--color-text-muted)' }} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── How it Works ─────────────────────────────────────────── */}
            <section style={{
                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: 180, height: 180, pointerEvents: 'none',
                    background: isDark
                        ? 'radial-gradient(circle at top right, rgba(255,255,255,0.02) 0%, transparent 65%)'
                        : 'radial-gradient(circle at top right, rgba(0,0,0,0.02) 0%, transparent 65%)',
                }} />
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.03em', margin: '0 0 14px 0' }}>
                    How Truvornex Works
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {HOW_IT_WORKS.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flexShrink: 0 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 9,
                                    backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <step.icon style={{ width: 14, height: 14, color: 'var(--color-text-muted)' }} />
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-text-subtle)' }}>{step.num}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{step.title}</span>
                                </div>
                                <p style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--color-text-muted)', margin: 0 }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Featured Providers ───────────────────────────────────── */}
            <section>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.03em', margin: 0 }}>
                        Top-Rated Providers{city ? ` in ${city}` : ''}
                    </h2>
                    <Link to="/nearby"
                        style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 500, color: 'var(--color-text-subtle)', textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                        View all <ChevronRight style={{ width: 13, height: 13 }} />
                    </Link>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {FEATURED_PROVIDERS.map((provider, i) => (
                        <Link key={provider.id} to={`/providers/${provider.id}`}
                            style={{
                                borderRadius: 12, overflow: 'hidden', textDecoration: 'none',
                                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                transition: 'all 0.2s cubic-bezier(0.19,1,0.22,1)',
                                animation: `fadeInUp 0.45s cubic-bezier(0.19,1,0.22,1) ${i * 0.06}s both`,
                                display: 'block',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)', e.currentTarget.style.boxShadow = 'var(--shadow-md)', e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none', e.currentTarget.style.borderColor = 'var(--color-border)')}>
                            <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
                                <img src={provider.image} alt={provider.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.35)', transition: 'all 0.6s' }}
                                    onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0)', e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(0.35)', e.currentTarget.style.transform = 'scale(1)')} />
                                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                                <span style={{
                                    position: 'absolute', top: 6, left: 6, padding: '2px 5px',
                                    borderRadius: 5, fontSize: 9, fontWeight: 700, color: '#ffffff',
                                    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)',
                                }}>
                                    {provider.badge}
                                </span>
                                {provider.online && (
                                    <div style={{ position: 'absolute', top: 7, right: 7, width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                                )}
                            </div>
                            <div style={{ padding: '10px 10px 10px 10px' }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: 2 }}>{provider.name}</div>
                                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 7 }}>{provider.role}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                        <Star style={{ width: 10, height: 10, fill: 'var(--color-text-muted)', color: 'var(--color-text-muted)' }} />
                                        <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text)' }}>{provider.rating}</span>
                                        <span style={{ fontSize: 9, color: 'var(--color-text-subtle)' }}>({provider.reviews})</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, color: 'var(--color-text-subtle)' }}>
                                        <MapPin style={{ width: 8, height: 8 }} />
                                        <span style={{ maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{provider.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Two CTAs ─────────────────────────────────────────────── */}
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <Link to="/nearby"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
                        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                        transition: 'all 0.18s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.transform = 'translateY(0)')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)' }}>
                            <MapPin style={{ width: 16, height: 16, color: 'var(--color-text-muted)' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Providers Near You</div>
                            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                                {city ? `Available in ${city} now` : 'Available in your area now'}
                            </p>
                        </div>
                    </div>
                    <ArrowRight style={{ width: 14, height: 14, color: 'var(--color-text-subtle)', flexShrink: 0 }} />
                </Link>

                <Link to="/ai"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderRadius: 12, textDecoration: 'none',
                        backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-strong)',
                        transition: 'all 0.18s', position: 'relative', overflow: 'hidden',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = 'var(--shadow-glow)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: isDark ? 'radial-gradient(circle at top left, rgba(255,255,255,0.025) 0%, transparent 55%)' : 'radial-gradient(circle at top left, rgba(0,0,0,0.02) 0%, transparent 55%)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-primary)' }}>
                            <Sparkles style={{ width: 16, height: 16, color: 'var(--color-on-primary)' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Meet Simon AI</div>
                            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>Smart booking & recommendations</p>
                        </div>
                    </div>
                    <ArrowRight style={{ width: 14, height: 14, color: 'var(--color-text-subtle)', flexShrink: 0, position: 'relative' }} />
                </Link>
            </section>

            {/* ── Provider CTA ─────────────────────────────────────────── */}
            <section style={{
                backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                borderRadius: 14, padding: '18px 20px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 600,
                            backgroundColor: 'rgba(0,0,0,0.12)', color: 'rgba(255,255,255,0.7)',
                            marginBottom: 8,
                        }}>
                            <Shield style={{ width: 8, height: 8 }} />
                            Join 2,400+ providers
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 5px 0' }}>Are you a service provider?</h2>
                        <p style={{ fontSize: 11, lineHeight: 1.65, opacity: 0.65, maxWidth: 400, margin: '0 0 12px 0' }}>
                            Earn more with Truvornex. Set your hours, manage bookings, grow your business.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, fontSize: 10, opacity: 0.6, marginBottom: 14 }}>
                            {['Free to join', 'Instant payouts', 'AI-powered tools', 'Dedicated support'].map(f => (
                                <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <CheckCircle2 style={{ width: 9, height: 9 }} /> {f}
                                </span>
                            ))}
                        </div>
                        <button onClick={() => navigate('/provider')}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                                backgroundColor: 'var(--color-on-primary)', color: 'var(--color-primary)',
                                border: 'none', cursor: 'pointer', letterSpacing: '-0.01em',
                                transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9', e.currentTarget.style.transform = 'translateY(-1px)')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1', e.currentTarget.style.transform = 'translateY(0)')}>
                            Start as Provider <ArrowRight style={{ width: 12, height: 12 }} />
                        </button>
                    </div>
                    <div style={{ width: 64, height: 64, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Wrench style={{ width: 26, height: 26, opacity: 0.45 }} />
                    </div>
                </div>
            </section>

        </div>
    );
}
