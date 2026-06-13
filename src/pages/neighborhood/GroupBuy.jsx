import { useState, useEffect } from 'react';
import { Layers, Users, Clock, Plus, Check, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

const SERVICE_CATEGORIES = [
    'Cleaning', 'Gardening', 'Plumbing', 'Electrical', 'Painting',
    'HVAC', 'Security', 'Handyman', 'Pest Control', 'Moving',
];

const EMPTY_FORM = { service_category: '', description: '', target_participants: 5, discount_percent: 15, expires_days: 7 };

function countdown(expiresAt) {
    const diff = new Date(expiresAt) - Date.now();
    if (diff <= 0) return 'Expired';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `${d}d ${h}h left`;
    if (h > 0) return `${h}h ${m}m left`;
    return `${m}m left`;
}

function BuyCard({ buy, joined, joining, onJoin }) {
    const pct = Math.min(100, Math.round(((buy.current_participants || 0) / (buy.target_participants || 1)) * 100));
    const isJoined = joined.has(buy.id);
    const cd = buy.expires_at ? countdown(buy.expires_at) : null;
    const isLocked = buy.status === 'locked';

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                    <p className="font-bold text-sm text-zinc-900 dark:text-white">{buy.service_category}</p>
                    {buy.description && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{buy.description}</p>}
                </div>
                <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-emerald-600">{buy.discount_percent}%</span>
                    <span className="text-xs font-semibold text-zinc-400 ml-0.5">off</span>
                </div>
            </div>

            <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {buy.current_participants || 0}/{buy.target_participants} joined
                    </span>
                    {cd && (
                        <span className="text-zinc-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />{cd}
                        </span>
                    )}
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">{pct}% to unlock deal</p>
            </div>

            {isLocked && (
                <div className="mb-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Deal locked — provider being assigned</p>
                </div>
            )}

            <Button
                size="sm"
                className="w-full rounded-xl h-8 text-xs gap-1.5"
                variant={isJoined ? 'outline' : 'default'}
                disabled={isJoined || joining === buy.id || isLocked}
                onClick={() => onJoin(buy)}>
                {joining === buy.id
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : isJoined
                        ? <Check className="h-3 w-3" />
                        : <ShoppingCart className="h-3 w-3" />}
                {isJoined ? 'Joined' : isLocked ? 'Deal Locked' : 'Join Group Buy'}
            </Button>
        </div>
    );
}

