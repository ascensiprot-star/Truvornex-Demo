import { useState, useEffect, useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
    DollarSign, TrendingUp, TrendingDown, CalendarDays, CheckCircle,
    XCircle, AlertTriangle, ArrowUpRight, Download, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, startOfMonth, subDays, subMonths } from 'date-fns';

const TABS = ['Overview', 'By Service', 'Loss Tracker', 'Trends'];

function fmt(n) { return `$${(n || 0).toFixed(0)}`; }

const KPICard = ({ label, value, sub, icon: Icon, accent, trend }) => (
    <div className={`rounded-2xl p-5 border shadow-premium transition-all ${accent ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-zinc-100'}`}>
        <div className="flex items-center justify-between mb-3">
            <span className={`text-[11px] font-bold uppercase tracking-widest ${accent ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</span>
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${accent ? 'bg-white/10' : 'bg-zinc-50'}`}>
                <Icon className={`h-4 w-4 ${accent ? 'text-zinc-300' : 'text-zinc-500'}`} />
            </div>
        </div>
        <div className={`text-3xl font-black font-inter tracking-tight ${accent ? 'text-white' : 'text-zinc-900'}`}>{value}</div>
        {sub && <div className={`text-xs mt-1.5 ${accent ? 'text-zinc-400' : 'text-zinc-400'}`}>{sub}</div>}
        {trend != null && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                <ArrowUpRight className={`h-3 w-3 ${trend < 0 ? 'rotate-[180deg]' : ''}`} />
                {Math.abs(trend).toFixed(1)}% vs last month
            </div>
        )}
    </div>
);

