import { useState, useEffect } from 'react';
import { CalendarDays, Search, Filter, Star, Download, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
    completed: 'bg-emerald-100 text-emerald-700',
    confirmed: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-zinc-100 text-zinc-600',
};

export default function BookingHistory() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
                setBookings(b);
                setLoading(false);
    }, []);

    const filtered = bookings.filter(b => {
        const matchSearch = !search || b.service_name?.toLowerCase().includes(search.toLowerCase()) || b.provider_name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || b.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalSpent = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="font-display font-bold text-3xl tracking-tight">Booking History</h1>
                    <p className="text-zinc-500 text-sm mt-1">{bookings.length} total bookings · ${totalSpent.toLocaleString()} spent</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Total', value: bookings.length, sub: 'bookings' },
                    { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, sub: 'services done' },
                    { label: 'Upcoming', value: bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length, sub: 'scheduled' },
                    { label: 'Spent', value: `$${totalSpent.toLocaleString()}`, sub: 'lifetime' },
                ].map(s => (
                    <div key={s.label} className="card-premium p-4">
                        <p className="text-xs text-zinc-400 font-medium mb-1">{s.label}</p>
                        <p className="font-black text-2xl text-zinc-900">{s.value}</p>
                        <p className="text-[10px] text-zinc-400">{s.sub}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bookings…" className="pl-9 rounded-xl" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="rounded-xl w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-wave h-16 rounded-2xl" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="card-premium p-12 text-center">
                    <CalendarDays className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">No bookings found</p>
                    <Button asChild variant="outline" className="mt-4 rounded-xl"><Link to="/services">Browse Services</Link></Button>
                </div>
            ) : (
                <div className="card-premium overflow-hidden">
                    <div className="divide-y divide-zinc-50">
                        {filtered.map(b => (
                            <div key={b.id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors">
                                <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                    <CalendarDays className="h-4.5 w-4.5 text-zinc-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{b.service_name}</p>
                                    <p className="text-xs text-zinc-400 truncate">{b.provider_name} · {b.date} {b.time_slot}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="font-bold text-sm">${b.price || 0}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[b.status] || 'bg-zinc-100 text-zinc-600'}`}>{b.status}</span>
                                    {b.status === 'completed' && (
                                        <Link to={`/providers/${b.provider_id}`} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                                            <Star className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}