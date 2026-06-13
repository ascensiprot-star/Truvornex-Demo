import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, X, ChevronRight } from 'lucide-react';
import ServiceCategoryCard from '../components/ServiceCategoryCard';
import ProviderCard from '../components/ProviderCard';
import { Button } from '@/components/ui/button';

const CATEGORY_PILLS = ['All', 'Cleaning', 'Plumbing', 'Tutoring', 'Healthcare', 'Legal', 'Restaurants', 'Events', 'Transport'];

export default function Services() {
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // grid | map
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ rating: 0, maxDistance: 50, available: false });

    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get('q') || '';

    useEffect(() => {
        setSearch(queryParam);
        setCategories([]);
        setProviders([]);
        setLoading(false);
    }, []);

    const filteredCategories = categories.filter(c =>
        (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
        (activeCategory === 'All' || c.name.toLowerCase().includes(activeCategory.toLowerCase()))
    );

    const filteredProviders = providers.filter(p =>
        (!search || p.business_name?.toLowerCase().includes(search.toLowerCase())) &&
        (filters.rating === 0 || (p.rating || 0) >= filters.rating) &&
        (!filters.available || p.status === 'approved')
    );

    return (
        <div className="pb-8 relative">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-mono-premium font-bold text-2xl tracking-tight text-zinc-900 dark:text-white mb-1">Service Discovery</h1>
                <p className="text-zinc-400 dark:text-zinc-500 text-sm">Find trusted providers in your neighborhood</p>
            </div>

            {/* Search + filter row */}
            <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" strokeWidth={1.8} />
                    <input
                        type="text"
                        placeholder="Search services or providers…"
                        className="w-full h-10 pl-10 pr-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:focus:ring-zinc-700 text-zinc-900 dark:text-zinc-100 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setFilterOpen(true)}
                    className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
                >
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
                </button>
                {/* Map/List toggle */}
                <button
                    onClick={() => setViewMode(v => v === 'grid' ? 'map' : 'grid')}
                    className="h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5"
                >
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                    {viewMode === 'grid' ? 'Map' : 'List'}
                </button>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-6 no-scrollbar">
                {CATEGORY_PILLS.map(pill => (
                    <button
                        key={pill}
                        onClick={() => setActiveCategory(pill)}
                        className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-all ${activeCategory === pill
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                    >
                        {pill}
                    </button>
                ))}
            </div>

            {loading ? (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-wave h-36 rounded-xl" />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Categories section */}
                    {filteredCategories.length > 0 && (
                        <div className="mb-8">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600 mb-3">Categories</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                                {filteredCategories.map(c => <ServiceCategoryCard key={c.id} category={c} />)}
                            </div>
                        </div>
                    )}

                    {/* Provider cards */}
                    {filteredProviders.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
                                    Providers ({filteredProviders.length})
                                </p>
                                <Link to="/nearby" className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1">
                                    View on map <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {filteredProviders.slice(0, 9).map(p => <ProviderCard key={p.id} provider={p} />)}
                            </div>
                        </div>
                    )}

                    {filteredCategories.length === 0 && filteredProviders.length === 0 && (
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-12 text-center bg-zinc-50 dark:bg-zinc-900/50">
                            <Search className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" strokeWidth={1.5} />
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm">No results for "{search}"</p>
                            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline mt-2">
                                Clear search
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Filter Drawer */}
            {filterOpen && (
                <>
                    <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setFilterOpen(false)} />
                    <div className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 z-50 flex flex-col shadow-lifted">
                        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
                            <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">Filters</h3>
                            <button onClick={() => setFilterOpen(false)} className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400">
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
                            {/* Minimum rating */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600 mb-2.5">Minimum Rating</p>
                                <div className="flex gap-2">
                                    {[0, 3, 4, 4.5].map(r => (
                                        <button key={r} onClick={() => setFilters(f => ({ ...f, rating: r }))}
                                            className={`flex-1 h-9 rounded-lg border text-xs font-semibold transition-all ${filters.rating === r ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400'}`}>
                                            {r === 0 ? 'Any' : `${r}★`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Distance */}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600 mb-2.5">
                                    Max Distance: <span className="text-zinc-900 dark:text-white">{filters.maxDistance} km</span>
                                </p>
                                <input type="range" min={1} max={50} value={filters.maxDistance}
                                    onChange={e => setFilters(f => ({ ...f, maxDistance: Number(e.target.value) }))}
                                    className="w-full accent-zinc-900 dark:accent-white" />
                            </div>

                            {/* Available now */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Available Now</p>
                                <button
                                    onClick={() => setFilters(f => ({ ...f, available: !f.available }))}
                                    className={`relative h-5 w-9 rounded-full transition-colors ${filters.available ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                >
                                    <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white dark:bg-zinc-900 shadow transition-all ${filters.available ? 'left-[18px]' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>
                        <div className="p-5 border-t border-zinc-200 dark:border-zinc-800">
                            <Button className="w-full h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 text-sm font-semibold" onClick={() => setFilterOpen(false)}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}