export default function GroupBuy() {
    const { user } = useAuth();
    const [buys, setBuys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joined, setJoined] = useState(new Set());
    const [joining, setJoining] = useState(null);
    const [dialog, setDialog] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        const [buysRes, partRes] = await Promise.all([
            supabase.from('group_buys').select('*').in('status', ['open', 'locked']).order('created_at', { ascending: false }).limit(30),
            user
                ? supabase.from('group_buy_participants').select('group_buy_id').eq('user_id', user.id)
                : Promise.resolve({ data: [] }),
        ]);
        if (buysRes.data) setBuys(buysRes.data);
        if (partRes.data) setJoined(new Set(partRes.data.map(p => p.group_buy_id)));
        setLoading(false);
    };

    useEffect(() => { load(); }, [user]);

    const joinBuy = async (buy) => {
        if (!user) { toast.error('Sign in to join'); return; }
        if (joined.has(buy.id)) { toast('Already joined'); return; }
        setJoining(buy.id);
        try {
            const { error } = await supabase.from('group_buy_participants').insert([{
                group_buy_id: buy.id,
                user_id: user.id,
                joined_at: new Date().toISOString(),
            }]);
            if (error) throw error;
            await supabase.from('group_buys')
                .update({ current_participants: (buy.current_participants || 0) + 1 })
                .eq('id', buy.id);
            setJoined(p => new Set([...p, buy.id]));
            setBuys(p => p.map(b => b.id === buy.id
                ? { ...b, current_participants: (b.current_participants || 0) + 1 }
                : b));
            toast.success('Joined group buy!');
        } catch (err) { toast.error(err.message || 'Failed to join'); }
        finally { setJoining(null); }
    };

    const create = async () => {
        if (!form.service_category) { toast.error('Select a service category'); return; }
        if (!user) { toast.error('Sign in first'); return; }
        setSaving(true);
        try {
            const expiresAt = new Date(Date.now() + Number(form.expires_days) * 86400000).toISOString();
            const { data, error } = await supabase.from('group_buys').insert([{
                initiator_id: user.id,
                service_category: form.service_category,
                description: form.description || null,
                target_participants: Number(form.target_participants),
                current_participants: 1,
                discount_percent: Number(form.discount_percent),
                status: 'open',
                expires_at: expiresAt,
            }]).select().single();
            if (error) throw error;
            if (data) {
                await supabase.from('group_buy_participants').insert([{
                    group_buy_id: data.id, user_id: user.id, joined_at: new Date().toISOString(),
                }]);
                setJoined(p => new Set([...p, data.id]));
            }
            toast.success('Group buy started!');
            setDialog(false);
            setForm(EMPTY_FORM);
            load();
        } catch (err) { toast.error(err.message || 'Failed to create'); }
        finally { setSaving(false); }
    };

    const open = buys.filter(b => b.status === 'open');
    const locked = buys.filter(b => b.status === 'locked');

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">Group Buy Hub</h1>
                        <p className="text-zinc-400 text-sm mt-0.5">Pool demand, unlock neighborhood discounts</p>
                    </div>
                </div>
                <Button className="rounded-xl gap-2" onClick={() => user ? setDialog(true) : toast.error('Sign in first')}>
                    <Plus className="h-4 w-4" /> Start Group Buy
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Open Deals',  value: open.length   },
                    { label: 'Locked Deals',value: locked.length },
                    { label: "You've Joined",value: joined.size  },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-center">
                        <p className="text-2xl font-black text-zinc-900 dark:text-white">{s.value}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-wave h-44 rounded-2xl" />)}
                </div>
            ) : open.length === 0 && locked.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <Layers className="h-10 w-10 mx-auto mb-3 text-zinc-200 dark:text-zinc-700" strokeWidth={1.5} />
                    <p className="text-zinc-400 font-medium">No group buys yet</p>
                    <p className="text-xs text-zinc-400 mt-1">Pool demand with your neighbors for big discounts</p>
                    {user && (
                        <button onClick={() => setDialog(true)} className="mt-4 text-sm font-semibold text-zinc-900 dark:text-white underline underline-offset-2">
                            Start the first one
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {open.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                                Open — Collecting Participants
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {open.map(b => (
                                    <BuyCard key={b.id} buy={b} joined={joined} joining={joining} onJoin={joinBuy} />
                                ))}
                            </div>
                        </div>
                    )}
                    {locked.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                                Locked — Provider Being Assigned
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {locked.map(b => (
                                    <BuyCard key={b.id} buy={b} joined={joined} joining={joining} onJoin={joinBuy} />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Create dialog */}
            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>Start a Group Buy</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-1">
                        <Select value={form.service_category} onValueChange={v => setForm(p => ({ ...p, service_category: v }))}>
                            <SelectTrigger className="rounded-xl"><SelectValue placeholder="Service category *" /></SelectTrigger>
                            <SelectContent>
                                {SERVICE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="What specifically? (optional)"
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            className="rounded-xl"
                        />
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <p className="text-[10px] text-zinc-400 mb-1">Target participants</p>
                                <Input type="number" min={2} max={100} value={form.target_participants}
                                    onChange={e => setForm(p => ({ ...p, target_participants: e.target.value }))} className="rounded-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-400 mb-1">Discount %</p>
                                <Input type="number" min={5} max={50} value={form.discount_percent}
                                    onChange={e => setForm(p => ({ ...p, discount_percent: e.target.value }))} className="rounded-xl" />
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-400 mb-1">Expires (days)</p>
                                <Input type="number" min={1} max={30} value={form.expires_days}
                                    onChange={e => setForm(p => ({ ...p, expires_days: e.target.value }))} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl p-3 text-xs text-zinc-500">
                            You will automatically be added as the first participant. When the target is reached, the deal locks in and the best provider gets matched.
                        </div>
                        <Button className="w-full h-11 rounded-xl gap-2" onClick={create} disabled={saving || !form.service_category}>
                            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {saving ? 'Creating...' : 'Start Group Buy'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
