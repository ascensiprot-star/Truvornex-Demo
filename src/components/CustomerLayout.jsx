import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import {
    Home, Compass, Sparkles, BarChart3, User, Moon, Sun,
    Bell, Search, Menu, X, ChevronRight, Briefcase,
    Heart, MapPin, Clock, Star, Settings, HelpCircle,
    MessageSquare, Tag, Repeat, Gift, Zap, LogIn
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/',        icon: Home,     label: 'Home',     exact: true },
    { path: '/services',icon: Compass,  label: 'Explore' },
    { path: '/ai',      icon: Sparkles, label: 'AI' },
    { path: '/spending',icon: BarChart3,label: 'Spending' },
    { path: '/profile', icon: User,     label: 'Profile' },
];

const MORE_ITEMS = [
    { path: '/chat',            icon: MessageSquare, label: 'Messages' },
    { path: '/favorites',       icon: Heart,         label: 'Saved' },
    { path: '/booking-history', icon: Clock,         label: 'Booking History' },
    { path: '/loyalty',         icon: Star,          label: 'Loyalty Program' },
    { path: '/recurring',       icon: Repeat,        label: 'Recurring Services' },
    { path: '/gift-cards',      icon: Gift,          label: 'Gift Cards' },
    { path: '/emergency',       icon: Zap,           label: 'Emergency Services' },
    { path: '/saved-addresses', icon: MapPin,        label: 'Saved Addresses' },
    { path: '/help',            icon: HelpCircle,    label: 'Help Center' },
    { path: '/notification-settings', icon: Bell,    label: 'Notifications' },
    { path: '/privacy',         icon: Settings,      label: 'Privacy & Settings' },
];

