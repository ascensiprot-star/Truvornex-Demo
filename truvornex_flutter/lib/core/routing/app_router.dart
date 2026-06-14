import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import '../auth/auth_provider.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/auth/login_screen.dart';
import '../../features/auth/onboarding_screen.dart';
import '../../features/customer/home/home_screen.dart';
import '../../features/customer/services/services_screen.dart';
import '../../features/customer/services/nearby_providers_screen.dart';
import '../../features/customer/services/provider_detail_screen.dart';
import '../../features/customer/booking/book_service_screen.dart';
import '../../features/customer/profile/customer_profile_screen.dart';
import '../../features/customer/profile/stub_screens.dart';
import '../../features/customer/neighborhood/dashboard/neighborhood_dashboard_screen.dart';
import '../../features/customer/neighborhood/emergency/emergency_request_screen.dart';
import '../../features/customer/neighborhood/group_buy/group_buy_screen.dart';
import '../../features/customer/neighborhood/skill_swap/skill_swap_screen.dart';
import '../../features/customer/neighborhood/jury/jury_screen.dart';
import '../../features/customer/ai/ai_assistant_screen.dart';
import '../../features/customer/financial/spending_analytics_screen.dart';
import '../../features/customer/events/events_screen.dart';
import '../../features/customer/community/community_screen.dart';
import '../../features/customer/loyalty/loyalty_screen.dart';
import '../../features/provider/dashboard/provider_dashboard_screen.dart';
import '../../features/provider/bookings/provider_bookings_screen.dart';
import '../../features/provider/services/manage_services_screen.dart';
import '../../features/provider/earnings/provider_earnings_screen.dart';
import '../../features/provider/availability/provider_availability_screen.dart';
import '../../features/provider/copilot/provider_copilot_screen.dart';
import '../../features/provider/insights/provider_ai_insights_screen.dart';
import '../../features/admin/admin_shell.dart';
import '../../features/admin/admin_dashboard_screen.dart';
import '../../features/admin/admin_users_screen.dart';
import '../../features/admin/admin_providers_screen.dart';
import '../../features/admin/admin_bookings_screen.dart';
import '../../features/admin/admin_analytics_screen.dart';
import '../../features/admin/admin_system_health_screen.dart';
import '../../features/admin/admin_financial_screen.dart';
import '../../features/admin/admin_ai_control_screen.dart';
import '../../features/shared/widgets/tx_app_bar.dart';
import 'route_names.dart';

part 'app_router.g.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _customerShellKey = GlobalKey<NavigatorState>(debugLabel: 'customer');
final _providerShellKey = GlobalKey<NavigatorState>(debugLabel: 'provider');

