import { useState, useEffect } from 'react';
import { Users, Copy, Check, Gift, Share2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
    { icon: Share2, title: 'Share your link', desc: 'Send your unique referral link to friends and family.' },
    { icon: Users, title: 'They sign up & book', desc: 'Your friend registers and completes their first booking.' },
    { icon: Gift, title: 'Both earn credits', desc: 'You get $10 credit and your friend gets $5 off their first booking.' },
];

export default function ReferralProgram() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch('/api/referral/stats', { credentials: 'include' })
            .then(r => r.json())
            .then(data => setStats(data))
            .catch(() => setStats({ referral_code: null, referral_count: 0, credits_earned: 0, recent_referrals: [] }))
            .finally(() => setLoading(false));
    }, []);

    const refCode = stats?.referral_code || '...';
    const refLink = `${window.location.origin}?ref=${refCode}`;

    const copyLink = () => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        toast.success('Referral link copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-wave h-24 rounded-2xl" />
            ))}
        </div>
    );

    return (
        <div className="space-y-5 max-w-2xl">
            <div>
                <h1 className="font-black text-2xl tracking-tight" style={{ color: 'var(--color-primary)', letterSpacing: '-0.03em' }}>Refer &amp; Earn</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Invite friends and earn $10 for every successful referral</p>
            </div>

            {/* Hero */}
            <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, var(--color-surface-high) 0%, var(--color-surface) 100%)', border: '1px solid var(--color-border-accent)', boxShadow: 'var(--shadow-card-hover)' }}>
                <TrendingUp className="h-8 w-8 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                <h2 className="font-black text-3xl mb-1" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>Earn $10 per referral</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No limit — the more you refer, the more you earn.</p>
            </div>

            {/* Referral link card */}
            <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
                <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-text-subtle)' }}>Your Referral Link</p>
                <div className="flex gap-2">
                    <div className="flex-1 min-w-0 rounded-xl px-3 py-2.5 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap"
                        style={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                        {refLink}
                    </div>
                    <button onClick={copyLink}
                        className="shrink-0 flex items-center gap-1.5 px-4 rounded-xl text-sm font-semibold transition-all"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>Code: <span className="font-mono font-bold" style={{ color: 'var(--color-primary)' }}>{refCode}</span></p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Referrals',     value: stats?.referral_count ?? 0 },
                    { label: 'Credits Earned', value: `$${(stats?.credits_earned ?? 0).toFixed(2)}` },
                    { label: 'Per Referral',   value: '$10' },
                ].map(s => (
                    <div key={s.label} className="rounded-xl p-4 text-center"
                        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                        <p className="font-black text-xl" style={{ color: 'var(--color-primary)', letterSpacing: '-0.04em' }}>{s.value}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div>
                <h2 className="font-bold text-sm mb-3 uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>How it works</h2>
                <div className="space-y-3">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-xl p-4"
                            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border)' }}>
                                <s.icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div className="min-w-0">
                                <p className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{s.title}</p>
                                <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent referrals */}
            {stats?.recent_referrals?.length > 0 && (
                <div>
                    <h2 className="font-bold text-sm mb-3 uppercase tracking-widest" style={{ color: 'var(--color-text-subtle)' }}>Recent Referrals</h2>
                    <div className="space-y-2">
                        {stats.recent_referrals.map((r, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3"
                                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: 'var(--color-surface-high)', border: '1px solid var(--color-border)' }}>
                                        <Users className="h-3.5 w-3.5" style={{ color: 'var(--color-text-muted)' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>{r.referred_name || 'Anonymous'}</p>
                                        <p className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>{new Date(r.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold" style={{ color: r.status === 'completed' ? 'var(--color-success)' : 'var(--color-text-subtle)' }}>
                                    {r.status === 'completed' ? `+$${r.credit_amount}` : r.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={copyLink}
                className="w-full flex items-center justify-center h-12 rounded-xl text-base font-semibold transition-all gap-2"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                <Share2 className="h-4 w-4" />
                Share My Link
            </button>
        </div>
    );
}
