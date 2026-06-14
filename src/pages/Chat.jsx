import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, Loader2, Users, Send, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Chat() {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selected, setSelected] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState('');
    const bottomRef = useRef(null);
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const directProviderId = params.get('provider_id');
    const directCustomerEmail = params.get('customer_email');

    useEffect(() => {
        const u = null;
        const msgs = [];
        const provs = [];
        if (u) {
            setUser(u);
            const role = u.user_type || 'customer';

            if (role === 'provider') {
                if (!provs[0]) { setLoading(false); return; }
                const byCustomer = {};
                msgs.forEach(m => {
                    if (!byCustomer[m.customer_email]) byCustomer[m.customer_email] = { provider_id: provs[0].id, customer_email: m.customer_email, last_text: '', unread: 0 };
                    if (!byCustomer[m.customer_email].last_text) byCustomer[m.customer_email].last_text = m.text;
                    if (!m.is_read && m.sender_role === 'customer') byCustomer[m.customer_email].unread++;
                });
                const convos = Object.values(byCustomer);
                setConversations(convos);
                if (directCustomerEmail) {
                    const match = byCustomer[directCustomerEmail] || { provider_id: provs[0].id, customer_email: directCustomerEmail, last_text: '', unread: 0 };
                    setSelected(match);
                } else if (convos.length) setSelected(convos[0]);
            } else {
                const byProvider = {};
                msgs.forEach(m => {
                    if (!byProvider[m.provider_id]) byProvider[m.provider_id] = { provider_id: m.provider_id, customer_email: u.email, last_text: '', unread: 0 };
                    if (!byProvider[m.provider_id].last_text) byProvider[m.provider_id].last_text = m.text;
                    if (!m.is_read && m.sender_role === 'provider') byProvider[m.provider_id].unread++;
                });
                const convos = Object.values(byProvider);
                setConversations(convos);
                if (directProviderId) {
                    const match = byProvider[directProviderId] || { provider_id: directProviderId, customer_email: u.email, last_text: '', unread: 0 };
                    setSelected(match);
                } else if (convos.length) setSelected(convos[0]);
            }
            setLoading(false);
        }
        setLoading(false);
    }, []);

    // Load messages when selected changes
    useEffect(() => {
        if (!selected) return;
        setMsgLoading(true);
        setMessages([]);
        setMsgLoading(false);
    }, [selected?.provider_id, selected?.customer_email]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const send = async () => {
        const trimmed = text.trim();
        if (!trimmed || sending || !selected || !user) return;
        setSending(true);
        setText('');
        const role = user.user_type || 'customer';
        const _msgData = {
            provider_id: selected.provider_id,
            customer_email: selected.customer_email,
            sender_email: user.email,
            sender_role: role,
            text: trimmed,
            is_read: false,
        };
        setMessages(prev => [...prev, { id: Date.now(), ..._msgData }]);
        setSending(false);
    };

    const filteredConvos = conversations.filter(c => {
        const label = user?.user_type === 'provider' ? c.customer_email : `Provider ${c.provider_id?.slice(-6)}`;
        return !search || label.toLowerCase().includes(search.toLowerCase());
    });

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>;
    if (!user) return <p className="text-center py-20 text-zinc-400">Please log in to use chat.</p>;

    const role = user.user_type || 'customer';

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-display font-bold text-2xl tracking-tight mb-5 flex items-center gap-2">
                <MessageCircle className="h-6 w-6" /> Messages
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ height: '72vh' }}>
                {/* Sidebar */}
                <div className="md:col-span-1 border border-border rounded-2xl overflow-hidden bg-card flex flex-col">
                    <div className="p-3 border-b border-border shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="pl-8 h-8 rounded-xl text-xs" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredConvos.length === 0 ? (
                            <div className="p-8 text-center">
                                <Users className="h-7 w-7 text-zinc-300 mx-auto mb-2" />
                                <p className="text-xs text-zinc-400">No conversations yet</p>
                                {role === 'customer' && <p className="text-xs text-zinc-400 mt-1">Start by booking a service</p>}
                            </div>
                        ) : filteredConvos.map((c, i) => {
                            const label = role === 'customer' ? `Provider ${c.provider_id?.slice(-6)}` : c.customer_email;
                            const isActive = selected?.provider_id === c.provider_id && selected?.customer_email === c.customer_email;
                            return (
                                <button key={i} onClick={() => setSelected(c)}
                                    className={`w-full text-left p-3.5 border-b border-border/50 hover:bg-muted/40 transition-colors ${isActive ? 'bg-muted' : ''}`}>
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 text-xs font-bold shrink-0">
                                                {label.charAt(0).toUpperCase()}
                                            </div>
                                            <p className="text-xs font-semibold truncate max-w-[110px]">{label}</p>
                                        </div>
                                        {c.unread > 0 && (
                                            <span className="h-5 w-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold flex items-center justify-center shrink-0">{c.unread}</span>
                                        )}
                                    </div>
                                    {c.last_text && <p className="text-[11px] text-zinc-400 truncate pl-10">{c.last_text}</p>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat area */}
                <div className="md:col-span-2 flex flex-col border border-border rounded-2xl overflow-hidden bg-card">
                    {selected ? (
                        <>
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
                                <div className="h-8 w-8 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 text-xs font-bold">
                                    {(role === 'customer' ? 'P' : selected.customer_email?.charAt(0) || 'C').toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{role === 'customer' ? `Provider ${selected.provider_id?.slice(-6)}` : selected.customer_email}</p>
                                    <p className="text-xs text-zinc-400">Active now</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                                {msgLoading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-zinc-300" /></div>
                                ) : messages.length === 0 ? (
                                    <p className="text-center text-sm text-zinc-400 py-8">No messages yet. Start the conversation.</p>
                                ) : messages.map(msg => {
                                    const isMe = msg.sender_email === user.email;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-br-sm'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
                                                }`}>
                                                {msg.text}
                                                <div className={`text-[10px] mt-1 ${isMe ? 'text-white/50 dark:text-zinc-500' : 'text-zinc-400'}`}>
                                                    {new Date(msg.created_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            <div className="px-4 py-3 border-t border-border shrink-0">
                                <div className="flex gap-2">
                                    <Input
                                        value={text}
                                        onChange={e => setText(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                                        placeholder="Type a message…"
                                        className="rounded-xl flex-1 text-sm"
                                        disabled={sending}
                                    />
                                    <Button onClick={send} disabled={!text.trim() || sending}
                                        className="h-9 w-9 rounded-xl p-0 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 shrink-0">
                                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageCircle className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                                <p className="text-sm text-zinc-400">Select a conversation</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}