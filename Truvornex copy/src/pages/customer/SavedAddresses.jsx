import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, Home, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const ADDR_TYPES = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'other', label: 'Other', icon: MapPin },
];

export default function SavedAddresses() {
    const [addresses, setAddresses] = useState([]);
    const [dialog, setDialog] = useState(false);
    const [form, setForm] = useState({ label: 'home', address: '', notes: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('saved_addresses') || '[]');
        setAddresses(stored);
    }, []);

    const save = () => {
        if (!form.address) { toast.error('Address is required'); return; }
        let updated;
        if (editId) {
            updated = addresses.map(a => a.id === editId ? { ...a, ...form } : a);
        } else {
            updated = [...addresses, { ...form, id: Date.now().toString() }];
        }
        setAddresses(updated);
        localStorage.setItem('saved_addresses', JSON.stringify(updated));
        toast.success(editId ? 'Address updated' : 'Address saved');
        setDialog(false);
        setEditId(null);
        setForm({ label: 'home', address: '', notes: '' });
    };

    const del = (id) => {
        const updated = addresses.filter(a => a.id !== id);
        setAddresses(updated);
        localStorage.setItem('saved_addresses', JSON.stringify(updated));
        toast.success('Address removed');
    };

    const openEdit = (a) => {
        setForm({ label: a.label, address: a.address, notes: a.notes || '' });
        setEditId(a.id);
        setDialog(true);
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-3xl tracking-tight">Saved Addresses</h1>
                    <p className="text-zinc-500 text-sm mt-1">Quick-fill your addresses when booking</p>
                </div>
                <Button className="rounded-xl gap-2" onClick={() => { setEditId(null); setForm({ label: 'home', address: '', notes: '' }); setDialog(true); }}>
                    <Plus className="h-4 w-4" /> Add Address
                </Button>
            </div>

            {addresses.length === 0 ? (
                <div className="card-premium p-12 text-center">
                    <MapPin className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                    <p className="text-zinc-400 text-sm">No saved addresses yet</p>
                    <Button variant="outline" className="mt-4 rounded-xl" onClick={() => setDialog(true)}>Add your first address</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map(a => {
                        const type = ADDR_TYPES.find(t => t.value === a.label) || ADDR_TYPES[2];
                        const Icon = type.icon;
                        return (
                            <div key={a.id} className="card-premium p-5 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                                    <Icon className="h-4.5 w-4.5 text-zinc-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="font-semibold text-sm capitalize">{type.label}</p>
                                    </div>
                                    <p className="text-sm text-zinc-600 truncate">{a.address}</p>
                                    {a.notes && <p className="text-xs text-zinc-400 mt-0.5">{a.notes}</p>}
                                </div>
                                <div className="flex gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-red-400 hover:text-red-600" onClick={() => del(a.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Address</DialogTitle></DialogHeader>
                    <div className="space-y-3 pt-1">
                        <div>
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">Type</label>
                            <div className="flex gap-2">
                                {ADDR_TYPES.map(t => (
                                    <button key={t.value} onClick={() => setForm(p => ({ ...p, label: t.value }))}
                                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${form.label === t.value ? 'bg-zinc-900 text-white border-zinc-900' : 'border-zinc-200 text-zinc-500'}`}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Input placeholder="Full address *" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="rounded-xl" />
                        <Input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="rounded-xl" />
                        <Button className="w-full h-11 rounded-xl" onClick={save}>{editId ? 'Update' : 'Save'} Address</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}