export default function Earnings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('Overview');

    useEffect(() => {
            if (provs.length > 0) {
                setBookings(bks);
            }
            setLoading(false);
    }, []);

    const metrics = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const lastMonthStart = format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd');
        const lastMonthEnd = format(new Date(new Date().getFullYear(), new Date().getMonth(), 0), 'yyyy-MM-dd');

        const completed = bookings.filter(b => b.status === 'completed');
        const cancelled = bookings.filter(b => b.status === 'cancelled');
        const noShow = bookings.filter(b => b.status === 'no_show');
        const sum = arr => arr.reduce((s, b) => s + (b.price || 0), 0);

        const allRevenue = sum(completed);
        const todayRevenue = sum(completed.filter(b => b.date === today));
        const weekRevenue = sum(completed.filter(b => b.date >= weekStart));
        const monthRevenue = sum(completed.filter(b => b.date >= monthStart));
        const lastMonthRevenue = sum(completed.filter(b => b.date >= lastMonthStart && b.date <= lastMonthEnd));
        const avgValue = completed.length ? allRevenue / completed.length : 0;
        const completionRate = bookings.length ? (completed.length / bookings.length * 100) : 0;
        const cancelLoss = sum(cancelled);
        const noShowLoss = sum(noShow);
        const monthTrend = lastMonthRevenue > 0 ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : null;

        // Revenue by service
        const byServiceMap = {};
        completed.forEach(b => {
            const name = b.service_name || 'Other';
            if (!byServiceMap[name]) byServiceMap[name] = { name, revenue: 0, count: 0 };
            byServiceMap[name].revenue += (b.price || 0);
            byServiceMap[name].count += 1;
        });
        const serviceData = Object.values(byServiceMap).sort((a, b) => b.revenue - a.revenue).slice(0, 8);

        // Daily last 30 days
        const daily = {};
        for (let i = 29; i >= 0; i--) {
            const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
            daily[d] = { date: format(subDays(new Date(), i), 'MMM d'), revenue: 0, count: 0 };
        }
        completed.forEach(b => {
            if (daily[b.date]) { daily[b.date].revenue += (b.price || 0); daily[b.date].count += 1; }
        });
        const dailyData = Object.values(daily);

        // Monthly last 12
        const monthly = {};
        for (let i = 11; i >= 0; i--) {
            const m = format(subMonths(new Date(), i), 'yyyy-MM');
            monthly[m] = { month: format(subMonths(new Date(), i), 'MMM yy'), revenue: 0, count: 0 };
        }
        completed.forEach(b => {
            const m = b.date?.slice(0, 7);
            if (m && monthly[m]) { monthly[m].revenue += (b.price || 0); monthly[m].count += 1; }
        });
        const monthlyData = Object.values(monthly);

        // Day of week pattern
        const dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dow = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
        completed.forEach(b => {
            if (b.date) {
                const d = dowLabels[new Date(b.date + 'T12:00:00').getDay()];
                if (dow[d] !== undefined) dow[d] += (b.price || 0);
            }
        });
        const dowData = Object.entries(dow).map(([day, revenue]) => ({ day, revenue }));

        return {
            allRevenue, todayRevenue, weekRevenue, monthRevenue, avgValue,
            completionRate, cancelLoss, noShowLoss, monthTrend,
            serviceData, dailyData, monthlyData, dowData,
            completedCount: completed.length, cancelledCount: cancelled.length, noShowCount: noShow.length,
        };
    }, [bookings]);

    if (loading) return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-wave h-28 rounded-2xl" />)}
            </div>
            <div className="skeleton-wave h-72 rounded-2xl" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-inter font-black text-2xl tracking-tight">Earnings</h1>
                    <p className="text-zinc-400 text-sm mt-0.5">Revenue and performance analytics</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
                    <Download className="h-3.5 w-3.5" /> Export
                </Button>
            </div>

            {/* Tab bar */}
            <div className="glass rounded-2xl p-1.5 flex gap-1 shadow-premium">
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`flex-1 h-9 rounded-xl text-xs font-semibold transition-all ${tab === t ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'Overview' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <KPICard accent label="Total Revenue" value={fmt(metrics.allRevenue)} sub={`${metrics.completedCount} completed jobs`} icon={DollarSign} />
                        <KPICard label="This Month" value={fmt(metrics.monthRevenue)} icon={CalendarDays} trend={metrics.monthTrend} sub="vs last month" />
                        <KPICard label="This Week" value={fmt(metrics.weekRevenue)} icon={TrendingUp} sub="Mon — today" />
                        <KPICard label="Today" value={fmt(metrics.todayRevenue)} icon={DollarSign} sub={`Avg ${fmt(metrics.avgValue)} / job`} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Avg Order</p>
                            <p className="text-2xl font-black">{fmt(metrics.avgValue)}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Completion Rate</p>
                            <p className="text-2xl font-black">{metrics.completionRate.toFixed(0)}%</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Bookings</p>
                            <p className="text-2xl font-black">{bookings.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                        <h3 className="font-semibold text-sm mb-4">Daily Revenue — Last 30 Days</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={metrics.dailyData} margin={{ left: -10 }}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.12} />
                                        <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                                <Area type="monotone" dataKey="revenue" stroke="#18181b" strokeWidth={2} fill="url(#revGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {tab === 'By Service' && (
                <div className="space-y-4">
                    {metrics.serviceData.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center shadow-premium">
                            <p className="text-zinc-400 text-sm">No completed bookings yet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                                <h3 className="font-semibold text-sm mb-4">Revenue by Service</h3>
                                <ResponsiveContainer width="100%" height={Math.max(metrics.serviceData.length * 44, 180)}>
                                    <BarChart data={metrics.serviceData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 10 }} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                                        <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                                        <Bar dataKey="revenue" fill="#18181b" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                                <h3 className="font-semibold text-sm mb-4">Revenue by Day of Week</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={metrics.dowData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 10 }} />
                                        <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                                        <Bar dataKey="revenue" fill="#52525b" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-premium">
                                <div className="px-5 py-4 border-b border-zinc-100">
                                    <h3 className="font-semibold text-sm">Service Breakdown</h3>
                                </div>
                                <table className="w-full text-sm">
                                    <thead className="bg-zinc-50 text-zinc-400 text-[11px] uppercase tracking-wider">
                                        <tr>
                                            <th className="text-left px-5 py-3">Service</th>
                                            <th className="text-right px-5 py-3">Jobs</th>
                                            <th className="text-right px-5 py-3">Revenue</th>
                                            <th className="text-right px-5 py-3">Avg/Job</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {metrics.serviceData.map(s => (
                                            <tr key={s.name} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-5 py-3.5 font-medium">{s.name}</td>
                                                <td className="px-5 py-3.5 text-right text-zinc-500">{s.count}</td>
                                                <td className="px-5 py-3.5 text-right font-semibold">{fmt(s.revenue)}</td>
                                                <td className="px-5 py-3.5 text-right text-zinc-500">{fmt(s.revenue / s.count)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tab === 'Loss Tracker' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-premium">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                                    <XCircle className="h-5 w-5 text-red-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Cancellation Loss</p>
                                    <p className="text-3xl font-black text-red-600">{fmt(metrics.cancelLoss)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-400">{metrics.cancelledCount} cancelled bookings</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-amber-100 p-5 shadow-premium">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">No-Show Loss</p>
                                    <p className="text-3xl font-black text-amber-600">{fmt(metrics.noShowLoss)}</p>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-400">{metrics.noShowCount} no-show bookings</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                        <h3 className="font-semibold text-sm mb-4">Revenue vs Lost Revenue</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={[
                                { name: 'Earned', value: metrics.allRevenue },
                                { name: 'Cancelled', value: metrics.cancelLoss },
                                { name: 'No-Show', value: metrics.noShowLoss },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(v) => [`$${v}`, 'Amount']} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    <Cell fill="#18181b" />
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#f59e0b" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100">
                        <h3 className="font-semibold text-sm mb-3">Recovery Recommendations</h3>
                        <ul className="space-y-2.5 text-sm text-zinc-600">
                            {[
                                'Enable 24h automated reminders to cut no-shows by up to 40%',
                                'Set a cancellation policy — require 24h notice to protect revenue',
                                'Follow up automatically with no-shows to rebook their slot',
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <span className="mt-0.5 h-5 w-5 rounded-full bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {tab === 'Trends' && (
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                        <h3 className="font-semibold text-sm mb-4">Monthly Revenue — Last 12 Months</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={metrics.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(v) => [`$${v}`, 'Revenue']} />
                                <Bar dataKey="revenue" fill="#18181b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium">
                        <h3 className="font-semibold text-sm mb-4">Booking Volume — Last 12 Months</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={metrics.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip formatter={(v) => [v, 'Jobs']} />
                                <Bar dataKey="count" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}