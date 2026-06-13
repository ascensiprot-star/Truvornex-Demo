import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cpu, TrendingUp, Users, DollarSign, Star, Lightbulb, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const INSIGHT_TYPES = [
    { id: 'revenue', label: 'Revenue Optimization', icon: DollarSign, prompt: (data) => `Analyze provider data and give revenue optimization strategies: ${JSON.stringify(data)}. Give 5 specific actions to increase revenue.` },
    { id: 'customers', label: 'Customer Retention', icon: Users, prompt: (data) => `Analyze booking patterns and suggest customer retention strategies: ${JSON.stringify(data)}. Focus on repeat customers and loyalty.` },
    { id: 'pricing', label: 'Dynamic Pricing', icon: TrendingUp, prompt: (data) => `Suggest optimal pricing strategy based on demand and competition: ${JSON.stringify(data)}. Give specific price points and when to apply them.` },
    { id: 'scheduling', label: 'Schedule Optimization', icon: Star, prompt: (data) => `Optimize provider's schedule for maximum efficiency and earnings: ${JSON.stringify(data)}. Suggest best working hours and slot intervals.` },
];

export default function AIInsights() {
    const [provider, setProvider] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [insights, setInsights] = useState({});
    const [loading, setLoading] = useState({});
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        setProvider(null);
        setBookings([]);
        setPageLoading(false);
    }, []);

    const getInsight = async (type) => {
        setLoading(l => ({ ...l, [type.id]: true }));
        const data = {
            provider: { business_name: provider?.business_name, rating: provider?.rating, city: provider?.city },
            totalBookings: bookings.length,
            completed: bookings.filter(b => b.status === 'completed').length,
            revenue: bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0),
            avgPrice: bookings.length ? (bookings.reduce((s, b) => s + (b.price || 0), 0) / bookings.length).toFixed(2) : 0,
        };
        const res = `**Demo Mode** — AI backend not configured. Please configure Supabase and an AI provider to enable Simon AI insights.\n\nData snapshot: ${JSON.stringify(data, null, 2)}`;
        setInsights(i => ({ ...i, [type.id]: res }));
        setLoading(l => ({ ...l, [type.id]: false }));
    };

    if (pageLoading) return <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton-wave h-24 rounded-2xl" />)}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-2xl tracking-tight">Simon Business Intelligence</h1>
                    <p className="text-zinc-400 text-sm">AI-powered insights to grow your business</p>
                </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="card-premium p-4">
                    <div className="text-2xl font-black">{bookings.length}</div>
                    <div className="text-xs text-zinc-400">Total Bookings</div>
                </div>
                <div className="card-premium p-4">
                    <div className="text-2xl font-black">${bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0).toFixed(0)}</div>
                    <div className="text-xs text-zinc-400">Revenue</div>
                </div>
                <div className="card-premium p-4">
                    <div className="text-2xl font-black">{provider?.rating?.toFixed(1) || '—'}</div>
                    <div className="text-xs text-zinc-400">Avg Rating</div>
                </div>
            </div>

            {INSIGHT_TYPES.map(type => (
                <div key={type.id} className="card-premium p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                                <type.icon className="h-4 w-4 text-zinc-700" />
                            </div>
                            <h2 className="font-semibold text-sm">{type.label}</h2>
                        </div>
                        <Button size="sm" onClick={() => getInsight(type)} disabled={loading[type.id]} className="rounded-xl bg-zinc-900 h-8 gap-1.5">
                            {loading[type.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : insights[type.id] ? <RefreshCw className="h-3.5 w-3.5" /> : <Lightbulb className="h-3.5 w-3.5" />}
                            {loading[type.id] ? 'Analyzing...' : insights[type.id] ? 'Refresh' : 'Get Insight'}
                        </Button>
                    </div>
                    {insights[type.id] ? (
                        <div className="bg-zinc-50 rounded-xl p-4 text-sm text-zinc-700 leading-relaxed prose prose-sm prose-zinc max-w-none">
                            {insights[type.id].slice(0, 600)}
                            {insights[type.id].length > 600 && '...'}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-400">Click to get Simon's AI analysis for {type.label.toLowerCase()}.</p>
                    )}
                </div>
            ))}
        </div>
    );
}