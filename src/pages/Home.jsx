import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, Sparkles, MapPin, ChevronRight, Star, Clock,
    Sparkle, Zap, Wrench, Droplets, ChefHat, Truck,
    Heart, GraduationCap, Camera, Monitor, PawPrint, Dumbbell,
    CalendarDays, Leaf, ArrowRight, CheckCircle2, Shield, Award
} from 'lucide-react';

const SERVICE_CATEGORIES = [
    { slug: 'cleaning',    label: 'Cleaning',       icon: Sparkle,      color: '#3b82f6' },
    { slug: 'plumbing',    label: 'Plumbing',       icon: Droplets,     color: '#06b6d4' },
    { slug: 'electrical',  label: 'Electrical',     icon: Zap,          color: '#f59e0b' },
    { slug: 'moving',      label: 'Moving',         icon: Truck,        color: '#8b5cf6' },
    { slug: 'beauty',      label: 'Beauty',         icon: Heart,        color: '#ec4899' },
    { slug: 'chef',        label: 'Personal Chef',  icon: ChefHat,      color: '#ef4444' },
    { slug: 'fitness',     label: 'Fitness',        icon: Dumbbell,     color: '#22c55e' },
    { slug: 'tutoring',    label: 'Tutoring',       icon: GraduationCap,color: '#f97316' },
    { slug: 'pet-care',    label: 'Pet Care',       icon: PawPrint,     color: '#84cc16' },
    { slug: 'photography', label: 'Photography',    icon: Camera,       color: '#a855f7' },
    { slug: 'tech',        label: 'Tech Support',   icon: Monitor,      color: '#0ea5e9' },
    { slug: 'garden',      label: 'Gardening',      icon: Leaf,         color: '#16a34a' },
];

const FEATURED_PROVIDERS = [
    {
        id: 1,
        name: 'Marcus V.',
        role: 'Private Concierge',
        rating: 4.9,
        reviews: 142,
        badge: 'Top Rated',
        location: 'Upper East Side',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
        category: 'concierge',
        online: true,
    },
    {
        id: 2,
        name: 'Elena Rose',
        role: 'Personal Chef',
        rating: 4.8,
        reviews: 98,
        badge: 'Premium',
        location: 'Chelsea',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80',
        category: 'chef',
        online: true,
    },
    {
        id: 3,
        name: 'David Chen',
        role: 'Wellness Coach',
        rating: 5.0,
        reviews: 61,
        badge: 'New',
        location: 'Midtown',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
        category: 'fitness',
        online: false,
    },
    {
        id: 4,
        name: 'Sarah K.',
        role: 'Interior Designer',
        rating: 4.7,
        reviews: 203,
        badge: 'Verified',
        location: 'Brooklyn',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=200&q=80',
        category: 'design',
        online: true,
    },
];

const HOW_IT_WORKS = [
    { icon: Search,      title: 'Discover',  desc: 'Browse hundreds of verified providers across every service category.' },
    { icon: CalendarDays,title: 'Book',       desc: 'Instantly book with real-time availability. No calls, no hassle.' },
    { icon: CheckCircle2,title: 'Done',       desc: 'Provider shows up, job gets done. Rate & review when finished.' },
];

const STATS = [
    { value: '2,400+', label: 'Verified Providers' },
    { value: '98%',    label: 'Satisfaction Rate' },
    { value: '15,000+',label: 'Bookings Completed' },
    { value: '4.9★',   label: 'Average Rating' },
];

