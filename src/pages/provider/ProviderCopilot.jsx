import { useState, useEffect, useRef, useMemo } from 'react';
import { computeTrustScore, optimizeSchedule, predictRepeatBookings, TRUST_TIER_STYLE } from '@/lib/ai/engine';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Sparkles, Loader2, TrendingUp, CalendarDays, DollarSign, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { format, subDays, startOfMonth } from 'date-fns';

const QUICK_PROMPTS = [
    'What should I prioritize today to maximize earnings?',
    'How can I improve my trust score?',
    'Which time slots get the most bookings?',
    'How am I performing compared to last month?',
    'Give me tips to reduce cancellations.',
    'What services should I add to grow revenue?',
];

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${isUser ? 'bg-zinc-900' : 'bg-gradient-to-br from-indigo-500 to-violet-600'}`}>
                {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'bg-zinc-900 text-white rounded-tr-sm' : 'bg-white border border-zinc-100 text-zinc-800 shadow-premium rounded-tl-sm'
                }`}>
                {isUser ? <p>{msg.content}</p> : (
                    <ReactMarkdown className="prose prose-sm prose-zinc max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    );
}

export default function ProviderCopilot() {
    const [provider, setProvider] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const bottomRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            const provs = [];
            const bks = [];
            if (provs.length > 0) {
                setProvider(provs[0]);
                setBookings(bks.filter(b => b.provider_id === provs[0].id));
            }
            setDataLoading(false);
        };
        load().catch(() => setDataLoading(false));
    }, []);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

    const metrics = useMemo(() => {
        if (!provider) return null;
        const trust = computeTrustScore(provider, bookings);
        const { schedule, suggestions } = optimizeSchedule(bookings);
        const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const monthRevenue = bookings.filter(b => b.status === 'completed' && b.date >= monthStart).reduce((s, b) => s + (b.price || 0), 0);
        const totalRevenue = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);
        const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
        const weekBookings = bookings.filter(b => b.date >= weekAgo).length;
        return { trust, schedule: schedule.slice(0, 5), suggestions, monthRevenue, totalRevenue, weekBookings };
    }, [provider, bookings]);

    const buildSystemPrompt = () => {
        if (!provider || !metrics) return '';
        const ts = metrics.trust;
        return `You are the AI Business Copilot for ${provider.business_name} on ServiceFlow.

Provider profile:
- Business: ${provider.business_name}
- Rating: ${provider.rating?.toFixed(1) || 'N/A'}/5.0 (${provider.review_count || 0} reviews)
- Verified: ${provider.verified ? 'Yes' : 'No'}
- Auto-confirm: ${provider.auto_confirm ? 'Yes' : 'No'}

Performance metrics:
- Trust score: ${ts.score}/100 (${ts.label} tier)
- Completion rate: ${ts.completionRate}%
- Total bookings: ${ts.total} (${ts.completed} completed, ${ts.cancelled} cancelled, ${ts.noShows} no-shows)
- Revenue this month: $${metrics.monthRevenue.toFixed(0)}
- Revenue all time: $${metrics.totalRevenue.toFixed(0)}
- Bookings this week: ${metrics.weekBookings}

Upcoming schedule (next ${metrics.schedule.length} jobs):
${metrics.schedule.map(b => `- ${b.service_name} on ${b.date} at ${b.time_slot} (${b.status})`).join('\n') || '- No upcoming bookings'}

Schedule optimization suggestions:
${metrics.suggestions.map(s => `- ${s.message}`).join('\n') || '- Schedule looks good!'}

Your role:
- Help this provider grow their business on the platform
- Give specific, actionable advice on earnings, scheduling, and ratings
- Flag any concerns in their metrics
- Suggest ways to improve their trust score
- Be direct, specific, and practical — no generic advice
- Use markdown formatting for clarity`;
    };

    const send = async (text) => {
        const content = text || input.trim();
        if (!content || loading) return;
        setInput('');
        const updated = [...messages, { role: 'user', content }];
        setMessages(updated);
        setLoading(true);
        const history = updated.map(m => `${m.role === 'user' ? 'Provider' : 'Copilot'}: ${m.content}`).join('\n\n');
        try {
            const response = `**Demo Mode** — AI backend not configured. Please set up Supabase and an AI provider.\n\n**Your message:** ${content}`;
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection issue. Please try again.' }]);
        }
        setLoading(false);
    };

    if (dataLoading) return (
        <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
        </div>
    );

    if (!provider) return (
        <div className="max-w-lg">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800">
                Set up your provider profile first to access the AI Copilot.
            </div>
        </div>
    );

    const ts = metrics?.trust;
    const tierStyle = TRUST_TIER_STYLE[ts?.tier] || TRUST_TIER_STYLE.new;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 h-[calc(100vh-8rem)] max-h-[760px]">
            {/* Sidebar: metrics */}
            <div className="space-y-4 overflow-y-auto lg:max-h-full">
                {/* Trust score */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Trust Score</p>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="text-4xl font-black">{ts?.score}</div>
                        <div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${tierStyle.bg} ${tierStyle.text} ${tierStyle.border}`}>
                                {ts?.label}
                            </span>
                        </div>
                    </div>
                    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden mb-3">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${ts?.score}%` }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        {[['Completion', `${ts?.completionRate}%`], ['Bookings', ts?.total], ['Rating', `${provider.rating?.toFixed(1) || '—'}`]].map(([l, v]) => (
                            <div key={l} className="bg-zinc-50 rounded-xl p-2">
                                <p className="text-base font-black">{v}</p>
                                <p className="text-[10px] text-zinc-400 font-medium">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Earnings */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Earnings</p>
                    <div className="space-y-2">
                        {[['This Month', `$${metrics?.monthRevenue.toFixed(0)}`], ['All Time', `$${metrics?.totalRevenue.toFixed(0)}`], ['This Week', `${metrics?.weekBookings} jobs`]].map(([l, v]) => (
                            <div key={l} className="flex items-center justify-between">
                                <span className="text-xs text-zinc-400">{l}</span>
                                <span className="text-sm font-bold">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule suggestions */}
                {metrics?.suggestions.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                        <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertTriangle className="h-3.5 w-3.5" /> Schedule Tips
                        </p>
                        {metrics.suggestions.map((s, i) => (
                            <p key={i} className="text-xs text-amber-800 mb-1.5">{s.message}</p>
                        ))}
                    </div>
                )}

                {/* Quick prompts */}
                <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-premium">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Quick Ask</p>
                    <div className="space-y-1.5">
                        {QUICK_PROMPTS.slice(0, 4).map(p => (
                            <button key={p} onClick={() => send(p)}
                                className="w-full text-left text-xs text-zinc-600 hover:text-zinc-900 py-1.5 px-2.5 rounded-lg hover:bg-zinc-50 transition-colors flex items-center gap-2">
                                <ArrowRight className="h-3 w-3 text-zinc-300 shrink-0" />
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chat area */}
            <div className="flex flex-col min-h-0">
                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-inter font-black text-xl tracking-tight">Provider Copilot</h1>
                        <p className="text-zinc-400 text-xs">Personalized AI advice for {provider.business_name}</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                    {messages.length === 0 && (
                        <div className="text-center pt-8">
                            <Bot className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                            <p className="text-zinc-400 text-sm">Ask me anything about your business performance, schedule, or growth strategy.</p>
                        </div>
                    )}
                    {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                    {loading && (
                        <div className="flex gap-3 items-center">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white border border-zinc-100 rounded-2xl px-4 py-3 shadow-premium">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div className="shrink-0 pt-3">
                    <div className="glass rounded-2xl p-2 shadow-float">
                        <div className="flex items-center gap-2">
                            <input type="text" placeholder="Ask about earnings, schedule, growth…"
                                className="flex-1 h-10 px-3 bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none"
                                value={input} onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && send()} />
                            <Button onClick={() => send()} disabled={!input.trim() || loading}
                                className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 p-0">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}