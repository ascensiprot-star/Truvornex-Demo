import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Sparkles, MapPin, ChevronRight, Star,
    Sparkle, Zap, Wrench, Droplets, ChefHat, Truck,
    Heart, GraduationCap, Camera, Monitor, PawPrint, Dumbbell,
    CalendarDays, Leaf, ArrowRight, CheckCircle2, Shield
} from 'lucide-react';

const SERVICE_CATEGORIES = [
    { slug: 'cleaning',    label: 'Cleaning',      icon: Sparkle },
    { slug: 'plumbing',    label: 'Plumbing',       icon: Droplets },
    { slug: 'electrical',  label: 'Electrical',     icon: Zap },
    { slug: 'moving',      label: 'Moving',         icon: Truck },
    { slug: 'beauty',      label: 'Beauty',         icon: Heart },
    { slug: 'chef',        label: 'Personal Chef',  icon: ChefHat },
    { slug: 'fitness',     label: 'Fitness',        icon: Dumbbell },
    { slug: 'tutoring',    label: 'Tutoring',       icon: GraduationCap },
    { slug: 'pet-care',    label: 'Pet Care',       icon: PawPrint },
    { slug: 'photography', label: 'Photography',    icon: Camera },
    { slug: 'tech',        label: 'Tech Support',   icon: Monitor },
    { slug: 'garden',      label: 'Gardening',      icon: Leaf },
];

