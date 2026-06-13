import { useState, useEffect, useRef } from 'react';
import {
    Megaphone, Search, HelpCircle, Briefcase, RefreshCw, Plus,
    MessageCircle, ChevronDown, ChevronUp, Send, MapPin,
    Share2, Heart, Bookmark, ImageIcon, X, Camera, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

const POST_TYPES = {
    general:      { icon: MessageCircle, label: 'General',        emoji: '💬' },
    announcement: { icon: Megaphone,     label: 'Announcement',   emoji: '📢' },
    lost_found:   { icon: Search,        label: 'Lost & Found',   emoji: '🔍' },
    recommendation:{ icon: Heart,        label: 'Recommend',      emoji: '👍' },
    question:     { icon: HelpCircle,    label: 'Question',       emoji: '❓' },
    job:          { icon: Briefcase,     label: 'Job',            emoji: '💼' },
    skill_exchange:{ icon: RefreshCw,   label: 'Skill Swap',     emoji: '🔄' },
};

const TABS = [
    { key: 'feed', label: 'Feed' },
    { key: 'jobs', label: 'Jobs Board' },
];

const FILTER_PILLS = ['All', 'Photo', 'Announcement', 'Lost & Found', 'Recommendation', 'Question'];

const EMPTY = {
    type: 'general', title: '', body: '', neighborhood: '',
    job_type: '', job_salary: '', skill_offer: '', skill_want: '', contact_email: '',
};

const JOB_TYPES = { full_time: 'Full-time', part_time: 'Part-time', freelance: 'Contract', gig: 'Gig' };

function Avatar({ name, email, size = 8 }) {
    const initial = (name || email || 'A').charAt(0).toUpperCase();
    const colors = ['bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-sky-500', 'bg-pink-500'];
    const color = colors[(initial.charCodeAt(0)) % colors.length];
    return (
        <div className={`h-${size} w-${size} rounded-full ${color} flex items-center justify-center shrink-0`}>
            <span className="text-white font-bold" style={{ fontSize: size * 1.5 }}>{initial}</span>
        </div>
    );
}

function PostCard({ post, onLike, likedPosts }) {
    const [expanded, setExpanded] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const cfg = POST_TYPES[post.type] || POST_TYPES.general;
    const isLiked = likedPosts.has(post.id);
    const authorName = post.author_name || post.author_email?.split('@')[0] || 'Anonymous';
    const timeAgo = (() => {
        const diff = Date.now() - new Date(post.created_date || post.created_at).getTime();
        const h = Math.floor(diff / 3600000);
        if (h < 1) return `${Math.max(1, Math.floor(diff / 60000))}m`;
        if (h < 24) return `${h}h`;
        return `${Math.floor(h / 24)}d`;
    })();

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
                <Avatar name={post.author_name} email={post.author_email} size={9} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-none">{authorName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        {post.neighborhood && (
                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                                <MapPin className="h-2.5 w-2.5" />{post.neighborhood}
                            </span>
                        )}
                        <span className="text-[10px] text-zinc-400">{timeAgo}</span>
                    </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                    {cfg.emoji} {cfg.label}
                </span>
            </div>

            {/* Image */}
            {post.image_url && (
                <div className="relative bg-zinc-100 dark:bg-zinc-800" style={{ aspectRatio: '4/3' }}>
                    {!imgLoaded && (
                        <div className="absolute inset-0 skeleton-wave" />
                    )}
                    <img
                        src={post.image_url}
                        alt={post.title || 'Post image'}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImgLoaded(true)}
                    />
                </div>
            )}

            {/* Action bar */}
            <div className="flex items-center gap-3 px-4 pt-3 pb-2">
                <button
                    onClick={() => onLike(post)}
                    className="flex items-center gap-1.5 transition-all active:scale-90"
                >
                    <Heart
                        className={`h-5 w-5 transition-all ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-zinc-400 dark:text-zinc-500'}`}
                        strokeWidth={isLiked ? 0 : 1.8}
                    />
                </button>
                <button className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 transition-colors">
                    <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
                </button>
                <button className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 transition-colors">
                    <Share2 className="h-5 w-5" strokeWidth={1.8} />
                </button>
                <div className="flex-1" />
                <button className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 transition-colors">
                    <Bookmark className="h-5 w-5" strokeWidth={1.8} />
                </button>
            </div>

            {/* Likes */}
            {(post.upvotes || 0) > 0 && (
                <p className="px-4 text-xs font-semibold text-zinc-900 dark:text-white pb-1">
                    {post.upvotes} {post.upvotes === 1 ? 'like' : 'likes'}
                </p>
            )}

            {/* Caption */}
            <div className="px-4 pb-4">
                {post.title && (
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">{post.title}</p>
                )}
                {post.body && (
                    <>
                        <p className={`text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
                            <span className="font-semibold text-zinc-900 dark:text-white mr-1">{authorName}</span>
                            {post.body}
                        </p>
                        {post.body.length > 100 && (
                            <button onClick={() => setExpanded(!expanded)} className="text-xs text-zinc-400 mt-0.5">
                                {expanded ? 'less' : 'more'}
                            </button>
                        )}
                    </>
                )}

                {post.type === 'skill_exchange' && (
                    <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                        {post.skill_offer && <span className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">🎓 {post.skill_offer}</span>}
                        <span className="text-zinc-300">⇄</span>
                        {post.skill_want && <span className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800">🔍 {post.skill_want}</span>}
                    </div>
                )}

                {post.reply_count > 0 && (
                    <button className="text-xs text-zinc-400 mt-1.5">
                        View all {post.reply_count} comments
                    </button>
                )}
            </div>
        </div>
    );
}

function JobCard({ post }) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
            <div className="flex items-start gap-3">
                <Avatar name={post.author_name} email={post.author_email} size={10} />
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
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" /> {post.neighborhood}
                            </span>
                        )}
                        {post.job_salary && <span className="text-[10px] font-semibold text-emerald-600">{post.job_salary}</span>}
                    </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-[10px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    Apply
                </Button>
            </div>
        </div>
    );
}

async function uploadPostImage(file, userId) {
    const ext = file.name.split('.').pop();
    const path = `${userId || 'anon'}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('community-posts').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from('community-posts').getPublicUrl(path);
    return data.publicUrl;
}

export default function Community() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState(() => {
        try { return new Set(JSON.parse(localStorage.getItem('likedPosts') || '[]')); } catch { return new Set(); }
    });
    const [mainTab, setMainTab] = useState('feed');
    const [filterPill, setFilterPill] = useState('All');
    const [search, setSearch] = useState('');
    const [createDialog, setCreateDialog] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);
    const dropRef = useRef(null);

    const load = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('community_posts')
            .select('*')
            .order('created_date', { ascending: false })
            .limit(50);
        if (data) setPosts(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleImageSelect = (file) => {
        if (!file || !file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
    };

    const closeDialog = () => {
        setCreateDialog(false);
        setForm(EMPTY);
        clearImage();
    };

    const feedPosts = posts.filter(p => {
        if (mainTab === 'jobs') return p.type === 'job';
        const pillMap = { 'Announcement': 'announcement', 'Lost & Found': 'lost_found', 'Recommendation': 'recommendation', 'Question': 'question' };
        const matchPill =
            filterPill === 'All' ? true :
            filterPill === 'Photo' ? !!p.image_url :
            p.type === pillMap[filterPill];
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.body?.toLowerCase().includes(search.toLowerCase());
        return matchPill && matchSearch && p.type !== 'job';
    });

    const handleLike = async (post) => {
        const alreadyLiked = likedPosts.has(post.id);
        const delta = alreadyLiked ? -1 : 1;
        const newLiked = new Set(likedPosts);
        alreadyLiked ? newLiked.delete(post.id) : newLiked.add(post.id);
        setLikedPosts(newLiked);
        localStorage.setItem('likedPosts', JSON.stringify([...newLiked]));
        setPosts(prev => prev.map(p => p.id === post.id ? { ...p, upvotes: Math.max(0, (p.upvotes || 0) + delta) } : p));
        await supabase.from('community_posts').update({ upvotes: Math.max(0, (post.upvotes || 0) + delta) }).eq('id', post.id);
    };

    const create = async () => {
        if (!form.body && !imageFile) { toast.error('Add a caption or photo to post'); return; }
        if (!user) { toast.error('Please sign in to post'); return; }
        setSaving(true);
        try {
            let image_url = null;
            if (imageFile) {
                try {
                    image_url = await uploadPostImage(imageFile, user.id);
                } catch (err) {
                    toast.error('Image upload failed — posting without photo. (Enable Supabase Storage bucket "community-posts")');
                }
            }
            const payload = {
                type: form.type,
                title: form.title || null,
                body: form.body || null,
                neighborhood: form.neighborhood || null,
                contact_email: form.contact_email || null,
                job_type: form.job_type || null,
                job_salary: form.job_salary || null,
                skill_offer: form.skill_offer || null,
                skill_want: form.skill_want || null,
                author_email: user.email,
                author_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                upvotes: 0,
                reply_count: 0,
                is_resolved: false,
                created_date: new Date().toISOString(),
                ...(image_url ? { image_url } : {}),
            };
            const { error } = await supabase.from('community_posts').insert([payload]);
            if (error) throw error;
            toast.success('Posted! 🎉');
            closeDialog();
            load();
        } catch (err) {
            toast.error(err.message || 'Failed to post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="pb-8 space-y-5 max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between pt-1">
                <div>
                    <h1 className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-white">Community</h1>
                    <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-0.5">Neighborhood feed, jobs, skill exchange & more</p>
                </div>
                <button
                    onClick={() => user ? setCreateDialog(true) : toast.error('Sign in to post')}
                    className="h-9 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                    <Plus className="h-4 w-4" /> New Post
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl w-fit">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setMainTab(t.key)}
                        className={`h-8 px-5 rounded-lg text-xs font-semibold transition-all ${mainTab === t.key ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {mainTab === 'feed' && (
                <>
                    {/* Filter pills + search */}
                    <div className="space-y-2.5">
                        <div className="flex gap-2 flex-wrap">
                            {FILTER_PILLS.map(pill => (
                                <button key={pill} onClick={() => setFilterPill(pill)}
                                    className={`h-7 px-3 rounded-full text-xs font-semibold transition-all ${filterPill === pill ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
                                    {pill === 'Photo' ? '📸 Photo' : pill}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                            <Input
                                placeholder="Search posts…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-8 h-8 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-wave h-80 rounded-2xl" />)}</div>
                    ) : feedPosts.length === 0 ? (
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/50">
                            <Camera className="h-8 w-8 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" strokeWidth={1.5} />
                            <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No posts yet</p>
                            <p className="text-zinc-300 dark:text-zinc-600 text-xs mt-1">Be the first to share something with the neighborhood</p>
                            {user && (
                                <button onClick={() => setCreateDialog(true)} className="mt-4 text-xs font-semibold text-zinc-900 dark:text-white underline underline-offset-2">
                                    Create a post
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {feedPosts.map(p => <PostCard key={p.id} post={p} onLike={handleLike} likedPosts={likedPosts} />)}
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

            {/* Create Post Dialog */}
            <Dialog open={createDialog} onOpenChange={closeDialog}>
                <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto p-0">
                    <DialogHeader className="px-5 pt-5 pb-0">
                        <DialogTitle className="font-semibold text-base">New Post</DialogTitle>
                    </DialogHeader>

                    <div className="px-5 pt-4 pb-5 space-y-4">
                        {/* Image upload area */}
                        <div
                            ref={dropRef}
                            onDragOver={e => { e.preventDefault(); dropRef.current?.classList.add('border-zinc-500'); }}
                            onDragLeave={() => dropRef.current?.classList.remove('border-zinc-500')}
                            onDrop={e => { e.preventDefault(); dropRef.current?.classList.remove('border-zinc-500'); handleImageSelect(e.dataTransfer.files[0]); }}
                            className="relative"
                        >
                            {imagePreview ? (
                                <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800" style={{ aspectRatio: '4/3' }}>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-500 dark:hover:text-zinc-400 transition-all"
                                    style={{ minHeight: 140 }}
                                >
                                    <div className="h-10 w-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium">Add a photo</p>
                                        <p className="text-xs">Drag & drop or click · JPG, PNG, GIF up to 5MB</p>
                                    </div>
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleImageSelect(e.target.files[0])}
                            />
                        </div>

                        {/* Author row */}
                        <div className="flex items-center gap-2.5">
                            <Avatar name={user?.user_metadata?.full_name} email={user?.email} size={9} />
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'You'}</p>
                                <p className="text-[10px] text-zinc-400">Posting to Community</p>
                            </div>
                        </div>

                        {/* Post type */}
                        <div className="grid grid-cols-4 gap-1.5">
                            {Object.entries(POST_TYPES).map(([k, v]) => (
                                <button key={k} onClick={() => setForm(p => ({ ...p, type: k }))}
                                    className={`py-2 rounded-xl border text-center transition-all ${form.type === k ? 'border-zinc-900 dark:border-white bg-zinc-900/5 dark:bg-white/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}>
                                    <div className="text-base mb-0.5">{v.emoji}</div>
                                    <p className="text-[9px] font-semibold text-zinc-600 dark:text-zinc-400 leading-tight">{v.label}</p>
                                </button>
                            ))}
                        </div>

                        {/* Title (optional) */}
                        <Input
                            placeholder="Title (optional)"
                            value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="rounded-xl"
                        />

                        {/* Caption */}
                        <div className="relative">
                            <Textarea
                                placeholder="Write a caption…"
                                value={form.body}
                                onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                                className="rounded-xl resize-none pr-14"
                                rows={3}
                            />
                            <span className="absolute bottom-2.5 right-3 text-[10px] text-zinc-300 dark:text-zinc-600">
                                {form.body.length}/500
                            </span>
                        </div>

                        {/* Location */}
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                            <Input
                                placeholder="Add location (optional)"
                                value={form.neighborhood}
                                onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))}
                                className="pl-8 rounded-xl"
                            />
                        </div>

                        {/* Job-specific fields */}
                        {form.type === 'job' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Select value={form.job_type} onValueChange={v => setForm(p => ({ ...p, job_type: v }))}>
                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Job type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full_time">Full Time</SelectItem>
                                        <SelectItem value="part_time">Part Time</SelectItem>
                                        <SelectItem value="freelance">Freelance</SelectItem>
                                        <SelectItem value="gig">Gig</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input placeholder="Pay / Salary" value={form.job_salary} onChange={e => setForm(p => ({ ...p, job_salary: e.target.value }))} className="rounded-xl" />
                            </div>
                        )}

                        {/* Skill exchange fields */}
                        {form.type === 'skill_exchange' && (
                            <div className="grid grid-cols-2 gap-3">
                                <Input placeholder="I offer…" value={form.skill_offer} onChange={e => setForm(p => ({ ...p, skill_offer: e.target.value }))} className="rounded-xl" />
                                <Input placeholder="I want…" value={form.skill_want} onChange={e => setForm(p => ({ ...p, skill_want: e.target.value }))} className="rounded-xl" />
                            </div>
                        )}

                        {/* Contact email */}
                        <Input placeholder="Contact email (optional)" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} className="rounded-xl" type="email" />

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                            <Button variant="outline" className="flex-1 h-10 rounded-xl text-sm" onClick={closeDialog}>Cancel</Button>
                            <Button
                                className="flex-1 h-10 rounded-xl text-sm gap-2"
                                onClick={create}
                                disabled={saving || (!form.body && !imageFile)}
                            >
                                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                {saving ? 'Publishing…' : 'Publish'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
