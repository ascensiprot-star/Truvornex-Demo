import { useState } from 'react';
import { Shield, Download, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PRIVACY_ITEMS = [
    { key: 'show_profile', label: 'Show profile to providers', desc: 'Providers can see your name and profile photo when you book' },
    { key: 'share_location', label: 'Share location for nearby', desc: 'Allow the app to detect your location for nearby providers' },
    { key: 'analytics_tracking', label: 'Analytics tracking', desc: 'Help improve the app with anonymous usage data' },
    { key: 'personalized_recs', label: 'Personalized recommendations', desc: 'Use your booking history to suggest relevant services' },
    { key: 'marketing_emails', label: 'Marketing communications', desc: 'Receive promotional offers and platform news' },
    { key: 'data_to_providers', label: 'Share data with providers', desc: 'Allow providers to see your booking patterns for better service' },
];

export default function PrivacySettings() {
    const [settings, setSettings] = useState(() => ({
        show_profile: true, share_location: true, analytics_tracking: false,
        personalized_recs: true, marketing_emails: false, data_to_providers: true,
        ...JSON.parse(localStorage.getItem('privacy_settings') || '{}'),
    }));

    const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

    const save = () => {
        localStorage.setItem('privacy_settings', JSON.stringify(settings));
        toast.success('Privacy settings saved');
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="font-display font-bold text-3xl tracking-tight">Privacy Settings</h1>
                <p className="text-zinc-500 text-sm mt-1">Control how your data is used and shared</p>
            </div>

            <div className="flex items-center gap-3 bg-zinc-900 text-white rounded-2xl px-5 py-4">
                <Shield className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                    <p className="font-semibold text-sm">Your privacy is our priority</p>
                    <p className="text-zinc-400 text-xs mt-0.5">We never sell your personal data to third parties.</p>
                </div>
            </div>

            <div className="space-y-2">
                {PRIVACY_ITEMS.map(item => (
                    <div key={item.key} className="card-premium p-5 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                        </div>
                        <Switch checked={!!settings[item.key]} onCheckedChange={() => toggle(item.key)} />
                    </div>
                ))}
            </div>

            <Button className="w-full h-11 rounded-xl" onClick={save}>Save Privacy Settings</Button>

            <div className="space-y-3">
                <h2 className="font-bold text-base">Data Management</h2>
                {[
                    { icon: Download, label: 'Download My Data', desc: 'Export all your personal data in JSON format', action: 'Request Export', variant: 'outline' },
                    { icon: Trash2, label: 'Delete My Account', desc: 'Permanently delete your account and all data', action: 'Delete Account', variant: 'destructive' },
                ].map(item => (
                    <div key={item.label} className="card-premium p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <item.icon className="h-4.5 w-4.5 text-zinc-400 shrink-0" />
                            <div>
                                <p className="font-medium text-sm">{item.label}</p>
                                <p className="text-xs text-zinc-400">{item.desc}</p>
                            </div>
                        </div>
                        <Button variant={item.variant} size="sm" className="rounded-xl shrink-0" onClick={() => toast.info('Contact support to complete this request')}>{item.action}</Button>
                    </div>
                ))}
            </div>
        </div>
    );
}