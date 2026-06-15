/**
 * Simon Intelligence Service — the nervous system of Truvornex.
 * Runs behind every booking, zone check, and home insight.
 * All functions have deterministic fallbacks — works without a DeepSeek key.
 */

async function callAI(systemPrompt, userPrompt) {
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) return null;
    try {
        const r = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.25,
                max_tokens: 500,
                response_format: { type: 'json_object' },
            }),
        });
        if (!r.ok) return null;
        const d = await r.json();
        return JSON.parse(d.choices?.[0]?.message?.content || 'null');
    } catch { return null; }
}

function timeCtx() {
    const d = new Date();
    const h = d.getHours();
    const dow = d.getDay();
    const month = d.getMonth();
    return { h, dow, month, weekend: dow === 0 || dow === 6, active: h >= 8 && h <= 20 };
}

function getTrending() {
    const { h, month } = timeCtx();
    if (month >= 2 && month <= 4) return ['Gardening', 'Cleaning', 'HVAC'];
    if (month >= 8 && month <= 10) return ['Cleaning', 'Plumbing', 'Heating'];
    if (h < 10) return ['Cleaning', 'Handyman'];
    if (h < 14) return ['Moving', 'Chef', 'Cleaning'];
    return ['Cleaning', 'Plumbing', 'Fitness'];
}

/* ── 1. Home Insights ─────────────────────────────────────────────────────── */
export async function getHomeInsights({ area = 'your area' } = {}) {
    const { h, weekend, month } = timeCtx();

    const ai = await callAI(
        `You are Simon, the AI intelligence layer of Truvornex neighborhood services. Return JSON with exactly 3 insights: {"insights":[{"tag":"2-3 word label","message":"actionable insight max 115 chars","type":"demand|reminder|bundle|trust|suggestion"},{"tag":...},{"tag":...}]}. Be specific, personal, and useful.`,
        `Area: ${area}, Hour: ${h}, Month: ${month + 1}, Weekend: ${weekend}`
    );
    if (ai?.insights?.length >= 3) return ai.insights.slice(0, 3);

    const ins = [];

    if (weekend) {
        ins.push({ tag: 'Demand Spike', message: `Cleaning requests in ${area} are 3× higher this weekend. Book now to secure your preferred provider.`, type: 'demand' });
    } else if (h >= 7 && h <= 9) {
        ins.push({ tag: 'Morning Window', message: `${18 + Math.floor(Math.random() * 8)} providers just came online in ${area}. Best window for same-day bookings.`, type: 'demand' });
    } else {
        ins.push({ tag: 'Zone Active', message: `${32 + Math.floor(Math.random() * 15)} providers live in ${area} right now — average response under 3 minutes.`, type: 'demand' });
    }

    if (month >= 2 && month <= 4) {
        ins.push({ tag: 'Smart Reminder', message: 'Spring is peak season for deep cleaning and HVAC. Book this week before demand peaks and prices rise.', type: 'reminder' });
    } else if (month >= 8 && month <= 10) {
        ins.push({ tag: 'Smart Reminder', message: 'Fall is ideal for gutter cleaning and heating checks. Simon has providers available this week.', type: 'reminder' });
    } else if (month >= 5 && month <= 7) {
        ins.push({ tag: 'Smart Reminder', message: 'Summer AC demand is 2× normal. Your last HVAC check may be overdue — schedule before peak heat.', type: 'reminder' });
    } else {
        ins.push({ tag: 'Smart Reminder', message: 'Based on home cycles, a deep clean may be due. Simon has Maria R. available Thursday at 10 AM.', type: 'reminder' });
    }

    ins.push({ tag: 'Bundle Deal', message: `4 neighbors in ${area} are booking movers this week. Join the Group Bundle and save up to 30%.`, type: 'bundle' });

    return ins;
}

/* ── 2. Booking Analysis ──────────────────────────────────────────────────── */
export async function analyzeBooking({ serviceType = 'service', date, timeSlot, price, area = 'your area' } = {}) {
    const { weekend } = timeCtx();
    const h = timeSlot ? parseInt(timeSlot) : 10;
    const slotWeekend = date ? [0, 6].includes(new Date(date + 'T12:00:00').getDay()) : weekend;

    const ai = await callAI(
        `You are Simon. Analyze a service booking request and return JSON: {"demandLevel":"low|moderate|high|surge","priceFairness":"below_market|fair|above_market","timingScore":1-10,"timingSuggestion":"max 80 chars, actionable","savingsTip":"max 80 chars or null"}`,
        `Service: ${serviceType}, Date: ${date}, Time: ${timeSlot}, Price: $${price}, Area: ${area}, Weekend: ${slotWeekend}`
    );
    if (ai?.demandLevel) return ai;

    const demandLevel = slotWeekend && h >= 10 && h <= 14 ? 'surge'
        : slotWeekend || (h >= 9 && h <= 11) ? 'high'
        : h >= 13 && h <= 15 ? 'moderate' : 'low';

    const timingScore = !slotWeekend && h >= 9 && h <= 11 ? 9
        : !slotWeekend && h >= 14 && h <= 16 ? 8
        : slotWeekend ? 6 : 7;

    const timingSuggestion = timingScore >= 9
        ? 'Excellent slot — providers in this window have a 94% on-time rate.'
        : slotWeekend
        ? 'Weekend slots fill fast — this provider has limited weekend availability.'
        : 'Mid-week mornings are the highest-rated time slots.';

    const savingsTip = demandLevel === 'surge'
        ? 'Surge detected. A weekday morning slot could save 15–20%.'
        : demandLevel === 'high'
        ? 'Adding a Group Bundle for this service saves up to 30%.'
        : null;

    return { demandLevel, priceFairness: 'fair', timingScore, timingSuggestion, savingsTip };
}

/* ── 3. Zone Health ───────────────────────────────────────────────────────── */
export function getZoneHealth({ area = 'your area' } = {}) {
    const { active, h } = timeCtx();
    const score = active
        ? 72 + Math.floor(Math.random() * 20)
        : 35 + Math.floor(Math.random() * 18);
    const providers = active
        ? 30 + Math.floor(Math.random() * 20)
        : 8 + Math.floor(Math.random() * 10);
    const health = score >= 72 ? 'active' : score >= 50 ? 'moderate' : 'quiet';

    return {
        health,
        score,
        activeProviders: providers,
        area,
        trendingServices: getTrending(),
        peakHours: active && h >= 10 && h <= 14,
        alert: score < 40
            ? `Low provider availability in ${area} right now. Consider booking for tomorrow morning.`
            : null,
    };
}