const FEATURED_PROVIDERS = [
    { id: 1, name: 'Marcus V.',  role: 'Private Concierge', rating: 4.9, reviews: 142, badge: 'Top Rated', location: 'Upper East Side', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', online: true },
    { id: 2, name: 'Elena Rose', role: 'Personal Chef',     rating: 4.8, reviews: 98,  badge: 'Premium',   location: 'Chelsea',         image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80', online: true },
    { id: 3, name: 'David Chen', role: 'Wellness Coach',    rating: 5.0, reviews: 61,  badge: 'Rising',    location: 'Midtown',         image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', online: false },
    { id: 4, name: 'Sarah K.',   role: 'Interior Designer', rating: 4.7, reviews: 203, badge: 'Verified',  location: 'Brooklyn',        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80', online: true },
];

const STATS = [
    { value: '2,400+', label: 'Verified Providers' },
    { value: '98%',    label: 'Satisfaction Rate' },
    { value: '15K+',   label: 'Jobs Completed' },
    { value: '4.9★',   label: 'Avg Rating' },
];

const HOW_IT_WORKS = [
    { icon: Search,       num: '01', title: 'Discover', desc: 'Browse hundreds of verified providers across every category — AI-ranked for your needs.' },
    { icon: CalendarDays, num: '02', title: 'Book',     desc: 'Instantly book with real-time availability. No calls, no waiting.' },
    { icon: CheckCircle2, num: '03', title: 'Done',     desc: 'Provider shows up, job gets done. Rate & earn loyalty points.' },
];

export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/services?q=${encodeURIComponent(search.trim())}`);
    };

    const anim = (delay = 0) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: `all 0.55s cubic-bezier(0.19,1,0.22,1) ${delay}s`,
    });

    return (
        <div className="w-full space-y-10">

            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="pt-3 relative">
                {/* Subtle ambient */}
                <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)', filter: 'blur(32px)' }} />

                {/* AI tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-4"
                    style={{ ...anim(0), backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border-strong)' }}>
                    <Sparkles style={{ width: 10, height: 10 }} />
                    AI-powered neighborhood services
                </div>

                {/* Headline */}
                <h1 className="font-black tracking-tight leading-[1.06] mb-3"
                    style={{ ...anim(0.04), fontSize: 'clamp(2rem, 5vw, 2.8rem)', letterSpacing: '-0.045em', color: 'var(--color-primary)' }}>
                    Every service,<br />
                    <span style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.45) 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                        at your fingertips.
                    </span>
                </h1>

                <p className="text-sm mb-5 max-w-md"
                    style={{ ...anim(0.08), color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
                    Connect with trusted, verified service providers in your neighborhood — instantly.
                </p>

                {/* Search */}
                <form onSubmit={handleSearch} className="relative max-w-lg" style={anim(0.12)}>
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ width: 15, height: 15, color: 'var(--color-text-subtle)', transition: 'color 0.15s' }} />
                    <input
                        type="text"
                        placeholder="Search cleaning, plumbing, chef…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        className="w-full h-11 pl-10 pr-28 text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: `1px solid ${searchFocused ? 'var(--color-border-accent)' : 'var(--color-border-strong)'}`,
                            borderRadius: 10,
                            boxShadow: searchFocused ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                            transition: 'all 0.18s',
                            fontFamily: 'Inter, sans-serif',
                            letterSpacing: '-0.01em',
                        }}
                    />
                    <button type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-lg text-xs font-semibold transition-all"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', letterSpacing: '-0.01em' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                        Search
                    </button>
                </form>

                {/* Quick tags */}
                <div className="flex flex-wrap gap-1.5 mt-3" style={anim(0.16)}>
                    {['Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness'].map(tag => (
                        <button key={tag}
                            onClick={() => navigate(`/services?q=${encodeURIComponent(tag)}`)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                            style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.color = 'var(--color-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {STATS.map((stat, i) => (
                    <div key={stat.label}
                        className="rounded-xl p-4 relative overflow-hidden"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', animation: `fadeInUp 0.45s cubic-bezier(0.19,1,0.22,1) ${i * 0.05}s both` }}>
                        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                            style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />
                        <div className="text-xl font-black mb-0.5" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>{stat.value}</div>
                        <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Categories ────────────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>Browse by Category</h2>
                    <Link to="/services"
                        className="flex items-center gap-0.5 text-xs font-medium transition-all"
                        style={{ color: 'var(--color-text-subtle)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                        See all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-2">
                    {SERVICE_CATEGORIES.map((cat, i) => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl text-center group transition-all duration-200"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                animation: `fadeInUp 0.45s cubic-bezier(0.19,1,0.22,1) ${i * 0.025}s both`,
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
                            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: 'var(--color-surface-high)' }}>
                                <cat.icon style={{ width: 17, height: 17, color: 'var(--color-text-muted)' }} />
                            </div>
                            <span className="text-[10px] font-semibold leading-tight" style={{ color: 'var(--color-text-muted)' }}>
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── How it Works ─────────────────────────────────────────── */}
            <section className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                    style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.02) 0%, transparent 65%)' }} />
                <h2 className="text-base font-bold mb-5" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>How Truvornex Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div key={i} className="flex gap-3 group">
                            <div className="shrink-0">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                                    style={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)' }}>
                                    <step.icon style={{ width: 15, height: 15, color: 'var(--color-text-muted)' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>{step.num}</span>
                                    <div className="text-[13px] font-bold" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{step.title}</div>
                                </div>
                                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Featured Providers ───────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>Top-Rated Providers</h2>
                    <Link to="/nearby"
                        className="flex items-center gap-0.5 text-xs font-medium transition-all"
                        style={{ color: 'var(--color-text-subtle)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                        View all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {FEATURED_PROVIDERS.map((provider, i) => (
                        <Link key={provider.id} to={`/providers/${provider.id}`}
                            className="rounded-xl overflow-hidden group transition-all duration-250"
                            style={{
                                backgroundColor: 'var(--color-surface)',
                                border: '1px solid var(--color-border)',
                                animation: `fadeInUp 0.45s cubic-bezier(0.19,1,0.22,1) ${i * 0.06}s both`,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)', e.currentTarget.style.boxShadow = 'var(--shadow-md)', e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
                            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none', e.currentTarget.style.borderColor = 'var(--color-border)')}>
                            <div className="relative h-32 overflow-hidden">
                                <img src={provider.image} alt={provider.name}
                                    className="w-full h-full object-cover transition-all duration-700"
                                    style={{ filter: 'grayscale(0.4)' }}
                                    onMouseEnter={e => (e.currentTarget.style.filter = 'grayscale(0)', e.currentTarget.style.transform = 'scale(1.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.filter = 'grayscale(0.4)', e.currentTarget.style.transform = 'scale(1)')} />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)' }} />
                                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {provider.badge}
                                </span>
                                {provider.online && (
                                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
                                )}
                            </div>
                            <div className="p-3">
                                <div className="text-xs font-bold mb-0.5" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>{provider.name}</div>
                                <div className="text-[11px] mb-2" style={{ color: 'var(--color-text-muted)' }}>{provider.role}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star style={{ width: 11, height: 11, fill: 'var(--color-text-muted)', color: 'var(--color-text-muted)' }} />
                                        <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text)' }}>{provider.rating}</span>
                                        <span className="text-[10px]" style={{ color: 'var(--color-text-subtle)' }}>({provider.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[10px]" style={{ color: 'var(--color-text-subtle)' }}>
                                        <MapPin style={{ width: 9, height: 9 }} />
                                        <span className="truncate max-w-[70px]">{provider.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Two CTAs ──────────────────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Link to="/nearby"
                    className="flex items-center justify-between p-4 rounded-xl group transition-all duration-200"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.transform = 'translateY(0)')}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border-strong)' }}>
                            <MapPin style={{ width: 18, height: 18, color: 'var(--color-text-muted)' }} />
                        </div>
                        <div>
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Providers Near You</div>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Available in your area right now</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-text-subtle)' }} />
                </Link>

                <Link to="/ai"
                    className="flex items-center justify-between p-4 rounded-xl group relative overflow-hidden transition-all duration-200"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-strong)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.transform = 'translateY(-1px)', e.currentTarget.style.boxShadow = 'var(--shadow-glow)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)', e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = 'none')}>
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.03) 0%, transparent 60%)' }} />
                    <div className="flex items-center gap-3 relative">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: 'var(--color-primary)' }}>
                            <Sparkles style={{ width: 18, height: 18, color: 'var(--color-on-primary)' }} />
                        </div>
                        <div>
                            <div className="text-[13px] font-semibold" style={{ color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>Meet Simon AI</div>
                            <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Smart booking & recommendations</p>
                        </div>
                    </div>
                    <ArrowRight className="h-4 w-4 relative transition-transform group-hover:translate-x-1" style={{ color: 'var(--color-text-subtle)' }} />
                </Link>
            </section>

            {/* ── Provider CTA ──────────────────────────────────────────── */}
            <section className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.07) 0%, transparent 60%)' }} />
                <div className="relative z-10 flex items-start gap-5 flex-col md:flex-row">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mb-3"
                            style={{ backgroundColor: 'rgba(0,0,0,0.12)', color: 'rgba(255,255,255,0.7)' }}>
                            <Shield style={{ width: 9, height: 9 }} />
                            Join 2,400+ providers
                        </div>
                        <h2 className="text-base font-black mb-1.5" style={{ letterSpacing: '-0.03em' }}>Are you a service provider?</h2>
                        <p className="text-[12px] mb-4" style={{ opacity: 0.65, lineHeight: 1.65, maxWidth: 400 }}>
                            Earn more with Truvornex. Set your hours, manage bookings, grow your business.
                        </p>
                        <div className="flex flex-wrap gap-2.5 text-[11px] mb-4" style={{ opacity: 0.6 }}>
                            {['Free to join', 'Instant payouts', 'AI-powered tools', 'Dedicated support'].map(f => (
                                <span key={f} className="flex items-center gap-1">
                                    <CheckCircle2 style={{ width: 10, height: 10 }} /> {f}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/provider')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all"
                            style={{ backgroundColor: 'var(--color-on-primary)', color: 'var(--color-primary)', letterSpacing: '-0.01em' }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9', e.currentTarget.style.transform = 'translateY(-1px)')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1', e.currentTarget.style.transform = 'translateY(0)')}>
                            Start as Provider <ArrowRight style={{ width: 13, height: 13 }} />
                        </button>
                    </div>
                    <div className="hidden md:flex items-center justify-center h-20 w-20 rounded-2xl shrink-0"
                        style={{ backgroundColor: 'rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Wrench style={{ width: 32, height: 32, opacity: 0.5 }} />
                    </div>
                </div>
            </section>

        </div>
    );
}
