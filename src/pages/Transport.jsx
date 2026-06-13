import { useState, useEffect } from 'react';
import { Car, Package, Truck, Key, Plus, MapPin, Calendar, Users, Clock, ShieldCheck, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const SEGMENTS = [
    { key: 'carpool', label: 'Rides', icon: Car },
    { key: 'delivery', label: 'Courier', icon: Package },
    { key: 'moving', label: 'Moving', icon: Truck },
    { key: 'car_rental', label: 'Car Rental', icon: Key },
];

const EMPTY = { type: 'carpool', from_location: '', to_location: '', date: '', departure_time: '', seats_available: 3, price_per_seat: 0, vehicle: '', description: '', contact_phone: '', recurring: false };

export default function Transport() {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [tab, setTab] = useState('carpool');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [createDialog, setCreateDialog] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [requestDialog, setRequestDialog] = useState(null);

    useEffect(() => {
    }, []);

    const filtered = rides.filter(r => {
        const matchType = r.type === tab;
        const matchFrom = !from || r.from_location?.toLowerCase().includes(from.toLowerCase());
        const matchTo = !to || r.to_location?.toLowerCase().includes(to.toLowerCase());
        return matchType && matchFrom && matchTo;
    });

    const create = async () => {
        if (!form.from_location || !form.to_location || !form.date) { toast.error('From, to and date required'); return; }
        setSaving(true);
        toast.success('Listing posted!');
        setSaving(false);
        setCreateDialog(false);
        setForm(EMPTY);
    };

    const requestSeat = async (ride) => {
        if (!user) { toast.error('Please log in'); return; }
        if (ride.seats_taken >= ride.seats_available) { toast.error('No seats available'); return; }
        setRides(prev => prev.map(r => r.id === ride.id ? { ...r, seats_taken: (r.seats_taken || 0) + 1 } : r));
        toast.success('Seat reserved! Contact the driver to confirm.');
        setRequestDialog(null);
    };

    const PACKAGE_SIZES = [
        { key: 'small', label: 'Small', desc: 'Envelope / box < 5kg', icon: '📦' },
        { key: 'medium', label: 'Medium', desc: 'Up to 20kg', icon: '🗃️' },
        { key: 'large', label: 'Large', desc: 'Furniture / bulky', icon: '📫' },
    ];

    return (
        <div className="pb-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-mono-premium font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">Transport Hub</h1>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-0.5">Rides, courier, moving & car rentals nearby</p>
                </div>
                {user && (
                    <Button
                        className="rounded-xl gap-2 h-9 text-sm bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-80"
                        onClick={() => { setForm({ ...EMPTY, type: tab }); setCreateDialog(true); }}
                    >
                        <Plus className="h-3.5 w-3.5" /> Post Listing
                    </Button>
                )}
            </div>

            {/* Segmented control */}
            <div className="flex bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 gap-1">
                {SEGMENTS.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold transition-all ${tab === key
                                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                                : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                            }`}>
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                        <span className="hidden sm:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Rides view */}
            {tab === 'carpool' && (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-2">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />
                                <Input value={from} onChange={e => setFrom(e.target.value)} placeholder="From…" className="pl-9 h-10 rounded-lg bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm" />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-300" strokeWidth={1.8} />
                                <Input value={to} onChange={e => setTo(e.target.value)} placeholder="To…" className="pl-9 h-10 rounded-lg bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm" />
                            </div>
                        </div>
                        <button onClick={() => { const tmp = from; setFrom(to); setTo(tmp); }}
                            className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-zinc-400">
                            <ArrowLeftRight className="h-4 w-4" strokeWidth={1.8} />
                        </button>
                    </div>
                </div>
            )}

            {/* Courier package size selector */}
            {tab === 'delivery' && (
                <div className="grid grid-cols-3 gap-3">
                    {PACKAGE_SIZES.map(s => (
                        <div key={s.key} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-all">
                            <div className="text-3xl mb-2">{s.icon}</div>
                            <p className="font-semibold text-sm text-zinc-900 dark:text-white">{s.label}</p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">{s.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Listings */}
            {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-wave h-24 rounded-xl" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/50">
                    <Car className="h-8 w-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm">No listings found</p>
                    {user && <Button variant="outline" size="sm" className="rounded-xl mt-3 text-xs" onClick={() => { setForm({ ...EMPTY, type: tab }); setCreateDialog(true); }}>Post First Listing</Button>}
                </div>
            ) : (
                <div className="space-y-2.5">
                    {filtered.map(ride => {
                        const seatsLeft = (ride.seats_available || 0) - (ride.seats_taken || 0);
                        const isFull = seatsLeft <= 0;
                        const SegIcon = SEGMENTS.find(s => s.key === ride.type)?.icon || Car;
                        return (
                            <div key={ride.id} className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
                                                <span className="text-[11px] font-bold text-white dark:text-zinc-900">
                                                    {ride.driver_name?.charAt(0)?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-zinc-900 dark:text-white">{ride.driver_name || ride.driver_email?.split('@')[0]}</p>
                                                {ride.vehicle && <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{ride.vehicle}</p>}
                                            </div>
                                            <ShieldCheck className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600 ml-1" strokeWidth={1.5} />
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400 mb-1.5">
                                            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                                            <span>{ride.from_location}</span>
                                            <span className="text-zinc-300 dark:text-zinc-700 mx-1">→</span>
                                            <span>{ride.to_location}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" strokeWidth={1.5} />{ride.date}</span>
                                            {ride.departure_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" strokeWidth={1.5} />{ride.departure_time}</span>}
                                            {ride.type === 'carpool' && <span className="flex items-center gap-1"><Users className="h-3 w-3" strokeWidth={1.5} />{seatsLeft} left</span>}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="font-bold text-base text-zinc-900 dark:text-white">{ride.price_per_seat > 0 ? `$${ride.price_per_seat}` : 'Free'}</p>
                                        {ride.type === 'carpool' && <p className="text-[10px] text-zinc-400 dark:text-zinc-500">/seat</p>}
                                        <Button size="sm" className="rounded-lg h-8 text-xs mt-2" disabled={isFull}
                                            variant={isFull ? 'outline' : 'default'}
                                            onClick={() => setRequestDialog(ride)}>
                                            {isFull ? 'Full' : ride.type === 'carpool' ? 'Request' : 'Contact'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle className="font-semibold">Post Transport Listing</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-1">
                        <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>{SEGMENTS.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="From *" value={form.from_location} onChange={e => setForm(p => ({ ...p, from_location: e.target.value }))} className="rounded-xl" />
                            <Input placeholder="To *" value={form.to_location} onChange={e => setForm(p => ({ ...p, to_location: e.target.value }))} className="rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="rounded-xl" />
                            <Input type="time" value={form.departure_time} onChange={e => setForm(p => ({ ...p, departure_time: e.target.value }))} className="rounded-xl" />
                        </div>
                        {form.type === 'carpool' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Input type="number" placeholder="Seats" value={form.seats_available} onChange={e => setForm(p => ({ ...p, seats_available: Number(e.target.value) }))} className="rounded-xl" min={1} />
                                <Input type="number" placeholder="Price/seat" value={form.price_per_seat} onChange={e => setForm(p => ({ ...p, price_per_seat: Number(e.target.value) }))} className="rounded-xl" />
                            </div>
                        )}
                        {form.type !== 'carpool' && (
                            <Input type="number" placeholder="Price ($)" value={form.price_per_seat} onChange={e => setForm(p => ({ ...p, price_per_seat: Number(e.target.value) }))} className="rounded-xl" />
                        )}
                        <Input placeholder="Vehicle (optional)" value={form.vehicle} onChange={e => setForm(p => ({ ...p, vehicle: e.target.value }))} className="rounded-xl" />
                        <Input placeholder="Contact phone" value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} className="rounded-xl" />
                        <div className="flex gap-2 pt-1">
                            <Button variant="outline" className="flex-1 h-10 rounded-xl text-sm" onClick={() => setCreateDialog(false)}>Cancel</Button>
                            <Button className="flex-1 h-10 rounded-xl text-sm" onClick={create} disabled={saving}>{saving ? 'Posting…' : 'Publish'}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Request Dialog */}
            <Dialog open={!!requestDialog} onOpenChange={() => setRequestDialog(null)}>
                {requestDialog && (
                    <DialogContent className="max-w-sm">
                        <DialogHeader><DialogTitle className="font-semibold">Confirm Request</DialogTitle></DialogHeader>
                        <div className="space-y-3 pt-1">
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 space-y-1.5 text-sm">
                                <p className="text-zinc-500 dark:text-zinc-400"><span className="text-zinc-900 dark:text-white font-medium">Route:</span> {requestDialog.from_location} → {requestDialog.to_location}</p>
                                <p className="text-zinc-500 dark:text-zinc-400"><span className="text-zinc-900 dark:text-white font-medium">Date:</span> {requestDialog.date} {requestDialog.departure_time && `at ${requestDialog.departure_time}`}</p>
                                <p className="text-zinc-500 dark:text-zinc-400"><span className="text-zinc-900 dark:text-white font-medium">Driver:</span> {requestDialog.driver_name || requestDialog.driver_email}</p>
                                {requestDialog.contact_phone && <p className="text-zinc-500 dark:text-zinc-400"><span className="text-zinc-900 dark:text-white font-medium">Phone:</span> {requestDialog.contact_phone}</p>}
                                <p className="text-zinc-500 dark:text-zinc-400"><span className="text-zinc-900 dark:text-white font-medium">Price:</span> {requestDialog.price_per_seat > 0 ? `$${requestDialog.price_per_seat} per seat` : 'Free'}</p>
                            </div>
                            <Button className="w-full h-11 rounded-xl" onClick={() => requestDialog.type === 'carpool' ? requestSeat(requestDialog) : (toast.success('Request sent!'), setRequestDialog(null))}>
                                {requestDialog.type === 'carpool' ? 'Confirm Seat Request' : 'Send Request'}
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}