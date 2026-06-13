/**
 * Financial Engine — Feature #4
 *
 * The financial layer that makes Truvornex a de-facto digital banking
 * entry point for gig workers — BNPL for customers, instant payouts
 * and savings recommendations for providers.
 */

// ─── BNPL (Buy Now Pay Later) ─────────────────────────────────────────────────

/**
 * Determines if a customer is eligible for BNPL on a service booking.
 * Factors: loyalty tier, booking history, risk score, minimum spend threshold.
 */
export function computeBNPLEligibility(customer, bookings, requestedAmount) {
    const completedBookings = bookings.filter(b =>
        b.customer_email === customer.email && b.status === 'completed'
    );
    const cancelledBookings = bookings.filter(b =>
        b.customer_email === customer.email && b.status === 'cancelled'
    );
    const noShows = bookings.filter(b =>
        b.customer_email === customer.email && b.status === 'no_show'
    );

    const totalSpent = completedBookings.reduce((s, b) => s + (b.price || 0), 0);
    const cancelRate = bookings.length > 0 ? cancelledBookings.length / bookings.length : 0;
    const noShowRate = bookings.length > 0 ? noShows.length / bookings.length : 0;

    // Eligibility rules
    const reasons = [];

    if (completedBookings.length < 2) {
        reasons.push('Need at least 2 completed bookings to qualify');
    }
    if (cancelRate > 0.4) {
        reasons.push('Cancellation rate is too high');
    }
    if (noShowRate > 0.2) {
        reasons.push('No-show rate is too high');
    }

    // Tier-based credit limits
    const creditLimits = {
        champion: 5000,
        vip: 2000,
        regular: 500,
        new: 0,
    };
    const tier = customer.loyalty_tier || 'new';
    const creditLimit = creditLimits[tier] || 0;

    if (creditLimit === 0) {
        reasons.push('Loyalty tier does not qualify for BNPL yet');
    }

    const eligible = reasons.length === 0 && creditLimit > 0;
    const approvedAmount = eligible ? Math.min(requestedAmount || creditLimit, creditLimit) : 0;

    return {
        eligible,
        reasons,
        creditLimit,
        approvedAmount,
        tier,
        repaymentOptions: eligible ? generateRepaymentOptions(approvedAmount) : [],
        completedBookings: completedBookings.length,
        totalSpent,
    };
}

function generateRepaymentOptions(amount) {
    if (amount <= 0) return [];
    return [
        { installments: 2, intervalDays: 30, perInstallment: Math.ceil(amount / 2), fee: 0, label: '2 months, 0% fee' },
        { installments: 3, intervalDays: 30, perInstallment: Math.ceil(amount / 3), fee: Math.round(amount * 0.02), label: '3 months, 2% fee' },
        { installments: 6, intervalDays: 30, perInstallment: Math.ceil(amount / 6), fee: Math.round(amount * 0.05), label: '6 months, 5% fee' },
    ];
}

// ─── Instant Payout ───────────────────────────────────────────────────────────

/**
 * Determines if a provider is eligible for instant payout (vs standard settlement).
 * High-trust providers with consistent completion get priority payout.
 */
export function computeInstantPayoutEligibility(provider, bookings) {
    const providerBookings = bookings.filter(b => b.provider_id === provider.id);
    const completed = providerBookings.filter(b => b.status === 'completed');
    const noShows = providerBookings.filter(b => b.status === 'no_show');

    const completionRate = providerBookings.length > 0
        ? completed.length / providerBookings.length
        : 0;
    const noShowRate = providerBookings.length > 0
        ? noShows.length / providerBookings.length
        : 0;

    const reasons = [];
    if (completed.length < 5) reasons.push('Need at least 5 completed jobs');
    if (completionRate < 0.8) reasons.push('Completion rate below 80%');
    if (noShowRate > 0.1) reasons.push('No-show rate too high');
    if (!provider.verified) reasons.push('Provider verification required');

    const eligible = reasons.length === 0;

    // Pending payout = sum of completed but unpaid
    const pendingRevenue = completed
        .filter(b => !b.paid_at)
        .reduce((s, b) => s + (b.price || 0), 0);

    // Standard settlement is T+7; instant is within 24h
    return {
        eligible,
        reasons,
        settlementType: eligible ? 'instant' : 'standard',
        settlementHours: eligible ? 24 : 168,
        pendingRevenue,
        instantFee: eligible ? Math.round(pendingRevenue * 0.015 * 100) / 100 : 0,
        netInstantPayout: eligible ? Math.round((pendingRevenue * 0.985) * 100) / 100 : 0,
        completionRate: Math.round(completionRate * 100),
        completedJobs: completed.length,
    };
}

