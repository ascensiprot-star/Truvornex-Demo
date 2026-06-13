import { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays } from 'date-fns';

const PERIOD_OPTIONS = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '12m', label: 'Last 12 months' },
];

export default function FinancialDashboard() {
    const [bookings, setBookings] = useState([]);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    }, []);

    const metrics = useMemo(() => {
        const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
        const cutoff = format(subDays(new Date(), days), 'yyyy-MM-dd');
        const filtered = bookings.filter(b => b.date >= cutoff);
        const completed = filtered.filter(b => b.status === 'completed');
        const totalRevenue = completed.reduce((s, b) => s + (b.price || 0), 0);
        const avgBookingValue = completed.length ? totalRevenue / completed.length : 0;

        // Daily revenue
        const daily = {};
        for (let i = Math.min(days, 30) - 1; i >= 0; i--) {
            const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
            daily[d] = { date: format(subDays(new Date(), i), 'MMM d'), revenue: 0, bookings: 0 };
        }
        completed.forEach(b => { if (daily[b.date]) { daily[b.date].revenue += (b.price || 0); daily[b.date].bookings++; } });

        // Category breakdown
        const catMap = {};
        completed.forEach(b => {
            const cat = b.service_name?.split(' ')[0] || 'Other';
            catMap[cat] = (catMap[cat] || 0) + (b.price || 0);
        });
        const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));

        return { totalRevenue, avgBookingValue, totalBookings: filtered.length, completedCount: completed.length, dailyData: Object.values(daily), catData };
    }, [bookings, period]);

    const COLORS = ['#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#e4e4e7'];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-inter font-black text-2xl tracking-tight">Financial Dashboard</h1>
                    <p className="text-zinc-400 text-sm">Revenue analytics and financial overview</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="rounded-xl w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>{PERIOD_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button variant="outline" className="rounded-xl gap-2"><Download className="h-4 w-4" /> Export</Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `$${metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, delta: '+12%', up: true },
                    { label: 'Avg Booking Value', value: `$${metrics.avgBookingValue.toFixed(0)}`, icon: CreditCard, delta: '+3%', up: true },
                    { label: 'Total Bookings', value: metrics.totalBookings, icon: Calendar, delta: '+8%', up: true },
                    { label: 'Completion Rate', value: metrics.totalBookings ? `${Math.round(metrics.completedCount / metrics.totalBookings * 100)}%` : '0%', icon: TrendingUp, delta: '-2%', up: false },
                ].map(k => (
                    <div key={k.label} className="card-premium p-5">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{k.label}</span>
                            <k.icon className="h-4 w-4 text-zinc-400" />
                        </div>
                        <p className="font-black text-3xl text-zinc-900">{k.value}</p>
                        <p className={`text-xs mt-1.5 font-semibold flex items-center gap-1 ${k.up ? 'text-emerald-600' : 'text-red-500'}`}>
                            {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{k.delta} vs prev period
                        </p>
                    </div>
                ))}
            </div>

            <div className="card-premium p-5">
                <h2 className="font-semibold text-sm mb-4">Revenue Over Time</h2>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={metrics.dailyData}>
                        <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                        <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} fill="url(#revGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="card-premium p-5">
                    <h2 className="font-semibold text-sm mb-4">Daily Bookings</h2>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={metrics.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#18181b" radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card-premium p-5">
                    <h2 className="font-semibold text-sm mb-4">Revenue by Category</h2>
                    {metrics.catData.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-zinc-400 text-sm">No data</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={metrics.catData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                                    {metrics.catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}