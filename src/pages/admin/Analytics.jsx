import { useState, useEffect } from 'react';
import {
    computePlatformKPIs,
    computeMonthlyRevenue,
    computeBookingsByDayOfWeek,
    computeTopProviders,
    computeStatusDistribution,
    computeRevenueByCategory,
    computeCustomerRetention,
    forecastNextMonthRevenue,
} from '@/lib/platform/analyticsEngine';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign, CalendarCheck, Star, ArrowUpRight, ArrowDownRight, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = ['#18181b', '#52525b', '#a1a1aa', '#d4d4d8', '#e4e4e7', '#3f3f46'];
const STATUS_COLORS = { completed: '#16a34a', cancelled: '#dc2626', pending: '#d97706', confirmed: '#2563eb', in_progress: '#7c3aed', no_show: '#6b7280' };

function KPI({ label, value, sub, icon: KpiIcon, trend, trendLabel, color = 'text-zinc-900' }) {
    const Icon = KpiIcon;
    const up = trend > 0;
    return (
        <div className="card-premium p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-zinc-700" />
                </div>
                {trend != null && (
                    <div className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
                        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-sm font-medium text-zinc-700 mt-0.5">{label}</p>
            {sub && <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>}
        </div>
    );
}

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');

    const load = async () => {
        setLoading(true);
        const bookings = [], providers = [], reviews = [], services = [];

        const kpis = computePlatformKPIs({ bookings, providers, reviews });
        const monthly = computeMonthlyRevenue(bookings);
        const byDay = computeBookingsByDayOfWeek(bookings);
        const topProviders = computeTopProviders(bookings, providers, 10);
        const statusDist = computeStatusDistribution(bookings);
        const byCategory = computeRevenueByCategory(bookings, services);
        const retention = computeCustomerRetention(bookings);
        const forecast = forecastNextMonthRevenue(monthly);

        setData({ kpis, monthly, byDay, topProviders, statusDist, byCategory, retention, forecast, bookings, providers });
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    if (loading) return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="card-premium skeleton-wave h-28" />)}
            </div>
        </div>
    );

    const { kpis, monthly, byDay, topProviders, statusDist, byCategory, retention, forecast } = data;

    const TABS = ['overview', 'revenue', 'providers', 'customers', 'operations'];

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="font-inter font-black text-2xl">Platform Intelligence</h1>
                    <p className="text-zinc-500 text-sm mt-0.5">Real-time analytics across all operations</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={load}>
                    <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </Button>
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 flex-wrap">
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 h-9 rounded-xl text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'overview' && (
                <div className="space-y-6">
                    {/* KPI grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KPI label="Total Revenue" value={`$${kpis.totalRevenue.toLocaleString()}`} sub="from completed bookings" icon={DollarSign} />
                        <KPI label="Total Bookings" value={kpis.totalBookings.toLocaleString()} sub={`${kpis.pendingBookings} pending`} icon={CalendarCheck} />
                        <KPI label="Active Providers" value={kpis.approvedProviders} sub={`${kpis.pendingProviders} pending review`} icon={Users} />
                        <KPI label="Avg Rating" value={kpis.avgRating.toFixed(2)} sub={`${kpis.totalReviews} reviews`} icon={Star} />
                        <KPI label="Completion Rate" value={`${kpis.completionRate.toFixed(1)}%`} icon={TrendingUp} color="text-green-700" />
                        <KPI label="Cancellation Rate" value={`${kpis.cancellationRate.toFixed(1)}%`} icon={TrendingUp} color="text-red-600" />
                        <KPI label="Avg Booking Value" value={`$${kpis.avgBookingValue.toFixed(2)}`} icon={DollarSign} />
                        {forecast && <KPI label="Revenue Forecast" value={`$${forecast.toLocaleString()}`} sub="next month (linear)" icon={Zap} color="text-blue-700" />}
                    </div>

                    {/* Monthly revenue */}
                    <div className="card-premium p-6">
                        <h2 className="font-bold text-base mb-4">Monthly Revenue Trend</h2>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={monthly}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                                <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} fill="url(#revenueGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Status distribution */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="card-premium p-6">
                            <h2 className="font-bold text-base mb-4">Booking Status Distribution</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                        {statusDist.map((entry) => (
                                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#a1a1aa'} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="card-premium p-6">
                            <h2 className="font-bold text-base mb-4">Bookings by Day of Week</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={byDay}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip />
                                    <Bar dataKey="bookings" fill="#18181b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {tab === 'revenue' && (
                <div className="space-y-6">
                    <div className="card-premium p-6">
                        <h2 className="font-bold text-base mb-4">Revenue by Category</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={byCategory} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={100} />
                                <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, 'Revenue']} />
                                <Bar dataKey="revenue" fill="#18181b" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="card-premium p-6">
                        <h2 className="font-bold text-base mb-4">Monthly Bookings Volume</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={monthly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="bookings" stroke="#18181b" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {tab === 'providers' && (
                <div className="space-y-4">
                    <h2 className="font-bold text-base">Top Providers by Revenue</h2>
                    {topProviders.map((item, i) => item.provider && (
                        <div key={i} className="card-premium p-4 flex items-center gap-4">
                            <span className="text-2xl font-black text-zinc-300 w-8 shrink-0">{i + 1}</span>
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                                {item.provider.logo_url
                                    ? <img src={item.provider.logo_url} alt="" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center font-black text-zinc-400">{item.provider.business_name?.[0]}</div>
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{item.provider.business_name}</p>
                                <p className="text-xs text-zinc-400">{item.bookings} completed bookings</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-black text-zinc-900">${item.revenue.toLocaleString()}</p>
                                <div className="flex items-center gap-1 justify-end mt-0.5">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <div key={j} className={`h-1 w-4 rounded-full ${j < Math.round(item.provider.rating || 0) ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'customers' && (
                <div className="space-y-6">
                    <div className="card-premium p-6">
                        <h2 className="font-bold text-base mb-4">New vs Returning Customers</h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={retention}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="new" name="New" fill="#18181b" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="returning" name="Returning" fill="#a1a1aa" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {tab === 'operations' && (
                <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="card-premium p-5">
                            <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Pending Review</p>
                            <p className="text-3xl font-black">{kpis.pendingBookings}</p>
                            <p className="text-sm text-zinc-500">bookings need attention</p>
                        </div>
                        <div className="card-premium p-5">
                            <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">In Progress</p>
                            <p className="text-3xl font-black">{kpis.confirmedBookings}</p>
                            <p className="text-sm text-zinc-500">confirmed bookings</p>
                        </div>
                        <div className="card-premium p-5">
                            <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Providers Pending</p>
                            <p className="text-3xl font-black text-yellow-600">{kpis.pendingProviders}</p>
                            <p className="text-sm text-zinc-500">await approval</p>
                        </div>
                    </div>
                    <div className="card-premium p-6">
                        <h2 className="font-bold text-base mb-4">Booking Volume by Day of Week</h2>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={byDay}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Bar dataKey="bookings" fill="#18181b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}