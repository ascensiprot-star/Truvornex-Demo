import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Building2, CalendarDays, Settings,
    BarChart3, Shield, Bell, FileText, Tags, CreditCard,
    Activity, FileBarChart, Brain, Wrench, Menu, X, Home,
    ChevronRight, Zap
} from 'lucide-react';

const BASE = '/x7k9m2q4p8w1n5v3r6t0y/admin';

const NAV_GROUPS = [
    {
        label: 'Overview',
        items: [
            { path: BASE,                    icon: LayoutDashboard, label: 'Dashboard', exact: true },
            { path: `${BASE}/analytics`,     icon: BarChart3,       label: 'Analytics' },
            { path: `${BASE}/financial`,     icon: CreditCard,      label: 'Financial' },
        ],
    },
    {
        label: 'Platform',
        items: [
            { path: `${BASE}/users`,         icon: Users,           label: 'Users' },
            { path: `${BASE}/providers`,     icon: Building2,       label: 'Providers' },
            { path: `${BASE}/bookings`,      icon: CalendarDays,    label: 'Bookings' },
            { path: `${BASE}/services`,      icon: Wrench,          label: 'Services' },
            { path: `${BASE}/customers`,     icon: Users,           label: 'Customers' },
        ],
    },
    {
        label: 'Finance',
        items: [
            { path: `${BASE}/invoices`,      icon: FileText,        label: 'Invoices' },
            { path: `${BASE}/payouts`,       icon: CreditCard,      label: 'Payouts' },
        ],
    },
    {
        label: 'Trust & Safety',
        items: [
            { path: `${BASE}/reviews`,       icon: Shield,          label: 'Reviews' },
            { path: `${BASE}/audit-logs`,    icon: FileBarChart,    label: 'Audit Logs' },
        ],
    },
    {
        label: 'Config',
        items: [
            { path: `${BASE}/notifications`, icon: Bell,            label: 'Notifications' },
            { path: `${BASE}/categories`,    icon: Tags,            label: 'Categories' },
            { path: `${BASE}/content`,       icon: FileText,        label: 'Content' },
            { path: `${BASE}/platform-config`, icon: Settings,      label: 'Platform Config' },
            { path: `${BASE}/settings`,      icon: Settings,        label: 'Settings' },
        ],
    },
    {
        label: 'Intelligence',
        items: [
            { path: `${BASE}/ai-control`,    icon: Brain,           label: 'AI Control' },
            { path: `${BASE}/system-health`, icon: Activity,        label: 'System Health' },
        ],
    },
];

export default function AdminLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    const SidebarContent = ({ onClose }) => (
        <>
            {/* Header */}
            <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Link to={BASE} onClick={onClose} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tighter" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>TRUVORNEX</h1>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                            style={{ backgroundColor: 'rgba(244,63,94,0.12)', color: '#f43f5e' }}>
                            Admin
                        </span>
                    </div>
                </Link>
                {onClose && (
                    <button onClick={onClose} className="p-1.5 rounded-lg md:hidden" style={{ color: 'var(--color-text-subtle)' }}>
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Back to app */}
            <div className="px-3 py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-border-strong)', e.currentTarget.style.color = 'var(--color-text)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                    <Home className="h-3.5 w-3.5" />
                    <span>Back to Customer App</span>
                </button>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 overflow-y-auto p-2 no-scrollbar">
                {NAV_GROUPS.map((group) => (
                    <div key={group.label} className="mb-3">
                        <div className="px-3 py-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>
                                {group.label}
                            </span>
                        </div>
                        <div className="space-y-0.5">
                            {group.items.map(item => {
                                const active = isActive(item);
                                return (
                                    <Link key={item.path} to={item.path}
                                        onClick={onClose}
                                        className="relative flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
                                        style={active ? {
                                            backgroundColor: 'rgba(244,63,94,0.1)',
                                            color: '#f43f5e',
                                        } : { color: 'var(--color-text-muted)' }}
                                        onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-text)')}
                                        onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                                        {active && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                                                style={{ backgroundColor: '#f43f5e', marginLeft: -1 }} />
                                        )}
                                        <item.icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* AI status footer */}
            <div className="p-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ backgroundColor: 'rgba(139,124,246,0.06)', border: '1px solid rgba(139,124,246,0.12)' }}>
                    <div className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--color-success)', animation: 'rt-pulse 2s ease-in-out infinite' }} />
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold" style={{ color: 'var(--color-accent)' }}>Simon AI Active</p>
                        <p className="text-[10px]" style={{ color: 'var(--color-text-subtle)' }}>Intelligence engine online</p>
                    </div>
                    <Zap style={{ width: 12, height: 12, color: 'var(--color-accent)', flexShrink: 0 }} />
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col z-40"
                style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}>
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
                style={scrolled ? {
                    backgroundColor: 'var(--color-glass)',
                    backdropFilter: 'blur(24px)',
                    borderBottom: '1px solid var(--color-border)',
                } : { backgroundColor: 'var(--color-bg)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)}
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                        <Menu className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #f43f5e, #e11d48)' }}>
                            <Shield className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>Admin</span>
                    </div>
                </div>
                <button onClick={() => navigate('/')}
                    className="h-7 px-3 rounded-full text-[11px] font-semibold flex items-center gap-1"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                    <Home style={{ width: 11, height: 11 }} /> App
                </button>
            </header>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50">
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full w-64 flex flex-col overflow-y-auto"
                        style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', zIndex: 51, animation: 'slideInLeft 0.3s cubic-bezier(0.19,1,0.22,1)' }}>
                        <SidebarContent onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main */}
            <main className="md:ml-56 pt-14 md:pt-0 pb-8" style={{ minHeight: '100vh' }}>
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-5 md:py-8">
                    {/* Warning banner */}
                    <div className="mb-5 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium"
                        style={{ backgroundColor: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', color: '#f43f5e' }}>
                        <Shield className="h-3.5 w-3.5 shrink-0" />
                        <span>Admin Panel — changes affect all platform users and data</span>
                    </div>
                    <div className="page-enter">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
