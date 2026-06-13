import { useState, useEffect } from 'react';
import { Star, Gift, Zap, Crown, Award, TrendingUp, ArrowRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TIERS = [
    { name: 'New', min: 0, max: 499, color: 'bg-zinc-100 text-zinc-600', icon: Star, perks: ['Access to all services', 'Basic support'] },
    { name: 'Regular', min: 500, max: 1999, color: 'bg-blue-100 text-blue-700', icon: Award, perks: ['5% discount on bookings', 'Priority booking slots', 'Early access to bundles'] },
    { name: 'VIP', min: 2000, max: 4999, color: 'bg-violet-100 text-violet-700', icon: Zap, perks: ['10% discount on all services', 'Dedicated support', 'Free cancellation', 'VIP provider matching'] },
    { name: 'Champion', min: 5000, max: Infinity, color: 'bg-amber-100 text-amber-700', icon: Crown, perks: ['15% discount on all services', 'Personal concierge', 'First access to new features', 'Exclusive provider relationships', 'Monthly perks credits'] },
];

export default function LoyaltyProgram() {
    const [memory, setMemory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
                setMemory(mem || { lifetime_value: 0, loyalty_tier: 'new', booking_count: 0 });
                setLoading(false);
    }, []);

    const ltv = memory?.lifetime_value || 0;
    const tier = TIERS.find(t => ltv >= t.min && ltv <= t.max) || TIERS[0];
    const nextTier = TIERS[TIERS.indexOf(tier) + 1];
    const progress = nextTier ? ((ltv - tier.min) / (nextTier.min - tier.min)) * 100 : 100;

    if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-wave h-24 rounded-2xl" />)}</div>;

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="font-display font-bold text-3xl tracking-tight">Loyalty Program</h1>
                <p className="text-zinc-500 text-sm mt-1">Earn rewards every time you book</p>
            </div>

            {/* Current tier card */}
            <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 text-white">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Your Tier</p>
                        <div className="flex items-center gap-3">
                            <tier.icon className="h-8 w-8 text-white" />
                            <h2 className="font-display font-bold text-4xl">{tier.name}</h2>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-zinc-400 text-xs">Lifetime Value</p>
                        <p className="font-black text-3xl">${ltv.toLocaleString()}</p>
                    </div>
                </div>
                {nextTier && (
                    <div>
                        <div className="flex justify-between text-xs text-zinc-400 mb-2">
                            <span>${ltv.toLocaleString()} spent</span>
                            <span>${nextTier.min.toLocaleString()} for {nextTier.name}</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>
                        <p className="text-zinc-400 text-xs mt-2">${(nextTier.min - ltv).toLocaleString()} more to reach {nextTier.name}</p>
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Bookings', value: memory?.booking_count || 0 },
                    { label: 'Total Spent', value: `$${ltv.toLocaleString()}` },
                    { label: 'Cancellations', value: memory?.cancellation_count || 0 },
                ].map(s => (
                    <div key={s.label} className="card-premium p-4 text-center">
                        <p className="font-black text-2xl text-zinc-900">{s.value}</p>
                        <p className="text-xs text-zinc-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Tier benefits */}
            <div>
                <h2 className="font-bold text-lg mb-4">All Tiers</h2>
                <div className="space-y-3">
                    {TIERS.map((t, i) => {
                        const Icon = t.icon;
                        const isCurrentOrPast = ltv >= t.min;
                        return (
                            <div key={t.name} className={`card-premium p-5 ${tier.name === t.name ? 'ring-2 ring-zinc-900' : ''}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${t.color}`}>
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{t.name}</p>
                                            <p className="text-xs text-zinc-400">{t.max === Infinity ? `$${t.min.toLocaleString()}+` : `$${t.min.toLocaleString()} – $${t.max.toLocaleString()}`}</p>
                                        </div>
                                    </div>
                                    {tier.name === t.name && <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-bold">Current</span>}
                                    {!isCurrentOrPast && <Lock className="h-4 w-4 text-zinc-300" />}
                                </div>
                                <ul className="space-y-1">
                                    {t.perks.map(p => (
                                        <li key={p} className={`text-xs flex items-center gap-2 ${isCurrentOrPast ? 'text-zinc-600' : 'text-zinc-300'}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isCurrentOrPast ? 'bg-emerald-500' : 'bg-zinc-200'}`} />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Button asChild className="w-full h-11 rounded-xl">
                <Link to="/services">Book a Service & Earn</Link>
            </Button>
        </div>
    );
}