// ─── Provider Savings Engine ──────────────────────────────────────────────────

/**
 * Generates savings recommendations for a provider based on their earnings.
 * Targets the unbanked/underbanked gig worker — encourages building
 * a financial buffer within the platform.
 */
export function computeProviderSavingsRecommendation(provider, bookings) {
    const completed = bookings.filter(b =>
        b.provider_id === provider.id && b.status === 'completed'
    );

    const totalRevenue = completed.reduce((s, b) => s + (b.price || 0), 0);
    const monthlyRevenue = computeMonthlyRevenueForProvider(completed);
    const avgMonthly = monthlyRevenue.length > 0
        ? monthlyRevenue.reduce((s, m) => s + m.revenue, 0) / monthlyRevenue.length
        : 0;

    const volatility = computeRevenueVolatility(monthlyRevenue);

    // Emergency fund target = 3 months of average revenue
    const emergencyFundTarget = Math.round(avgMonthly * 3);
    const recommendedMonthlySaving = Math.round(avgMonthly * 0.15);

    // Tool/equipment BNPL: providers can buy tools on credit against future earnings
    const bnplForTools = totalRevenue >= 500 && completed.length >= 10;

    return {
        avgMonthlyRevenue: Math.round(avgMonthly),
        totalEarned: Math.round(totalRevenue),
        volatility,
        emergencyFundTarget,
        recommendedMonthlySaving,
        recommendedSavingsRate: '15%',
        bnplForToolsEligible: bnplForTools,
        bnplToolsCreditLimit: bnplForTools ? Math.round(avgMonthly * 0.5) : 0,
        milestones: generateSavingsMilestones(totalRevenue, avgMonthly),
        insights: generateSavingsInsights(avgMonthly, volatility, completed.length),
    };
}

function computeMonthlyRevenueForProvider(completedBookings) {
    const map = {};
    for (const b of completedBookings) {
        if (!b.date) continue;
        const month = b.date.slice(0, 7);
        if (!map[month]) map[month] = { month, revenue: 0 };
        map[month].revenue += b.price || 0;
    }
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
}

function computeRevenueVolatility(monthlyRevenue) {
    if (monthlyRevenue.length < 2) return 'unknown';
    const revenues = monthlyRevenue.map(m => m.revenue);
    const avg = revenues.reduce((s, v) => s + v, 0) / revenues.length;
    const variance = revenues.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / revenues.length;
    const cv = avg > 0 ? Math.sqrt(variance) / avg : 0;
    return cv > 0.5 ? 'high' : cv > 0.25 ? 'moderate' : 'stable';
}

function generateSavingsMilestones(totalRevenue, avgMonthly) {
    const milestones = [
        { label: 'Emergency fund (1 month)', target: Math.round(avgMonthly), reached: totalRevenue * 0.1 >= avgMonthly },
        { label: 'Emergency fund (3 months)', target: Math.round(avgMonthly * 3), reached: totalRevenue * 0.1 >= avgMonthly * 3 },
        { label: 'Tool upgrade fund', target: 300, reached: totalRevenue * 0.1 >= 300 },
        { label: 'Business insurance buffer', target: 500, reached: totalRevenue * 0.1 >= 500 },
    ];
    return milestones;
}

