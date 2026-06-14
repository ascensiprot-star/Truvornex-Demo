import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';

class NeighborhoodDashboardScreen extends StatelessWidget {
  const NeighborhoodDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          const Icon(Icons.location_city_outlined, size: 18),
          const SizedBox(width: 8),
          Text('Neighborhood OS',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(width: 8),
          const TxBadge(label: 'BETA', variant: TxBadgeVariant.info),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Hero description
          TxCard(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF7C6FCD), Color(0xFF9F8FE0)]),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(Icons.hub_outlined, size: 22, color: Colors.white),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('Your Neighborhood Network',
                        style: AppTypography.h3.copyWith(color: text)),
                      Text('AI-powered community platform',
                        style: AppTypography.caption.copyWith(color: muted)),
                    ]),
                  ),
                ]),
                const SizedBox(height: AppSpacing.base),
                Text(
                  'Connect with neighbors, share resources, resolve disputes, '
                  'and access emergency services — all powered by AI.',
                  style: AppTypography.body.copyWith(color: muted, height: 1.5),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.base),

          // Feature grid
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.85,
            children: [
              _featureCard(context,
                Icons.warning_amber_rounded,
                'Emergency Request',
                'Get urgent help within minutes from nearby providers',
                RouteNames.emergency,
                const Color(0xFFEF4444),
                badge: 'URGENT'),
              _featureCard(context,
                Icons.group_outlined,
                'Group Buy',
                'Pool with neighbors to unlock bulk service discounts',
                RouteNames.groupBuy,
                const Color(0xFF10B981),
                badge: '4 active'),
              _featureCard(context,
                Icons.swap_horiz_rounded,
                'Skill Swap',
                'Trade your skills with neighbors using time credits',
                RouteNames.skillSwap,
                const Color(0xFF7C6FCD)),
              _featureCard(context,
                Icons.balance_rounded,
                'Community Jury',
                'Fair peer-reviewed dispute resolution system',
                RouteNames.jury,
                const Color(0xFFF59E0B)),
            ],
          ).animate(delay: 100.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          // Zone health
          Text('Zone Health', style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(children: [
              _healthRow('Active Members',    '1,247',  0.72, isDark, text, muted),
              const SizedBox(height: 12),
              _healthRow('Open Skill Swaps',  '34',     0.45, isDark, text, muted),
              const SizedBox(height: 12),
              _healthRow('Group Buys Live',   '4',      0.30, isDark, text, muted),
              const SizedBox(height: 12),
              _healthRow('Trust Score',       '94/100', 0.94, isDark, text, muted),
            ]),
          ).animate(delay: 200.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }

  Widget _featureCard(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    String routeName,
    Color accent, {
    String? badge,
  }) {
    return GestureDetector(
      onTap: () => context.pushNamed(routeName),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          color: accent.withOpacity(0.08),
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          border: Border.all(color: accent.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Container(
                width: 40, height: 40,
                decoration: BoxDecoration(
                  color: accent.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Icon(icon, size: 20, color: accent),
              ),
              if (badge != null) ...[
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: accent.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                  ),
                  child: Text(badge,
                    style: AppTypography.labelSm.copyWith(
                      color: accent, fontSize: 9)),
                ),
              ],
            ]),
            const Spacer(),
            Text(title,
              style: AppTypography.h3.copyWith(
                color: AppColors.darkPrimary, fontSize: 14)),
            const SizedBox(height: 4),
            Text(subtitle,
              style: AppTypography.caption.copyWith(
                color: AppColors.darkTextMuted, height: 1.4),
              maxLines: 2,
              overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }

  Widget _healthRow(
      String label, String value, double progress,
      bool isDark, Color text, Color muted) {
    return Row(children: [
      Expanded(
        flex: 2,
        child: Text(label,
          style: AppTypography.caption.copyWith(color: muted)),
      ),
      Expanded(
        flex: 3,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(2),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 4,
            backgroundColor:
                isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
            valueColor: AlwaysStoppedAnimation(
              isDark ? AppColors.darkPrimary : AppColors.lightPrimary),
          ),
        ),
      ),
      const SizedBox(width: 10),
      Text(value,
        style: AppTypography.mono.copyWith(color: text, fontSize: 12)),
    ]);
  }
}
