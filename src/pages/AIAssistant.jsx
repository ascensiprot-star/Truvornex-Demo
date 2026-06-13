import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { predictRepeatBookings } from '@/lib/ai/engine';
import {
    Send, Sparkles, User, Loader2, MapPin, CalendarDays,
    Zap, TrendingUp, Search, Clock, ArrowRight, Cpu, RefreshCw,
    Lightbulb, BarChart2, ShieldCheck, Package, MessageSquare, Mic
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
    { icon: Search, label: 'Best provider near me', prompt: 'Which providers should I book? Show me the best options near me with ratings and availability.' },
    { icon: TrendingUp, label: 'What to book this month', prompt: 'Based on the season and my area, what services should I be booking this month? Be specific.' },
    { icon: CalendarDays, label: 'Schedule recurring cleaning', prompt: 'Help me set up a recurring house cleaning schedule. What would you recommend for my area?' },
    { icon: Zap, label: 'Urgent service needed', prompt: 'I need urgent help — what providers can come quickest? Show availability.' },
    { icon: MapPin, label: "Trending in my area", prompt: 'What services are most in demand in my neighborhood right now? Show demand data.' },
    { icon: Clock, label: 'Predict my next booking', prompt: 'Based on my booking history, when do you think I will need my next service and what will it be?' },
    { icon: Lightbulb, label: 'AI home maintenance plan', prompt: 'Create a complete AI-powered home maintenance plan for the next 3 months based on my area and season.' },
    { icon: BarChart2, label: 'Neighborhood service gaps', prompt: 'What service gaps exist in my neighborhood? Where is demand high but supply low?' },
    { icon: ShieldCheck, label: 'Best verified providers', prompt: 'Who are the most trusted and verified providers on the platform? Show me their ratings and reviews.' },
    { icon: Package, label: 'Bundle deals available', prompt: 'What bundle deals are currently forming? How much can I save by joining a group booking?' },
    { icon: MessageSquare, label: 'Complaint resolution', prompt: 'I had an issue with a recent booking. How can I resolve it and what are my options?' },
    { icon: Cpu, label: 'Optimize my schedule', prompt: 'Analyze my booking patterns and suggest how to optimize my home service schedule for cost and efficiency.' },
];

const MODES = [
    { id: 'assistant', label: 'Assistant', icon: Cpu, desc: 'General help & recommendations' },
    { id: 'planner', label: 'Planner', icon: CalendarDays, desc: 'Schedule & recurring services' },
    { id: 'analyst', label: 'Analyst', icon: BarChart2, desc: 'Neighborhood insights & trends' },
    { id: 'advisor', label: 'Advisor', icon: Lightbulb, desc: 'Cost optimization & savings' },
];

function TypingIndicator() {
    return (
        <div className="flex gap-3 items-start">
            <div className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0">
                <Cpu className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.8} />
            </div>
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                        <div key={i} className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500"
                            style={{ animation: `simonBounce 1.2s ease-in-out ${i * 0.15}s infinite` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border ${isUser
                    ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'
                }`}>
                {isUser
                    ? <User className="h-3.5 w-3.5 text-white dark:text-zinc-900" strokeWidth={2} />
                    : <Cpu className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-300" strokeWidth={1.8} />
                }
            </div>
            <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-tr-sm'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'
                }`}>
                {isUser ? (
                    <p>{msg.content}</p>
                ) : (
                    <ReactMarkdown className="prose prose-sm prose-zinc dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        {msg.content}
                    </ReactMarkdown>
                )}
                {!isUser && (
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-600 mt-2 font-mono-premium">SIMON · TRUVORNEX</p>
                )}
            </div>
        </div>
    );
}

