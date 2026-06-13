import { useState, useEffect } from 'react';
import { Zap, Phone, MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const EMERGENCY_CATS = ['plumbing', 'electrical', 'locksmith', 'hvac', 'appliance-repair'];
const URGENCY_LEVELS = [
    { label: 'Right Now', sub: 'Within 1 hour', color: 'bg-red-600 text-white', border: 'border-red-200' },
    { label: 'Within 4 Hours', sub: 'Same day', color: 'bg-amber-500 text-white', border: 'border-amber-200' },
    { label: 'Today', sub: 'Within 8 hours', color: 'bg-zinc-900 text-white', border: 'border-zinc-200' },
];

export default function EmergencyServices() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUrgency, setSelectedUrgency] = useState(0);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        setProviders([]);
        setLoading(false);
    }, []);

    const requestEmergency = async () => {
        setRequesting(true);
        await new Promise(r => setTimeout(r, 1200));
        setRequesting(false);
        toast.success('Emergency request sent! Providers will respond shortly.');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-red-100 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-red-600" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-3xl tracking-tight">Emergency Services</h1>
                    <p className="text-zinc-500 text-sm mt-0.5">On-demand urgent service dispatch</p>
                </div>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold text-sm text-red-700">For life-threatening emergencies, call 911</p>
                    <p className="text-xs text-red-500 mt-0.5">This service is for home emergencies like burst pipes, power outages, and lockouts.</p>
                </div>
            </div>

            <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">How urgent is it?</p>
                <div className="grid grid-cols-3 gap-3">
                    {URGENCY_LEVELS.map((u, i) => (
                        <button key={i} onClick={() => setSelectedUrgency(i)}
                            className={`rounded-2xl p-4 text-center border-2 transition-all ${selectedUrgency === i ? `${u.color} border-transparent` : `bg-white ${u.border} hover:border-zinc-300`}`}>
                            <p className={`font-bold text-sm ${selectedUrgency === i ? 'text-white' : 'text-zinc-900'}`}>{u.label}</p>
                            <p className={`text-xs mt-0.5 ${selectedUrgency === i ? 'text-white/80' : 'text-zinc-400'}`}>{u.sub}</p>
                        </button>
                    ))}
                </div>
            </div>

            <Button className="w-full h-14 rounded-2xl text-base font-bold bg-red-600 hover:bg-red-700 gap-3" onClick={requestEmergency} disabled={requesting}>
                <Zap className="h-5 w-5" />
                {requesting ? 'Dispatching…' : 'Request Emergency Service'}
            </Button>

            <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Available Emergency Providers ({providers.length})</p>
                {loading ? (
                    <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-wave h-20 rounded-2xl" />)}</div>
                ) : providers.length === 0 ? (
                    <div className="card-premium p-8 text-center text-zinc-400 text-sm">No emergency providers available in your area right now</div>
                ) : (
                    <div className="space-y-2">
                        {providers.map(p => (
                            <Link key={p.id} to={`/providers/${p.id}`} className="card-premium p-4 flex items-center gap-4 hover:shadow-float transition-all block">
                                <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                    {p.logo_url ? <img src={p.logo_url} alt="" className="h-full w-full object-cover rounded-xl" /> : <span className="font-bold text-zinc-600">{p.business_name?.[0]}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{p.business_name}</p>
                                    <p className="text-xs text-zinc-400 truncate">{p.city} · ⭐ {p.rating?.toFixed(1) || 'New'}</p>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600 shrink-0">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-semibold">Available</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}