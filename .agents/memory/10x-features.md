---
name: 10x Feature Layer
description: Six strategic features implemented as pure logic/service files — no UI changes. All wired through src/lib/platform/index.js.
---

## Files Added

- `src/lib/platform/neighborhoodOSEngine.js` — computeZoneSummary(), trust graph, service gap analysis, zone health scores
- `src/lib/platform/reputationExport.js` — generateReputationCredential(), generateCredentialURL(), verifyCredentialFromURL()
- `src/lib/platform/financialEngine.js` — computeBNPLEligibility(), computeInstantPayoutEligibility(), computeProviderWalletSummary()
- `src/lib/platform/diasporaService.js` — createDiasporaBookingRequest(), buildCarePackage(), SUPPORTED_MARKETS (PK + FI)
- `src/lib/platform/communityTrustEngine.js` — vouchForProvider(), computeCommunityTrustBoost(), computeNeighborhoodVerificationStatus()

## Files Modified

- `src/lib/ai/engine.js` — computeTrustScore() now accepts optional communityBoost param (up to +12 points from vouches)
- `src/lib/ai/simon.js` — added simonDispatch(), simonMaintenanceReminders(), simonDynamicPricing(), simonNeighbourhoodDispatch(); updated buildSystemPrompt() with 10x strategic context; version bumped to 3.0
- `src/lib/platform/index.js` — exports all new services

## Key Decisions

- Community vouch boost is optional param (default 0) — backward compatible with all existing computeTrustScore() call sites
- diasporaService uses btoa/atob for care package IDs — browser-only, no server needed
- communityTrustEngine writes vouches to `provider_vouches` Supabase table (needs to be created in schema)
- BNPL credit limits: champion=5000, vip=2000, regular=500, new=0

**Why:** All features implemented as pure logic without UI changes per explicit user instruction.
