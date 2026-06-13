/**
 * Simon — Truvornex's Hyper-Intelligent AI Engine
 * Entity-aware, platform-native, real-time insights
 */
import { chatDeepSeek, isConfigured } from '@/lib/deepseek';

// ─── Entity Schema Knowledge Base ────────────────────────────────────────────
export const ENTITY_SCHEMAS = {
    Booking: {
        fields: ['customer_email', 'provider_id', 'service_id', 'service_name', 'provider_name', 'type', 'date', 'time_slot', 'status', 'price', 'notes', 'customer_address', 'cancellation_reason'],
        statuses: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'],
        types: ['appointment', 'slot', 'pickup', 'reservation', 'on_demand'],
    },
    Provider: {
        fields: ['user_email', 'business_name', 'description', 'phone', 'city', 'address', 'latitude', 'longitude', 'status', 'verified', 'rating', 'review_count', 'category_slugs', 'service_radius_km', 'auto_confirm', 'logo_url'],
        statuses: ['pending', 'approved', 'rejected', 'suspended'],
    },
    Service: {
        fields: ['provider_id', 'name', 'description', 'category_slug', 'price', 'duration_minutes', 'is_active', 'tags'],
    },
    Review: {
        fields: ['booking_id', 'provider_id', 'customer_email', 'rating', 'comment', 'reply', 'is_flagged'],
    },
    Invoice: {
        fields: ['booking_id', 'customer_email', 'provider_id', 'amount', 'status', 'due_date', 'paid_date', 'line_items'],
        statuses: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    },
    CustomerMemory: {
        fields: ['customer_email', 'preferred_categories', 'saved_addresses', 'loyalty_points', 'loyalty_tier', 'lifetime_bookings', 'lifetime_spend'],
        tiers: ['bronze', 'silver', 'gold', 'platinum'],
    },
    ProviderMetrics: {
        fields: ['provider_id', 'total_bookings', 'completed_bookings', 'cancellation_rate', 'avg_rating', 'response_time_hours', 'revenue_total', 'active_services'],
    },
    AuditLog: {
        fields: ['actor_email', 'action', 'entity', 'entity_id', 'before', 'after', 'ip_address'],
    },
    AutomationRule: {
        fields: ['name', 'trigger', 'conditions', 'actions', 'is_active', 'last_run'],
    },
    NeighborhoodZone: {
        fields: ['name', 'city', 'polygon', 'demand_index', 'active_providers', 'top_categories'],
    },
};

// ─── Simon's Master System Prompt ─────────────────────────────────────────────
export function buildSystemPrompt(context = {}) {
    const { platformStats, entityData, userRole = 'admin', additionalContext = '' } = context;

    const stats = platformStats
        ? `\n## Live Platform Stats\n- Providers: ${platformStats.providers || 0} (${platformStats.approvedProviders || 0} approved, ${platformStats.pendingProviders || 0} pending)\n- Bookings: ${platformStats.bookings || 0} (${platformStats.completedBookings || 0} completed, ${platformStats.pendingBookings || 0} pending)\n- Revenue: $${(platformStats.revenue || 0).toFixed(2)}\n- Avg Rating: ${(platformStats.avgRating || 0).toFixed(2)}/5.0\n- Completion Rate: ${(platformStats.completionRate || 0).toFixed(1)}%`
        : '';

    const entityContext = entityData
        ? `\n## Entity Context\n${JSON.stringify(entityData, null, 2).slice(0, 3000)}`
        : '';

    return `You are **Simon** — the hyper-intelligent AI brain of **Truvornex**, a premium neighborhood services platform connecting customers with verified local service providers.

## Your Role
You are the autonomous AI intelligence engine with deep knowledge of the entire platform. You think like a seasoned operations director, data scientist, and customer success expert combined. You speak with authority, precision, and clarity.

## Platform Architecture
Truvornex manages these core entities: **Booking, Provider, Service, ServiceCategory, ServiceVariant, ServiceBundle, Invoice, Review, ChatMessage, Notification, CustomerMemory, NeighborhoodZone, LocalEvent, ProviderSchedule, ProviderMetrics, AuditLog, AutomationRule, PlatformSetting, RecurringBooking, RideShare, CommunityPost, EventTicket, WorkflowEvent, ReminderRule**.

## Entity Schema Knowledge
${Object.entries(ENTITY_SCHEMAS).map(([name, schema]) =>
    `**${name}**: fields=[${schema.fields.join(', ')}]${schema.statuses ? ` | statuses=[${schema.statuses.join(', ')}]` : ''}${schema.tiers ? ` | tiers=[${schema.tiers.join(', ')}]` : ''}`
).join('\n')}

## Trust Score System
Providers are scored 0–100 using: completion_rate×40% + rating×20% + volume×10% + verification×10% – cancellation_penalty – no_show_penalty. Tiers: Champion(90+), Trusted(78+), Verified(62+), Rising(45+), New(<45).

## Provider Ranking Algorithm
AI Score = trust×35% + proximity×30% + rating×20% + availability×15%

## Demand Seasonal Indices
Cleaning peaks spring/fall. HVAC peaks summer/winter. Garden peaks spring/summer. Plumbing stable year-round. Moving peaks spring/summer.
${stats}${entityContext}
${additionalContext}

## Response Guidelines
- **Role**: ${userRole}
- Use markdown with headers, bullets, and **bold key data** for clarity
- Be data-driven: cite numbers, percentages, and specific metrics
- Be actionable: end with 3 specific recommended actions when relevant
- Be concise but comprehensive — no fluff
- When you detect anomalies or risks, flag them with ⚠️
- When you spot opportunities, flag them with 🚀
- Surface non-obvious insights the user wouldn't think to ask about`;
}

