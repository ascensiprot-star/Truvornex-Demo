import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '@/lib/ThemeContext';
import {
    LayoutDashboard, Wrench, CalendarDays, DollarSign, User,
    Moon, Sun, Bell, Menu, X, Bot, Users, ChevronRight,
    TrendingUp, MessageSquare, Home, Zap
} from 'lucide-react';

const NAV_ITEMS = [
    { path: '/provider',            icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/provider/services',   icon: Wrench,          label: 'Services' },
    { path: '/provider/bookings',   icon: CalendarDays,    label: 'Bookings' },
    { path: '/provider/earnings',   icon: DollarSign,      label: 'Earnings' },
    { path: '/provider/profile',    icon: User,            label: 'Profile' },
];

const MORE_ITEMS = [
    { path: '/provider/copilot',     icon: Bot,           label: 'AI Copilot' },
    { path: '/provider/ai-insights', icon: TrendingUp,    label: 'AI Insights' },
    { path: '/provider/customers',   icon: Users,         label: 'Customer Insights' },
    { path: '/provider/chat',        icon: MessageSquare, label: 'Messages' },
    { path: '/provider/availability',icon: CalendarDays,  label: 'Availability' },
];

const ACCENT = '#f59e0b';
const ACCENT_BG = 'rgba(245,158,11,0.1)';

function NavItem({ item, active, onClick }) {
    return (
        <Link to={item.path} onClick={onClick}
            className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ color: active ? ACCENT : 'var(--color-text-muted)', backgroundColor: active ? ACCENT_BG : 'transparent' }}
            onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
            onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
            {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ backgroundColor: ACCENT, marginLeft: -1 }} />}
            <item.icon style={{ width: 15, height: 15, flexShrink: 0, color: active ? ACCENT : 'currentColor' }} />
            <span style={{ letterSpacing: '-0.01em', fontWeight: active ? 600 : 500 }}>{item.label}</span>
        </Link>
    );
}

export default function ProviderLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const s = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', s, { passive: true });
        return () => window.removeEventListener('scroll', s);
    }, []);

    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    const SidebarInner = ({ onClose }) => (
        <>
            {/* Logo */}
            <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Link to="/provider" onClick={onClose} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                        <Wrench className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tighter" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>TRUVORNEX</h1>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: ACCENT }}>
                            Provider
                        </span>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-lg md:hidden" style={{ color: 'var(--color-text-subtle)' }}>
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Role switcher */}
            <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                    <button onClick={() => navigate('/')}
                        className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-all flex items-center justify-center gap-1"
                        style={{ color: 'var(--color-text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-text)', e.currentTarget.style.backgroundColor = 'var(--color-surface-highest)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)', e.currentTarget.style.backgroundColor = '')}>
                        Customer
                    </button>
                    <span className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
                        Provider
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-2 no-scrollbar">
                <div className="space-y-0.5">
                    {NAV_ITEMS.map(item => (
                        <NavItem key={item.path} item={item} active={isActive(item)} onClick={onClose} />
                    ))}
                </div>
                <div className="pt-3 pb-1.5 px-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>Tools</span>
                </div>
                <div className="space-y-0.5">
                    {MORE_ITEMS.map(item => (
                        <Link key={item.path} to={item.path}
                            onClick={onClose}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                            <item.icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Bottom */}
            <div className="p-3 space-y-1" style={{ borderTop: '1px solid var(--color-border)' }}>
                {/* AI badge */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1"
                    style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT, animation: 'rt-pulse 2s ease-in-out infinite' }} />
                    <p className="text-[11px] font-semibold flex-1" style={{ color: ACCENT }}>AI Copilot Ready</p>
                    <Zap style={{ width: 11, height: 11, color: ACCENT }} />
                </div>
                <button onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all"
                    style={{ color: 'var(--color-text-muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                    {theme === 'dark' ? <Sun style={{ width: 14, height: 14 }} /> : <Moon style={{ width: 14, height: 14 }} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-40"
                style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                <SidebarInner />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
                style={scrolled ? { backgroundColor: 'var(--color-glass)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--color-border)' }
                    : { backgroundColor: 'transparent' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                        <Menu className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                            <Wrench className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm font-black" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>Provider</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: ACCENT }}>PRO</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={toggleTheme} className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ color: 'var(--color-text-muted)' }}>
                        {theme === 'dark' ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
                    </button>
                    <button onClick={() => navigate('/')}
                        className="h-7 px-3 rounded-full text-[11px] font-semibold flex items-center gap-1"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                        <Home style={{ width: 11, height: 11 }} /> Customer
                    </button>
                </div>
            </header>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-72 flex flex-col overflow-y-auto"
                        style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', zIndex: 51, animation: 'slideInLeft 0.3s cubic-bezier(0.19,1,0.22,1)' }}>
                        <SidebarInner onClose={() => setSidebarOpen(false)} />
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
                style={{ backgroundColor: 'var(--color-glass)', backdropFilter: 'blur(24px) saturate(200%)', borderTop: '1px solid var(--color-border)' }}>
                {NAV_ITEMS.map(item => {
                    const active = isActive(item);
                    return (
                        <Link key={item.path} to={item.path}
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-all duration-200">
                            <div className="h-7 w-7 flex items-center justify-center rounded-xl transition-all"
                                style={{ backgroundColor: active ? 'rgba(245,158,11,0.12)' : 'transparent' }}>
                                <item.icon style={{ width: 18, height: 18, color: active ? ACCENT : 'var(--color-text-subtle)', strokeWidth: active ? 2.2 : 1.7 }} />
                            </div>
                            <span className="text-[10px] leading-none"
                                style={{ color: active ? ACCENT : 'var(--color-text-subtle)', fontWeight: active ? 700 : 500 }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