@riverpod
GoRouter appRouter(AppRouterRef ref) {
  final authState = ref.watch(authNotifierProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/splash',
    redirect: (context, state) {
      final isLoading   = authState.isLoading;
      final isAuth      = authState.valueOrNull?.session != null;
      final isSplash    = state.matchedLocation == '/splash';
      final isAuthRoute = state.matchedLocation.startsWith('/login') ||
                          state.matchedLocation.startsWith('/onboarding');

      if (isLoading) return isSplash ? null : '/splash';
      if (!isAuth && !isAuthRoute && !isSplash) return '/login';
      if (isAuth && isAuthRoute) return '/';
      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        name: RouteNames.splash,
        builder: (_, __) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        name: RouteNames.login,
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        name: RouteNames.onboarding,
        builder: (_, __) => const OnboardingScreen(),
      ),

      // ── Customer Shell ────────────────────────────────────────────
      StatefulShellRoute.indexedStack(
        builder: (context, state, shell) => CustomerShell(shell: shell),
        branches: [
          StatefulShellBranch(
            navigatorKey: _customerShellKey,
            routes: [
              GoRoute(
                path: '/',
                name: RouteNames.home,
                builder: (_, __) => const HomeScreen(),
                routes: [
                  GoRoute(
                    path: 'providers/:providerId',
                    name: RouteNames.providerDetail,
                    builder: (_, state) => ProviderDetailScreen(
                      providerId: state.pathParameters['providerId']!,
                    ),
                  ),
                  GoRoute(
                    path: 'book/:providerId/:serviceId',
                    name: RouteNames.bookService,
                    builder: (_, state) => BookServiceScreen(
                      providerId: state.pathParameters['providerId']!,
                      serviceId: state.pathParameters['serviceId']!,
                    ),
                  ),
                ],
              ),
            ],
          ),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/services',
              name: RouteNames.services,
              builder: (_, __) => const ServicesScreen(),
              routes: [
                GoRoute(
                  path: 'nearby',
                  name: RouteNames.nearbyProviders,
                  builder: (_, __) => const NearbyProvidersScreen(),
                ),
                GoRoute(
                  path: 'category/:slug',
                  name: RouteNames.categoryProviders,
                  builder: (_, state) => NearbyProvidersScreen(
                    categorySlug: state.pathParameters['slug'],
                  ),
                ),
              ],
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/ai',
              name: RouteNames.aiAssistant,
              builder: (_, __) => const AIAssistantScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/spending',
              name: RouteNames.spending,
              builder: (_, __) => const SpendingAnalyticsScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/profile',
              name: RouteNames.customerProfile,
              builder: (_, __) => const CustomerProfileScreen(),
            ),
          ]),
        ],
      ),

      // ── Standalone Customer Routes ────────────────────────────────
      GoRoute(path: '/neighborhood', name: RouteNames.neighborhood,
        builder: (_, __) => const NeighborhoodDashboardScreen()),
      GoRoute(path: '/neighborhood/emergency', name: RouteNames.emergency,
        builder: (_, __) => const EmergencyRequestScreen()),
      GoRoute(path: '/neighborhood/group-buy', name: RouteNames.groupBuy,
        builder: (_, __) => const GroupBuyScreen()),
      GoRoute(path: '/neighborhood/skill-swap', name: RouteNames.skillSwap,
        builder: (_, __) => const SkillSwapScreen()),
      GoRoute(path: '/neighborhood/jury', name: RouteNames.jury,
        builder: (_, __) => const JuryScreen()),
      GoRoute(path: '/events', name: RouteNames.events,
        builder: (_, __) => const EventsScreen()),
      GoRoute(path: '/community', name: RouteNames.community,
        builder: (_, __) => const CommunityScreen()),
      GoRoute(path: '/loyalty', name: RouteNames.loyalty,
        builder: (_, __) => const LoyaltyScreen()),

      // ── Stub profile routes ──────────────────────────────────────
      GoRoute(path: '/notifications', name: RouteNames.notifications,
        builder: (_, __) => const NotificationsScreen()),
      GoRoute(path: '/booking-history', name: RouteNames.bookingHistory,
        builder: (_, __) => const BookingHistoryScreen()),
      GoRoute(path: '/saved-addresses', name: RouteNames.savedAddresses,
        builder: (_, __) => const SavedAddressesScreen()),
      GoRoute(path: '/reviews', name: RouteNames.reviews,
        builder: (_, __) => const ReviewsScreen()),
      GoRoute(path: '/payment-methods', name: RouteNames.paymentMethods,
        builder: (_, __) => const PaymentMethodsScreen()),
      GoRoute(path: '/invoices', name: RouteNames.invoices,
        builder: (_, __) => const InvoicesScreen()),
      GoRoute(path: '/gift-cards', name: RouteNames.giftCards,
        builder: (_, __) => const GiftCardsScreen()),
      GoRoute(path: '/referral', name: RouteNames.referral,
        builder: (_, __) => const ReferralScreen()),
      GoRoute(path: '/help-center', name: RouteNames.helpCenter,
        builder: (_, __) => const HelpCenterScreen()),
      GoRoute(path: '/support-tickets', name: RouteNames.supportTickets,
        builder: (_, __) => const SupportTicketsScreen()),
      GoRoute(path: '/notification-settings', name: RouteNames.notifSettings,
        builder: (_, __) => const NotifSettingsScreen()),
      GoRoute(path: '/privacy', name: RouteNames.privacy,
        builder: (_, __) => const PrivacyScreen()),
      GoRoute(path: '/track-service', name: RouteNames.trackService,
        builder: (_, __) => const TrackServiceScreen()),
      GoRoute(path: '/recurring', name: RouteNames.recurring,
        builder: (_, __) => const RecurringServicesScreen()),

      // ── Provider Shell ────────────────────────────────────────────
      StatefulShellRoute.indexedStack(
        builder: (context, state, shell) => ProviderShell(shell: shell),
        branches: [
          StatefulShellBranch(
            navigatorKey: _providerShellKey,
            routes: [
              GoRoute(
                path: '/provider',
                name: RouteNames.providerHome,
                builder: (_, __) => const ProviderDashboardScreen(),
              ),
            ],
          ),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/provider/bookings',
              name: RouteNames.providerBookings,
              builder: (_, __) => const ProviderBookingsScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/provider/services',
              name: RouteNames.providerServices,
              builder: (_, __) => const ManageServicesScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/provider/earnings',
              name: RouteNames.providerEarnings,
              builder: (_, __) => const ProviderEarningsScreen(),
            ),
          ]),
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/provider/profile',
              name: RouteNames.providerProfile,
              builder: (_, __) => const CustomerProfileScreen(isProvider: true),
            ),
          ]),
        ],
      ),

      GoRoute(path: '/provider/availability', name: RouteNames.providerAvailability,
        builder: (_, __) => const ProviderAvailabilityScreen()),
      GoRoute(path: '/provider/copilot', name: RouteNames.providerCopilot,
        builder: (_, __) => const ProviderCopilotScreen()),
      GoRoute(path: '/provider/ai-insights', name: RouteNames.providerAiInsights,
        builder: (_, __) => const ProviderAIInsightsScreen()),

      // ── Admin Shell ───────────────────────────────────────────────
      ShellRoute(
        builder: (context, state, child) => AdminShell(child: child),
        routes: [
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin',
            name: RouteNames.adminDashboard,
            builder: (_, __) => const AdminDashboardScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/users',
            name: RouteNames.adminUsers,
            builder: (_, __) => const AdminUsersScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/providers',
            name: RouteNames.adminProviders,
            builder: (_, __) => const AdminProvidersScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/bookings',
            name: RouteNames.adminBookings,
            builder: (_, __) => const AdminBookingsScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/analytics',
            name: RouteNames.adminAnalytics,
            builder: (_, __) => const AdminAnalyticsScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/system-health',
            name: RouteNames.adminSystemHealth,
            builder: (_, __) => const AdminSystemHealthScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/financial',
            name: RouteNames.adminFinancial,
            builder: (_, __) => const AdminFinancialScreen()),
          GoRoute(path: '/x7k9m2q4p8w1n5v3r6t0y/admin/ai-control',
            name: RouteNames.adminAiControl,
            builder: (_, __) => const AdminAIControlScreen()),
        ],
      ),
    ],
  );
}

