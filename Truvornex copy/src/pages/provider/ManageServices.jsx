import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const EMPTY = { name: '', description: '', category_slug: '', type: 'appointment', price: '', duration_minutes: 30, is_active: true, image_url: '' };

export default function ManageServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [provider, setProvider] = useState(null);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [uploadingImg, setUploadingImg] = useState(false);
    const imgRef = useRef();

    const uploadImage = async (file) => {
        setUploadingImg(true);
        setForm(f => ({ ...f, image_url: file_url }));
        setUploadingImg(false);
        toast.success('Image uploaded!');
    };

    const load = async () => {
        if (provs.length === 0) { setLoading(false); return; }
        setProvider(provs[0]);
        const [svcs, cats] = await Promise.all([
        ]);
        setServices(svcs);
        setCategories(cats);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const save = async () => {
        const data = { ...form, price: Number(form.price), duration_minutes: Number(form.duration_minutes), provider_id: provider.id };
        toast.success(editId ? 'Service updated' : 'Service created');
        setOpen(false); setForm(EMPTY); setEditId(null);
        load();
    };

    const del = async (id) => {
        toast.success('Deleted');
        load();
    };

    if (loading) return (
        <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="card-premium h-20 skeleton-wave" />)}
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-inter font-black text-2xl">My Services</h1>
                <Button size="sm" className="rounded-xl gap-1" onClick={() => { setForm(EMPTY); setEditId(null); setOpen(true); }}><Plus className="h-4 w-4" />Add Service</Button>
            </div>
            {!provider && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 mb-4">
                    ⚠️ You need to set up your provider profile first before adding services.
                </div>
            )}
            {services.length === 0 ? (
                <div className="card-premium p-12 text-center">
                    <p className="text-zinc-400 mb-3">No services yet</p>
                    <Button variant="outline" className="rounded-xl" onClick={() => { setForm(EMPTY); setEditId(null); setOpen(true); }}>Add your first service</Button>
                </div>
            ) : (
                <div className="space-y-2">
                    {services.map(s => (
                        <div key={s.id} className="card-premium p-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                {s.image_url ? (
                                    <img src={s.image_url} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0" />
                                ) : (
                                    <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                        <Image className="h-5 w-5 text-zinc-400" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <h3 className="font-inter font-semibold text-sm truncate">{s.name}</h3>
                                    <p className="text-xs text-zinc-500">${s.price} · {s.duration_minutes}min · {s.category_slug} · {s.type}</p>
                                    <span className={`text-xs font-medium ${s.is_active ? 'text-green-600' : 'text-zinc-400'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                                </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <Button variant="ghost" size="sm" className="h-8 px-2.5 rounded-xl text-xs text-zinc-500 hover:text-zinc-900" onClick={() => navigate(`/provider/services/${s.id}/variants`)}>Options</Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setForm(s); setEditId(s.id); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                        {/* Image upload */}
                        <div>
                            <p className="text-sm font-medium mb-2">Service Photo (optional)</p>
                            <div
                                className="h-32 rounded-xl border-2 border-dashed border-zinc-200 flex items-center justify-center cursor-pointer hover:border-zinc-400 transition-colors overflow-hidden bg-zinc-50"
                                onClick={() => imgRef.current.click()}
                            >
                                {form.image_url ? (
                                    <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                                ) : uploadingImg ? (
                                    <div className="w-5 h-5 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />
                                ) : (
                                    <div className="text-center">
                                        <Image className="h-7 w-7 text-zinc-300 mx-auto mb-1" />
                                        <p className="text-xs text-zinc-400">Click to upload photo</p>
                                    </div>
                                )}
                            </div>
                            <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                        </div>
                        <Input placeholder="Service name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        <Select value={form.category_slug} onValueChange={v => setForm({ ...form, category_slug: v })}>
                            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                            <SelectContent>{categories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {['appointment', 'slot', 'pickup', 'reservation', 'on_demand'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-3">
                            <Input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                            <Input type="number" placeholder="Duration (min)" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={form.is_active} onCheckedChange={v => setForm({ ...form, is_active: v })} />
                            <span className="text-sm">Active</span>
                        </div>
                        <Button className="w-full" onClick={save} disabled={!form.name || !form.price}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}