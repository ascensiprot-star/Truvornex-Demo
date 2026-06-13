import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, MapPin, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function WishlistFavorites() {
    const [favorites, setFavorites] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
        ]).then(([me, provs]) => {
            setProviders(provs);
            const saved = JSON.parse(localStorage.getItem('sf_favorites') || '[]');
            setFavorites(provs.filter(p => saved.includes(p.id)));
            setLoading(false);
        });
    }, []);

    const remove = (id) => {
        const saved = JSON.parse(localStorage.getItem('sf_favorites') || '[]');
        const updated = saved.filter(s => s !== id);
        localStorage.setItem('sf_favorites', JSON.stringify(updated));
        setFavorites(f => f.filter(p => p.id !== id));
        toast.success('Removed from favorites');
    };

    return (
        <div className="pb-24 md:pb-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-2xl tracking-tight">Favorites</h1>
                    <p className="text-zinc-400 text-sm">Your saved providers & services</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="skeleton-wave h-28 rounded-2xl" />)}
                </div>
            ) : favorites.length === 0 ? (
                <div className="card-premium p-16 text-center">
                    <Heart className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2 text-zinc-700">No favorites yet</h3>
                    <p className="text-zinc-400 text-sm mb-5">Browse providers and save your favorites for quick access.</p>
                    <Button asChild className="rounded-xl"><Link to="/nearby">Browse Providers <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map(p => (
                        <div key={p.id} className="card-premium p-4 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center text-lg font-black text-zinc-400 shrink-0">
                                {p.business_name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm truncate">{p.business_name}</h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                                    <span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{p.rating?.toFixed(1) || 'N/A'}</span>
                                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{p.city}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button asChild size="sm" className="rounded-xl bg-zinc-900 h-8"><Link to={`/providers/${p.id}`}>Book</Link></Button>
                                <button onClick={() => remove(p.id)} className="h-8 w-8 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                                    <Trash2 className="h-3.5 w-3.5 text-zinc-400 hover:text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}