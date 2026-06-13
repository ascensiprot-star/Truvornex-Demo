import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Package, Star, DollarSign, ArrowRight, TrendingUp, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
    pending: { label: 'Pending', class: 'bg-amber-50 text-amber-700 border border-amber-200' },
    confirmed: { label: 'Confirmed', class: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    in_progress: { label: 'In Progress', class: 'bg-blue-50 text-blue-700 border border-blue-200' },
    completed: { label: 'Completed', class: 'bg-zinc-100 text-zinc-600 border border-zinc-200' },
    cancelled: { label: 'Cancelled', class: 'bg-red-50 text-red-600 border border-red-200' },
    no_show: { label: 'No Show', class: 'bg-red-50 text-red-700 border border-red-200' },
};

const KPICard = ({ icon: Icon, label, value, trend }) => (
    <div className="card-premium p-5">
        <div className="flex items-center justify-between mb-4">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                <Icon className="h-4 w-4 text-zinc-600" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <TrendingUp className="h-3 w-3" />{trend}
                </div>
            )}
        </div>
        <div className="text-3xl font-black text-zinc-900 leading-none mb-1.5">{value}</div>
        <div className="text-xs font-medium text-zinc-500">{label}</div>
    </div>
);

const BookingItem = ({ booking }) => {
    const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
    return (
        <div className="card-premium p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-sm font-black text-zinc-400 shrink-0">
                {booking.customer_email?.[0]?.toUpperCase() || 'C'}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-sm text-zinc-900 truncate">{booking.service_name}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${status.class}`}>{status.label}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                    <span className="truncate">{booking.customer_email}</span>
                    <span className="flex items-center gap-1 shrink-0"><CalendarDays className="h-3 w-3" />{booking.date}</span>
                    <span className="flex items-center gap-1 shrink-0"><Clock className="h-3 w-3" />{booking.time_slot}</span>
                    {booking.price > 0 && <span className="ml-auto font-bold text-zinc-700 shrink-0">${booking.price}</span>}
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const [provider, setProvider] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsub;
            if (provs.length > 0) {
                setProvider(provs[0]);
                setBookings(bks);
                    if (event.type === 'create' && event.data?.provider_id === provs[0].id) {
                        setBookings(prev => [event.data, ...prev]);
                    } else if (event.type === 'update') {
                        setBookings(prev => prev.map(b => b.id === event.id ? event.data : b));
                    } else if (event.type === 'delete') {
                        setBookings(prev => prev.filter(b => b.id !== event.id));
                    }
                });
            }
            setLoading(false);
        });
        return () => unsub?.();
    }, []);

    if (loading) return (
        <div className="space-y-4">
            <div className="skeleton-wave h-8 w-64 rounded-xl" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-wave h-32 rounded-2xl" />)}
            </div>
        </div>
    );

    if (!provider) return (
        <div className="card-premium p-16 text-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-zinc-400" />
            </div>
            <h2 className="font-inter font-black text-xl mb-2">No Provider Profile</h2>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto mb-6">Set up your provider profile to start receiving bookings and managing your services.</p>
            <Button asChild className="rounded-xl"><Link to="/provider/profile">Set Up Profile <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
        </div>
    );

    const pending = bookings.filter(b => b.status === 'pending');
    const confirmed = bookings.filter(b => b.status === 'confirmed');
    const earnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);
    const total = bookings.filter(b => b.status === 'completed').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-inter font-black text-3xl tracking-tight">{provider.business_name}</h1>
                    <p className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                        <span className={`inline-block h-2 w-2 rounded-full ${provider.status === 'approved' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {provider.status === 'approved' ? 'Active & Visible' : `Status: ${provider.status}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-xl hidden md:flex"><Link to="/provider/bookings">All Bookings</Link></Button>
                    <Button asChild size="sm" className="rounded-xl bg-zinc-900"><Link to="/provider/services">Manage Services</Link></Button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KPICard icon={CalendarDays} label="Pending Requests" value={pending.length} />
                <KPICard icon={Package} label="Confirmed Today" value={confirmed.length} />
                <KPICard icon={Star} label="Avg Rating" value={provider.rating?.toFixed(1) || '—'} />
                <KPICard icon={DollarSign} label="Total Earnings" value={`$${earnings.toFixed(0)}`} />
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                    { to: '/provider/bookings', label: 'View All Bookings', icon: CalendarDays },
                    { to: '/provider/services', label: 'Manage Services', icon: Package },
                    { to: '/provider/availability', label: 'Set Availability', icon: Clock },
                    { to: '/provider/earnings', label: 'See Earnings', icon: TrendingUp },
                ].map(item => (
                    <Link key={item.to} to={item.to} className="glass-subtle rounded-2xl p-4 hover:bg-zinc-900 hover:text-white group transition-all duration-200">
                        <item.icon className="h-5 w-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                        <p className="text-xs font-semibold text-zinc-700 group-hover:text-white transition-colors">{item.label}</p>
                    </Link>
                ))}
            </div>

            {/* Recent bookings */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-inter font-bold text-lg">Recent Bookings</h2>
                    <Link to="/provider/bookings" className="text-sm text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-colors">
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                {bookings.length === 0 ? (
                    <div className="card-premium p-12 text-center">
                        <Users className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
                        <p className="text-zinc-400 text-sm">No bookings yet. Share your profile to get started.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {bookings.slice(0, 8).map(b => <BookingItem key={b.id} booking={b} />)}
                    </div>
                )}
            </div>
        </div>
    );
}