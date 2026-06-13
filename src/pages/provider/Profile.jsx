import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { LogOut, Camera, MapPin, Navigation, CheckCircle, Image, X } from 'lucide-react';

const ALL_ICONS = ['scissors', 'stethoscope', 'wrench', 'zap', 'book', 'truck', 'dumbbell', 'utensils', 'shopping', 'droplets', 'paintbrush', 'car'];

export default function ProviderProfile() {
    const [provider, setProvider] = useState(null);
    const [form, setForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [categories, setCategories] = useState([]);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const logoRef = useRef();
    const coverRef = useRef();

    useEffect(() => {
        setCreating(true);
        setForm({ user_email: '', business_name: '', description: '', phone: '', address: '', city: '', latitude: 40.7128, longitude: -74.006, category_slugs: [], chat_enabled: false });
        setCategories([]);
        setLoading(false);
    }, []);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const toggleCategory = (slug) => {
        const current = form.category_slugs || [];
        set('category_slugs', current.includes(slug) ? current.filter(s => s !== slug) : [...current, slug]);
    };

    const uploadImage = async (file, field, setUploading) => {
        setUploading(true);
        toast.error('Image upload requires Supabase storage to be configured.');
        setUploading(false);
    };

    const getMyLocation = () => {
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                set('latitude', latitude);
                set('longitude', longitude);
                // Reverse geocode for address
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    const city = data.address?.city || data.address?.town || data.address?.village || '';
                    const address = data.display_name?.split(',').slice(0, 3).join(',') || '';
                    if (city) set('city', city);
                    if (address) set('address', address);
                } catch (_) { }
                setGeoLoading(false);
                toast.success('Location updated!');
            },
            () => { setGeoLoading(false); toast.error('Could not get location'); },
            { enableHighAccuracy: true }
        );
    };

    const save = async () => {
        if (!form.business_name) { toast.error('Business name is required'); return; }
        setSaving(true);
        if (creating) {
            setProvider({ ...form });
            setCreating(false);
            toast.success('Profile created! Pending admin approval.');
        } else {
            setProvider({ ...provider, ...form });
            toast.success('Profile saved!');
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="space-y-4 max-w-2xl">
            <div className="skeleton-wave h-48 rounded-2xl" />
            <div className="skeleton-wave h-12 rounded-xl" />
            <div className="skeleton-wave h-12 rounded-xl" />
        </div>
    );

    return (
        <div className="max-w-2xl pb-24 md:pb-8">
            <h1 className="font-inter font-black text-2xl mb-6">{creating ? '🚀 Set Up Your Business' : 'Business Profile'}</h1>

            {creating && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
                    <strong>Welcome!</strong> Fill in your business details below. Once submitted, our team will review and approve your profile within 24 hours.
                </div>
            )}

            {/* Cover Photo */}
            <div className="card-premium overflow-hidden mb-6">
                <div className="relative h-40 bg-zinc-100 group cursor-pointer" onClick={() => coverRef.current.click()}>
                    {form.cover_image ? (
                        <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <Image className="h-8 w-8 text-zinc-300" />
                            <span className="text-zinc-400 text-sm">Click to add cover photo</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {uploadingCover ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Camera className="h-7 w-7 text-white" />
                        )}
                    </div>
                    <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'cover_image', setUploadingCover)} />
                </div>

                {/* Logo */}
                <div className="px-5 pb-5 -mt-10 relative">
                    <div className="relative inline-block">
                        <div
                            className="h-20 w-20 rounded-2xl border-4 border-white bg-zinc-100 overflow-hidden cursor-pointer shadow-float group"
                            onClick={() => logoRef.current.click()}
                        >
                            {form.logo_url ? (
                                <img src={form.logo_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-zinc-400 font-black text-2xl">
                                        {form.business_name?.[0]?.toUpperCase() || '?'}
                                    </span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                {uploadingLogo ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="h-5 w-5 text-white" />}
                            </div>
                        </div>
                        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && uploadImage(e.target.files[0], 'logo_url', setUploadingLogo)} />
                        {form.verified && (
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                                <CheckCircle className="h-3 w-3 text-white" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Business Info */}
            <div className="card-premium p-6 mb-4 space-y-4">
                <h2 className="font-bold text-base">Business Information</h2>
                <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Business Name <span className="text-red-500">*</span></label>
                    <Input value={form.business_name || ''} onChange={e => set('business_name', e.target.value)} placeholder="e.g. John's Plumbing" className="h-11 rounded-xl" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Description</label>
                    <Textarea
                        value={form.description || ''}
                        onChange={e => set('description', e.target.value)}
                        placeholder="Tell customers what makes your business special..."
                        className="resize-none rounded-xl"
                        rows={3}
                    />
                </div>
                <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Phone Number</label>
                    <Input type="tel" value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" className="h-11 rounded-xl" />
                </div>
            </div>

            {/* Location */}
            <div className="card-premium p-6 mb-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-base">Location</h2>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5" onClick={getMyLocation} disabled={geoLoading}>
                        <Navigation className={`h-3.5 w-3.5 ${geoLoading ? 'animate-spin' : ''}`} />
                        {geoLoading ? 'Getting...' : 'Use My Location'}
                    </Button>
                </div>
                <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Address <span className="text-red-500">*</span></label>
                    <Input value={form.address || ''} onChange={e => set('address', e.target.value)} placeholder="123 Main Street" className="h-11 rounded-xl" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-1.5">City</label>
                    <Input value={form.city || ''} onChange={e => set('city', e.target.value)} placeholder="New York" className="h-11 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm font-semibold text-zinc-700 block mb-1.5 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Latitude</label>
                        <Input type="number" step="any" value={form.latitude || ''} onChange={e => set('latitude', Number(e.target.value))} className="h-11 rounded-xl font-mono text-sm" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-zinc-700 block mb-1.5 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />Longitude</label>
                        <Input type="number" step="any" value={form.longitude || ''} onChange={e => set('longitude', Number(e.target.value))} className="h-11 rounded-xl font-mono text-sm" />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-zinc-700 block mb-1.5">Service Radius (km)</label>
                    <Input type="number" value={form.service_radius_km || 10} onChange={e => set('service_radius_km', Number(e.target.value))} className="h-11 rounded-xl" />
                </div>
            </div>

            {/* Service Categories */}
            <div className="card-premium p-6 mb-4">
                <h2 className="font-bold text-base mb-1">Service Categories</h2>
                <p className="text-zinc-500 text-sm mb-4">Select all categories that describe your services. This determines where you appear in searches.</p>
                <div className="flex flex-wrap gap-2">
                    {categories.map(c => {
                        const selected = (form.category_slugs || []).includes(c.slug);
                        return (
                            <button
                                key={c.slug}
                                onClick={() => toggleCategory(c.slug)}
                                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all border ${selected
                                        ? 'bg-zinc-900 text-white border-zinc-900'
                                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400'
                                    }`}
                            >
                                {selected && <span className="mr-1.5">✓</span>}
                                {c.name}
                            </button>
                        );
                    })}
                </div>
                {(form.category_slugs || []).length === 0 && (
                    <p className="text-amber-600 text-sm mt-3 bg-amber-50 rounded-lg p-3">
                        ⚠️ Please select at least one category so customers can find you.
                    </p>
                )}
            </div>

            {/* Settings */}
            <div className="card-premium p-6 mb-6">
                <h2 className="font-bold text-base mb-4">Settings</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-zinc-800">Enable Chat</p>
                        <p className="text-xs text-zinc-500 mt-0.5">Allow customers to message you directly</p>
                    </div>
                    <Switch checked={form.chat_enabled || false} onCheckedChange={v => set('chat_enabled', v)} />
                </div>
            </div>

            {/* Status banner */}
            {provider && provider.status !== 'approved' && (
                <div className={`rounded-xl p-4 mb-4 text-sm font-medium ${provider.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                        provider.status === 'rejected' ? 'bg-red-50 text-red-800 border border-red-200' :
                            'bg-zinc-100 text-zinc-700'
                    }`}>
                    {provider.status === 'pending' && '⏳ Your profile is pending admin review. Usually takes 24 hours.'}
                    {provider.status === 'rejected' && '❌ Your profile was rejected. Please update your information and save again.'}
                    {provider.status === 'suspended' && '⚠️ Your profile is currently suspended. Contact support for help.'}
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    className="flex-1 h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-base font-semibold"
                    onClick={save}
                    disabled={saving || !form.business_name}
                >
                    {saving ? 'Saving...' : creating ? '✓ Submit Profile' : '✓ Save Changes'}
                </Button>
            </div>
        </div>
    );
}