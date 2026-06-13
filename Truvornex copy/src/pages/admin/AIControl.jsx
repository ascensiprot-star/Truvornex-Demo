import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cpu, Play, RotateCcw, Zap, Users, Package, CalendarDays, TrendingUp, AlertTriangle, CheckCircle, Loader2, BarChart3, Globe, Shield, Settings, Brain } from 'lucide-react';
import { toast } from 'sonner';

const AI_ACTIONS = [
    {
        id: 'auto_approve_providers',
        icon: Shield,
        title: 'Auto-Approve Verified Providers',
        desc: 'Simon scans all pending providers and auto-approves those who meet quality thresholds',
        category: 'providers',
        danger: false,
    },
    {
        id: 'flag_low_rating',
        icon: AlertTriangle,
        title: 'Flag Low-Rating Providers',
        desc: 'Automatically flag providers with rating below 3.5 for review',
        category: 'providers',
        danger: true,
    },
    {
        id: 'analyze_demand',
        icon: TrendingUp,
        title: 'Run Demand Analysis',
        desc: 'Simon analyzes all bookings and generates neighborhood demand reports',
        category: 'analytics',
        danger: false,
    },
    {
        id: 'generate_bundles',
        icon: Package,
        title: 'AI Bundle Generator',
        desc: 'Simon identifies bundling opportunities and creates group deals automatically',
        category: 'bundles',
        danger: false,
    },
    {
        id: 'send_reminders',
        icon: CalendarDays,
        title: 'Send Smart Reminders',
        desc: 'Simon sends personalized reminders to customers with upcoming or overdue services',
        category: 'notifications',
        danger: false,
    },
    {
        id: 'cleanup_cancelled',
        icon: RotateCcw,
        title: 'Clean Up Cancelled Bookings',
        desc: 'Archive all cancelled bookings older than 30 days',
        category: 'maintenance',
        danger: true,
    },
    {
        id: 'score_customers',
        icon: Users,
        title: 'Update Customer Loyalty Scores',
        desc: 'Recalculate loyalty tiers and risk scores for all customers',
        category: 'customers',
        danger: false,
    },
    {
        id: 'health_check',
        icon: Globe,
        title: 'Platform Health Check',
        desc: 'Simon runs a comprehensive audit of the platform and reports anomalies',
        category: 'system',
        danger: false,
    },
];

export default function AIControl() {
    const [running, setRunning] = useState({});
    const [results, setResults] = useState({});
    const [stats, setStats] = useState({ providers: 0, bookings: 0, customers: 0 });

    useEffect(() => {
        Promise.all([
        ]).then(([providers, bookings, customers]) => {
            setStats({ providers: providers.length, bookings: bookings.length, customers: customers.length
    }, []);

    const runAction = async (action) => {
        setRunning(r => ({ ...r, [action.id]: true }));
        try {
            const prompt = `You are Simon — the autonomous AI admin for ServiceFlow platform.
Platform stats: ${stats.providers} providers, ${stats.bookings} bookings, ${stats.customers} customer profiles.
Task: ${action.title}
Description: ${action.desc}
Provide a detailed report of what you would do, what criteria you would use, expected outcomes, and a summary of recommended actions. Be specific and data-driven. Format with markdown.`;

                prompt,
                model: 'claude_sonnet_4_6',
            });
            setResults(r => ({ ...r, [action.id]: response }));
            toast.success(`${action.title} completed`);
        } catch (e) {
            toast.error('Simon encountered an error');
        }
        setRunning(r => ({ ...r, [action.id]: false }));
    };

    const categories = [...new Set(AI_ACTIONS.map(a => a.category))];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl tracking-tight">Simon AI Control Center</h1>
                    <p className="text-zinc-400 text-sm mt-1">Autonomous platform management powered by Simon AI</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    <Cpu className="h-4 w-4" />
                    <span>Simon Active</span>
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Providers', value: stats.providers, icon: Shield },
                    { label: 'Bookings', value: stats.bookings, icon: CalendarDays },
                    { label: 'Customers', value: stats.customers, icon: Users },
                ].map(s => (
                    <div key={s.label} className="card-premium p-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <s.icon className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-black text-zinc-900">{s.value}</div>
                            <div className="text-xs text-zinc-400">{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions by category */}
            {categories.map(cat => (
                <div key={cat}>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3 font-mono-premium">{cat}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {AI_ACTIONS.filter(a => a.category === cat).map(action => (
                            <div key={action.id} className="card-premium p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${action.danger ? 'bg-red-50' : 'bg-zinc-100'}`}>
                                            <action.icon className={`h-4 w-4 ${action.danger ? 'text-red-600' : 'text-zinc-600'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{action.title}</h3>
                                            {action.danger && <span className="text-[10px] text-red-500 font-bold uppercase">High Impact</span>}
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => runAction(action)}
                                        disabled={running[action.id]}
                                        className={`rounded-xl shrink-0 ${action.danger ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}
                                    >
                                        {running[action.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                                    </Button>
                                </div>
                                <p className="text-xs text-zinc-500 mb-2">{action.desc}</p>
                                {results[action.id] && (
                                    <div className="mt-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                                            <span className="text-xs font-semibold text-emerald-700">Simon's Report</span>
                                        </div>
                                        <div className="text-xs text-zinc-600 leading-relaxed max-h-40 overflow-y-auto prose prose-xs prose-zinc max-w-none">
                                            {results[action.id].slice(0, 500)}...
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}