import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    AreaChart, Area
} from 'recharts';
import {
    Activity, AlertCircle, Layers, TrendingUp, TrendingDown,
    ArrowRight, ShieldCheck, CheckCircle, MapPin
} from 'lucide-react';
import { format, subDays } from 'date-fns';

const StatCard = ({ label, value, sub, icon: Icon, accent, trend }) => (
    <div className={`rounded-2xl p-5 border shadow-premium ${accent ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold uppercase tracking-widest ${accent ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${accent ? 'bg-white/10' : 'bg-zinc-50'}`}>
                <Icon className={`h-4 w-4 ${accent ? 'text-zinc-300' : 'text-zinc-500'}`} />
            </div>
        </div>
        <div className={`text-3xl font-black font-inter tracking-tight ${accent ? 'text-white' : 'text-zinc-900'}`}>{value}</div>
        {sub && <div className={`text-xs mt-1.5 ${accent ? 'text-zinc-400' : 'text-zinc-400'}`}>{sub}</div>}
        {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(trend).toFixed(0)}% this week
            </div>
        )}
    </div>
);

const GapBadge = ({ category, demand, supply }) => {
    const ratio = supply === 0 ? 99 : demand / supply;
    const level = ratio > 3 ? 'critical' : ratio > 2 ? 'high' : 'moderate';
    const styles = {
        critical: 'bg-red-50 border-red-200 text-red-700',
        high: 'bg-amber-50 border-amber-200 text-amber-700',
        moderate: 'bg-blue-50 border-blue-200 text-blue-700',
    };
    const labels = { critical: '🔴 Critical Gap', high: '🟡 High Demand', moderate: '🔵 Moderate Gap' };
    return (
        <div className={`rounded-xl border px-4 py-3 ${styles[level]}`}>
            <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm capitalize">{category.replace('_', ' ')}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">{labels[level]}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
                <span>{demand} pending requests</span>
                <span>{supply} available providers</span>
            </div>
        </div>
    );
};

