import { useState, useEffect } from 'react';
import { notificationService } from '@/lib/platform/notificationService';
import { Bell, CheckCheck, ExternalLink, AlertCircle, CalendarCheck, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TYPE_ICON = {
    booking_confirmed: CalendarCheck,
    booking_cancelled: AlertCircle,
    booking_reminder: Bell,
    new_review: Star,
    provider_approved: Zap,
    provider_rejected: AlertCircle,
    system_alert: AlertCircle,
    automation_triggered: Zap,
    default: Bell,
};

const PRIORITY_BADGE = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    normal: 'bg-zinc-100 text-zinc-600',
    low: 'bg-zinc-50 text-zinc-400',
};

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        setLoading(false);
    }, []);

    const loadNotifications = async (_email) => {
        setNotifications([]);
        setLoading(false);
    };

    const markRead = async (id) => {
        await notificationService.markRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const markAllRead = async () => {
        await notificationService.markAllRead(userEmail);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const filtered = filter === 'unread' ? notifications.filter(n => !n.is_read) : notifications;
    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) return (
        <div className="max-w-2xl mx-auto space-y-3 pb-24">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="card-premium h-20 skeleton-wave" />)}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto pb-24 md:pb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-inter font-black text-2xl">Notifications</h1>
                    {unreadCount > 0 && <p className="text-zinc-500 text-sm mt-0.5">{unreadCount} unread</p>}
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={markAllRead}>
                        <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                    </Button>
                )}
            </div>

            <div className="flex gap-1 mb-4">
                {['all', 'unread'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 h-8 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500 hover:text-zinc-900'}`}>
                        {f} {f === 'unread' && unreadCount > 0 && `(${unreadCount})`}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="card-premium p-16 text-center">
                    <Bell className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                    <h3 className="font-semibold text-zinc-700 mb-1">You're all caught up!</h3>
                    <p className="text-zinc-400 text-sm">No {filter === 'unread' ? 'unread ' : ''}notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map(n => {
                        const Icon = TYPE_ICON[n.type] || TYPE_ICON.default;
                        return (
                            <div
                                key={n.id}
                                className={`card-premium p-4 flex items-start gap-3 cursor-pointer transition-all ${!n.is_read ? 'border-l-4 border-l-zinc-900' : ''}`}
                                onClick={() => !n.is_read && markRead(n.id)}
                            >
                                <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${n.is_read ? 'bg-zinc-100' : 'bg-zinc-900'}`}>
                                    <Icon className={`h-4 w-4 ${n.is_read ? 'text-zinc-500' : 'text-white'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm font-semibold ${n.is_read ? 'text-zinc-600' : 'text-zinc-900'}`}>{n.title}</p>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[n.priority] || PRIORITY_BADGE.normal}`}>
                                                {n.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{n.body}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[11px] text-zinc-400">
                                            {new Date(n.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {n.action_url && (
                                            <Link to={n.action_url} className="flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900">
                                                View <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}