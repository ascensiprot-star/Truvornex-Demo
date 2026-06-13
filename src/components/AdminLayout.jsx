import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, Building2, CalendarDays, Settings,
    BarChart3, Shield, Bell, FileText, Tags, CreditCard,
    Activity, FileBarChart, Brain, Wrench, Menu, X, Home,
    ChevronRight, AlertTriangle
} from 'lucide-react';

const BASE = '/x7k9m2q4p8w1n5v3r6t0y/admin';

const NAV_ITEMS = [
    { path: BASE,                    icon: LayoutDashboard, label: 'Overview',    exact: true },
    { path: `${BASE}/users`,         icon: Users,           label: 'Users' },
    { path: `${BASE}/providers`,     icon: Building2,       label: 'Providers' },
    { path: `${BASE}/bookings`,      icon: CalendarDays,    label: 'Bookings' },
    { path: `${BASE}/services`,      icon: Wrench,          label: 'Services' },
    { path: `${BASE}/analytics`,     icon: BarChart3,       label: 'Analytics' },
    { path: `${BASE}/financial`,     icon: CreditCard,      label: 'Financial' },
    { path: `${BASE}/customers`,     icon: Users,           label: 'Customers' },
    { path: `${BASE}/invoices`,      icon: FileText,        label: 'Invoices' },
    { path: `${BASE}/payouts`,       icon: CreditCard,      label: 'Payouts' },
    { path: `${BASE}/reviews`,       icon: Shield,          label: 'Reviews' },
    { path: `${BASE}/notifications`, icon: Bell,            label: 'Notifications' },
    { path: `${BASE}/audit-logs`,    icon: FileBarChart,    label: 'Audit Logs' },
    { path: `${BASE}/categories`,    icon: Tags,            label: 'Categories' },
    { path: `${BASE}/content`,       icon: FileText,        label: 'Content' },
    { path: `${BASE}/ai-control`,    icon: Brain,           label: 'AI Control' },
    { path: `${BASE}/system-health`, icon: Activity,        label: 'System Health' },
    { path: `${BASE}/platform-config`, icon: Settings,      label: 'Platform Config' },
    { path: `${BASE}/settings`,      icon: Settings,        label: 'Settings' },
];

export default function AdminLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    const isActive = (item) =>
        item.exact ? pathname === item.path : pathname === item.path || pathname.startsWith(item.path + '/');

    const SidebarContent = () => (
        <>
            <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <Link to={BASE} className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#ef4444' }}>
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black tracking-tighter" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</h1>
                        <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                            Admin Panel
                        </span>
                    </div>
                </Link>
            </div>

            <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={() => navigate('/')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)' }}>
                    <Home className="h-3.5 w-3.5" />
                    Back to Customer App
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {NAV_ITEMS.map(item => {
                    const active = isActive(item);
                    return (
                        <Link key={item.path} to={item.path}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                            style={active
                                ? { backgroundColor: '#ef4444', color: '#ffffff' }
                                : { color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => !active && (e.currentTarget.style.backgroundColor = 'var(--color-surface-high)', e.currentTarget.style.color = 'var(--color-primary)')}
                            onMouseLeave={e => !active && (e.currentTarget.style.backgroundColor = '', e.currentTarget.style.color = 'var(--color-text-muted)')}>
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="text-[13px]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
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
                style={scrolled
                    ? { backgroundColor: 'var(--color-glass)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-border)' }
                    : { backgroundColor: 'var(--color-bg)' }}>
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} style={{ color: 'var(--color-text-muted)' }}>
                        <Menu className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                            <Shield className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-sm font-black tracking-tight" style={{ color: 'var(--color-primary)' }}>Admin</span>
                    </div>
                </div>
                <button onClick={() => navigate('/')}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1"
                    style={{ backgroundColor: 'var(--color-surface-high)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                    <Home style={{ width: 12, height: 12 }} /> Customer App
                </button>
            </header>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                    <div className="relative w-64 h-full flex flex-col overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)', zIndex: 51 }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <span className="text-sm font-black" style={{ color: 'var(--color-primary)' }}>Admin Panel</span>
                            <button onClick={() => setSidebarOpen(false)} style={{ color: 'var(--color-text-muted)' }}>
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="md:ml-56 pt-14 md:pt-0 pb-8" style={{ minHeight: '100vh' }}>
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-8">
                    {/* Admin banner */}
                    <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
                        style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>Admin Panel — changes affect all users and data</span>
                    </div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
