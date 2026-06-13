import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import {
    Home, Compass, Sparkles, BarChart3, User, Moon, Sun,
    Bell, Search, Menu, X, Briefcase,
    Heart, MapPin, Clock, Star, Settings, HelpCircle,
    MessageSquare, Repeat, Gift, Zap, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/',        icon: Home,     label: 'Home',   exact: true },
    { path: '/services',icon: Compass,  label: 'Explore' },
    { path: '/ai',      icon: Sparkles, label: 'Simon AI' },
    { path: '/spending',icon: BarChart3,label: 'Spending' },
    { path: '/profile', icon: User,     label: 'Profile' },
];

const MORE_ITEMS = [
    { path: '/chat',            icon: MessageSquare, label: 'Messages' },
    { path: '/favorites',       icon: Heart,         label: 'Saved' },
    { path: '/booking-history', icon: Clock,         label: 'Booking History' },
    { path: '/loyalty',         icon: Star,          label: 'Loyalty' },
    { path: '/recurring',       icon: Repeat,        label: 'Recurring' },
    { path: '/gift-cards',      icon: Gift,          label: 'Gift Cards' },
    { path: '/emergency',       icon: Zap,           label: 'Emergency' },
    { path: '/saved-addresses', icon: MapPin,        label: 'Addresses' },
    { path: '/help',            icon: HelpCircle,    label: 'Help' },
    { path: '/notification-settings', icon: Bell,   label: 'Notifications' },
    { path: '/privacy',         icon: Settings,      label: 'Settings' },
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
        const h = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', h, { passive: true });
        return () => window.removeEventListener('scroll', h);
    }, []);
    useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus(); }, [searchOpen]);
    useEffect(() => { setSidebarOpen(false); setSearchOpen(false); }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) { navigate(`/services?q=${encodeURIComponent(q)}`); setSearchOpen(false); setSearchQuery(''); }
    };

    const SidebarInner = ({ onClose }) => (
        <>
            {/* Logo */}
            <div className="px-4 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'var(--color-primary)' }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 4h10M3 8h7M3 12h8" stroke="var(--color-on-primary)" strokeWidth="1.8" strokeLinecap="round"/>
                            <circle cx="13" cy="12" r="2.5" fill="var(--color-on-primary)" fillOpacity="0.8"/>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xs font-black" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>TRUVORNEX</h1>
                        <p className="text-[10px]" style={{ color: 'var(--color-text-subtle)', letterSpacing: '0.02em' }}>Service Platform</p>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-1 rounded-md" style={{ color: 'var(--color-text-subtle)' }}>
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Role switcher */}
            <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex rounded-lg p-0.5 gap-0.5" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                    <span className="flex-1 text-center text-[11px] font-semibold py-1.5 rounded-md"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                        Customer
                    </span>
                    <button onClick={() => navigate('/provider')}
                        className="flex-1 text-center text-[11px] font-medium py-1.5 rounded-md transition-all flex items-center justify-center gap-0.5"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}>
                        Provider <ChevronRight style={{ width: 9, height: 9 }} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => { setSearchOpen(true); if (onClose) onClose(); }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-all"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-subtle)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                    <Search className="h-3 w-3 shrink-0" />
                    <span>Search services…</span>
                    <span className="ml-auto text-[10px] px-1 py-0.5 rounded font-mono"
                        style={{ backgroundColor: 'var(--color-surface-highest)', color: 'var(--color-text-subtle)' }}>⌘K</span>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-2 py-2 no-scrollbar">
                <div className="space-y-0.5">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item);
                        return (
                            <Link key={item.path} to={item.path} onClick={onClose}
                                className="relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150"
                                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)', backgroundColor: active ? 'var(--color-surface-high)' : 'transparent' }}
                                onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                                onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full" style={{ backgroundColor: 'var(--color-primary)', marginLeft: -1 }} />}
                                <item.icon style={{ width: 14, height: 14, flexShrink: 0, opacity: active ? 1 : 0.6 }} />
                                <span style={{ fontWeight: active ? 600 : 450, letterSpacing: '-0.01em' }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="px-2.5 pt-4 pb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>More</span>
                </div>
                <div className="space-y-0.5">
                    {MORE_ITEMS.map(item => (
                        <Link key={item.path} to={item.path} onClick={onClose}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12px] transition-all"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                            <item.icon style={{ width: 12, height: 12, flexShrink: 0, opacity: 0.5 }} />
                            <span style={{ letterSpacing: '-0.01em' }}>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom */}
            <div className="px-2 py-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={toggleTheme}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] font-medium transition-all"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                    {theme === 'dark' ? <Sun style={{ width: 13, height: 13 }} /> : <Moon style={{ width: 13, height: 13 }} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSidebarOpen(false); } }}>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col z-40"
                style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                <SidebarInner />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 flex items-center justify-between px-3"
                style={scrolled ? {
                    backgroundColor: 'var(--color-glass)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderBottom: '1px solid var(--color-border)',
                } : { backgroundColor: 'transparent' }}>
                <div className="flex items-center gap-2.5">
                    <button onClick={() => setSidebarOpen(true)}
                        className="h-7 w-7 rounded-md flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                        <Menu className="h-3.5 w-3.5" />
                    </button>
                    <Link to="/" className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: 'var(--color-primary)' }}>
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                <path d="M3 4h10M3 8h7M3 12h8" stroke="var(--color-on-primary)" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className="text-xs font-black" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>TRUVORNEX</span>
                    </Link>
                </div>
                <div className="flex items-center gap-0.5">
                    <button onClick={() => setSearchOpen(true)}
                        className="h-7 w-7 rounded-md flex items-center justify-center"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <Search style={{ width: 14, height: 14 }} />
                    </button>
                    <button onClick={toggleTheme}
                        className="h-7 w-7 rounded-md flex items-center justify-center"
                        style={{ color: 'var(--color-text-muted)' }}>
                        {theme === 'dark' ? <Sun style={{ width: 14, height: 14 }} /> : <Moon style={{ width: 14, height: 14 }} />}
                    </button>
                    <button onClick={() => navigate('/provider')}
                        className="h-6 px-2.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ml-1"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                        <Briefcase style={{ width: 9, height: 9 }} />
                        Provider
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50" style={{ animation: 'fadeIn 0.15s ease' }}>
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-64 flex flex-col"
                        style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', zIndex: 51, animation: 'slideInLeft 0.28s cubic-bezier(0.19,1,0.22,1)' }}>
                        <SidebarInner onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center pt-20 md:pt-28 px-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(24px)', animation: 'fadeIn 0.12s ease' }}>
                    <div className="w-full max-w-lg" style={{ animation: 'scaleIn 0.18s cubic-bezier(0.34,1.56,0.64,1)' }}>
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ width: 15, height: 15, color: 'var(--color-text-subtle)' }} />
                            <input ref={searchRef} type="text"
                                placeholder="Search services, providers…"
                                className="w-full h-12 pl-10 pr-12 text-sm outline-none"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-text)',
                                    border: '1px solid var(--color-border-accent)',
                                    borderRadius: 12,
                                    boxShadow: 'var(--shadow-glow)',
                                    fontFamily: 'Inter, sans-serif',
                                    letterSpacing: '-0.01em',
                                }}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)} />
                            <button type="button" onClick={() => setSearchOpen(false)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center"
                                style={{ color: 'var(--color-text-subtle)', backgroundColor: 'var(--color-surface-high)' }}>
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </form>
                        <div className="mt-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: 'var(--color-text-subtle)' }}>Trending</p>
                            <div className="flex flex-wrap gap-1.5">
                                {['Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness', 'Tutoring'].map(tag => (
                                    <button key={tag}
                                        onClick={() => { navigate(`/services?q=${encodeURIComponent(tag)}`); setSearchOpen(false); }}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-accent)', e.currentTarget.style.color = 'var(--color-primary)')}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="md:ml-56 pt-12 md:pt-0 pb-20 md:pb-6" style={{ minHeight: '100vh' }}>
                <div className="max-w-4xl mx-auto px-4 md:px-7 py-5 md:py-7 page-enter">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-14 pb-safe"
                style={{
                    backgroundColor: 'var(--color-glass)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderTop: '1px solid var(--color-border)',
                }}>
                {NAV_ITEMS.map(item => {
                    const active = isActive(item);
                    return (
                        <Link key={item.path} to={item.path}
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-all duration-150">
                            <div className="h-6 w-6 flex items-center justify-center rounded-lg"
                                style={{ backgroundColor: active ? 'var(--color-surface-high)' : 'transparent' }}>
                                <item.icon style={{ width: 17, height: 17, color: active ? 'var(--color-primary)' : 'var(--color-text-subtle)', strokeWidth: active ? 2.2 : 1.7 }} />
                            </div>
                            <span className="text-[9px] font-medium leading-none"
                                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-subtle)', fontWeight: active ? 700 : 500 }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
