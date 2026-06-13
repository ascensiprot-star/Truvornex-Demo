import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
    Plus, Layers, MapPin, Users, Tag, Calendar, Clock, ArrowRight,
    CheckCircle, Zap, TrendingUp, X
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const STATUS_CONFIG = {
    forming: { label: 'Forming', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    confirmed: { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    active: { label: 'Active', bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200' },
    completed: { label: 'Done', bg: 'bg-zinc-100', text: 'text-zinc-500', border: 'border-zinc-200' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

const EMPTY = {
    title: '',
    description: '',
    category_slug: '',
    service_name: '',
    zone_name: '',
    address_hint: '',
    max_participants: 5,
    discount_percentage: 20,
    base_price: '',
    scheduled_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    deadline_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
};

export default function ServiceBundles() {
    const [bundles, setBundles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState(null);
    const [filter, setFilter] = useState('forming');
    const [loading, setLoading] = useState(true);
    const [dialog, setDialog] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [joining, setJoining] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setUser(null);
        setBundles([]);
        setCategories([]);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const filtered = bundles.filter(b => filter === 'all' || b.status === filter);

    const hasJoined = (b) => user && (b.participant_emails || []).includes(user.email);
    const isOrganizer = (b) => user && b.organizer_email === user.email;

    const joinBundle = async (bundle) => {
        if (!user) { toast.error('Please log in to join a bundle'); return; }
        if (hasJoined(bundle)) { toast('You already joined this bundle'); return; }
        if ((bundle.current_participants || 1) >= bundle.max_participants) { toast.error('Bundle is full'); return; }
        setJoining(bundle.id);
        setBundles(prev => prev.map(b => b.id === bundle.id ? {
            ...b,
            participant_emails: [...(b.participant_emails || [b.organizer_email]), user.email],
            current_participants: (b.current_participants || 1) + 1,
        } : b));
        toast.success('Joined! You\'ll be notified when the bundle is confirmed.');
        await load();
        setJoining(null);
    };

    const createBundle = async () => {
        if (!user) { toast.error('Please log in first'); return; }
        setSaving(true);
        const discounted = form.base_price
            ? Number(form.base_price) * (1 - Number(form.discount_percentage) / 100)
            : null;
        const newBundle = {
            id: Date.now(),
            ...form,
            organizer_email: user.email,
            participant_emails: [user.email],
            current_participants: 1,
            max_participants: Number(form.max_participants),
            discount_percentage: Number(form.discount_percentage),
            base_price: form.base_price ? Number(form.base_price) : undefined,
            discounted_price: discounted || undefined,
            status: 'forming',
        };
        setBundles(prev => [newBundle, ...prev]);
        toast.success('Bundle created! Share with your neighbors.');
        setDialog(false);
        setForm(EMPTY);
        setSaving(false);
        load();
    };

    return (
        <div className="pb-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-inter font-black text-2xl tracking-tight">Group Deals</h1>
                            <p className="text-zinc-400 text-sm">Bundle nearby jobs · Save up to 35%</p>
                        </div>
                    </div>
                    <Button className="rounded-xl gap-1.5" onClick={() => setDialog(true)}>
                        <Plus className="h-4 w-4" /> Create Bundle
                    </Button>
                </div>

                {/* Explainer cards */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                    {[
                        { icon: Users, title: 'Group up', sub: '3-8 neighbors for same service', color: 'bg-blue-50 text-blue-700' },
                        { icon: Tag, title: 'Save big', sub: 'Up to 35% group discount', color: 'bg-emerald-50 text-emerald-700' },
                        { icon: Zap, title: 'Faster booking', sub: 'Provider does all in one trip', color: 'bg-violet-50 text-violet-700' },
                    ].map(({ icon: Icon, title, sub, color }) => (
                        <div key={title} className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium text-center">
                            <div className={`h-9 w-9 rounded-xl mx-auto mb-2 flex items-center justify-center ${color}`}>
                                <Icon className="h-4.5 w-4.5" />
                            </div>
                            <p className="text-sm font-bold">{title}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter tabs */}
            <div className="glass rounded-2xl p-1.5 flex gap-1 mb-6 shadow-premium">
                {[['forming', 'Forming'], ['confirmed', 'Confirmed'], ['active', 'Active'], ['completed', 'Past'], ['all', 'All']].map(([key, label]) => (
                    <button key={key} onClick={() => setFilter(key)}
                        className={`flex-1 h-8 rounded-xl text-xs font-semibold transition-all ${filter === key ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                        {label}
                        {key !== 'all' && (
                            <span className="ml-1 opacity-60">{bundles.filter(b => b.status === key).length || ''}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Bundles Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton-wave h-56 rounded-2xl" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-100 p-14 text-center shadow-premium">
                    <Layers className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                    <h3 className="font-semibold text-zinc-700 mb-2">No {filter !== 'all' ? filter : ''} bundles yet</h3>
                    <p className="text-zinc-400 text-sm mb-5">Be the first to start a group deal in your neighborhood.</p>
                    <Button className="rounded-xl" onClick={() => setDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Create a Bundle
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(bundle => {
                        const sc = STATUS_CONFIG[bundle.status] || STATUS_CONFIG.forming;
                        const pct = Math.round(((bundle.current_participants || 1) / (bundle.max_participants || 5)) * 100);
                        const joined = hasJoined(bundle);
                        const full = (bundle.current_participants || 1) >= bundle.max_participants;
                        const canJoin = !joined && !isOrganizer(bundle) && !full && bundle.status === 'forming';

                        return (
                            <div key={bundle.id} className="bg-white rounded-2xl border border-zinc-100 p-5 shadow-premium flex flex-col">
                                {/* Top row */}
                                <div className="flex items-start justify-between mb-3">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.bg} ${sc.text} ${sc.border}`}>
                                        {sc.label}
                                    </span>
                                    {bundle.discount_percentage > 0 && (
                                        <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600">
                                            <Tag className="h-3 w-3" /> -{bundle.discount_percentage}%
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <h3 className="font-inter font-bold text-base mb-1 leading-tight">{bundle.title}</h3>
                                {bundle.description && <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{bundle.description}</p>}

                                <div className="space-y-1.5 mb-4">
                                    {bundle.zone_name && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                            <MapPin className="h-3 w-3 shrink-0" /> {bundle.zone_name}{bundle.address_hint ? ` · ${bundle.address_hint}` : ''}
                                        </div>
                                    )}
                                    {bundle.scheduled_date && (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                            <Calendar className="h-3 w-3 shrink-0" /> {format(new Date(bundle.scheduled_date + 'T12:00:00'), 'MMM d, yyyy')}
                                        </div>
                                    )}
                                    {bundle.deadline_date && bundle.status === 'forming' && (
                                        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                                            <Clock className="h-3 w-3 shrink-0" /> Join by {format(new Date(bundle.deadline_date + 'T12:00:00'), 'MMM d')}
                                        </div>
                                    )}
                                </div>

                                {/* Pricing */}
                                {bundle.base_price && (
                                    <div className="flex items-baseline gap-2 mb-3">
                                        {bundle.discounted_price && (
                                            <span className="text-lg font-black text-zinc-900">${bundle.discounted_price.toFixed(0)}</span>
                                        )}
                                        <span className={`text-sm ${bundle.discounted_price ? 'text-zinc-400 line-through' : 'font-bold text-zinc-900'}`}>${bundle.base_price}</span>
                                        <span className="text-xs text-zinc-400">per person</span>
                                    </div>
                                )}

                                {/* Progress */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-[10px] font-semibold mb-1">
                                        <span className="text-zinc-600"><Users className="h-3 w-3 inline mr-0.5" />{bundle.current_participants || 1} / {bundle.max_participants} joined</span>
                                        {full && <span className="text-amber-600 font-bold">FULL</span>}
                                        {!full && <span className="text-zinc-400">{bundle.max_participants - (bundle.current_participants || 1)} slots left</span>}
                                    </div>
                                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-amber-500' : 'bg-zinc-900'}`}
                                            style={{ width: `${Math.min(pct, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="mt-auto">
                                    {joined || isOrganizer(bundle) ? (
                                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                            <CheckCircle className="h-4 w-4" />
                                            {isOrganizer(bundle) ? "You organized this" : "You're in!"}
                                        </div>
                                    ) : canJoin ? (
                                        <Button className="w-full rounded-xl h-9" onClick={() => joinBundle(bundle)} disabled={joining === bundle.id}>
                                            {joining === bundle.id ? 'Joining...' : 'Join Bundle'}
                                        </Button>
                                    ) : full ? (
                                        <Button variant="outline" className="w-full rounded-xl h-9" disabled>Bundle Full</Button>
                                    ) : (
                                        <Button variant="outline" className="w-full rounded-xl h-9" disabled>
                                            {bundle.status === 'confirmed' ? 'Booking Confirmed' : 'Closed'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Bundle Dialog */}
            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create a Group Deal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 pt-1 max-h-[70vh] overflow-y-auto pr-1">
                        <Input placeholder="Bundle title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-xl" />
                        <Textarea placeholder="Describe the service (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-xl resize-none" rows={2} />
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Category</label>
                                <Select value={form.category_slug} onValueChange={v => setForm({ ...form, category_slug: v })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Service name</label>
                                <Input placeholder="e.g. House cleaning" value={form.service_name} onChange={e => setForm({ ...form, service_name: e.target.value })} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Neighborhood</label>
                                <Input placeholder="e.g. Maple Heights" value={form.zone_name} onChange={e => setForm({ ...form, zone_name: e.target.value })} className="rounded-xl" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Area hint</label>
                                <Input placeholder="e.g. Oak Street area" value={form.address_hint} onChange={e => setForm({ ...form, address_hint: e.target.value })} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Max slots</label>
                                <Select value={String(form.max_participants)} onValueChange={v => setForm({ ...form, max_participants: v })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[3, 4, 5, 6, 8, 10].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Discount %</label>
                                <Select value={String(form.discount_percentage)} onValueChange={v => setForm({ ...form, discount_percentage: v })}>
                                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[10, 15, 20, 25, 30, 35].map(n => <SelectItem key={n} value={String(n)}>{n}%</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Base price $</label>
                                <Input type="number" placeholder="0" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} className="rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Scheduled date</label>
                                <Input type="date" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} className="rounded-xl" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 block">Join-by deadline</label>
                                <Input type="date" value={form.deadline_date} onChange={e => setForm({ ...form, deadline_date: e.target.value })} className="rounded-xl" />
                            </div>
                        </div>
                        <Button className="w-full rounded-xl h-11" onClick={createBundle} disabled={!form.title || !form.zone_name || saving}>
                            {saving ? 'Creating...' : 'Create Group Deal'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}