export default function NeighborhoodDashboard() {
    const [bookings, setBookings] = useState([]);
    const [providers, setProviders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
        ]).then(([bks, provs, cats, bunds]) => {
            setBookings(bks);
            setProviders(provs);
            setCategories(cats);
            setBundles(bunds);
            setLoading(false);
        });
    }, []);

    const metrics = useMemo(() => {
        const pending = bookings.filter(b => b.status === 'pending');
        const confirmed = bookings.filter(b => b.status === 'confirmed');
        const completed = bookings.filter(b => b.status === 'completed');
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

        // Demand by category from service_name
        const demandMap = {};
        pending.concat(confirmed).forEach(b => {
            const cat = b.service_name?.split(' ')[0]?.toLowerCase() || 'other';
            demandMap[cat] = (demandMap[cat] || 0) + 1;
        });

        // Supply by category_slugs
        const supplyMap = {};
        providers.forEach(p => {
            (p.category_slugs || []).forEach(slug => {
                supplyMap[slug] = (supplyMap[slug] || 0) + 1;
            });
        });

        // Demand chart data (top 8)
        const demandChartData = Object.entries(demandMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([name, demand]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                demand,
                supply: supplyMap[name] || 0,
            }));

        // Service gaps: demand > 2× supply
        const gaps = Object.entries(demandMap)
            .filter(([cat, demand]) => demand > 1 && demand > (supplyMap[cat] || 0) * 2)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([cat, demand]) => ({ category: cat, demand, supply: supplyMap[cat] || 0 }));

        // Daily trend last 14 days
        const dailyMap = {};
        for (let i = 13; i >= 0; i--) {
            const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
            dailyMap[d] = { date: format(subDays(new Date(), i), 'MMM d'), count: 0 };
        }
        bookings.forEach(b => { if (dailyMap[b.date]) dailyMap[b.date].count++; });
        const dailyTrend = Object.values(dailyMap);

        // Week-over-week trend
        const thisWeek = bookings.filter(b => b.date >= weekAgo && b.date <= today).length;
        const prevWeekStart = format(subDays(new Date(), 14), 'yyyy-MM-dd');
        const prevWeekEnd = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        const prevWeek = bookings.filter(b => b.date >= prevWeekStart && b.date <= prevWeekEnd).length;
        const trend = prevWeek > 0 ? ((thisWeek - prevWeek) / prevWeek * 100) : null;

        // Recent activity (last 8 bookings, show as anonymized feed)
        const recent = [...bookings].slice(0, 8);

        return {
            totalProviders: providers.length,
            pending: pending.length,
            formingBundles: bundles.filter(b => b.status === 'forming').length,
            completedTotal: completed.length,
            demandChartData,
            gaps,
            dailyTrend,
            trend,
            recent,
        };
    }, [bookings, providers, bundles]);

    if (loading) return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-wave h-28 rounded-2xl" />)}
            </div>
            <div className="skeleton-wave h-72 rounded-2xl" />
        </div>
    );

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="relative h-2.5 w-2.5">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                            <div className="relative h-2.5 w-2.5 bg-emerald-500 rounded-full" />
                        </div>
                        <h1 className="font-inter font-black text-2xl tracking-tight">Neighborhood Intelligence</h1>
                    </div>
                    <p className="text-zinc-400 text-sm">Real-time demand, supply gaps, and service intelligence</p>
                </div>
                <Link to="/bundles" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-zinc-900 px-4 h-9 rounded-xl border border-zinc-200 hover:border-zinc-400 transition-all">
                    <Layers className="h-3.5 w-3.5" /> Bundles
                </Link>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard accent label="Active Providers" value={metrics.totalProviders} sub="Verified & approved" icon={ShieldCheck} />
                <StatCard label="Open Requests" value={metrics.pending} sub="Awaiting confirmation" icon={Activity} trend={metrics.trend} />
                <StatCard label="Bundles Forming" value={metrics.formingBundles} sub="Group deals active" icon={Layers} />
                <StatCard label="Jobs Completed" value={metrics.completedTotal} sub="Platform-wide total" icon={CheckCircle} />
            </div>

            {/* Daily Trend Chart */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-sm">Booking Activity — Last 14 Days</h2>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${metrics.trend != null && metrics.trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                        {metrics.trend != null ? `${metrics.trend >= 0 ? '+' : ''}${metrics.trend.toFixed(0)}% vs prev week` : 'Tracking'}
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metrics.dailyTrend} margin={{ left: -10 }}>
                        <defs>
                            <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip formatter={(v) => [v, 'Bookings']} />
                        <Area type="monotone" dataKey="count" stroke="#18181b" strokeWidth={2} fill="url(#actGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Demand vs Supply Chart */}
            {metrics.demandChartData.length > 0 && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-sm">Demand vs Supply by Service</h2>
                        <div className="flex items-center gap-3 text-[11px]">
                            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-zinc-900 inline-block" /> Demand</span>
                            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-zinc-300 inline-block" /> Supply</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={metrics.demandChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                            <Tooltip />
                            <Bar dataKey="demand" fill="#18181b" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="supply" fill="#d4d4d8" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Service Gap Analysis */}
            {metrics.gaps.length > 0 && (
                <div>
                    <div className="flex items-center gap-2.5 mb-4">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <h2 className="font-inter font-bold text-lg tracking-tight">Service Gap Alerts</h2>
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{metrics.gaps.length} gaps detected</span>
                    </div>
                    <div className="space-y-2.5">
                        {metrics.gaps.map((gap, i) => (
                            <GapBadge key={i} category={gap.category} demand={gap.demand} supply={gap.supply} />
                        ))}
                    </div>
                    <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                        <p className="text-xs text-amber-800 font-medium">
                            💡 These gaps represent <strong>provider opportunities</strong>. Share this dashboard with local professionals to grow supply in underserved categories.
                        </p>
                    </div>
                </div>
            )}

            {/* Active Bundles */}
            {bundles.filter(b => ['forming', 'confirmed'].includes(b.status)).length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-inter font-bold text-lg tracking-tight">Active Group Deals</h2>
                        <Link to="/bundles" className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors">
                            Manage bundles <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {bundles.filter(b => ['forming', 'confirmed'].includes(b.status)).slice(0, 3).map(b => (
                            <Link key={b.id} to="/bundles" className="card-premium p-4 block group">
                                <div className="flex items-start justify-between mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {b.status}
                                    </span>
                                    <span className="text-xs font-bold text-blue-600">Save {b.discount_percentage || 20}%</span>
                                </div>
                                <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
                                <p className="text-xs text-zinc-400 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {b.zone_name}
                                </p>
                                <div className="mt-3">
                                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${((b.current_participants || 1) / (b.max_participants || 5)) * 100}%` }} />
                                    </div>
                                    <p className="text-[10px] text-zinc-400 mt-1">{b.current_participants || 1}/{b.max_participants} participants</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity Feed */}
            {metrics.recent.length > 0 && (
                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-premium">
                    <div className="px-5 py-4 border-b border-zinc-100 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-zinc-400" />
                        <h2 className="font-semibold text-sm">Recent Platform Activity</h2>
                    </div>
                    <div className="divide-y divide-zinc-50">
                        {metrics.recent.map((b, i) => {
                            const statusColors = {
                                pending: 'text-amber-600 bg-amber-50',
                                confirmed: 'text-blue-600 bg-blue-50',
                                completed: 'text-emerald-600 bg-emerald-50',
                                cancelled: 'text-zinc-400 bg-zinc-100',
                                no_show: 'text-red-600 bg-red-50',
                                in_progress: 'text-violet-600 bg-violet-50',
                            };
                            return (
                                <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className="h-7 w-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 shrink-0">
                                        {b.service_name?.[0] || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{b.service_name || 'Service'}</p>
                                        <p className="text-xs text-zinc-400">{b.date} at {b.time_slot}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusColors[b.status] || 'text-zinc-500 bg-zinc-100'}`}>
                                        {b.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}