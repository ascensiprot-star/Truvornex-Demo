import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Sparkles, MapPin, ChevronRight, Star, Clock,
    Sparkle, Zap, Wrench, Droplets, ChefHat, Truck,
    Heart, GraduationCap, Camera, Monitor, PawPrint, Dumbbell,
    CalendarDays, Leaf, ArrowRight, CheckCircle2, Shield
} from 'lucide-react';

const SERVICE_CATEGORIES = [
    { slug: 'cleaning',    label: 'Cleaning',       icon: Sparkle,       color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
    { slug: 'plumbing',    label: 'Plumbing',       icon: Droplets,      color: '#22d3ee', bg: 'rgba(34,211,238,0.1)' },
    { slug: 'electrical',  label: 'Electrical',     icon: Zap,           color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    { slug: 'moving',      label: 'Moving',         icon: Truck,         color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
    { slug: 'beauty',      label: 'Beauty',         icon: Heart,         color: '#f472b6', bg: 'rgba(244,114,182,0.1)' },
    { slug: 'chef',        label: 'Personal Chef',  icon: ChefHat,       color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
    { slug: 'fitness',     label: 'Fitness',        icon: Dumbbell,      color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    { slug: 'tutoring',    label: 'Tutoring',       icon: GraduationCap, color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
    { slug: 'pet-care',    label: 'Pet Care',       icon: PawPrint,      color: '#a3e635', bg: 'rgba(163,230,53,0.1)' },
    { slug: 'photography', label: 'Photography',    icon: Camera,        color: '#c084fc', bg: 'rgba(192,132,252,0.1)' },
    { slug: 'tech',        label: 'Tech Support',   icon: Monitor,       color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
    { slug: 'garden',      label: 'Gardening',      icon: Leaf,          color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
];

const FEATURED_PROVIDERS = [
    { id: 1, name: 'Marcus V.',  role: 'Private Concierge', rating: 4.9, reviews: 142, badge: 'Top Rated', location: 'Upper East Side', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', online: true },
    { id: 2, name: 'Elena Rose', role: 'Personal Chef',     rating: 4.8, reviews: 98,  badge: 'Premium',   location: 'Chelsea',         image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', online: true },
    { id: 3, name: 'David Chen', role: 'Wellness Coach',    rating: 5.0, reviews: 61,  badge: 'Rising',    location: 'Midtown',         image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', online: false },
    { id: 4, name: 'Sarah K.',   role: 'Interior Designer', rating: 4.7, reviews: 203, badge: 'Verified',  location: 'Brooklyn',        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80', online: true },
];

const STATS = [
    { value: '2,400+', label: 'Verified Providers', color: 'var(--color-accent)' },
    { value: '98%',    label: 'Satisfaction Rate',  color: 'var(--color-success)' },
    { value: '15K+',   label: 'Jobs Completed',     color: 'var(--color-accent-2)' },
    { value: '4.9★',   label: 'Avg Rating',         color: '#fbbf24' },
];

const HOW_IT_WORKS = [
    { icon: Search,       title: 'Discover',  desc: 'Browse hundreds of verified providers across every service category — AI-ranked for you.',     num: '01' },
    { icon: CalendarDays, title: 'Book',       desc: 'Instantly book with real-time availability. No calls, no waiting, no friction.',                num: '02' },
    { icon: CheckCircle2, title: 'Done',       desc: 'Provider arrives, job gets done. Rate & review when complete. Points on every booking.',        num: '03' },
];

function useCountUp(end, duration = 1200, trigger = true) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!trigger) return;
        const steps = 40;
        const step = Math.ceil(end / steps);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + step, end);
            setCount(current);
            if (current >= end) clearInterval(timer);
        }, duration / steps);
        return () => clearInterval(timer);
    }, [trigger, end, duration]);
    return count;
}

export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/services?q=${encodeURIComponent(search.trim())}`);
    };

    return (
        <div className="w-full space-y-16 pb-8">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="relative pt-6 pb-2">
                {/* Ambient background glow */}
                <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,124,246,0.07) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }} />
                <div className="absolute -top-10 right-0 w-64 h-64 rounded-full pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)',
                        filter: 'blur(30px)',
                    }} />

                {/* AI badge */}
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                    style={{
                        backgroundColor: 'var(--color-accent-light)',
                        color: 'var(--color-accent)',
                        border: '1px solid var(--color-border-accent)',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'all 0.6s cubic-bezier(0.19,1,0.22,1)',
                    }}>
                    <Sparkles style={{ width: 11, height: 11 }} />
                    <span>AI-powered neighborhood services</span>
                </div>

                {/* Headline */}
                <h1
                    className="text-[2.6rem] md:text-[3.5rem] font-black tracking-tight leading-[1.05] mb-4"
                    style={{
                        color: 'var(--color-primary)',
                        letterSpacing: '-0.04em',
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'all 0.65s cubic-bezier(0.19,1,0.22,1) 0.05s',
                    }}>
                    Every service,<br />
                    <span style={{
                        background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-2) 50%, var(--color-accent-3) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        at your fingertips.
                    </span>
                </h1>

                <p
                    className="text-base md:text-lg max-w-lg mb-7"
                    style={{
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.65,
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.65s cubic-bezier(0.19,1,0.22,1) 0.1s',
                    }}>
                    Connect with trusted, verified service providers in your neighborhood — instantly.
                </p>

                {/* Search bar */}
                <form onSubmit={handleSearch}
                    className="relative max-w-xl"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.65s cubic-bezier(0.19,1,0.22,1) 0.15s',
                    }}>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 pointer-events-none"
                        style={{ width: 18, height: 18, color: searchFocused ? 'var(--color-accent)' : 'var(--color-text-subtle)', transition: 'color 0.2s' }} />
                    <input
                        type="text"
                        placeholder="Search cleaning, plumbing, chef…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="w-full h-14 pl-12 pr-32 text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: `1px solid ${searchFocused ? 'var(--color-border-accent)' : 'var(--color-border-strong)'}`,
                            borderRadius: 14,
                            boxShadow: searchFocused ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                            transition: 'all 0.2s',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    />
                    <button type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-accent), #5b4fc4)',
                            color: '#fff',
                            letterSpacing: '-0.01em',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-50%) translateY(-1px)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,124,246,0.4)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(-50%)', e.currentTarget.style.boxShadow = 'none')}>
                        Search
                    </button>
                </form>

                {/* Quick tags */}
                <div className="flex flex-wrap gap-2 mt-4"
                    style={{
                        opacity: visible ? 1 : 0,
                        transition: 'opacity 0.6s ease 0.2s',
                    }}>
                    {['Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness'].map(tag => (
                        <button key={tag}
                            onClick={() => navigate(`/services?q=${encodeURIComponent(tag)}`)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                            style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)', e.currentTarget.style.color = 'var(--color-accent)', e.currentTarget.style.backgroundColor = 'var(--color-accent-light)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-muted)', e.currentTarget.style.backgroundColor = 'var(--color-surface-high)')}>
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STATS.map((stat, i) => (
                    <div key={stat.label}
                        className="rounded-2xl p-5 text-center relative overflow-hidden"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            animation: `fadeInUp 0.5s cubic-bezier(0.19,1,0.22,1) ${i * 0.06}s both`,
                        }}>
                        <div className="absolute inset-0 opacity-30 pointer-events-none"
                            style={{ background: `radial-gradient(circle at 80% 20%, ${stat.color}15, transparent 60%)` }} />
                        <div className="relative">
                            <div className="text-2xl font-black mb-1" style={{ color: stat.color, letterSpacing: '-0.03em' }}>{stat.value}</div>
                            <div className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ── Service Categories ────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>
                        Browse by Category
                    </h2>
                    <Link to="/services"
                        className="flex items-center gap-1 text-sm font-medium transition-all"
                        style={{ color: 'var(--color-text-subtle)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                        See all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {SERVICE_CATEGORIES.map((cat, i) => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-2.5 p-3 md:p-4 rounded-2xl text-center group transition-all duration-250"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                animation: `fadeInUp 0.5s cubic-bezier(0.19,1,0.22,1) ${i * 0.03}s both`,
                            }}
                            onMouseEnter={e => (
                                e.currentTarget.style.borderColor = `${cat.color}40`,
                                e.currentTarget.style.backgroundColor = cat.bg,
                                e.currentTarget.style.transform = 'translateY(-3px)',
                                e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}20`
                            )}
                            onMouseLeave={e => (
                                e.currentTarget.style.borderColor = 'var(--color-border)',
                                e.currentTarget.style.backgroundColor = 'var(--color-surface)',
                                e.currentTarget.style.transform = 'translateY(0)',
                                e.currentTarget.style.boxShadow = 'none'
                            )}>
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center transition-transform duration-250"
                                style={{ backgroundColor: cat.bg }}>
                                <cat.icon style={{ width: 22, height: 22, color: cat.color }} />
                            </div>
                            <span className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── How it Works ─────────────────────────────────────────── */}
            <section className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at top right, rgba(139,124,246,0.06) 0%, transparent 60%)' }} />
                <h2 className="text-xl font-bold tracking-tight mb-7" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>
                    How Truvornex Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="shrink-0">
                                <div className="h-11 w-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                                    style={{ background: 'linear-gradient(135deg, var(--color-accent-light), var(--color-surface-high))', border: '1px solid var(--color-border-accent)' }}>
                                    <step.icon style={{ width: 18, height: 18, color: 'var(--color-accent)' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-black tracking-wider" style={{ color: 'var(--color-text-subtle)' }}>{step.num}</span>
                                    <div className="font-bold text-sm" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{step.title}</div>
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Featured Providers ───────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>
                        Top-Rated Providers
                    </h2>
                    <Link to="/nearby"
                        className="flex items-center gap-1 text-sm font-medium transition-all"
                        style={{ color: 'var(--color-text-subtle)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                        View all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {FEATURED_PROVIDERS.map((provider, i) => (
                        <Link key={provider.id} to={`/providers/${provider.id}`}
                            className="rounded-2xl overflow-hidden group transition-all duration-300"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                animation: `fadeInUp 0.5s cubic-bezier(0.19,1,0.22,1) ${i * 0.07}s both`,
                            }}
                            onMouseEnter={e => (
                                e.currentTarget.style.transform = 'translateY(-4px)',
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)',
                                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                            )}
                            onMouseLeave={e => (
                                e.currentTarget.style.transform = 'translateY(0)',
                                e.currentTarget.style.boxShadow = 'none',
                                e.currentTarget.style.borderColor = 'var(--color-border)'
                            )}>
                            <div className="relative h-40 overflow-hidden">
                                <img src={provider.image} alt={provider.name}
                                    className="w-full h-full object-cover transition-all duration-700"
                                    style={{ filter: 'grayscale(0.3)', transform: 'scale(1)' }}
                                    onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0)', e.currentTarget.style.transform = 'scale(1.06)')}
                                    onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(0.3)', e.currentTarget.style.transform = 'scale(1)')} />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                                        {provider.badge}
                                    </span>
                                </div>
                                {provider.online && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
                                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#4ade80' }} />
                                        <span className="text-[10px] font-medium text-white">Online</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3.5">
                                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{provider.name}</div>
                                <div className="text-xs mb-2.5" style={{ color: 'var(--color-text-muted)' }}>{provider.role}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star style={{ width: 13, height: 13, fill: '#fbbf24', color: '#fbbf24' }} />
                                        <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>{provider.rating}</span>
                                        <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>({provider.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                                        <MapPin style={{ width: 11, height: 11 }} />
                                        <span>{provider.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Two CTAs ──────────────────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nearby Providers */}
                <Link to="/nearby"
                    className="flex items-center justify-between p-5 rounded-2xl group transition-all duration-250"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = 'var(--shadow-glow)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, var(--color-accent-light), rgba(96,165,250,0.1))', border: '1px solid var(--color-border-accent)' }}>
                            <MapPin style={{ width: 22, height: 22, color: 'var(--color-accent)' }} />
                        </div>
                        <div>
                            <div className="font-bold text-sm" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Providers Near You</div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Available in your area right now</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5"
                        style={{ color: 'var(--color-text-subtle)' }} />
                </Link>

                {/* AI Assistant */}
                <Link to="/ai"
                    className="flex items-center justify-between p-5 rounded-2xl group relative overflow-hidden transition-all duration-250"
                    style={{ background: 'linear-gradient(135deg, rgba(139,124,246,0.1) 0%, rgba(96,165,250,0.06) 100%)', border: '1px solid var(--color-border-accent)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = 'var(--shadow-glow)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                    <div className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at top left, var(--color-accent-light), transparent 60%)' }} />
                    <div className="flex items-center gap-4 relative">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, var(--color-accent), #5b4fc4)', boxShadow: '0 4px 16px rgba(139,124,246,0.3)' }}>
                            <Sparkles style={{ width: 22, height: 22, color: '#fff' }} />
                        </div>
                        <div>
                            <div className="font-bold text-sm" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Meet Simon AI</div>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Smart booking & recommendations</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5 relative"
                        style={{ color: 'var(--color-accent)' }} />
                </Link>
            </section>

            {/* ── Become a Provider ─────────────────────────────────────── */}
            <section className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(139,124,246,0.2) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 right-0 w-48 h-48 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
                <div className="relative z-10 flex items-start gap-6 flex-col md:flex-row">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
                            <Shield style={{ width: 10, height: 10 }} />
                            Join 2,400+ providers
                        </div>
                        <h2 className="text-xl font-black mb-2" style={{ letterSpacing: '-0.03em' }}>Are you a service provider?</h2>
                        <p className="text-sm mb-4" style={{ opacity: 0.7, lineHeight: 1.65, maxWidth: 420 }}>
                            Join thousands of professionals earning more with Truvornex. Set your hours, manage bookings, and grow your business.
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs mb-5" style={{ opacity: 0.65 }}>
                            {['Free to join', 'Instant payouts', 'AI-powered tools', 'Dedicated support'].map(f => (
                                <span key={f} className="flex items-center gap-1.5">
                                    <CheckCircle2 style={{ width: 12, height: 12 }} /> {f}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/provider')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                            style={{ backgroundColor: 'var(--color-on-primary)', color: 'var(--color-primary)', letterSpacing: '-0.01em' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.92', e.currentTarget.style.transform = 'translateY(-1px)')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1', e.currentTarget.style.transform = 'translateY(0)')}>
                            Start as Provider <ArrowRight style={{ width: 16, height: 16 }} />
                        </button>
                    </div>
                    <div className="shrink-0 hidden md:flex items-center justify-center h-24 w-24 rounded-3xl"
                        style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Wrench style={{ width: 40, height: 40, opacity: 0.6 }} />
                    </div>
                </div>
            </section>

        </div>
    );
}