export default function CustomerLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    useEffect(() => {
        setSidebarOpen(false);
        setSearchOpen(false);
    }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) {
            navigate(`/services?q=${encodeURIComponent(q)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') { setSearchOpen(false); setSidebarOpen(false); }
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} onKeyDown={handleKeyDown}>

            {/* ── Desktop Sidebar ─────────────────────────────────────── */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-40"
                style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                {/* Logo */}
                <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <Link to="/" className="block group">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: 'var(--color-primary)' }}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 4h10M3 8h7M3 12h8" stroke="var(--color-on-primary)" strokeWidth="1.8" strokeLinecap="round"/>
                                    <circle cx="13" cy="12" r="2.5" fill="var(--color-on-primary)" fillOpacity="0.8"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-sm font-black tracking-tighter" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</h1>
                                <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-subtle)' }}>Service Platform</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Role Switcher */}
                <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                        <span className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg cursor-default"
                            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                            Customer
                        </span>
                        <button onClick={() => navigate('/provider')}
                            className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-colors hover:opacity-80"
                            style={{ color: 'var(--color-text-muted)' }}>
                            Provider ↗
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <button onClick={() => setSearchOpen(true)}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-subtle)' }}>
                        <Search className="h-4 w-4 shrink-0" />
                        <span>Search services…</span>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item);
                        return (
                            <Link key={item.path} to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                                style={active
                                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                                    : { color: 'var(--color-text-muted)' }
                                }
                                onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-primary)')}
                                onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-2 pb-1 px-3">
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>More</span>
                    </div>
                    {MORE_ITEMS.map(item => (
                        <Link key={item.path} to={item.path}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                            <item.icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[13px]">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <button onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                        {theme === 'dark' ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </aside>

            {/* ── Mobile Header ─────────────────────────────────────────── */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
                style={scrolled
                    ? { backgroundColor: 'var(--color-glass)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-border)' }
                    : { backgroundColor: 'var(--color-bg)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}
                        aria-label="Open menu">
                        <Menu className="h-5 w-5" />
                    </button>
                    <Link to="/" className="flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-primary)' }}>
                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                <path d="M3 4h10M3 8h7M3 12h8" stroke="var(--color-on-primary)" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</span>
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setSearchOpen(true)} className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <Search className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
                    </button>
                    <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors"
                        style={{ color: 'var(--color-text-muted)' }}>
                        {theme === 'dark'
                            ? <Sun style={{ width: 18, height: 18 }} />
                            : <Moon style={{ width: 18, height: 18 }} />}
                    </button>
                    <button onClick={() => navigate('/provider')}
                        className="ml-1 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors flex items-center gap-1"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                        <Briefcase style={{ width: 12, height: 12 }} />
                        <span>Provider</span>
                    </button>
                </div>
            </header>

            {/* ── Mobile Drawer ─────────────────────────────────────────── */}
            {sidebarOpen && (
                <>
                    <div className="md:hidden fixed inset-0 z-50 flex">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                        <div className="relative w-72 h-full flex flex-col overflow-y-auto"
                            style={{ backgroundColor: 'var(--color-surface)', zIndex: 51 }}>
                            <div className="flex items-center justify-between px-5 py-4"
                                style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--color-primary)' }}>
                                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 4h10M3 8h7M3 12h8" stroke="var(--color-on-primary)" strokeWidth="1.8" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                    <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</span>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg"
                                    style={{ color: 'var(--color-text-muted)' }}>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Role switcher in drawer */}
                            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-text-subtle)' }}>Current Mode</p>
                                <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                                    <span className="flex-1 text-center text-xs font-semibold py-2 rounded-lg"
                                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                                        Customer
                                    </span>
                                    <button onClick={() => navigate('/provider')}
                                        className="flex-1 text-center text-xs font-medium py-2 rounded-lg transition-colors"
                                        style={{ color: 'var(--color-text-muted)' }}>
                                        Provider ↗
                                    </button>
                                </div>
                            </div>

                            <nav className="flex-1 p-3 space-y-0.5">
                                {NAV_ITEMS.map(item => {
                                    const active = isActive(item);
                                    return (
                                        <Link key={item.path} to={item.path}
                                            className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors"
                                            style={active
                                                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                                                : { color: 'var(--color-text-muted)' }}>
                                            <item.icon className="h-4 w-4 shrink-0" />
                                            <span>{item.label}</span>
                                        </Link>
                                    );
                                })}
                                <div className="pt-3 pb-1 px-3">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>More</span>
                                </div>
                                {MORE_ITEMS.map(item => (
                                    <Link key={item.path} to={item.path}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors"
                                        style={{ color: 'var(--color-text-muted)' }}>
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </nav>

                            <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                                <button onClick={toggleTheme}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Search Overlay ────────────────────────────────────────── */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col"
                    style={{ backgroundColor: 'var(--color-glass)', backdropFilter: 'blur(20px)' }}>
                    <div className="max-w-2xl mx-auto w-full px-4 pt-16 md:pt-24">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                                style={{ color: 'var(--color-text-subtle)' }} />
                            <input ref={searchRef} type="text"
                                placeholder="Search services, providers, categories…"
                                className="w-full h-14 rounded-2xl pl-12 pr-14 text-base outline-none"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-text)',
                                    border: '1px solid var(--color-border-strong)',
                                    boxShadow: 'var(--shadow-lg)'
                                }}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)} />
                            <button type="button" onClick={() => setSearchOpen(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                                style={{ color: 'var(--color-text-subtle)' }}>
                                <X className="h-5 w-5" />
                            </button>
                        </form>

                        <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-subtle)' }}>
                                Popular
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Cleaning', 'Plumbing', 'Personal Chef', 'Moving', 'Fitness', 'Tutoring'].map(tag => (
                                    <button key={tag}
                                        onClick={() => { navigate(`/services?q=${encodeURIComponent(tag)}`); setSearchOpen(false); }}
                                        className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className="md:ml-60 pt-14 md:pt-0 pb-20 md:pb-8"
                style={{ minHeight: '100vh' }}>
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-8">
                    <Outlet />
                </div>
            </main>

            {/* ── Mobile Bottom Nav ─────────────────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 pb-safe"
                style={{ backgroundColor: 'var(--color-glass)', backdropFilter: 'blur(16px)', borderTop: '1px solid var(--color-border)' }}>
                {NAV_ITEMS.map(item => {
                    const active = isActive(item);
                    return (
                        <Link key={item.path} to={item.path}
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 min-w-[52px] transition-all duration-150">
                            <item.icon
                                style={{
                                    width: 22, height: 22,
                                    color: active ? 'var(--color-primary)' : 'var(--color-text-subtle)',
                                    strokeWidth: active ? 2.5 : 1.8
                                }} />
                            <span className="text-[10px] font-medium leading-none mt-0.5"
                                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-subtle)', fontWeight: active ? '700' : '500' }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
