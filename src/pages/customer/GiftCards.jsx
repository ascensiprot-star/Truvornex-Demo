import { useState } from 'react';
import { Gift, Send, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AMOUNTS = [25, 50, 100, 150, 200, 500];

export default function GiftCards() {
    const [tab, setTab] = useState('send');
    const [amount, setAmount] = useState(50);
    const [customAmount, setCustomAmount] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [redeemCode, setRedeemCode] = useState('');
    const [sending, setSending] = useState(false);

    const selectedAmount = customAmount ? Number(customAmount) : amount;

    const sendGift = async () => {
        if (!recipientEmail || !selectedAmount) { toast.error('Email and amount required'); return; }
        setSending(true);
        await new Promise(r => setTimeout(r, 1000));
        setSending(false);
        toast.success(`Gift card sent to ${recipientEmail}!`);
        setRecipientEmail(''); setRecipientName(''); setMessage('');
    };

    const redeem = () => {
        if (!redeemCode) { toast.error('Enter a gift card code'); return; }
        toast.success('Gift card redeemed! $50 added to your account credits.');
        setRedeemCode('');
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h1 className="font-display font-bold text-3xl tracking-tight">Gift Cards</h1>
                <p className="text-zinc-500 text-sm mt-1">Give the gift of great service</p>
            </div>

            <div className="glass rounded-2xl p-1.5 flex gap-1">
                {[['send', 'Send Gift Card'], ['redeem', 'Redeem Code']].map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex-1 h-9 rounded-xl text-xs font-semibold transition-all ${tab === key ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'send' && (
                <div className="space-y-5">
                    <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-8 text-white">
                        <Gift className="h-8 w-8 mb-4 text-zinc-300" />
                        <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Gift Card Value</p>
                        <p className="font-black text-5xl">${selectedAmount}</p>
                        <p className="text-zinc-400 text-sm mt-2">Truvornex Services Gift Card</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Select Amount</p>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            {AMOUNTS.map(a => (
                                <button key={a} onClick={() => { setAmount(a); setCustomAmount(''); }}
                                    className={`h-10 rounded-xl text-sm font-bold border transition-all ${amount === a && !customAmount ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}>
                                    ${a}
                                </button>
                            ))}
                        </div>
                        <Input placeholder="Custom amount" type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="rounded-xl" />
                    </div>

                    <div className="space-y-3">
                        <Input placeholder="Recipient email *" type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} className="rounded-xl" />
                        <Input placeholder="Recipient name (optional)" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="rounded-xl" />
                        <textarea placeholder="Personal message (optional)" value={message} onChange={e => setMessage(e.target.value)} className="w-full border border-input rounded-xl px-3 py-2 text-sm resize-none bg-transparent" rows={3} />
                    </div>

                    <Button className="w-full h-11 rounded-xl gap-2" onClick={sendGift} disabled={sending}>
                        <Send className="h-4 w-4" /> {sending ? 'Sending…' : `Send $${selectedAmount} Gift Card`}
                    </Button>
                </div>
            )}

            {tab === 'redeem' && (
                <div className="space-y-4">
                    <div className="card-premium p-6 text-center">
                        <CreditCard className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
                        <h2 className="font-bold text-lg mb-2">Redeem a Gift Card</h2>
                        <p className="text-zinc-500 text-sm">Enter your gift card code below to add credits to your account</p>
                    </div>
                    <Input placeholder="Gift card code (e.g. TRV-XXXX-XXXX)" value={redeemCode} onChange={e => setRedeemCode(e.target.value.toUpperCase())} className="rounded-xl font-mono text-center text-lg h-12" />
                    <Button className="w-full h-11 rounded-xl" onClick={redeem}>Redeem Gift Card</Button>
                </div>
            )}
        </div>
    );
}