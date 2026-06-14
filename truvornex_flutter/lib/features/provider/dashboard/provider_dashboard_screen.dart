import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_stat_card.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_avatar.dart';

class ProviderDashboardScreen extends ConsumerWidget {
  const ProviderDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    final upcoming = [
      _Booking('Pipe Repair',      'Ahmed K.',   '10:00 AM', 'Today',    'confirmed'),
      _Booking('Drain Cleaning',   'Sara M.',    '2:00 PM',  'Today',    'pending'),
      _Booking('Water Heater',     'Omar F.',    '9:00 AM',  'Tomorrow', 'confirmed'),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      body: RefreshIndicator(
        color: text,
        backgroundColor: surface,
        onRefresh: () async => await Future.delayed(const Duration(milliseconds: 800)),
        child: CustomScrollView(
          slivers: [
            // Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.base, AppSpacing.base, AppSpacing.base, 0),
                child: Row(children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Provider Dashboard',
                      style: AppTypography.caption.copyWith(color: muted)),
                    const SizedBox(height: 2),
                    Text('Welcome back 👋',
                      style: AppTypography.h2.copyWith(color: text)),
                  ]),
                  const Spacer(),
                  TxAvatar(name: 'Ahmed K.', size: 38),
                ]).animate().fadeIn(duration: 400.ms),
              ),
            ),

            // Stats grid
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Column(children: [
                  Row(children: [
                    Expanded(child: TxStatCard(
                      value: '\$2,840',
                      label: 'This month',
                      icon: Icons.account_balance_wallet_outlined,
                      trend: '+18%',
                      trendPositive: true,
                    )),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(child: TxStatCard(
                      value: '34',
                      label: 'Bookings',
                      icon: Icons.calendar_today_outlined,
                      trend: '+5',
                      trendPositive: true,
                    )),
                  ]),
                  const SizedBox(height: AppSpacing.sm),
                  Row(children: [
                    Expanded(child: TxStatCard(
                      value: '4.9★',
                      label: 'Avg rating',
                      icon: Icons.star_outline_rounded,
                    )),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(child: TxStatCard(
                      value: '98%',
                      label: 'On-time rate',
                      icon: Icons.schedule_rounded,
                    )),
                  ]),
                ]).animate(delay: 100.ms).fadeIn(duration: 400.ms),
              ),
            ),

            // Quick actions
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                child: Row(children: [
                  _actionBtn(context, Icons.calendar_today_outlined, 'Bookings',
                    RouteNames.providerBookings, isDark, text, muted),
                  const SizedBox(width: AppSpacing.sm),
                  _actionBtn(context, Icons.storefront_outlined, 'Services',
                    RouteNames.providerServices, isDark, text, muted),
                  const SizedBox(width: AppSpacing.sm),
                  _actionBtn(context, Icons.schedule_rounded, 'Availability',
                    RouteNames.providerAvailability, isDark, text, muted),
                  const SizedBox(width: AppSpacing.sm),
                  _actionBtn(context, Icons.auto_awesome_outlined, 'Copilot',
                    RouteNames.providerCopilot, isDark, text, muted),
                ]).animate(delay: 200.ms).fadeIn(duration: 400.ms),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

            // Upcoming bookings
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                child: Row(children: [
                  Text('Upcoming Bookings',
                    style: AppTypography.h3.copyWith(color: text)),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => context.pushNamed(RouteNames.providerBookings),
                    child: Text('View all',
                      style: AppTypography.caption.copyWith(color: muted)),
                  ),
                ]),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.sm)),

            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, i) {
                  final b = upcoming[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base, vertical: 4),
                    child: TxCard(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Row(children: [
                        Container(
                          width: 44, height: 44,
                          decoration: BoxDecoration(
                            color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          alignment: Alignment.center,
                          child: Icon(Icons.plumbing_outlined, size: 20, color: muted),
                        ),
                        const SizedBox(width: AppSpacing.md),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(b.service,
                                style: AppTypography.bodySm.copyWith(
                                  color: text, fontWeight: FontWeight.w600)),
                              Text(b.customer,
                                style: AppTypography.caption.copyWith(color: muted)),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('${b.time} · ${b.day}',
                              style: AppTypography.caption.copyWith(color: muted)),
                            const SizedBox(height: 4),
                            TxBadge(
                              label: b.status,
                              variant: b.status == 'confirmed'
                                  ? TxBadgeVariant.success
                                  : TxBadgeVariant.warning,
                              dot: true),
                          ],
                        ),
                      ]),
                    ),
                  );
                },
                childCount: upcoming.length,
              ),
            ),

            // AI Copilot banner
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: GestureDetector(
                  onTap: () => context.pushNamed(RouteNames.providerCopilot),
                  child: Container(
                    padding: const EdgeInsets.all(AppSpacing.base),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF3D2F8A), Color(0xFF241B6A)]),
                      borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                      border: Border.all(color: const Color(0x4D7C6FCD)),
                    ),
                    child: Row(children: [
                      Container(
                        width: 44, height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0x267C6FCD),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        alignment: Alignment.center,
                        child: const Icon(Icons.auto_awesome_rounded,
                          size: 22, color: Color(0xFF7C6FCD)),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Provider Copilot',
                              style: AppTypography.h3.copyWith(color: Colors.white)),
                            Text('AI-powered insights and scheduling assistant',
                              style: AppTypography.caption.copyWith(color: Colors.white54)),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_ios_rounded,
                        size: 14, color: Colors.white38),
                    ]),
                  ),
                ).animate(delay: 300.ms).fadeIn(duration: 400.ms),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl2)),
          ],
        ),
      ),
    );
  }

  Widget _actionBtn(
      BuildContext ctx,
      IconData icon,
      String label,
      String routeName,
      bool isDark,
      Color text,
      Color muted) {
    return Expanded(
      child: GestureDetector(
        onTap: () => ctx.pushNamed(routeName),
        child: Container(
          height: 72,
          decoration: BoxDecoration(
            color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
            borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
            border: Border.all(
              color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 22, color: muted),
              const SizedBox(height: 5),
              Text(label,
                style: AppTypography.labelSm.copyWith(color: muted, fontSize: 10)),
            ],
          ),
        ),
      ),
    );
  }
}

class _Booking {
  const _Booking(this.service, this.customer, this.time, this.day, this.status);
  final String service, customer, time, day, status;
}
