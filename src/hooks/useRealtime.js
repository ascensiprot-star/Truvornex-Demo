/**
 * useRealtime — Supabase real-time subscription hook
 * Provides live data updates across the platform
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/api/supabaseClient';

/**
 * Subscribe to real-time changes on a Supabase table.
 * @param {string} table - The table name to subscribe to
 * @param {function} onchange - Called with (payload) on any change
 * @param {object} filter - Optional filter: { column, value }
 * @returns {{ connected: boolean, error: string|null }}
 */
export function useRealtimeTable(table, onchange, filter = null) {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const channelRef = useRef(null);
    const onchangeRef = useRef(onchange);
    onchangeRef.current = onchange;

    useEffect(() => {
        if (!table) return;

        let channel = supabase.channel(`rt_${table}_${Date.now()}`);

        const config = {
            event: '*',
            schema: 'public',
            table,
        };

        if (filter?.column && filter?.value !== undefined) {
            config.filter = `${filter.column}=eq.${filter.value}`;
        }

        channel = channel.on('postgres_changes', config, (payload) => {
            onchangeRef.current?.(payload);
        });

        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                setConnected(true);
                setError(null);
            } else if (status === 'CHANNEL_ERROR') {
                setConnected(false);
                setError('Real-time connection failed');
            } else if (status === 'TIMED_OUT') {
                setConnected(false);
                setError('Real-time connection timed out');
            }
        });

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
            setConnected(false);
        };
    }, [table, filter?.column, filter?.value]);

    return { connected, error };
}

/**
 * useRealtimeList — Subscribe to a table and maintain a live-updated list.
 * @param {string} table - Table name
 * @param {Array} initialData - Starting data
 * @param {string} idField - Primary key field name (default: 'id')
 * @returns {{ data: Array, connected: boolean, lastUpdated: Date|null }}
 */
export function useRealtimeList(table, initialData = [], idField = 'id') {
    const [data, setData] = useState(initialData);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleChange = useCallback((payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        setData(prev => {
            let next;
            if (eventType === 'INSERT') {
                next = [newRecord, ...prev];
            } else if (eventType === 'UPDATE') {
                next = prev.map(item =>
                    item[idField] === newRecord[idField] ? { ...item, ...newRecord } : item
                );
            } else if (eventType === 'DELETE') {
                next = prev.filter(item => item[idField] !== oldRecord[idField]);
            } else {
                next = prev;
            }
            return next;
        });
        setLastUpdated(new Date());
    }, [idField]);

    const { connected, error } = useRealtimeTable(table, handleChange);

    return { data, connected, error, lastUpdated };
}

/**
 * useRealtimeSingle — Subscribe to a specific record.
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @param {object} initialData - Starting data
 */
export function useRealtimeSingle(table, id, initialData = null) {
    const [data, setData] = useState(initialData);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const handleChange = useCallback((payload) => {
        const { eventType, new: newRecord } = payload;
        if (eventType === 'UPDATE' || eventType === 'INSERT') {
            setData(prev => ({ ...prev, ...newRecord }));
            setLastUpdated(new Date());
        } else if (eventType === 'DELETE') {
            setData(null);
            setLastUpdated(new Date());
        }
    }, []);

    const filter = id ? { column: 'id', value: id } : null;
    const { connected, error } = useRealtimeTable(table, handleChange, filter);

    return { data, connected, error, lastUpdated };
}

/**
 * useRealtimePlatformStats — Subscribe to all key tables for platform-wide live stats.
 * Returns a live summary of key platform metrics.
 */
export function useRealtimePlatformStats() {
    const [stats, setStats] = useState({
        bookings: 0,
        providers: 0,
        pendingBookings: 0,
        activeBookings: 0,
        recentActivity: [],
    });
    const [connected, setConnected] = useState(false);

    const bookingChannel = useRef(null);
    const providerChannel = useRef(null);

    useEffect(() => {
        const bChannel = supabase.channel('platform_bookings_live')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
                setStats(prev => ({
                    ...prev,
                    recentActivity: [{ ...payload.new, _event: payload.eventType, _at: new Date() }, ...prev.recentActivity.slice(0, 9)],
                }));
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') setConnected(true);
            });

        const pChannel = supabase.channel('platform_providers_live')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, (payload) => {
                setStats(prev => ({
                    ...prev,
                    recentActivity: [{ ...payload.new, _event: payload.eventType, _at: new Date(), _table: 'provider' }, ...prev.recentActivity.slice(0, 9)],
                }));
            })
            .subscribe();

        bookingChannel.current = bChannel;
        providerChannel.current = pChannel;

        return () => {
            supabase.removeChannel(bChannel);
            supabase.removeChannel(pChannel);
            setConnected(false);
        };
    }, []);

    return { stats, connected };
}

/**
 * RealtimeIndicator — A small live indicator badge component helper
 */
export function getRealtimeLabel(connected) {
    return connected ? { text: 'Live', color: 'var(--color-success)' } : { text: 'Connecting…', color: 'var(--color-text-subtle)' };
}
