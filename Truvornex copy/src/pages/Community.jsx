import { useState, useEffect } from 'react';
import {
    Megaphone, Search, HelpCircle, Briefcase, RefreshCw, Plus, ThumbsUp,
    MessageCircle, ChevronDown, ChevronUp, Send, MapPin,
    MessageSquare, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const POST_TYPES = {
    announcement: { icon: Megaphone, label: 'Announcement', emoji: '📢' },
    lost_found: { icon: Search, label: 'Lost & Found', emoji: '🔍', dashed: true },
    recommendation: { icon: ThumbsUp, label: 'Recommendation', emoji: '👍' },
    question: { icon: HelpCircle, label: 'Question', emoji: '❓' },
    job: { icon: Briefcase, label: 'Job', emoji: '💼' },
    skill_exchange: { icon: RefreshCw, label: 'Skill Swap', emoji: '🔄' },
    general: { icon: MessageCircle, label: 'General', emoji: '💬' },
};

const TABS = [
    { key: 'feed', label: 'Feed' },
    { key: 'jobs', label: 'Jobs Board' },
];

const POST_FILTER_PILLS = ['All', 'Announcement', 'Lost & Found', 'Recommendation', 'Question'];

const EMPTY = { type: 'general', title: '', body: '', neighborhood: '', tags: [], contact_email: '', job_type: '', job_salary: '', skill_offer: '', skill_want: '' };

const JOB_TYPES = { full_time: 'Full-time', part_time: 'Part-time', freelance: 'Contract', gig: 'Freelance' };

function PostCard({ post, onUpvote }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = POST_TYPES[post.type] || POST_TYPES.general;
    const Icon = cfg.icon;
    const isDashed = cfg.dashed;

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-xl p-5 transition-all hover:shadow-sm ${isDashed ? 'border border-dashed border-zinc-300 dark:border-zinc-700' : 'border border-zinc-200 dark:border-zinc-800'
            }`}>
            {/* Author row */}
            <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-white dark:text-zinc-900">
                        {(post.author_name || post.author_email || 'A').charAt(0).toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{post.author_name || post.author_email?.split('@')[0]}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{post.created_date?.slice(0, 10)}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    <Icon className="h-2.5 w-2.5" />
                    {cfg.label}
                </span>
            </div>

            {post.title && <h3 className="font-semibold text-sm text-zinc-900 dark:text-white mb-1.5">{post.title}</h3>}
            <p className={`text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>{post.body}</p>
            {post.body?.length > 200 && (
                <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 mt-1 flex items-center gap-1">
                    {expanded ? <><ChevronUp className="h-3 w-3" /> Less</> : <><ChevronDown className="h-3 w-3" /> Read more</>}
                </button>
            )}

            {post.type === 'skill_exchange' && (
                <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
                    {post.skill_offer && <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-lg">🎓 {post.skill_offer}</span>}
                    <span className="text-zinc-300 dark:text-zinc-700">⇄</span>
                    {post.skill_want && <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-lg">🔍 {post.skill_want}</span>}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                    {post.neighborhood && <><MapPin className="h-2.5 w-2.5" /><span>{post.neighborhood}</span></>}
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => onUpvote(post)} className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                        <ThumbsUp className="h-3 w-3" strokeWidth={1.8} /> {post.upvotes || 0}
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                        <MessageSquare className="h-3 w-3" strokeWidth={1.8} /> {post.reply_count || 0}
                    </button>
                    <button className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">
                        <Share2 className="h-3 w-3" strokeWidth={1.8} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function JobCard({ post }) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center shrink-0 text-sm font-bold text-white dark:text-zinc-900">
                    {(post.author_name || post.author_email || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 dark:text-white line-clamp-1">{post.title}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{post.author_name || post.author_email?.split('@')[0]}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {post.job_type && (
                            <span className="text-[10px] font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-full">
                                {JOB_TYPES[post.job_type] || post.job_type}
                            </span>
                        )}
                        {post.neighborhood && (
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" strokeWidth={1.5} /> {post.neighborhood}
                            </span>
                        )}
                        {post.job_salary && (
                            <span className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">{post.job_salary}</span>
                        )}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mb-2">{post.created_date?.slice(0, 10)}</p>
                    <Button size="sm" variant="outline" className="h-7 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function Community() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [mainTab, setMainTab] = useState('feed');
    const [filterPill, setFilterPill] = useState('All');
    const [search, setSearch] = useState('');
    const [createDialog, setCreateDialog] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        load();
    }, []);

    const feedPosts = posts.filter(p => {
        if (mainTab === 'jobs') return p.type === 'job';
        const pillMap = { 'Announcement': 'announcement', 'Lost & Found': 'lost_found', 'Recommendation': 'recommendation', 'Question': 'question' };
        const matchPill = filterPill === 'All' || p.type === pillMap[filterPill];
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.body?.toLowerCase().includes(search.toLowerCase());
        return matchPill && matchSearch && p.type !== 'job';
    });

    const upvote = async (post) => {
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p));
    };

    const create = async () => {
        if (!form.title || !form.body) { toast.error('Title and body required'); return; }
        setSaving(true);
        toast.success('Post published!');
        setSaving(false);
        setCreateDialog(false);
        setForm(EMPTY);
        load();
    };

    return (
        <div className="pb-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-mono-premium font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">Community</h1>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-0.5">Neighborhood feed, jobs, skill exchange & more</p>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-fit">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setMainTab(t.key)}
                        className={`h-8 px-5 rounded-lg text-xs font-semibold transition-all ${mainTab === t.key ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {mainTab === 'feed' && (
                <>
                    {/* Filter pills */}
                    <div className="flex gap-2 flex-wrap">
                        {POST_FILTER_PILLS.map(pill => (
                            <button key={pill} onClick={() => setFilterPill(pill)}
                                className={`h-7 px-3 rounded-full text-xs font-semibold transition-all ${filterPill === pill
                                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                    }`}>
                                {pill}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-wave h-36 rounded-xl" />)}</div>
                    ) : feedPosts.length === 0 ? (
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/50">
                            <MessageCircle className="h-8 w-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
                            <p className="text-zinc-400 dark:text-zinc-500 text-sm">No posts yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {feedPosts.map(p => <PostCard key={p.id} post={p} onUpvote={upvote} />)}
                        </div>
                    )}
                </>
            )}

            {mainTab === 'jobs' && (
                <>
                    {loading ? (
                        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-wave h-20 rounded-xl" />)}</div>
                    ) : feedPosts.length === 0 ? (
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/50">
                            <Briefcase className="h-8 w-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
                            <p className="text-zinc-400 dark:text-zinc-500 text-sm">No jobs posted yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2.5">
                            {feedPosts.map(p => <JobCard key={p.id} post={p} />)}
                        </div>
                    )}
                </>
            )}

            {/* Floating create button */}
            {user && (
                <button
                    onClick={() => setCreateDialog(true)}
                    className="fixed bottom-20 md:bottom-6 right-5 md:right-6 h-12 w-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lifted hover:opacity-80 transition-all hover:-translate-y-0.5 z-30"
                >
                    <Plus className="h-5 w-5" />
                </button>
            )}

            {/* Create Dialog */}
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle className="font-semibold">New Post</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-1">
                        {/* Type grid */}
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(POST_TYPES).map(([k, v]) => (
                                <button key={k} onClick={() => setForm(p => ({ ...p, type: k }))}
                                    className={`p-2 rounded-xl border text-center transition-all ${form.type === k ? 'border-zinc-900 dark:border-white bg-zinc-900/5 dark:bg-white/5' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'}`}>
                                    <div className="text-xl mb-0.5">{v.emoji}</div>
                                    <p className="text-[9px] font-semibold text-zinc-600 dark:text-zinc-400 leading-tight">{v.label}</p>
                                </button>
                            ))}
                        </div>
                        <Input placeholder="Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl" />
                        <Textarea placeholder="What's on your mind? *" value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} className="rounded-xl resize-none" rows={4} />
                        <Input placeholder="Neighborhood (optional)" value={form.neighborhood} onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))} className="rounded-xl" />
                        {form.type === 'job' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Select value={form.job_type} onValueChange={v => setForm(p => ({ ...p, job_type: v }))}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Job type" /></SelectTrigger>
                                    <SelectContent><SelectItem value="full_time">Full Time</SelectItem><SelectItem value="part_time">Part Time</SelectItem><SelectItem value="freelance">Freelance</SelectItem><SelectItem value="gig">Gig</SelectItem></SelectContent>
                                </Select>
                                <Input placeholder="Salary / Pay" value={form.job_salary} onChange={e => setForm(p => ({ ...p, job_salary: e.target.value }))} className="rounded-xl" />
                            </div>
                        )}
                        {form.type === 'skill_exchange' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="I offer…" value={form.skill_offer} onChange={e => setForm(p => ({ ...p, skill_offer: e.target.value }))} className="rounded-xl" />
                                <Input placeholder="I want…" value={form.skill_want} onChange={e => setForm(p => ({ ...p, skill_want: e.target.value }))} className="rounded-xl" />
                            </div>
                        )}
                        <Input placeholder="Contact email (optional)" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} className="rounded-xl" type="email" />
                        <div className="flex gap-2 pt-1">
                            <Button variant="outline" className="flex-1 h-10 rounded-xl text-sm" onClick={() => setCreateDialog(false)}>Cancel</Button>
                            <Button className="flex-1 h-10 rounded-xl text-sm gap-2" onClick={create} disabled={saving}>
                                <Send className="h-3.5 w-3.5" /> {saving ? 'Publishing…' : 'Publish'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}