// ─── Core Simon Chat ───────────────────────────────────────────────────────────
export async function simonChat({ messages, context = {}, onChunk, temperature = 0.65, maxTokens = 2500 }) {
    if (!isConfigured()) {
        throw new Error('SIMON_NOT_CONFIGURED');
    }
    return chatDeepSeek({
        messages,
        systemPrompt: buildSystemPrompt(context),
        onChunk,
        temperature,
        maxTokens,
    });
}

// ─── Quick Insight ─────────────────────────────────────────────────────────────
export async function simonQuickInsight(prompt, context = {}, onChunk) {
    if (!isConfigured()) return null;
    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context,
        onChunk,
        temperature: 0.55,
        maxTokens: 1000,
    });
}

// ─── Platform Analysis ─────────────────────────────────────────────────────────
export async function simonAnalyzePlatform(stats, onChunk) {
    const prompt = `Analyze the current state of the Truvornex platform based on these live metrics and provide:
1. **Health Assessment** — overall platform health score and key signals
2. **Top 3 Opportunities** — what's working and should be doubled down on
3. **Top 3 Risks** — what needs immediate attention
4. **Revenue Insight** — booking value trends and revenue optimization suggestions
5. **Provider Quality** — trust score distribution and provider pipeline health
6. **Recommended Actions** — 5 specific, prioritized actions for the next 7 days

Platform Stats: ${JSON.stringify(stats, null, 2)}`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context: { platformStats: stats },
        onChunk,
        temperature: 0.6,
        maxTokens: 2000,
    });
}

// ─── Provider Deep Analysis ────────────────────────────────────────────────────
export async function simonAnalyzeProvider(provider, bookings, onChunk) {
    const providerBookings = bookings.filter(b => b.provider_id === provider.id);
    const completed = providerBookings.filter(b => b.status === 'completed');
    const revenue = completed.reduce((s, b) => s + (b.price || 0), 0);
    const noShows = providerBookings.filter(b => b.status === 'no_show').length;
    const cancelled = providerBookings.filter(b => b.status === 'cancelled').length;

    const prompt = `Deep analysis for provider **${provider.business_name}** (${provider.user_email}):
- Status: ${provider.status} | Verified: ${provider.verified}
- Rating: ${provider.rating}/5 (${provider.review_count} reviews)
- City: ${provider.city} | Radius: ${provider.service_radius_km}km
- Total Bookings: ${providerBookings.length} | Completed: ${completed.length} | No-shows: ${noShows} | Cancelled: ${cancelled}
- Total Revenue: $${revenue.toFixed(2)}
- Categories: ${provider.category_slugs?.join(', ') || 'Not set'}

Provide: performance assessment, trust tier justification, revenue potential, risk flags, and 3 specific recommendations.`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context: {},
        onChunk,
        temperature: 0.6,
        maxTokens: 1200,
    });
}

