# Truvornex Flutter

Full production-grade Flutter port of the Truvornex Hyperlocal Neighborhood Service Platform.

## Design System

| Token | Value |
|---|---|
| Dark Background | `#080808` |
| Dark Surface | `#111111` |
| Primary | `#FFFFFF` |
| On-Primary | `#080808` |
| Font | Inter + JetBrains Mono |

## Running

```bash
# With Supabase credentials
flutter run \
  --dart-define=SUPABASE_URL=https://xxxx.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your_anon_key

# Dev mode (no Supabase)
flutter run
```

## Architecture

```
lib/
├── core/
│   ├── auth/          # Riverpod auth state + Supabase auth
│   ├── routing/       # GoRouter + StatefulShellRoute shells
│   ├── supabase/      # Supabase client + realtime service
│   ├── theme/         # AppColors, AppTypography, AppSpacing, AppTheme
│   └── utils/         # Formatters, validators
└── features/
    ├── shared/
    │   ├── models/    # Booking, Provider, Service, Review, UserProfile
    │   └── widgets/   # TxCard, TxButton, TxInput, TxBadge, TxAvatar…
    ├── splash/
    ├── auth/          # Login + Onboarding
    ├── customer/      # Home, Services, AI, Spending, Profile, Neighborhood, Events, Community, Loyalty
    ├── provider/      # Dashboard, Bookings, Services, Earnings, Availability, Copilot, AI Insights
    └── admin/         # Shell + Dashboard, Users, Providers, Bookings, Analytics, Health, Financial, AI Control
```

## Admin Access

Navigate to `/x7k9m2q4p8w1n5v3r6t0y/admin` — obfuscated path, requires auth.

## Notes

- Riverpod `.g.dart` stub files are pre-written to skip `build_runner` in dev.
  Run `dart run build_runner build --delete-conflicting-outputs` for production codegen.
- Theme is locked to `ThemeMode.dark` by default — preserves `bg=#080808` identity.
