import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { CheckCircle, Clock, MapPin, ArrowLeft, ArrowRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];

export default function BookService() {
    const { providerId, serviceId } = useParams();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [service, setService] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [existingBookings, setExistingBookings] = useState([]);
    const [date, setDate] = useState(null);
    const [slot, setSlot] = useState('');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);

    useEffect(() => {
        Promise.all([
        ]).then(([p, s, vars, bks]) => {
            setProvider(p); setService(s);
            setVariants(vars.filter(v => v.is_active !== false));
            setExistingBookings(bks.filter(b => !['cancelled', 'no_show'].includes(b.status)));
            setLoading(false);
        });
    }, [providerId, serviceId]);

    const isSlotBooked = (dateStr, timeSlot) => {
        return existingBookings.some(b => b.date === dateStr && b.time_slot === timeSlot);
    };

    const totalPrice = (service?.price || 0) + selectedAddons.reduce((s, a) => s + (a.price_modifier || 0), 0);

    const toggleAddon = (v) => {
        setSelectedAddons(prev => prev.some(a => a.id === v.id) ? prev.filter(a => a.id !== v.id) : [...prev, v]);
    };

    const handleBook = async () => {
        if (!date || !slot) { toast.error('Please select a date and time'); return; }
        setSubmitting(true);
        const addonNotes = selectedAddons.length > 0 ? `Add-ons: ${selectedAddons.map(a => a.name).join(', ')}` : '';
            customer_email: user.email,
            provider_id: providerId,
            service_id: serviceId,
            service_name: service.name,
            provider_name: provider.business_name,
            type: service.type,
            date: date.toISOString().split('T')[0],
            time_slot: slot,
            price: totalPrice,
            notes: [notes, addonNotes].filter(Boolean).join(' | '),
            status: provider.auto_confirm ? 'confirmed' : 'pending',
        });
        setSuccess(true);
        setSubmitting(false);
    };

    if (loading) return (
        <div className="max-w-lg mx-auto space-y-4 pb-24">
            <div className="skeleton-wave h-24 rounded-2xl" />
            <div className="skeleton-wave h-72 rounded-2xl" />
        </div>
    );

    if (success) return (
        <div className="max-w-md mx-auto text-center py-20 pb-24">
            <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="font-inter font-black text-3xl mb-3">Booking Confirmed!</h1>
            <p className="text-zinc-500 mb-2 text-sm leading-relaxed">
                Your booking for <span className="font-semibold text-zinc-900">{service?.name}</span> has been submitted.
                The provider will confirm shortly.
            </p>
            <div className="glass rounded-2xl p-4 text-left mt-6 mb-8 space-y-2 shadow-premium">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Service</span>
                    <span className="font-semibold text-zinc-900">{service?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Provider</span>
                    <span className="font-semibold text-zinc-900">{provider?.business_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Scheduled</span>
                    <span className="font-semibold text-zinc-900">{date?.toLocaleDateString()} at {slot}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-zinc-100 pt-2 mt-2">
                    <span className="text-zinc-400">Total</span>
                    <span className="font-black text-zinc-900">${service?.price}</span>
                </div>
            </div>
            <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/dashboard')} className="rounded-xl">View My Bookings</Button>
                <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl">Back to Home</Button>
            </div>
        </div>
    );

    return (
        <div className="max-w-lg mx-auto pb-24 md:pb-8">
            <Link to={`/providers/${providerId}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-6">
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Provider
            </Link>

            {/* Service summary card */}
            <div className="card-premium p-5 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">Booking</p>
                        <h1 className="font-inter font-black text-2xl text-zinc-900">{service?.name}</h1>
                        <p className="text-sm text-zinc-500 mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{provider?.business_name}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{service?.duration_minutes + selectedAddons.reduce((s, a) => s + (a.duration_modifier || 0), 0)} min</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-zinc-900">${totalPrice}</span>
                        {selectedAddons.length > 0 && <p className="text-xs text-zinc-400">incl. {selectedAddons.length} add-on{selectedAddons.length > 1 ? 's' : ''}</p>}
                    </div>
                </div>
            </div>

            {/* Step indicator */}
            <div className="glass rounded-2xl p-1.5 flex gap-1 mb-6 shadow-premium">
                {[{ n: 1, label: 'Date' }, { n: 2, label: 'Time' }, { n: 3, label: 'Confirm' }].map(s => (
                    <button
                        key={s.n}
                        onClick={() => s.n < step && setStep(s.n)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold transition-all ${step === s.n ? 'bg-zinc-900 text-white' : step > s.n ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-300'
                            }`}
                    >
                        <span className={`h-4 w-4 rounded-full text-[10px] flex items-center justify-center font-bold ${step === s.n ? 'bg-white/20' : step > s.n ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-100 text-zinc-300'}`}>{s.n}</span>
                        {s.label}
                    </button>
                ))}
            </div>

            {step === 1 && (
                <div className="card-premium p-6">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" /> Select Date
                    </h2>
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={d => d < new Date()}
                        className="mx-auto"
                    />
                    <Button className="w-full mt-4 h-11 rounded-xl" disabled={!date} onClick={() => setStep(2)}>
                        Continue <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="card-premium p-6">
                    <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <Clock className="h-5 w-5" /> Select Time
                    </h2>
                    <p className="text-sm text-zinc-400 mb-4">{date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(t => {
                            const booked = date && isSlotBooked(date.toISOString().split('T')[0], t);
                            return (
                                <button
                                    key={t}
                                    onClick={() => !booked && setSlot(t)}
                                    disabled={booked}
                                    className={`h-10 rounded-xl text-sm font-semibold transition-all ${booked ? 'bg-zinc-100 text-zinc-300 cursor-not-allowed' :
                                            slot === t ? 'bg-zinc-900 text-white shadow-sm' : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                                        }`}
                                >
                                    {booked ? '—' : t}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-zinc-400 mt-2">Grayed slots are already booked</p>
                    <div className="flex gap-3 mt-5">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>Back</Button>
                        <Button className="flex-1 rounded-xl" disabled={!slot} onClick={() => setStep(3)}>
                            Continue <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="card-premium p-6 space-y-5">
                    <h2 className="font-bold text-lg">Confirm Booking</h2>
                    <div className="bg-zinc-50 rounded-xl p-4 space-y-2.5">
                        {[
                            { label: 'Service', value: service?.name },
                            { label: 'Provider', value: provider?.business_name },
                            { label: 'Date', value: date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) },
                            { label: 'Time', value: slot },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between text-sm">
                                <span className="text-zinc-400">{label}</span>
                                <span className="font-semibold text-zinc-900">{value}</span>
                            </div>
                        ))}
                        <div className="flex justify-between text-sm pt-2 border-t border-zinc-200">
                            <span className="font-semibold text-zinc-600">Total</span>
                            <span className="font-black text-zinc-900">${totalPrice}</span>
                        </div>
                    </div>
                    {variants.filter(v => v.type === 'addon').length > 0 && (
                        <div>
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Add-ons</label>
                            <div className="space-y-2">
                                {variants.filter(v => v.type === 'addon').map(v => {
                                    const sel = selectedAddons.some(a => a.id === v.id);
                                    return (
                                        <button key={v.id} onClick={() => toggleAddon(v)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${sel ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                                            <div className="text-left">
                                                <p className="font-medium">{v.name}</p>
                                                {v.description && <p className="text-xs text-zinc-400">{v.description}</p>}
                                                {v.duration_modifier > 0 && <p className="text-xs text-zinc-400">+{v.duration_modifier} min</p>}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {v.price_modifier > 0 && <span className="text-xs font-bold text-zinc-900">+${v.price_modifier}</span>}
                                                {sel && <CheckCircle className="h-4 w-4 text-zinc-900" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Notes (optional)</label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Any special requests or instructions..."
                            className="resize-none rounded-xl border-zinc-200 text-sm"
                            rows={3}
                        />
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(2)}>Back</Button>
                        <Button
                            className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800"
                            onClick={handleBook}
                            disabled={submitting}
                        >
                            {submitting ? 'Booking...' : `Confirm $${totalPrice}`}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}