import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogOut, Camera, User, Mail, Phone, MapPin, Edit3 } from 'lucide-react';

export default function CustomerProfile() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
    }, []);

    const save = async () => {
        setSaving(true);
        setUser(u => ({ ...u, ...form }));
        toast.success('Profile updated!');
        setSaving(false);
        setEditMode(false);
    };

    const uploadAvatar = async (file) => {
        setUploadingAvatar(true);
        setForm(f => ({ ...f, avatar_url: file_url }));
        setUploadingAvatar(false);
        toast.success('Photo updated!');
    };

    if (!user) return (
        <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-3 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-8">
            {/* Profile header card */}
            <div className="card-premium p-6 mb-4 text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                    <div
                        className="h-24 w-24 rounded-full bg-zinc-100 overflow-hidden cursor-pointer border-4 border-white shadow-float mx-auto group"
                        onClick={() => fileRef.current.click()}
                    >
                        {form.avatar_url ? (
                            <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                <User className="h-10 w-10 text-zinc-400" />
                            </div>
                        )}
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            {uploadingAvatar
                                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <Camera className="h-5 w-5 text-white" />}
                        </div>
                    </div>
                    <button
                        onClick={() => fileRef.current.click()}
                        className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-zinc-900 border-2 border-white flex items-center justify-center shadow-sm"
                    >
                        <Camera className="h-3.5 w-3.5 text-white" />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadAvatar(e.target.files[0])} />
                </div>

                <h1 className="font-inter font-black text-xl">{user.full_name || 'Your Name'}</h1>
                <p className="text-zinc-400 text-sm mt-0.5">{user.email}</p>

                {!editMode && (
                    <Button variant="outline" size="sm" className="mt-3 rounded-xl gap-1.5" onClick={() => setEditMode(true)}>
                        <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                    </Button>
                )}
            </div>

            {/* Info */}
            <div className="card-premium p-6 mb-4">
                <h2 className="font-bold text-base mb-4">Contact Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <User className="h-3.5 w-3.5" /> Full Name
                        </label>
                        <div className="h-11 px-3 flex items-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-400 text-sm">
                            {user.full_name || 'Not set'}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">Name is managed by your account</p>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <Mail className="h-3.5 w-3.5" /> Email
                        </label>
                        <div className="h-11 px-3 flex items-center rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-400 text-sm">
                            {user.email}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <Phone className="h-3.5 w-3.5" /> Phone Number
                        </label>
                        {editMode ? (
                            <Input
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                placeholder="+1 (555) 000-0000"
                                className="h-11 rounded-xl"
                            />
                        ) : (
                            <div className="h-11 px-3 flex items-center rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-700">
                                {form.phone || <span className="text-zinc-400">Not set — tap Edit Profile</span>}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                            <MapPin className="h-3.5 w-3.5" /> Address
                        </label>
                        {editMode ? (
                            <Input
                                value={form.address}
                                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                placeholder="Your home address"
                                className="h-11 rounded-xl"
                            />
                        ) : (
                            <div className="h-11 px-3 flex items-center rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-700">
                                {form.address || <span className="text-zinc-400">Not set — tap Edit Profile</span>}
                            </div>
                        )}
                    </div>
                </div>

                {editMode && (
                    <div className="flex gap-3 mt-5">
                        <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800" onClick={save} disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                )}
            </div>

            <Button variant="outline" className="w-full mt-4 rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
        </div>
    );
}