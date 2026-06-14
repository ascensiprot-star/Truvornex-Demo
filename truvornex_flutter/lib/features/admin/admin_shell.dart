import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/routing/route_names.dart';

class AdminShell extends StatelessWidget {
  const AdminShell({super.key, required this.child});
  final Widget child;

  static const _drawerItems = [
    _NavItem(Icons.dashboard_outlined,      'Dashboard',        RouteNames.adminDashboard),
    _NavItem(Icons.people_outline_rounded,  'Users',            RouteNames.adminUsers),
    _NavItem(Icons.handyman_outlined,       'Providers',        RouteNames.adminProviders),
    _NavItem(Icons.calendar_today_outlined, 'Bookings',         RouteNames.adminBookings),
    _NavItem(Icons.bar_chart_rounded,       'Analytics',        RouteNames.adminAnalytics),
    _NavItem(Icons.monitor_heart_outlined,  'System Health',    RouteNames.adminSystemHealth),
    _NavItem(Icons.account_balance_wallet_outlined, 'Financial', RouteNames.adminFinancial),
    _NavItem(Icons.auto_awesome_outlined,   'AI Control',       RouteNames.adminAiControl),
  ];

  @override
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      drawer: Drawer(
        backgroundColor: AppColors.darkSurface,
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      Container(
                        width: 36, height: 36,
                        decoration: BoxDecoration(
                          color: const Color(0x1AEF4444),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0x33EF4444)),
                        ),
                        alignment: Alignment.center,
                        child: const Icon(Icons.bolt_rounded,
                          size: 18, color: Color(0xFFEF4444)),
                      ),
                      const SizedBox(width: 10),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('ADMIN',
                          style: AppTypography.h3.copyWith(
                            color: AppColors.darkPrimary, letterSpacing: 1)),
                        Text('Truvornex Platform',
                          style: AppTypography.labelSm.copyWith(
                            color: AppColors.darkTextSubtle)),
                      ]),
                    ]),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0x1AEF4444),
                        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                      ),
                      child: Text('Super Admin',
                        style: AppTypography.labelSm.copyWith(
                          color: const Color(0xFFEF4444))),
                    ),
                  ],
                ),
              ),

              const Divider(height: 1, color: AppColors.darkBorder),
              const SizedBox(height: AppSpacing.sm),

              Expanded(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: _drawerItems.map((item) {
                    final adminBase = '/x7k9m2q4p8w1n5v3r6t0y/admin';
                    final itemPath = item.routeName == RouteNames.adminDashboard
                        ? adminBase
                        : '$adminBase/${item.routeName.replaceFirst('admin-', '')}';
                    final isActive = location.startsWith(itemPath) &&
                        (item.routeName == RouteNames.adminDashboard
                            ? location == adminBase
                            : true);

                    return ListTile(
                      dense: true,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.base, vertical: 2),
                      leading: Icon(item.icon, size: 18,
                        color: isActive
                            ? AppColors.darkPrimary
                            : AppColors.darkTextSubtle),
                      title: Text(item.label,
                        style: AppTypography.body.copyWith(
                          color: isActive
                              ? AppColors.darkPrimary
                              : AppColors.darkTextMuted,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w400)),
                      tileColor: isActive ? AppColors.darkSurfaceHigh : null,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(AppSpacing.radiusSm)),
                      onTap: () {
                        context.goNamed(item.routeName);
                        Navigator.of(context).pop();
                      },
                    );
                  }).toList(),
                ),
              ),

              const Divider(height: 1, color: AppColors.darkBorder),
              ListTile(
                dense: true,
                leading: const Icon(Icons.logout_rounded, size: 18,
                  color: AppColors.darkTextSubtle),
                title: Text('Exit Admin',
                  style: AppTypography.body.copyWith(color: AppColors.darkTextMuted)),
                onTap: () => context.goNamed(RouteNames.home),
              ),
            ],
          ),
        ),
      ),
      body: child,
    );
  }
}

class _NavItem {
  const _NavItem(this.icon, this.label, this.routeName);
  final IconData icon;
  final String label;
  final String routeName;
}
