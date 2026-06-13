/**
 * ServiceFlow Platform — Unified Export
 * 
 * This is the single entry point for all platform services.
 * Import from here to access any platform capability.
 * 
 * Architecture overview:
 * 
 *   ┌─────────────────────────────────────────────────────┐
 *   │                   Platform Layer                     │
 *   │                                                     │
 *   │  eventBus          → typed domain event system      │
 *   │  auditLogger       → immutable audit trail          │
 *   │  workflowEngine    → booking state machine          │
 *   │  automationEngine  → rule-based automation          │
 *   │  notificationService → in-app + email alerts        │
 *   │  invoiceService    → financial document lifecycle   │
 *   │  analyticsEngine   → metrics, forecasting, KPIs     │
 *   │  customerMemoryService → customer intelligence      │
 *   └─────────────────────────────────────────────────────┘
 * 
 * Domain Entities:
 *   Booking, Provider, Service, ServiceCategory, Review
 *   AuditLog, AutomationRule, Notification, Invoice
 *   CustomerMemory, WorkflowEvent, ProviderMetrics
 */

export { eventBus } from './eventBus';
export { auditLogger } from './auditLogger';
export { workflowEngine } from './workflowEngine';
export { automationEngine } from './automationEngine';
export { notificationService } from './notificationService';
export { invoiceService } from './invoiceService';
export { customerMemoryService } from './customerMemoryService';

export {
    computePlatformKPIs,
    computeMonthlyRevenue,
    computeBookingsByDayOfWeek,
    computeTopProviders,
    computeStatusDistribution,
    computeRevenueByCategory,
    computeCustomerRetention,
    forecastNextMonthRevenue,
    snapshotProviderMetrics,
} from './analyticsEngine';

export {
    isValidBookingTransition,
    bookingStatusToEvent,
    computeLoyaltyTier,
    computeRiskScore,
    generateInvoiceNumber,
    generateCorrelationId,
    BOOKING_TRANSITIONS,
} from './utils';