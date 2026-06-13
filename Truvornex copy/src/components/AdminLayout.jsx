import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
    const { pathname } = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { path: '/x7k9m2q4p8w1n5v3r6t0y/admin', icon: 'monitoring' },
        { path: '/x7k9m2q4p8w1n5v3r6t0y/admin/users', icon: 'group' },
        { path: '/x7k9m2q4p8w1n5v3r6t0y/admin/providers', icon: 'storefront' },
        { path: '/x7k9m2q4p8w1n5v3r6t0y/admin/settings', icon: 'settings' },
    ];

    return (
        <div className="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
            {/* TopAppBar */}
            <header className={`fixed top-0 w-full z-50 glass-header border-b border-subtle flex justify-between items-center px-margin-mobile bg-background transition-all duration-200 ${scrolled ? 'h-14' : 'h-16'}`}>
                <div className="flex items-center gap-4">
                    <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity duration-200 active:scale-95 transition-transform duration-200">
                        menu
                    </button>
                    <Link to="/x7k9m2q4p8w1n5v3r6t0y/admin">
                        <h1 className="text-headline-md font-headline-md font-bold tracking-tighter text-primary">TRUVORNEX <span className="text-[12px] text-error font-label-md">ADMIN</span></h1>
                    </Link>
                </div>
                <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity duration-200 active:scale-95 transition-transform duration-200">
                    admin_panel_settings
                </button>
            </header>

            {/* Main content */}
            <main className="pt-20 pb-24 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
                <Outlet />
            </main>

            {/* BottomNavBar */}
            <nav className="fixed bottom-0 w-full z-50 border-t border-subtle flex justify-around items-center h-20 px-margin-mobile pb-safe bg-surface glass-header">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/x7k9m2q4p8w1n5v3r6t0y/admin' && pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center group transition-all duration-200 ${isActive ? 'text-primary scale-110' : 'text-on-surface-variant hover:text-primary active:scale-90 transition-transform'}`}
                        >
                            <span 
                                className="material-symbols-outlined group-hover:text-primary" 
                                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {item.icon}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}