export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/services?q=${encodeURIComponent(search.trim())}`);
    };

    return (
        <div className="w-full space-y-12 fade-in">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <section className="pt-4 pb-2">
                <div className="mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
                        style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                        <Sparkles style={{ width: 12, height: 12 }} />
                        Now with AI-powered matching
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-3"
                        style={{ color: 'var(--color-primary)' }}>
                        Every service,<br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-text-muted) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>at your fingertips.</span>
                    </h1>
                    <p className="text-base max-w-lg mb-6" style={{ color: 'var(--color-text-muted)' }}>
                        Connect with trusted, verified service providers in your neighborhood — instantly.
                    </p>
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} className="relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                        style={{ color: 'var(--color-text-subtle)' }} />
                    <input
                        type="text"
                        placeholder="Search cleaning, plumbing, chef…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-14 rounded-2xl pl-12 pr-32 text-sm outline-none"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            color: 'var(--color-text)',
                            border: '1px solid var(--color-border-strong)',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    />
                    <button type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                        Search
                    </button>
                </form>

                {/* Quick tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {['Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness'].map(tag => (
                        <button key={tag}
                            onClick={() => navigate(`/services?q=${encodeURIComponent(tag)}`)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                            style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Stats ─────────────────────────────────────────────────── */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STATS.map(stat => (
                    <div key={stat.label} className="rounded-2xl p-4 text-center"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <div className="text-2xl font-black mb-1" style={{ color: 'var(--color-primary)' }}>{stat.value}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Service Categories ────────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
                        Browse by Category
                    </h2>
                    <Link to="/services"
                        className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                        style={{ color: 'var(--color-text-muted)' }}>
                        See all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {SERVICE_CATEGORIES.map(cat => (
                        <Link key={cat.slug} to={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl text-center hover-lift group transition-all"
                            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                                style={{ backgroundColor: `${cat.color}18` }}>
                                <cat.icon style={{ width: 22, height: 22, color: cat.color }} />
                            </div>
                            <span className="text-[12px] font-semibold leading-tight" style={{ color: 'var(--color-text)' }}>
                                {cat.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── How it Works ─────────────────────────────────────────── */}
            <section className="rounded-3xl p-6 md:p-8"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <h2 className="text-xl font-bold tracking-tight mb-6" style={{ color: 'var(--color-primary)' }}>
                    How Truvornex Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div key={i} className="flex gap-4">
                            <div className="shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: 'var(--color-surface-high)' }}>
                                <step.icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div>
                                <div className="font-bold text-sm mb-1" style={{ color: 'var(--color-primary)' }}>
                                    {i + 1}. {step.title}
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Featured Providers ───────────────────────────────────── */}
            <section>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>
                        Top-Rated Providers
                    </h2>
                    <Link to="/nearby"
                        className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
                        style={{ color: 'var(--color-text-muted)' }}>
                        View all <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {FEATURED_PROVIDERS.map(provider => (
                        <Link key={provider.id} to={`/providers/${provider.id}`}
                            className="rounded-2xl overflow-hidden hover-lift group"
                            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            {/* Image */}
                            <div className="relative h-40 overflow-hidden">
                                <img src={provider.image} alt={provider.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                {/* Badge */}
                                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                                    {provider.badge}
                                </span>
                                {/* Online dot */}
                                {provider.online && (
                                    <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white" />
                                )}
                            </div>
                            {/* Info */}
                            <div className="p-3">
                                <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--color-primary)' }}>{provider.name}</div>
                                <div className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>{provider.role}</div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>{provider.rating}</span>
                                        <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>({provider.reviews})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                                        <MapPin className="h-3 w-3" />
                                        <span>{provider.location}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Nearby Providers CTA ─────────────────────────────────── */}
            <section>
                <Link to="/nearby"
                    className="flex items-center justify-between p-5 rounded-2xl group hover-lift transition-all"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-accent-light)' }}>
                            <MapPin className="h-6 w-6" style={{ color: 'var(--color-accent)' }} />
                        </div>
                        <div>
                            <div className="font-bold text-sm mb-0.5" style={{ color: 'var(--color-primary)' }}>
                                Providers Near You
                            </div>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                See available providers in your area right now
                            </p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                        style={{ color: 'var(--color-text-muted)' }} />
                </Link>
            </section>

            {/* ── AI Assistant CTA ─────────────────────────────────────── */}
            <section>
                <Link to="/ai"
                    className="block p-6 rounded-3xl relative overflow-hidden group hover-lift"
                    style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
                            style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                            <Sparkles style={{ width: 10, height: 10 }} />
                            AI-Powered
                        </div>
                        <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                            Meet Your AI Assistant
                        </h3>
                        <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                            Get personalized service recommendations, instant answers, and smart booking suggestions.
                        </p>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                            Try AI Assistant <ArrowRight className="h-4 w-4" />
                        </span>
                    </div>
                    {/* Decorative gradient */}
                    <div className="absolute right-0 top-0 h-full w-48 opacity-10 pointer-events-none"
                        style={{ background: 'radial-gradient(circle at top right, var(--color-accent), transparent 70%)' }} />
                </Link>
            </section>

            {/* ── Become a Provider ─────────────────────────────────────── */}
            <section className="rounded-3xl p-6 md:p-8 relative overflow-hidden"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                <div className="relative z-10">
                    <div className="flex items-start gap-4 md:items-center flex-col md:flex-row">
                        <div className="flex-1">
                            <h2 className="text-xl font-black mb-2">Are you a service provider?</h2>
                            <p className="text-sm opacity-70 mb-4 max-w-md">
                                Join thousands of professionals earning more with Truvornex. Set your own hours, manage bookings, and grow your business.
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs opacity-70 mb-4">
                                {['Free to join', 'Instant payouts', 'AI-powered tools', 'Dedicated support'].map(f => (
                                    <span key={f} className="flex items-center gap-1">
                                        <Shield style={{ width: 12, height: 12 }} /> {f}
                                    </span>
                                ))}
                            </div>
                            <button onClick={() => navigate('/provider')}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
                                style={{ backgroundColor: 'var(--color-on-primary)', color: 'var(--color-primary)' }}>
                                Start as Provider <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="shrink-0 hidden md:flex items-center justify-center h-24 w-24 rounded-3xl"
                            style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                            <Wrench className="h-12 w-12" style={{ opacity: 0.8 }} />
                        </div>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 w-48 h-48 rounded-tl-3xl opacity-5 pointer-events-none"
                    style={{ backgroundColor: 'white' }} />
            </section>

        </div>
    );
}