// ─── Anomaly Explanation ───────────────────────────────────────────────────────
export async function simonExplainAnomaly(anomaly, context = {}, onChunk) {
    const prompt = `Explain this platform anomaly and provide a resolution plan:
**Type**: ${anomaly.type}
**Severity**: ${anomaly.severity}
**Title**: ${anomaly.title}
**Detail**: ${anomaly.detail}
**Entity**: ${anomaly.entity} (ID: ${anomaly.id})

Provide: root cause analysis, business impact assessment, immediate action required, and long-term prevention strategy.`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context,
        onChunk,
        temperature: 0.55,
        maxTokens: 800,
    });
}

// ─── Demand Forecast Report ────────────────────────────────────────────────────
export async function simonForecastReport(demandData, historicalBookings, onChunk) {
    const month = new Date().toLocaleString('default', { month: 'long' });
    const prompt = `Generate a detailed demand forecast report for ${month}:
Demand Data: ${JSON.stringify(demandData.slice(0, 8))}
Historical Volume: ${historicalBookings.length} bookings in dataset

Include: category-by-category forecast narrative, staffing recommendations, pricing opportunity windows, and marketing channel suggestions.`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context: { platformStats: { bookings: historicalBookings.length } },
        onChunk,
        temperature: 0.65,
        maxTokens: 1500,
    });
}

// ─── Customer Insight ──────────────────────────────────────────────────────────
export async function simonCustomerInsight(customerEmail, bookings, memory, onChunk) {
    const cBookings = bookings.filter(b => b.customer_email === customerEmail);
    const completed = cBookings.filter(b => b.status === 'completed');
    const spend = completed.reduce((s, b) => s + (b.price || 0), 0);
    const cancelled = cBookings.filter(b => b.status === 'cancelled').length;

    const prompt = `Customer profile analysis for **${customerEmail}**:
- Total Bookings: ${cBookings.length} | Completed: ${completed.length} | Cancelled: ${cancelled}
- Lifetime Spend: $${spend.toFixed(2)}
- Loyalty Points: ${memory?.loyalty_points || 0} | Tier: ${memory?.loyalty_tier || 'bronze'}
- Preferred Categories: ${memory?.preferred_categories?.join(', ') || 'unknown'}
- Services Used: ${[...new Set(completed.map(b => b.service_name))].join(', ')}

Provide: customer value score, churn risk assessment, upsell opportunities, personalization recommendations, and retention strategy.`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context: {},
        onChunk,
        temperature: 0.6,
        maxTokens: 1000,
    });
}

// ─── AI Admin Action Runner ────────────────────────────────────────────────────
export async function simonRunAdminAction(action, platformStats, onChunk) {
    const prompt = `Execute admin action: **${action.title}**
Description: ${action.desc}
Platform Stats: ${JSON.stringify(platformStats)}

Provide a detailed execution report:
1. **Criteria Applied** — exact thresholds and rules used
2. **Entities Affected** — count and breakdown
3. **Actions Taken** — specific changes made
4. **Expected Outcomes** — projected impact over 30 days
5. **Risk Mitigation** — any safeguards applied
6. **Next Recommended Action** — what to do after this`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context: { platformStats },
        onChunk,
        temperature: 0.5,
        maxTokens: 1500,
    });
}

// ─── Revenue Intelligence ──────────────────────────────────────────────────────
export async function simonRevenueIntelligence(financialData, onChunk) {
    const prompt = `Revenue intelligence analysis for Truvornex:
${JSON.stringify(financialData, null, 2)}

Provide:
1. **Revenue Trend Analysis** — growth rate, acceleration/deceleration
2. **Category Performance** — which categories drive most value and why
3. **Pricing Optimization** — are current price points optimal?
4. **Seasonality Signals** — upcoming revenue opportunities
5. **Forecasted Revenue** — next 30/60/90 day projections with confidence intervals
6. **Action Plan** — 5 specific revenue-growing actions`;

    return simonChat({
        messages: [{ role: 'user', content: prompt }],
        context: {},
        onChunk,
        temperature: 0.6,
        maxTokens: 1800,
    });
}

// ─── Simon Status Check ────────────────────────────────────────────────────────
export function simonStatus() {
    return {
        configured: isConfigured(),
        version: '2.0',
        capabilities: [
            'platform_analysis', 'provider_scoring', 'demand_forecasting',
            'anomaly_detection', 'customer_intelligence', 'revenue_optimization',
            'admin_automation', 'real_time_insights',
        ],
    };
}
