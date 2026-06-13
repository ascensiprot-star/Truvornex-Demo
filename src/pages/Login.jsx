import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Eye, EyeOff, Zap, ArrowRight, Loader2, CheckCircle, Sparkles, Shield, Clock, Star } from 'lucide-react';

const FEATURES = [
    { icon: Zap, title: '2,400+ Verified Providers', desc: 'Trusted professionals in your neighborhood' },
    { icon: Shield, title: 'AI-Powered Matching', desc: 'Simon finds the perfect provider for every job' },
    { icon: Clock, title: 'Book in 60 Seconds', desc: 'Instant booking with real-time availability' },
    { icon: Star, title: '4.9★ Average Rating', desc: '98% satisfaction across 15,000+ bookings' },
];

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { setError(''); setSuccess(''); }, [tab]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (tab === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate(from, { replace: true });
            } else {
                if (!fullName.trim()) { setError('Please enter your full name.'); setLoading(false); return; }
                const { error } = await supabase.auth.signUp({
                    email, password,
                    options: { data: { full_name: fullName } },
                });
                if (error) throw error;
                setSuccess('Account created! Check your email to confirm your address, then sign in.');
                setTab('login');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}${from}` },
        });
        if (error) { setError(error.message); setGoogleLoading(false); }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
            {/* Left panel — branding (desktop only) */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(135deg, #0f0f18 0%, #12131a 40%, #1a1030 100%)' }}>
                {/* Glow orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, #7c6fcd 0%, transparent 70%)', filter: 'blur(60px)' }} />
                    <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full opacity-15"
                        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', filter: 'blur(50px)' }} />
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(124,111,205,0.2)', border: '1px solid rgba(124,111,205,0.3)' }}>
                            <Zap className="h-5 w-5" style={{ color: '#7c6fcd' }} />
                        </div>
                        <div>
                            <div className="font-bold text-lg tracking-tight text-white">TRUVORNEX</div>
                            <div className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Service Platform</div>
                        </div>
                    </div>

                    <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
                        Every service,<br />
                        <span style={{ color: '#7c6fcd' }}>at your fingertips.</span>
                    </h1>
                    <p className="text-lg leading-relaxed mb-12" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Connect with trusted, verified service providers in your neighborhood — powered by Simon AI.
                    </p>

                    <div className="space-y-4">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="flex items-center gap-4 p-4 rounded-2xl"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: 'rgba(124,111,205,0.15)', border: '1px solid rgba(124,111,205,0.2)' }}>
                                    <Icon className="h-5 w-5" style={{ color: '#7c6fcd' }} />
                                </div>
                                <div>
                                    <div className="font-semibold text-sm text-white">{title}</div>
                                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Simon AI · Online · Powered by DeepSeek
                    </span>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'rgba(124,111,205,0.15)', border: '1px solid rgba(124,111,205,0.3)' }}>
                            <Zap className="h-4 w-4" style={{ color: '#7c6fcd' }} />
                        </div>
                        <span className="font-bold tracking-tight" style={{ color: 'var(--color-primary)' }}>TRUVORNEX</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black tracking-tight mb-2" style={{ color: 'var(--color-primary)' }}>
                            {tab === 'login' ? 'Welcome back' : 'Create account'}
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            {tab === 'login'
                                ? 'Sign in to access your services and Simon AI'
                                : 'Join 2,400+ users on Truvornex today'}
                        </p>
                    </div>

                    {/* Tab toggle */}
                    <div className="flex rounded-xl p-1 mb-8 gap-1"
                        style={{ background: 'var(--color-surface-high)' }}>
                        {['login', 'signup'].map(t => (
                            <button key={t} onClick={() => setTab(t)}
                                className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
                                style={tab === t
                                    ? { background: 'var(--color-surface)', color: 'var(--color-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }
                                    : { color: 'var(--color-text-subtle)' }}>
                                {t === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    {/* Success message */}
                    {success && (
                        <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
                            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
                            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-success)' }} />
                            <p className="text-sm" style={{ color: 'var(--color-success)' }}>{success}</p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="p-4 rounded-xl mb-6 text-sm"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--color-error)' }}>
                            {error}
                        </div>
                    )}

                    {/* Google OAuth */}
                    <button onClick={handleGoogle} disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold mb-6 transition-all hover:opacity-80 disabled:opacity-50"
                        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', color: 'var(--color-primary)' }}>
                        {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                        <span className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>or with email</span>
                        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tab === 'signup' && (
                            <div>
                                <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
                                    style={{ color: 'var(--color-text-muted)' }}>Full Name</label>
                                <input
                                    type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                                    placeholder="Alex Johnson" required={tab === 'signup'}
                                    className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', color: 'var(--color-primary)' }}
                                    onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--color-border-strong)'}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
                                style={{ color: 'var(--color-text-muted)' }}>Email</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com" required
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', color: 'var(--color-primary)' }}
                                onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                                onBlur={e => e.target.style.borderColor = 'var(--color-border-strong)'}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1.5 tracking-wide uppercase"
                                style={{ color: 'var(--color-text-muted)' }}>Password</label>
                            <div className="relative">
                                <input
                                    type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder={tab === 'signup' ? 'Min. 8 characters' : '••••••••'} required minLength={6}
                                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm transition-all outline-none"
                                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', color: 'var(--color-primary)' }}
                                    onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
                                    onBlur={e => e.target.style.borderColor = 'var(--color-border-strong)'}
                                />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                                    style={{ color: 'var(--color-text-subtle)' }}>
                                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {tab === 'login' && (
                            <div className="text-right">
                                <button type="button" className="text-xs font-medium transition-colors"
                                    style={{ color: 'var(--color-accent)' }}>
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                                <>
                                    {tab === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs mt-6" style={{ color: 'var(--color-text-subtle)' }}>
                        {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
                            className="font-semibold transition-colors" style={{ color: 'var(--color-accent)' }}>
                            {tab === 'login' ? 'Sign up free' : 'Sign in'}
                        </button>
                    </p>

                    <p className="text-center text-[10px] mt-8 leading-relaxed" style={{ color: 'var(--color-text-subtle)' }}>
                        By continuing you agree to our Terms of Service and Privacy Policy.
                        <br />Powered by Simon AI · Truvornex © 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