// ── Shell Widgets ──────────────────────────────────────────────────────────────

class CustomerShell extends StatelessWidget {
  const CustomerShell({super.key, required this.shell});
  final StatefulNavigationShell shell;

  static const _tabs = [
    _TabItem(icon: Icons.home_outlined,    activeIcon: Icons.home_rounded,    label: 'Home'),
    _TabItem(icon: Icons.explore_outlined, activeIcon: Icons.explore_rounded,  label: 'Explore'),
    _TabItem(icon: Icons.auto_awesome_outlined, activeIcon: Icons.auto_awesome_rounded, label: 'Simon'),
    _TabItem(icon: Icons.bar_chart_outlined, activeIcon: Icons.bar_chart_rounded, label: 'Spending'),
    _TabItem(icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF080808),
      body: shell,
      bottomNavigationBar: _TxBottomNav(
        currentIndex: shell.currentIndex,
        tabs: _tabs,
        onTap: (i) => shell.goBranch(i, initialLocation: i == shell.currentIndex),
      ),
    );
  }
}

class ProviderShell extends StatelessWidget {
  const ProviderShell({super.key, required this.shell});
  final StatefulNavigationShell shell;

  static const _tabs = [
    _TabItem(icon: Icons.dashboard_outlined, activeIcon: Icons.dashboard_rounded, label: 'Dashboard'),
    _TabItem(icon: Icons.calendar_today_outlined, activeIcon: Icons.calendar_today_rounded, label: 'Bookings'),
    _TabItem(icon: Icons.storefront_outlined, activeIcon: Icons.storefront_rounded, label: 'Services'),
    _TabItem(icon: Icons.account_balance_wallet_outlined, activeIcon: Icons.account_balance_wallet_rounded, label: 'Earnings'),
    _TabItem(icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: 'Profile'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF080808),
      body: shell,
      bottomNavigationBar: _TxBottomNav(
        currentIndex: shell.currentIndex,
        tabs: _tabs,
        onTap: (i) => shell.goBranch(i, initialLocation: i == shell.currentIndex),
      ),
    );
  }
}

class _TabItem {
  const _TabItem({required this.icon, required this.activeIcon, required this.label});
  final IconData icon;
  final IconData activeIcon;
  final String label;
}

class _TxBottomNav extends StatelessWidget {
  const _TxBottomNav({
    required this.currentIndex,
    required this.tabs,
    required this.onTap,
  });
  final int currentIndex;
  final List<_TabItem> tabs;
  final void Function(int) onTap;

  @override
  Widget build(BuildContext context) {
    final isDark   = Theme.of(context).brightness == Brightness.dark;
    final bg       = isDark ? const Color(0xFF111111) : const Color(0xFFFFFFFF);
    final border   = isDark ? const Color(0x12FFFFFF) : const Color(0x14000000);
    final active   = isDark ? const Color(0xFFFFFFFF) : const Color(0xFF080808);
    final inactive = isDark ? const Color(0xFF444444) : const Color(0xFF999999);

    return Container(
      decoration: BoxDecoration(
        color: bg,
        border: Border(top: BorderSide(color: border, width: 1)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            children: List.generate(tabs.length, (i) {
              final tab = tabs[i];
              final isActive = currentIndex == i;
              return Expanded(
                child: GestureDetector(
                  onTap: () {
                    HapticFeedback.lightImpact();
                    onTap(i);
                  },
                  behavior: HitTestBehavior.opaque,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 200),
                        child: Icon(
                          isActive ? tab.activeIcon : tab.icon,
                          key: ValueKey(isActive),
                          size: 22,
                          color: isActive ? active : inactive,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        tab.label,
                        style: TextStyle(
                          fontFamily: 'Inter',
                          fontSize: 10,
                          fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                          color: isActive ? active : inactive,
                          letterSpacing: 0.2,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
