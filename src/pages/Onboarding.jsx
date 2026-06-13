import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Briefcase, ArrowRight, Cpu, CheckCircle, Star, Shield, Zap, Globe } from 'lucide-react';

const CUSTOMER_PERKS = [
    'AI-powered service recommendations by Simon',
    'Real-time neighborhood demand intelligence',
    'Group bundle deals — save up to 35%',
    'Instant booking with verified providers',
    'Predictive maintenance scheduling',
];

const PROVIDER_PERKS = [
    'AI Copilot to manage bookings & revenue',
    'Intelligent customer matching & routing',
    'Automated scheduling & calendar sync',
    'Real-time earnings analytics dashboard',
    'Priority placement in neighborhood searches',
];

export default function Onboarding() {
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const confirm = async () => {
        if (!selected) return;
        setLoading(true);
        navigate(selected === 'provider' ? '/provider' : '/');
    };

    return (
        <div className="min-h-screen bg-black font-inter flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
            }} />

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-5"
                style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />

            <div className="relative z-10 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Cpu className="h-5 w-5 text-white/40" />
                        <span className="text-white/40 text-xs tracking-[0.25em] uppercase font-mono-premium">Simon AI · Welcome</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                        How will you use<br />Truvornex?
                    </h1>
                    <p className="text-white/40 text-base">Simon will personalize your entire experience based on your role.</p>
                </div>

                {/* Role selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {/* Customer */}
                    <button onClick={() => setSelected('customer')}
                        className={`relative border rounded-2xl p-6 text-left transition-all focus:outline-none group overflow-hidden ${selected === 'customer'
                                ? 'border-white bg-white text-zinc-900'
                                : 'border-white/10 bg-white/3 hover:border-white/25 text-white'
                            }`}>
                        {selected === 'customer' && (
                            <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-zinc-900" />
                        )}
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${selected === 'customer' ? 'bg-zinc-900' : 'bg-white/8'}`}>
                            <User className={`h-6 w-6 ${selected === 'customer' ? 'text-white' : 'text-white/70'}`} />
                        </div>
                        <h2 className="font-display font-bold text-xl mb-1">Customer</h2>
                        <p className={`text-sm mb-4 ${selected === 'customer' ? 'text-zinc-500' : 'text-white/40'}`}>
                            Book local services with AI guidance
                        </p>
                        <ul className="space-y-1.5">
                            {CUSTOMER_PERKS.map((perk, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs">
                                    <Star className={`h-3 w-3 mt-0.5 shrink-0 ${selected === 'customer' ? 'text-zinc-400' : 'text-white/30'}`} />
                                    <span className={selected === 'customer' ? 'text-zinc-600' : 'text-white/40'}>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </button>

                    {/* Provider */}
                    <button onClick={() => setSelected('provider')}
                        className={`relative border rounded-2xl p-6 text-left transition-all focus:outline-none group overflow-hidden ${selected === 'provider'
                                ? 'border-white bg-white text-zinc-900'
                                : 'border-white/10 bg-white/3 hover:border-white/25 text-white'
                            }`}>
                        {selected === 'provider' && (
                            <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-zinc-900" />
                        )}
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${selected === 'provider' ? 'bg-zinc-900' : 'bg-white/8'}`}>
                            <Briefcase className={`h-6 w-6 ${selected === 'provider' ? 'text-white' : 'text-white/70'}`} />
                        </div>
                        <h2 className="font-display font-bold text-xl mb-1">Provider</h2>
                        <p className={`text-sm mb-4 ${selected === 'provider' ? 'text-zinc-500' : 'text-white/40'}`}>
                            Offer services, managed by AI
                        </p>
                        <ul className="space-y-1.5">
                            {PROVIDER_PERKS.map((perk, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs">
                                    <Zap className={`h-3 w-3 mt-0.5 shrink-0 ${selected === 'provider' ? 'text-zinc-400' : 'text-white/30'}`} />
                                    <span className={selected === 'provider' ? 'text-zinc-600' : 'text-white/40'}>{perk}</span>
                                </li>
                            ))}
                        </ul>
                    </button>
                </div>

                <Button
                    className={`w-full h-12 text-base font-semibold rounded-xl transition-all ${selected ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-white/10 text-white/30 cursor-not-allowed'
                        }`}
                    disabled={!selected || loading}
                    onClick={confirm}
                >
                    {loading ? (
                        <span className="flex items-center gap-2"><Cpu className="h-4 w-4 animate-spin" /> Simon is setting up your experience…</span>
                    ) : (
                        <span className="flex items-center gap-2">Continue to Truvornex <ArrowRight className="h-4 w-4" /></span>
                    )}
                </Button>

                <div className="flex items-center justify-center gap-4 mt-5 text-xs text-white/20">
                    <div className="flex items-center gap-1"><Shield className="h-3 w-3" /> Secure & private</div>
                    <div className="flex items-center gap-1"><Globe className="h-3 w-3" /> Switch roles anytime</div>
                    <div className="flex items-center gap-1"><Cpu className="h-3 w-3" /> Powered by Simon AI</div>
                </div>
            </div>
        </div>
    );
}