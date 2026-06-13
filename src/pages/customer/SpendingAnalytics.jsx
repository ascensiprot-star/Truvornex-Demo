import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Package, Calendar, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const COLORS = ['#0a0a0a', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8'];

export default function SpendingAnalytics() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [aiInsight, setAiInsight] = useState('');
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        setBookings([]);
        setLoading(false);
    }, []);

    const stats = useMemo(() => {
        const total = bookings.reduce((s, b) => s + (b.price || 0), 0);
        const byCategory = {};
        bookings.forEach(b => {
            const cat = b.service_name?.split(' ')[0] || 'Other';
            byCategory[cat] = (byCategory[cat] || 0) + (b.price || 0);
        });
        const byMonth = {};
        bookings.forEach(b => {
            if (b.date) {
                const m = b.date.slice(0, 7);
                byMonth[m] = (byMonth[m] || 0) + (b.price || 0);
            }
        });
        return {
            total,
            avg: bookings.length ? (total / bookings.length).toFixed(2) : 0,
            count: bookings.length,
            byCategory: Object.entries(byCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5),
            byMonth: Object.entries(byMonth).map(([name, value]) => ({ name: name.slice(5), value })).slice(-6),
        };
    }, [bookings]);

    const getAiInsight = async () => {
        setAiLoading(true);
        const res = `**Demo Mode** — AI backend not configured. Total spent: $${stats.total}, ${stats.count} bookings. Please configure Supabase and an AI provider.`;
        setAiInsight(res);
        setAiLoading(false);
    };

    if (loading) return <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="skeleton-wave h-32 rounded-2xl" />)}</div>;

    return (
        <div className="pb-24 md:pb-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-2xl tracking-tight">Spending Analytics</h1>
                    <p className="text-zinc-400 text-sm">AI-powered insights into your service spending</p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Spent', value: `$${stats.total.toFixed(0)}`, icon: DollarSign },
                    { label: 'Avg per Booking', value: `$${stats.avg}`, icon: TrendingUp },
                    { label: 'Completed', value: stats.count, icon: Package },
                ].map(k => (
                    <div key={k.label} className="card-premium p-4">
                        <div className="h-8 w-8 rounded-xl bg-zinc-100 flex items-center justify-center mb-2">
                            <k.icon className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div className="text-2xl font-black text-zinc-900">{k.value}</div>
                        <div className="text-xs text-zinc-400">{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Monthly chart */}
            {stats.byMonth.length > 0 && (
                <div className="card-premium p-5">
                    <h2 className="font-semibold text-sm mb-4">Monthly Spending</h2>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={stats.byMonth}>
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e4e4e7', fontSize: '12px' }} />
                            <Bar dataKey="value" fill="#0a0a0a" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Category breakdown */}
            {stats.byCategory.length > 0 && (
                <div className="card-premium p-5">
                    <h2 className="font-semibold text-sm mb-4">Spending by Category</h2>
                    <div className="flex items-center gap-6">
                        <PieChart width={120} height={120}>
                            <Pie data={stats.byCategory} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value" paddingAngle={2}>
                                {stats.byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                        <div className="flex-1 space-y-2">
                            {stats.byCategory.map((c, i) => (
                                <div key={c.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                        <span className="text-sm text-zinc-700">{c.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-900">${c.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Insight */}
            <div className="card-premium p-5">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-zinc-700" />
                        <h2 className="font-semibold text-sm">Simon's Savings Advice</h2>
                    </div>
                    <Button size="sm" onClick={getAiInsight} disabled={aiLoading} className="rounded-xl bg-zinc-900 h-8">
                        {aiLoading ? 'Analyzing...' : 'Get AI Advice'}
                    </Button>
                </div>
                {aiInsight ? (
                    <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">{aiInsight}</p>
                ) : (
                    <p className="text-sm text-zinc-400">Click "Get AI Advice" for personalized savings recommendations from Simon.</p>
                )}
            </div>
        </div>
    );
}