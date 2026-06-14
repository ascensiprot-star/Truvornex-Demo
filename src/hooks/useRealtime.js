import { useEffect, useRef, useCallback, useState } from 'react';

export function useRealtimeTable(_table, _onchange, _filter = null) {
    return { connected: false, error: null };
}

export function useRealtimeList(_table, initialData = [], _idField = 'id') {
    const [data] = useState(initialData);
    return { data, connected: false, error: null, lastUpdated: null };
}

export function useRealtimeSingle(_table, _id, initialData = null) {
    const [data] = useState(initialData);
    return { data, connected: false, error: null, lastUpdated: null };
}

export function useRealtimePlatformStats() {
    return {
        stats: { bookings: 0, providers: 0, pendingBookings: 0, activeBookings: 0, recentActivity: [] },
        connected: false,
    };
}

export function getRealtimeLabel(_connected) {
    return { text: 'Offline', color: 'var(--color-text-subtle)' };
}
