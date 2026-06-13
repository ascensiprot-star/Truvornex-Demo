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
    { path: '/provider/copilot',    icon: Bot,             label: 'AI Copilot' },
    { path: '/provider/ai-insights',icon: TrendingUp,      label: 'AI Insights' },
    { path: '/provider/customers',  icon: Users,           label: 'Customer Insights' },
    { path: '/provider/chat',       icon: MessageSquare,   label: 'Messages' },
    { path: '/provider/availability', icon: CalendarDays,  label: 'Availability' },
];

export default function ProviderLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>

            {/* ── Desktop Sidebar ─────────────────────────────────────── */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-40"
                style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                {/* Logo */}
                <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <Link to="/provider" className="block">
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: '#f59e0b' }}>
                                <Wrench className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-sm font-black tracking-tighter" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</h1>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded"
                                        style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                                        Provider
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Role Switcher */}
                <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                        <button onClick={() => navigate('/')}
                            className="flex-1 text-center text-xs font-medium py-1.5 rounded-lg transition-colors"
                            style={{ color: 'var(--color-text-muted)' }}>
                            ← Customer
                        </button>
                        <span className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg"
                            style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}>
                            Provider
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item);
                        return (
                            <Link key={item.path} to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                                style={active
                                    ? { backgroundColor: '#f59e0b', color: '#ffffff' }
                                    : { color: 'var(--color-text-muted)' }}
                                onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-primary)')}
                                onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-2 pb-1 px-3">
                        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>Tools</span>
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
                <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
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
                    <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg"
                        style={{ color: 'var(--color-text-muted)' }}>
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: '#f59e0b' }}>
                            <Wrench className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                            PRO
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={toggleTheme} className="p-2 rounded-lg"
                        style={{ color: 'var(--color-text-muted)' }}>
                        {theme === 'dark' ? <Sun style={{ width: 18, height: 18 }} /> : <Moon style={{ width: 18, height: 18 }} />}
                    </button>
                    <button onClick={() => navigate('/')}
                        className="ml-1 px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                        <Home style={{ width: 12, height: 12 }} />
                        <span>Customer</span>
                    </button>
                </div>
            </header>

            {/* ── Mobile Drawer ─────────────────────────────────────────── */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-72 h-full flex flex-col overflow-y-auto"
                        style={{ backgroundColor: 'var(--color-surface)', zIndex: 51 }}>
                        <div className="flex items-center justify-between px-5 py-4"
                            style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: '#f59e0b' }}>
                                    <Wrench className="h-3.5 w-3.5 text-white" />
                                </div>
                                <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>Provider Portal</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: 'var(--color-surface-high)' }}>
                                <button onClick={() => navigate('/')}
                                    className="flex-1 text-center text-xs font-medium py-2 rounded-lg"
                                    style={{ color: 'var(--color-text-muted)' }}>← Customer</button>
                                <span className="flex-1 text-center text-xs font-semibold py-2 rounded-lg"
                                    style={{ backgroundColor: '#f59e0b', color: 'white' }}>Provider</span>
                            </div>
                        </div>

                        <nav className="flex-1 p-3 space-y-0.5">
                            {NAV_ITEMS.map(item => {
                                const active = isActive(item);
                                return (
                                    <Link key={item.path} to={item.path}
                                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors"
                                        style={active ? { backgroundColor: '#f59e0b', color: 'white' } : { color: 'var(--color-text-muted)' }}>
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            <div className="pt-3 pb-1 px-3">
                                <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>Tools</span>
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
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                                style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className="md:ml-60 pt-14 md:pt-0 pb-20 md:pb-8" style={{ minHeight: '100vh' }}>
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
                            className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 min-w-[52px] transition-all duration-150">
                            <item.icon style={{
                                width: 21, height: 21,
                                color: active ? '#f59e0b' : 'var(--color-text-subtle)',
                                strokeWidth: active ? 2.5 : 1.8
                            }} />
                            <span className="text-[10px] leading-none mt-0.5"
                                style={{ color: active ? '#f59e0b' : 'var(--color-text-subtle)', fontWeight: active ? '700' : '500' }}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
