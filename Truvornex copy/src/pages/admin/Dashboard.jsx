import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { detectAnomalies, findBundleOpportunities, predictDemand, rankProviders } from '@/lib/ai/engine';
import {
    AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { ShieldCheck, CalendarDays, AlertTriangle, TrendingUp,
    Zap, CheckCircle, Layers, ArrowRight, Sparkles
} from 'lucide-react';
import { format, subDays, startOfMonth } from 'date-fns';

const KPI = ({ label, value, sub, icon: Icon, accent, delta }) => (
    <div className={`rounded-2xl p-5 border shadow-premium ${accent ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white border-zinc-100'}`}>
        <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold uppercase tracking-widest ${accent ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${accent ? 'bg-white/10' : 'bg-zinc-50'}`}>
                <Icon className={`h-4 w-4 ${accent ? 'text-zinc-300' : 'text-zinc-500'}`} />
            </div>
        </div>
        <div className={`text-3xl font-black font-inter tracking-tight ${accent ? 'text-white' : 'text-zinc-900'}`}>{value}</div>
        {sub && <div className={`text-xs mt-1.5 ${accent ? 'text-zinc-500' : 'text-zinc-400'}`}>{sub}</div>}
    </div>
);

const SEVERITY_STYLE = {
    high: { bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', icon: 'bg-red-100 text-red-600', label: 'High' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-800', icon: 'bg-amber-100 text-amber-600', label: 'Medium' },
    low: { bg: 'bg-zinc-50', border: 'border-zinc-100', text: 'text-zinc-700', icon: 'bg-zinc-100 text-zinc-500', label: 'Low' },
};

export default function Dashboard() {
    const [providers, setProviders] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
        ]).then(([provs, bks, cats]) => {
            setProviders(provs);
            setBookings(bks);
            setCategories(cats);
            setLoading(false);
        });
    }, []);

    const metrics = useMemo(() => {
        const completed = bookings.filter(b => b.status === 'completed');
        const pending = bookings.filter(b => b.status === 'pending');
        const cancelled = bookings.filter(b => b.status === 'cancelled');
        const approved = providers.filter(p => p.status === 'approved');
        const pendingProvs = providers.filter(p => p.status === 'pending');

        const totalRevenue = completed.reduce((s, b) => s + (b.price || 0), 0);
        const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const monthRevenue = completed.filter(b => b.date >= monthStart).reduce((s, b) => s + (b.price || 0), 0);

        // Daily chart last 14 days
        const daily = {};
        for (let i = 13; i >= 0; i--) {
            const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
            daily[d] = { date: format(subDays(new Date(), i), 'MMM d'), bookings: 0, revenue: 0 };
        }
        bookings.forEach(b => {
            if (daily[b.date]) { daily[b.date].bookings++; if (b.status === 'completed') daily[b.date].revenue += (b.price || 0); }
        });

        // Demand forecast
        const demand = predictDemand(categories, bookings).slice(0, 6);

        // Anomaly detection
        const anomalies = detectAnomalies(bookings, approved);

        // Top providers by AI score
        const topProviders = rankProviders(approved, bookings, null, null, null).slice(0, 5);

        // Bundle opportunities
        const bundles = findBundleOpportunities(bookings);

        // Completion + cancellation rates
        const total = bookings.length;
        const completionRate = total > 0 ? Math.round(completed.length / total * 100) : 0;
        const cancellationRate = total > 0 ? Math.round(cancelled.length / total * 100) : 0;

        return {
            totalBookings: bookings.length, completedCount: completed.length, pendingCount: pending.length,
            approvedProviders: approved.length, pendingProviders: pendingProvs.length,
            totalRevenue, monthRevenue, completionRate, cancellationRate,
            dailyData: Object.values(daily), demand, anomalies, topProviders, bundles,
        };
    }, [providers, bookings, categories]);

    if (loading) return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-wave h-28 rounded-2xl" />)}
            </div>
            <div className="skeleton-wave h-64 rounded-2xl" />
        </div>
    );

    return (
        <div className="space-y-7 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-inter font-black text-2xl tracking-tight">Admin Intelligence</h1>
                        <p className="text-zinc-400 text-sm">AI-powered platform overview</p>
                    </div>
                </div>
                {metrics.anomalies.length > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-700">{metrics.anomalies.length} anomalies detected</span>
                    </div>
                )}
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KPI accent label="Total Revenue" value={`$${metrics.totalRevenue.toFixed(0)}`} sub={`$${metrics.monthRevenue.toFixed(0)} this month`} icon={TrendingUp} />
                <KPI label="Total Bookings" value={metrics.totalBookings} sub={`${metrics.completedCount} completed`} icon={CalendarDays} />
                <KPI label="Providers" value={metrics.approvedProviders} sub={`${metrics.pendingProviders} pending review`} icon={ShieldCheck} />
                <KPI label="Completion Rate" value={`${metrics.completionRate}%`} sub={`${metrics.cancellationRate}% cancelled`} icon={CheckCircle} />
            </div>

            {/* Activity chart */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                <h2 className="font-semibold text-sm mb-4">Platform Activity — Last 14 Days</h2>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={metrics.dailyData} margin={{ left: -10 }}>
                        <defs>
                            <linearGradient id="bkGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={3} />
                        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                        <Tooltip formatter={(v) => [v, 'Bookings']} />
                        <Area type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={2} fill="url(#bkGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Anomaly alerts */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                        <h2 className="font-inter font-bold text-base">Anomaly Alerts</h2>
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">{metrics.anomalies.length}</span>
                    </div>
                    {metrics.anomalies.length === 0 ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                            <p className="text-sm text-emerald-700 font-medium">No anomalies detected. Platform is healthy.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {metrics.anomalies.slice(0, 5).map((a, i) => {
                                const s = SEVERITY_STYLE[a.severity] || SEVERITY_STYLE.medium;
                                return (
                                    <div key={i} className={`rounded-2xl border p-4 ${s.bg} ${s.border}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-bold ${s.text}`}>{a.title}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.icon.split(' ')[0]} ${s.icon.split(' ')[1]}`}>{s.label}</span>
                                        </div>
                                        <p className={`text-xs ${s.text} opacity-80`}>{a.detail}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Demand forecast */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4.5 w-4.5 text-indigo-500" />
                        <h2 className="font-inter font-bold text-base">Demand Forecast</h2>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold capitalize">{new Date().toLocaleString('default', { month: 'long' })}</span>
                    </div>
                    <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={metrics.demand} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                                <Tooltip formatter={(v) => [v, 'Forecast']} />
                                <Bar dataKey="demandForecast" radius={[0, 4, 4, 0]}>
                                    {metrics.demand.map((d, i) => (
                                        <Cell key={i} fill={d.demandLevel === 'high' ? '#ef4444' : d.demandLevel === 'rising' ? '#f59e0b' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Providers by AI score */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4.5 w-4.5 text-violet-500" />
                        <h2 className="font-inter font-bold text-base">Top AI-Ranked Providers</h2>
                    </div>
                    <Link to="/admin/providers" className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
                        Manage all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-premium">
                    {metrics.topProviders.length === 0 ? (
                        <div className="p-8 text-center text-zinc-400 text-sm">No approved providers yet.</div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-50 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                <tr>
                                    <th className="text-left px-5 py-3">Provider</th>
                                    <th className="text-right px-5 py-3">AI Score</th>
                                    <th className="text-right px-5 py-3">Trust</th>
                                    <th className="text-right px-5 py-3">Completion</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-50">
                                {metrics.topProviders.map((p, i) => (
                                    <tr key={p.id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-5 py-3 flex items-center gap-2">
                                            <span className="text-xs font-bold text-zinc-300 w-4">{i + 1}</span>
                                            <span className="font-medium">{p.business_name}</span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${p.aiScore}%` }} />
                                                </div>
                                                <span className="font-bold">{p.aiScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <span className="font-semibold text-zinc-700">{p.trustScore}/100</span>
                                        </td>
                                        <td className="px-5 py-3 text-right text-zinc-500">{p.completionRate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Bundle opportunities */}
            {metrics.bundles.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Layers className="h-4.5 w-4.5 text-blue-500" />
                        <h2 className="font-inter font-bold text-base">Bundle Opportunities</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {metrics.bundles.slice(0, 3).map((b, i) => (
                            <div key={i} className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                <p className="font-bold text-sm text-blue-800">{b.service}</p>
                                <p className="text-xs text-blue-600 mt-0.5">{b.count} matching requests</p>
                                <p className="text-xs font-black text-blue-700 mt-2">Potential saving: {b.estimatedSaving}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}