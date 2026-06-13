import { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket, Plus, Search, Users, Camera, Utensils, Palette, Clock, Star, ChevronRight, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const CATEGORY_ICONS = { concert: '🎵', workshop: '🛠️', meetup: '🤝', sports: '⚽', festival: '🎉', exhibition: '🖼️', food: '🍽️', other: '📅' };
const VENUE_TYPES = { hall: 'Community Hall', rooftop: 'Rooftop', open_ground: 'Open Ground', indoor: 'Indoor', online: 'Online', other: 'Other' };
const BUNDLE_SERVICES = ['photographer', 'decorator', 'caterer', 'security', 'sound_system', 'mc_host', 'florist'];
const BUNDLE_ICONS = { photographer: Camera, decorator: Palette, caterer: Utensils, security: Users, sound_system: Star, mc_host: Users, florist: Star };

const EMPTY_EVENT = { title: '', description: '', category: 'meetup', venue_name: '', venue_type: 'hall', address: '', date: '', start_time: '', end_time: '', organizer_name: '', ticket_price: 0, is_free: true, total_tickets: 100, bundle_services: [] };

export default function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('all');
    const [tab, setTab] = useState('browse');
    const [createDialog, setCreateDialog] = useState(false);
    const [ticketDialog, setTicketDialog] = useState(null);
    const [form, setForm] = useState(EMPTY_EVENT);
    const [saving, setSaving] = useState(false);
    const [buying, setBuying] = useState(false);
    const [myTickets, setMyTickets] = useState([]);

    useEffect(() => {
    }, []);

    useEffect(() => {
        if (user && tab === 'my-tickets') {
        }
    }, [user, tab]);

    const toggleBundle = (s) => setForm(p => ({
        ...p, bundle_services: p.bundle_services?.includes(s) ? p.bundle_services.filter(x => x !== s) : [...(p.bundle_services || []), s]
    }));

    const createEvent = async () => {
        if (!form.title || !form.date || !form.venue_name) { toast.error('Title, date and venue required'); return; }
        setSaving(true);
        toast.success('Event created!');
        setSaving(false);
        setCreateDialog(false);
        setForm(EMPTY_EVENT);
    };

    const buyTicket = async (event, qty = 1) => {
        if (!user) { toast.error('Please log in to buy tickets'); return; }
        setBuying(true);
        const code = `TRV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const _ticketData = {
            event_id: event.id, event_title: event.title,
            buyer_email: user.email, buyer_name: user.full_name || user.email,
            quantity: qty, unit_price: event.ticket_price || 0,
            total_amount: (event.ticket_price || 0) * qty,
            status: 'active', ticket_code: code,
        };
        setEvents(prev => prev.map(e => e.id === event.id ? { ...e, tickets_sold: (e.tickets_sold || 0) + qty } : e));
        toast.success(`Ticket booked! Code: ${code}`);
        setBuying(false);
        setTicketDialog(null);
    };

    const filtered = events.filter(e => {
        const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase()) || e.venue_name?.toLowerCase().includes(search.toLowerCase());
        const matchCat = catFilter === 'all' || e.category === catFilter;
        return matchSearch && matchCat;
    });

    return (
        <div className="space-y-6 pb-8">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="font-display font-bold text-3xl tracking-tight">Local Events</h1>
                    <p className="text-zinc-400 text-sm mt-1">Concerts, workshops, meetups & venue bookings</p>
                </div>
                {user && (
                    <Button className="rounded-xl gap-2" onClick={() => setCreateDialog(true)}>
                        <Plus className="h-4 w-4" /> Create Event
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl w-fit">
                {[['browse', 'Browse Events'], ['my-tickets', 'My Tickets'], ['venues', 'Venues']].map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`h-8 px-4 rounded-xl text-xs font-semibold transition-all ${tab === key ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-800'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'browse' && (
                <>
                    {/* Filters */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events…" className="pl-9 rounded-xl" />
                        </div>
                        <Select value={catFilter} onValueChange={setCatFilter}>
                            <SelectTrigger className="rounded-xl w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {['concert', 'workshop', 'meetup', 'sports', 'festival', 'exhibition', 'food', 'other'].map(c => (
                                    <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton-wave h-64 rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filtered.map(event => {
                                const soldOut = event.tickets_sold >= event.total_tickets;
                                const pct = Math.min(100, Math.round((event.tickets_sold || 0) / (event.total_tickets || 1) * 100));
                                return (
                                    <div key={event.id} className="card-premium overflow-hidden group">
                                        <div className="h-36 bg-gradient-to-br from-zinc-800 to-zinc-600 flex items-center justify-center text-5xl relative">
                                            {event.image_url ? <img src={event.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" /> : CATEGORY_ICONS[event.category]}
                                            <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-full capitalize">{event.category}</span>
                                            {soldOut && <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">SOLD OUT</span>}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-sm mb-2 line-clamp-1">{event.title}</h3>
                                            <div className="space-y-1 text-xs text-zinc-500 mb-3">
                                                <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {event.date} {event.start_time && `· ${event.start_time}`}</div>
                                                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.venue_name} · {VENUE_TYPES[event.venue_type] || event.venue_type}</div>
                                                <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {event.tickets_sold || 0}/{event.total_tickets} tickets</div>
                                            </div>
                                            {event.bundle_services?.length > 0 && (
                                                <div className="flex gap-1 flex-wrap mb-3">
                                                    {event.bundle_services.map(s => (
                                                        <span key={s} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-1.5 py-0.5 rounded-full">{s}</span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-3 overflow-hidden">
                                                <div className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-sm">{event.is_free || !event.ticket_price ? 'Free' : `$${event.ticket_price}`}</span>
                                                <Button size="sm" className="rounded-xl h-8 text-xs gap-1.5" disabled={soldOut} onClick={() => setTicketDialog(event)}>
                                                    <Ticket className="h-3.5 w-3.5" /> {soldOut ? 'Sold Out' : 'Get Ticket'}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div className="col-span-3 text-center py-16 text-zinc-400">
                                    <Calendar className="h-10 w-10 mx-auto mb-3 text-zinc-200" />
                                    <p>No events found</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {tab === 'my-tickets' && (
                <div className="space-y-3">
                    {!user ? (
                        <div className="card-premium p-10 text-center text-zinc-400">Log in to view your tickets</div>
                    ) : myTickets.length === 0 ? (
                        <div className="card-premium p-10 text-center">
                            <Ticket className="h-10 w-10 mx-auto mb-3 text-zinc-200" />
                            <p className="text-zinc-400">No tickets yet</p>
                        </div>
                    ) : myTickets.map(t => (
                        <div key={t.id} className="card-premium p-5 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-bold">{t.event_title}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Qty: {t.quantity} · Code: <span className="font-mono font-bold">{t.ticket_code}</span></p>
                                <p className="text-xs text-zinc-400">{t.total_amount > 0 ? `$${t.total_amount}` : 'Free'}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${t.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}>{t.status}</span>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'venues' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                        { type: 'hall', name: 'Grand Community Hall', cap: 500, price: '$800/day', img: '🏛️', amenities: ['stage', 'parking', 'kitchen', 'AV system'] },
                        { type: 'rooftop', name: 'Skyline Rooftop', cap: 150, price: '$400/day', img: '🌆', amenities: ['panoramic view', 'bar counter', 'string lights'] },
                        { type: 'open_ground', name: 'Green Valley Ground', cap: 2000, price: '$300/day', img: '🌿', amenities: ['open air', 'tents available', 'generators', 'toilets'] },
                        { type: 'indoor', name: 'The Loft', cap: 80, price: '$250/day', img: '🏢', amenities: ['AC', 'projector', 'whiteboard', 'coffee'] },
                        { type: 'rooftop', name: 'Sunset Terrace', cap: 60, price: '$350/day', img: '🌅', amenities: ['garden', 'BBQ', 'private'] },
                        { type: 'hall', name: 'Heritage Ballroom', cap: 300, price: '$1200/day', img: '✨', amenities: ['vintage decor', 'dance floor', 'catering included'] },
                    ].map((v, i) => (
                        <div key={i} className="card-premium overflow-hidden">
                            <div className="h-28 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-5xl">{v.img}</div>
                            <div className="p-4">
                                <p className="font-bold text-sm">{v.name}</p>
                                <p className="text-xs text-zinc-400 mt-0.5">{VENUE_TYPES[v.type]} · Up to {v.cap.toLocaleString()} guests</p>
                                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                                    {v.amenities.map(a => <span key={a} className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-full">{a}</span>)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{v.price}</span>
                                    <Button size="sm" className="rounded-xl h-8 text-xs" onClick={() => toast.success('Venue inquiry sent! We\'ll contact you shortly.')}>Book Venue</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Event Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>Create New Event</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-1">
                        <Input placeholder="Event title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl" />
                        <Textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="rounded-xl resize-none" rows={3} />
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>{['concert', 'workshop', 'meetup', 'sports', 'festival', 'exhibition', 'food', 'other'].map(c => <SelectItem key={c} value={c}>{CATEGORY_ICONS[c]} {c}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select value={form.venue_type} onValueChange={v => setForm(p => ({ ...p, venue_type: v }))}>
                                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent>{Object.entries(VENUE_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <Input placeholder="Venue name *" value={form.venue_name} onChange={e => setForm(p => ({ ...p, venue_name: e.target.value }))} className="rounded-xl" />
                        <Input placeholder="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="rounded-xl" />
                        <div className="grid grid-cols-3 gap-3">
                            <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="rounded-xl" />
                            <Input type="time" value={form.start_time} onChange={e => setForm(p => ({ ...p, start_time: e.target.value }))} className="rounded-xl" placeholder="Start" />
                            <Input type="time" value={form.end_time} onChange={e => setForm(p => ({ ...p, end_time: e.target.value }))} className="rounded-xl" placeholder="End" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Input type="number" placeholder="Total tickets" value={form.total_tickets} onChange={e => setForm(p => ({ ...p, total_tickets: Number(e.target.value) }))} className="rounded-xl" />
                            <Input type="number" placeholder="Price (0 = free)" value={form.ticket_price} onChange={e => setForm(p => ({ ...p, ticket_price: Number(e.target.value), is_free: Number(e.target.value) === 0 }))} className="rounded-xl" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Bundle Services (optional)</p>
                            <div className="flex flex-wrap gap-2">
                                {BUNDLE_SERVICES.map(s => {
                                    const active = form.bundle_services?.includes(s);
                                    return (
                                        <button key={s} onClick={() => toggleBundle(s)}
                                            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-xl text-xs font-semibold border transition-all ${active ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'}`}>
                                            {active && <Check className="h-3 w-3" />} {s.replace('_', ' ')}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <Button className="w-full h-11 rounded-xl" onClick={createEvent} disabled={saving}>{saving ? 'Creating…' : 'Publish Event'}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Buy Ticket Dialog */}
            <Dialog open={!!ticketDialog} onOpenChange={() => setTicketDialog(null)}>
                {ticketDialog && (
                    <DialogContent className="max-w-sm">
                        <DialogHeader><DialogTitle>Get Ticket</DialogTitle></DialogHeader>
                        <div className="space-y-4 pt-1">
                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4">
                                <p className="font-bold">{ticketDialog.title}</p>
                                <p className="text-xs text-zinc-400 mt-1">{ticketDialog.date} · {ticketDialog.venue_name}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">Price per ticket</p>
                                <p className="font-bold text-lg">{ticketDialog.is_free || !ticketDialog.ticket_price ? 'Free' : `$${ticketDialog.ticket_price}`}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-zinc-400">
                                <span>Available</span>
                                <span>{(ticketDialog.total_tickets || 0) - (ticketDialog.tickets_sold || 0)} remaining</span>
                            </div>
                            {ticketDialog.bundle_services?.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Bundled Services Included</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {ticketDialog.bundle_services.map(s => <span key={s} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">{s}</span>)}
                                    </div>
                                </div>
                            )}
                            <Button className="w-full h-11 rounded-xl gap-2" onClick={() => buyTicket(ticketDialog)} disabled={buying}>
                                <Ticket className="h-4 w-4" /> {buying ? 'Booking…' : ticketDialog.is_free || !ticketDialog.ticket_price ? 'Reserve Free Ticket' : `Pay $${ticketDialog.ticket_price} & Book`}
                            </Button>
                        </div>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}