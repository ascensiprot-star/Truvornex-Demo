import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import {
    Home, Compass, Sparkles, BarChart3, User, Moon, Sun,
    Bell, Search, Menu, X, Briefcase,
    Heart, MapPin, Clock, Star, Settings, HelpCircle,
    MessageSquare, Tag, Repeat, Gift, Zap, ChevronRight
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/',        icon: Home,     label: 'Home',   exact: true },
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
    { path: '/notification-settings', icon: Bell,   label: 'Notifications' },
    { path: '/privacy',         icon: Settings,      label: 'Privacy & Settings' },
];

function NavItem({ item, active, onClick }) {
    return (
        <Link
            to={item.path}
            onClick={onClick}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
                color: active ? '#fff' : 'var(--color-text-muted)',
                backgroundColor: active ? 'rgba(139,124,246,0.15)' : 'transparent',
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface-high)';
                    e.currentTarget.style.color = 'var(--color-text)';
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                }
            }}>
            {/* Active indicator */}
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-2))', marginLeft: -1 }} />
            )}
            <item.icon
                style={{
                    width: 16, height: 16,
                    color: active ? 'var(--color-accent)' : 'currentColor',
                    transition: 'color 0.15s',
                    flexShrink: 0,
                }}
            />
            <span style={{
                letterSpacing: '-0.01em',
                fontWeight: active ? 600 : 500,
            }}>
                {item.label}
            </span>
            {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-accent)', opacity: 0.7 }} />
            )}
        </Link>
    );
}

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
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) searchRef.current.focus();
    }, [searchOpen]);

    useEffect(() => { setSidebarOpen(false); setSearchOpen(false); }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    const handleSearch = (e) => {
        e.preventDefault();
        const q = searchQuery.trim();
        if (q) { navigate(`/services?q=${encodeURIComponent(q)}`); setSearchOpen(false); setSearchQuery(''); }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') { setSearchOpen(false); setSidebarOpen(false); }
    };

    const SidebarInner = ({ onClose }) => (
        <>
            {/* Logo */}
            <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Link to="/" onClick={onClose} className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #5b4fc4 100%)' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 4h10M3 8h7M3 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                            <circle cx="13" cy="12" r="2.5" fill="white" fillOpacity="0.9"/>
                        </svg>
                        <div className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-2))', filter: 'blur(6px)', zIndex: -1 }} />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tighter" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>TRUVORNEX</h1>
                        <p className="text-[10px] font-medium tracking-wide" style={{ color: 'var(--color-text-subtle)' }}>Service Platform</p>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors md:hidden"
                        style={{ color: 'var(--color-text-subtle)' }}>
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Role Switcher */}
            <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                    <span className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg"
                        style={{ background: 'linear-gradient(135deg, var(--color-accent), #5b4fc4)', color: '#fff', letterSpacing: '-0.01em' }}>
                        Customer
                    </span>
                    <button onClick={() => navigate('/provider')}
                        className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)', e.currentTarget.style.backgroundColor = 'var(--color-surface-highest)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)', e.currentTarget.style.backgroundColor = '')}>
                        Provider <ChevronRight style={{ width: 10, height: 10 }} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => { setSearchOpen(true); if (onClose) onClose(); }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-subtle)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)', e.currentTarget.style.color = 'var(--color-text-muted)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-subtle)')}>
                    <Search className="h-3.5 w-3.5 shrink-0" />
                    <span>Search services…</span>
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md font-mono"
                        style={{ backgroundColor: 'var(--color-surface-highest)', color: 'var(--color-text-subtle)' }}>⌘K</span>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 no-scrollbar">
                {NAV_ITEMS.map(item => (
                    <NavItem key={item.path} item={item} active={isActive(item)} onClick={onClose} />
                ))}

                <div className="pt-3 pb-1.5 px-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>More</span>
                </div>
                {MORE_ITEMS.map(item => (
                    <Link key={item.path} to={item.path}
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                        <item.icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                    <div className="h-5 w-5 shrink-0 flex items-center justify-center">
                        {theme === 'dark'
                            ? <Sun style={{ width: 14, height: 14 }} />
                            : <Moon style={{ width: 14, height: 14 }} />}
                    </div>
                    <span className="text-[13px]">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }} onKeyDown={handleKeyDown}>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-40"
                style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                <SidebarInner />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4"
                style={scrolled ? {
                    backgroundColor: 'var(--color-glass)',
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    borderBottom: '1px solid var(--color-border)',
                    boxShadow: '0 1px 0 var(--color-border)',
                } : { backgroundColor: 'transparent' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                        <Menu className="h-4 w-4" />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, var(--color-accent), #5b4fc4)' }}>
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M3 4h10M3 8h7M3 12h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>TRUVORNEX</span>
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setSearchOpen(true)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <Search style={{ width: 16, height: 16 }} />
                    </button>
                    <button onClick={toggleTheme}
                        className="h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                        style={{ color: 'var(--color-text-muted)' }}>
                        {theme === 'dark' ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
                    </button>
                    <button onClick={() => navigate('/provider')}
                        className="ml-1 h-7 px-3 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                        <Briefcase style={{ width: 11, height: 11 }} />
                        <span>Provider</span>
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50" style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-72 flex flex-col overflow-y-auto"
                        style={{
                            backgroundColor: 'var(--color-surface)',
                            borderRight: '1px solid var(--color-border)',
                            zIndex: 51,
                            animation: 'slideInLeft 0.3s cubic-bezier(0.19,1,0.22,1)',
                        }}>
                        <SidebarInner onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center pt-20 md:pt-32 px-4"
                    style={{
                        backgroundColor: 'rgba(5,7,15,0.85)',
                        backdropFilter: 'blur(24px)',
                        animation: 'fadeIn 0.15s ease',
                    }}>
                    <div className="w-full max-w-xl" style={{ animation: 'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
                                style={{ color: 'var(--color-text-subtle)' }} />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search services, providers, categories…"
                                className="w-full h-14 pl-12 pr-14 text-base outline-none"
                                style={{
                                    backgroundColor: 'var(--color-surface)',
                                    color: 'var(--color-text)',
                                    border: '1px solid var(--color-border-accent)',
                                    borderRadius: 16,
                                    boxShadow: 'var(--shadow-glow)',
                                    fontFamily: 'Inter, sans-serif',
                                }}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)} />
                            <button type="button" onClick={() => setSearchOpen(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-all"
                                style={{ color: 'var(--color-text-subtle)', backgroundColor: 'var(--color-surface-high)' }}>
                                <X className="h-4 w-4" />
                            </button>
                        </form>

                        <div className="mt-5">
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-subtle)' }}>
                                Trending
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Cleaning', 'Plumbing', 'Personal Chef', 'Moving', 'Fitness', 'Tutoring'].map(tag => (
                                    <button key={tag}
                                        onClick={() => { navigate(`/services?q=${encodeURIComponent(tag)}`); setSearchOpen(false); }}
                                        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-accent)', e.currentTarget.style.color = 'var(--color-accent)')}
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
            <main className="md:ml-60 pt-14 md:pt-0 pb-20 md:pb-8" style={{ minHeight: '100vh' }}>
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-5 md:py-8 page-enter">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 pb-safe"
                style={{
                    backgroundColor: 'var(--color-glass)',
                    backdropFilter: 'blur(24px) saturate(200%)',
                    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                    borderTop: '1px solid var(--color-border)',
                }}>
                {NAV_ITEMS.map(item => {
                    const active = isActive(item);
                    return (
                        <Link key={item.path} to={item.path}
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-4 transition-all duration-200">
                            <div className="h-7 w-7 flex items-center justify-center rounded-xl transition-all"
                                style={{ backgroundColor: active ? 'var(--color-accent-light)' : 'transparent' }}>
                                <item.icon style={{
                                    width: 19, height: 19,
                                    color: active ? 'var(--color-accent)' : 'var(--color-text-subtle)',
                                    strokeWidth: active ? 2.2 : 1.7,
                                    transition: 'all 0.2s',
                                }} />
                            </div>
                            <span className="text-[10px] font-medium leading-none"
                                style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-subtle)', fontWeight: active ? 700 : 500 }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