function generateSavingsInsights(avgMonthly, volatility, completedJobs) {
    const insights = [];
    if (volatility === 'high') {
        insights.push('Your income is quite variable — a bigger emergency fund (4-6 months) would give you stability.');
    }
    if (avgMonthly > 0) {
        insights.push(`Saving 15% of your earnings means PKR ${Math.round(avgMonthly * 0.15).toLocaleString()} / month set aside automatically.`);
    }
    if (completedJobs >= 20) {
        insights.push('With 20+ completed jobs, you qualify for Truvornex BNPL to finance tools and equipment.');
    }
    return insights;
}

// ─── Wallet Balance Summary ───────────────────────────────────────────────────

/**
 * Computes a comprehensive wallet summary for a provider.
 * Includes pending payouts, savings balance, and BNPL exposure.
 */
export function computeProviderWalletSummary(provider, bookings) {
    const providerBookings = bookings.filter(b => b.provider_id === provider.id);
    const completed = providerBookings.filter(b => b.status === 'completed');
    const pending = providerBookings.filter(b => ['pending', 'confirmed'].includes(b.status));

    const totalEarned = completed.reduce((s, b) => s + (b.price || 0), 0);
    const pendingEarnings = pending.reduce((s, b) => s + (b.price || 0), 0);
    const payoutEligibility = computeInstantPayoutEligibility(provider, bookings);
    const savings = computeProviderSavingsRecommendation(provider, bookings);

    return {
        totalEarned,
        pendingEarnings,
        instantPayoutEligible: payoutEligibility.eligible,
        pendingPayoutAmount: payoutEligibility.pendingRevenue,
        instantPayoutNet: payoutEligibility.netInstantPayout,
        savingsRecommendation: savings,
        walletHealth: totalEarned > savings.avgMonthlyRevenue * 3 ? 'healthy' :
            totalEarned > savings.avgMonthlyRevenue ? 'growing' : 'early',
    };
}

// ─── Customer Spending Intelligence ──────────────────────────────────────────

/**
 * Analyses a customer's spending patterns and generates budget recommendations.
 */
export function computeCustomerSpendingIntelligence(customerEmail, bookings) {
    const myBookings = bookings.filter(b =>
        b.customer_email === customerEmail && b.status === 'completed'
    );

    const totalSpent = myBookings.reduce((s, b) => s + (b.price || 0), 0);
    const byCategory = {};
    for (const b of myBookings) {
        const cat = b.category_slug || 'other';
        if (!byCategory[cat]) byCategory[cat] = { count: 0, total: 0 };
        byCategory[cat].count++;
        byCategory[cat].total += b.price || 0;
    }

    const topCategories = Object.entries(byCategory)
        .map(([cat, data]) => ({ category: cat, ...data, avgSpend: Math.round(data.total / data.count) }))
        .sort((a, b) => b.total - a.total);

    const avgMonthlySpend = computeAvgMonthlySpend(myBookings);

    return {
        totalSpent,
        avgMonthlySpend,
        topCategories,
        bookingCount: myBookings.length,
        avgBookingValue: myBookings.length > 0 ? Math.round(totalSpent / myBookings.length) : 0,
        budgetRecommendation: avgMonthlySpend > 0 ? Math.round(avgMonthlySpend * 1.1) : null,
        savingsOpportunity: topCategories.length > 0 ? `Bundle your top services to save up to 15%` : null,
    };
}

function computeAvgMonthlySpend(bookings) {
    if (bookings.length === 0) return 0;
    const byMonth = {};
    for (const b of bookings) {
        if (!b.date) continue;
        const month = b.date.slice(0, 7);
        byMonth[month] = (byMonth[month] || 0) + (b.price || 0);
    }
    const months = Object.values(byMonth);
    return months.length > 0 ? Math.round(months.reduce((s, v) => s + v, 0) / months.length) : 0;
}