export default function AIAssistant() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [contextLoaded, setContextLoaded] = useState(false);
    const [context, setContext] = useState({});
    const [mode, setMode] = useState('assistant');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            try {
                const me = null, categories = [], providers = [], bookings = [];
                const userBookings = [];
                const repeatPredictions = predictRepeatBookings(bookings.filter(b => b.status === 'completed'));
                setContext({ me, categories, providers, userBookings, allBookings: bookings, repeatPredictions });
            } catch (_) { }
            setContextLoaded(true);
        };
        load();
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const getModePersonality = () => ({
        assistant: 'You are a helpful, friendly AI assistant focused on connecting users with the right services and providers.',
        planner: 'You are a strategic planning AI. Focus on scheduling, recurring services, calendar optimization, and long-term home maintenance plans.',
        analyst: 'You are a data analyst AI. Focus on neighborhood trends, demand/supply analysis, service gaps, pricing analytics, and market intelligence.',
        advisor: 'You are a financial advisor AI specializing in home services. Focus on cost optimization, bundle deals, savings opportunities, and budget planning.',
    }[mode] || '');

    const buildSystemPrompt = () => {
        const { me, categories, providers, userBookings, allBookings, repeatPredictions } = context;
        const month = new Date().toLocaleString('default', { month: 'long' });
        const pending = allBookings?.filter(b => b.status === 'pending') || [];
        const completed = userBookings?.filter(b => b.status === 'completed') || [];
        return `You are Simon — the AI intelligence engine powering Truvornex, an advanced neighborhood services super-app.
${getModePersonality()}
Mode: ${mode.toUpperCase()} | Month: ${month}
User: ${me?.full_name || 'Guest'} (${me?.email || 'not logged in'})
Booking history (${completed.length} completed): ${completed.slice(0, 10).map(b => `${b.service_name} on ${b.date}`).join(', ') || 'none'}
Predictions: ${repeatPredictions?.slice(0, 5).map(p => `${p.service} in ~${p.daysUntil} days`).join(', ') || 'insufficient data'}
Platform: ${providers?.length || 0} providers, ${pending.length} open requests
Categories: ${categories?.map(c => c.name).join(', ')}
Top providers: ${providers?.slice(0, 8).map(p => `${p.business_name} ⭐${p.rating?.toFixed(1) || 'N/A'}`).join(', ')}
Be precise, data-driven, use markdown formatting. End complex responses with a "Next Step".`;
    };

    const send = async (text) => {
        const content = text || input.trim();
        if (!content || loading) return;
        setInput('');
        const newMsg = { role: 'user', content };
        const updated = [...messages, newMsg];
        setMessages(updated);
        setLoading(true);
        const history = updated.map(m => `${m.role === 'user' ? 'User' : 'Simon'}: ${m.content}`).join('\n\n');
        try {
            const response = `I'm Simon, the Truvornex AI assistant. I'm currently in demo mode — backend AI is not yet configured. Please set up Supabase and an AI provider to enable full responses.\n\n**Your prompt:** ${content}`;
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again in a moment.' }]);
        }
        setLoading(false);
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)] max-h-[900px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center">
                        <Cpu className="h-4 w-4 text-zinc-700 dark:text-zinc-300" strokeWidth={1.8} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="font-mono-premium font-bold text-base tracking-tight text-zinc-900 dark:text-white">Simon AI</h1>
                            <span className="text-[9px] border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md font-mono-premium uppercase tracking-wider">Beta</span>
                            <span className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-500">Online</span>
                            </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono-premium">
                            {MODES.find(m2 => m2.id === mode)?.desc}
                        </p>
                    </div>
                </div>
                {hasMessages && (
                    <button onClick={() => setMessages([])} className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-400 transition-colors">
                        <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                )}
            </div>

            {/* Mode selector */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-0.5 shrink-0">
                {MODES.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${mode === m.id
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200'
                            }`}>
                        <m.icon className="h-3 w-3" strokeWidth={1.8} />{m.label}
                    </button>
                ))}
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5 min-h-0">
                {!hasMessages && (
                    <div className="text-center pt-8 pb-4">
                        <div className="h-14 w-14 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                            <Cpu className="h-6 w-6 text-zinc-500 dark:text-zinc-400" strokeWidth={1.5} />
                        </div>
                        <h2 className="font-mono-premium font-bold text-base text-zinc-900 dark:text-white mb-1">Hello, I'm Simon.</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 text-xs max-w-xs mx-auto mb-5 leading-relaxed">
                            Ask Simon anything about services, providers, or your neighborhood
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto text-left">
                            {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
                                <button key={label} onClick={() => send(prompt)} disabled={!contextLoaded}
                                    className="flex items-center gap-2.5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left group">
                                    <div className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-900 dark:group-hover:bg-white group-hover:border-zinc-900 dark:group-hover:border-white transition-all">
                                        <Icon className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-white dark:group-hover:text-zinc-900 transition-colors" strokeWidth={1.8} />
                                    </div>
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">{label}</span>
                                    <ArrowRight className="h-3 w-3 text-zinc-300 dark:text-zinc-700 ml-auto shrink-0" strokeWidth={1.8} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {loading && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 pt-3">
                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-2 focus-within:ring-1 focus-within:ring-zinc-300 dark:focus-within:ring-zinc-700 transition-all">
                    <button className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors shrink-0">
                        <Mic className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder={contextLoaded ? 'Ask Simon anything…' : 'Loading context…'}
                        className="flex-1 h-9 bg-transparent text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none text-zinc-900 dark:text-zinc-100 font-inter"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                        disabled={!contextLoaded}
                    />
                    <Button
                        onClick={() => send()}
                        disabled={!input.trim() || loading || !contextLoaded}
                        className="h-9 w-9 rounded-lg bg-zinc-900 dark:bg-white hover:opacity-80 p-0 shrink-0"
                    >
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" strokeWidth={2} />}
                    </Button>
                </div>
                <p className="text-center text-[9px] text-zinc-400 dark:text-zinc-600 mt-2 font-mono-premium tracking-widest">SIMON AI · TRUVORNEX INTELLIGENCE ENGINE</p>
            </div>

            <style>{`
        @keyframes simonBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
        </div>
    );
}