import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, CheckCircle, Phone, Star, ArrowLeft, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapView from '../components/MapView';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function getTodayStatus(working_hours) {
    if (!working_hours) return null;
    const day = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    const h = working_hours[day];
    if (!h || h.closed) return { open: false, text: 'Closed today' };
    return { open: true, text: `Open · ${h.open} – ${h.close}` };
}

const ReviewCard = ({ review }) => (
    <div className="card-premium p-4">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {(review.customer_name || 'C')[0].toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{review.customer_name || 'Customer'}</span>
            </div>
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-zinc-800 text-zinc-800' : 'text-zinc-200'}`} />
                ))}
            </div>
        </div>
        {review.comment && <p className="text-sm text-zinc-500 leading-relaxed">{review.comment}</p>}
    </div>
);

export default function ProviderDetail() {
    const { providerId } = useParams();
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        setProvider(null);
        setServices([]);
        setReviews([]);
        setLoading(false);
    }, [providerId]);

    if (loading) return (
        <div className="max-w-3xl mx-auto space-y-4 pb-24">
            <div className="skeleton-wave h-64 rounded-2xl" />
            <div className="skeleton-wave h-32 rounded-2xl" />
            <div className="skeleton-wave h-48 rounded-2xl" />
        </div>
    );

    if (!provider) return (
        <div className="text-center py-20">
            <p className="text-zinc-400">Provider not found.</p>
            <Button asChild variant="outline" className="mt-4"><Link to="/services">Browse Services</Link></Button>
        </div>
    );

    const todayStatus = getTodayStatus(provider.working_hours);

    return (
        <div className="pb-24 md:pb-8 max-w-3xl mx-auto">
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-4">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>

            {/* Hero */}
            <div className="card-premium overflow-hidden mb-5 p-0">
                <div className="relative h-56 bg-zinc-100">
                    {provider.cover_image ? (
                        <img src={provider.cover_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                            <span className="text-8xl font-black text-zinc-200 dark:text-zinc-700">{provider.business_name?.[0]}</span>
                        </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Status badge */}
                    {todayStatus && (
                        <div className={`absolute top-4 right-4 glass rounded-full px-3 py-1.5 text-xs font-semibold ${todayStatus.open ? 'text-emerald-700' : 'text-red-600'}`}>
                            {todayStatus.text}
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <h1 className="font-inter font-black text-2xl text-zinc-900 dark:text-zinc-100">{provider.business_name}</h1>
                                {provider.verified && <CheckCircle className="h-5 w-5 text-zinc-500 dark:text-zinc-400 shrink-0" />}
                            </div>
                            <div className="flex items-center gap-4 flex-wrap text-sm text-zinc-500 dark:text-zinc-400">
                                {provider.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-zinc-800 text-zinc-800" />
                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{provider.rating?.toFixed(1)}</span>
                                        <span className="text-zinc-400">({provider.review_count} reviews)</span>
                                    </div>
                                )}
                                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{provider.city || provider.address}</span>
                                {provider.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{provider.phone}</span>}
                            </div>
                        </div>
                    </div>
                    {provider.description && (
                        <p className="text-zinc-500 text-sm mt-4 leading-relaxed">{provider.description}</p>
                    )}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="card-premium p-4 text-center">
                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{services.length}</div>
                    <div className="text-xs text-zinc-400 mt-1">Services</div>
                </div>
                <div className="card-premium p-4 text-center">
                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{provider.review_count || 0}</div>
                    <div className="text-xs text-zinc-400 mt-1">Reviews</div>
                </div>
                <div className="card-premium p-4 text-center">
                    <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">{provider.rating?.toFixed(1) || '—'}</div>
                    <div className="text-xs text-zinc-400 mt-1">Rating</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="glass rounded-2xl p-1.5 flex gap-1 mb-5 shadow-premium">
                {[
                    { id: 'services', label: 'Services', icon: Calendar },
                    { id: 'hours', label: 'Hours', icon: Clock },
                    { id: 'map', label: 'Location', icon: MapPin },
                    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Users },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                            }`}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Services tab */}
            {activeTab === 'services' && (
                <div className="space-y-3">
                    {services.length === 0 ? (
                        <div className="card-premium p-12 text-center">
                            <p className="text-zinc-400 text-sm">No services listed yet.</p>
                        </div>
                    ) : services.map(s => (
                        <div key={s.id} className="card-premium p-5 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="font-inter font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-1">{s.name}</h3>
                                <div className="flex items-center gap-3 text-xs text-zinc-400">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration_minutes} min</span>
                                    <span className="capitalize">{s.type}</span>
                                    {s.description && <span className="truncate max-w-[150px]">{s.description}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="font-inter font-black text-xl text-zinc-900 dark:text-zinc-100">${s.price}</span>
                                <Button asChild size="sm" className="rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white">
                                    <Link to={`/book/${provider.id}/${s.id}`}>
                                        Book <ArrowRight className="h-3.5 w-3.5 ml-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hours tab */}
            {activeTab === 'hours' && (
                <div className="card-premium p-5">
                    {provider.working_hours ? (
                        <div className="space-y-1">
                            {DAYS.map(d => {
                                const h = provider.working_hours[d];
                                const isToday = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === d;
                                return (
                                    <div key={d} className={`flex justify-between py-2.5 px-4 rounded-xl text-sm ${isToday ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                                        <span className="capitalize font-medium">{d}</span>
                                        <span className={isToday ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'}>
                                            {h?.closed ? 'Closed' : h ? `${h.open} – ${h.close}` : '—'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-zinc-400 text-sm text-center py-6">Hours not specified.</p>
                    )}
                </div>
            )}

            {/* Map tab */}
            {activeTab === 'map' && (
                <div className="rounded-2xl overflow-hidden shadow-premium border border-zinc-100 dark:border-zinc-800">
                    {provider.latitude ? (
                        <MapView providers={[provider]} className="h-72" />
                    ) : (
                        <div className="h-72 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                            <p className="text-zinc-400 text-sm">Location not set.</p>
                        </div>
                    )}
                    {provider.address && (
                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-zinc-400" />
                                {provider.address}
                                {provider.service_radius_km && <span className="ml-auto text-xs text-zinc-400">±{provider.service_radius_km} km radius</span>}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Reviews tab */}
            {activeTab === 'reviews' && (
                <div className="space-y-3">
                    {reviews.length === 0 ? (
                        <div className="card-premium p-12 text-center">
                            <Star className="h-8 w-8 text-zinc-200 mx-auto mb-3" />
                            <p className="text-zinc-400 text-sm">No reviews yet. Be the first to book!</p>
                        </div>
                    ) : reviews.map(r => <ReviewCard key={r.id} review={r} />)}
                </div>
            )}
        </div>
    );
}