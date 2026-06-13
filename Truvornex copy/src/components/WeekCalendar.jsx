import { useState } from 'react';
import { format, startOfWeek, addDays, addWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STATUS_STYLES = {
    pending: 'bg-amber-100 border-amber-300 text-amber-900',
    confirmed: 'bg-blue-100 border-blue-300 text-blue-900',
    in_progress: 'bg-violet-100 border-violet-300 text-violet-900',
    completed: 'bg-emerald-100 border-emerald-300 text-emerald-900',
    cancelled: 'bg-zinc-100 border-zinc-200 text-zinc-400 opacity-60',
    no_show: 'bg-red-100 border-red-300 text-red-800',
};

function parseHour(slot) {
    if (!slot) return 9;
    const [h, m] = slot.split(':').map(Number);
    return h + (m || 0) / 60;
}

const START_HOUR = 8;
const HOUR_HEIGHT = 56;
const VISIBLE_HOURS = 13; // 8am - 9pm

export default function WeekCalendar({ bookings = [], onBookingClick }) {
    const [weekOffset, setWeekOffset] = useState(0);
    const today = new Date();
    const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 1 });
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: VISIBLE_HOURS }, (_, i) => START_HOUR + i);

    const getBookingsForDay = (day) => {
        const d = format(day, 'yyyy-MM-dd');
        return bookings.filter(b => b.date === d);
    };

    const fmtHour = (h) => h > 12 ? `${h - 12}pm` : h === 12 ? '12pm' : `${h}am`;

    return (
        <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-premium">
            {/* Navigation header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-1.5">
                    <button onClick={() => setWeekOffset(o => o - 1)}
                        className="h-8 w-8 rounded-xl hover:bg-zinc-200 flex items-center justify-center transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-bold px-2">
                        {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                    </span>
                    <button onClick={() => setWeekOffset(o => o + 1)}
                        className="h-8 w-8 rounded-xl hover:bg-zinc-200 flex items-center justify-center transition-colors">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
                {weekOffset !== 0 && (
                    <button onClick={() => setWeekOffset(0)}
                        className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 px-3 h-7 rounded-lg hover:bg-zinc-100 transition-colors">
                        Today
                    </button>
                )}
            </div>

            {/* Day headers */}
            <div className="grid border-b border-zinc-100" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
                <div className="h-11" />
                {days.map((day, i) => {
                    const isToday = isSameDay(day, today);
                    return (
                        <div key={i} className={`h-11 flex flex-col items-center justify-center border-l border-zinc-100 ${isToday ? 'bg-zinc-900' : ''}`}>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isToday ? 'text-zinc-400' : 'text-zinc-400'}`}>
                                {format(day, 'EEE')}
                            </span>
                            <span className={`text-sm font-black ${isToday ? 'text-white' : 'text-zinc-700'}`}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
                <div className="grid relative" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
                    {/* Hour labels */}
                    <div>
                        {hours.map(h => (
                            <div key={h} style={{ height: HOUR_HEIGHT }} className="flex items-start justify-end pr-2.5 pt-1.5">
                                <span className="text-[10px] text-zinc-400 font-medium">{fmtHour(h)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Day columns */}
                    {days.map((day, di) => {
                        const dayBookings = getBookingsForDay(day);
                        return (
                            <div key={di} className="border-l border-zinc-100 relative">
                                {hours.map(h => (
                                    <div key={h} style={{ height: HOUR_HEIGHT }}
                                        className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors" />
                                ))}
                                {dayBookings.map(b => {
                                    const startH = parseHour(b.time_slot);
                                    if (startH < START_HOUR || startH >= START_HOUR + VISIBLE_HOURS) return null;
                                    const dur = (b.duration_minutes || 30) / 60;
                                    const top = (startH - START_HOUR) * HOUR_HEIGHT;
                                    const height = Math.max(dur * HOUR_HEIGHT - 4, 24);
                                    const style = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                                    return (
                                        <button
                                            key={b.id}
                                            onClick={() => onBookingClick?.(b)}
                                            style={{ top: top + 2, height, left: 2, right: 2 }}
                                            className={`absolute rounded-lg border text-left px-1.5 py-1 text-[10px] font-semibold overflow-hidden hover:opacity-80 transition-opacity cursor-pointer ${style}`}
                                        >
                                            <div className="truncate font-bold">{b.time_slot}</div>
                                            <div className="truncate opacity-80">{b.service_name}</div>
                                            <div className="truncate opacity-60">{b.customer_email?.split('@')[0]}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-zinc-100 flex items-center gap-3 flex-wrap">
                {Object.entries(STATUS_STYLES).map(([status, cls]) => (
                    <div key={status} className="flex items-center gap-1.5">
                        <div className={`h-3 w-3 rounded border ${cls}`} />
                        <span className="text-[10px] text-zinc-500 capitalize">{status.replace('_', ' ')}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}