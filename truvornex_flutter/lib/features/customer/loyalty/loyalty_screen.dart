import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';

class LoyaltyScreen extends StatelessWidget {
  const LoyaltyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    const perks = [
      (Icons.local_offer_outlined,      '10% off next booking',  '50 pts'),
      (Icons.card_giftcard_outlined,    'Free premium service',  '200 pts'),
      (Icons.star_border_rounded,       'Priority matching',     '100 pts'),
      (Icons.support_agent_outlined,    'Priority support',      '75 pts'),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'Loyalty Program'),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Points card
          Container(
            padding: const EdgeInsets.all(AppSpacing.xl),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF0F0F18), Color(0xFF1A1030)],
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
              border: Border.all(color: AppColors.darkBorder),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Text('YOUR POINTS',
                    style: AppTypography.labelSm.copyWith(
                      color: Colors.white38, letterSpacing: 2)),
                  const Spacer(),
                  const TxBadge(label: 'GOLD', variant: TxBadgeVariant.warning),
                ]),
                const SizedBox(height: 8),
                Text('2,840',
                  style: AppTypography.display.copyWith(
                    color: Colors.white, fontSize: 48, letterSpacing: -2)),
                const SizedBox(height: 4),
                Text('160 pts to Platinum tier',
                  style: AppTypography.caption.copyWith(color: Colors.white38)),
                const SizedBox(height: AppSpacing.xl),

                // Progress to next tier
                Column(children: [
                  Row(children: [
                    Text('Gold', style: AppTypography.labelSm.copyWith(color: Colors.white38)),
                    const Spacer(),
                    Text('Platinum',
                      style: AppTypography.labelSm.copyWith(color: Colors.white38)),
                  ]),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: 0.78,
                      minHeight: 6,
                      backgroundColor: Colors.white.withOpacity(0.1),
                      valueColor: const AlwaysStoppedAnimation(Color(0xFFFCD34D)),
                    ),
                  ),
                ]),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.base),

          Text('Redeem Rewards', style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.sm),

          ...perks.asMap().entries.map((e) {
            final perk = e.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: TxCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Row(children: [
                  Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    alignment: Alignment.center,
                    child: Icon(perk.$1, size: 20, color: muted),
                  ),
                  const SizedBox(width: 14),
                  Expanded(child: Text(perk.$2,
                    style: AppTypography.bodySm.copyWith(
                      color: text, fontWeight: FontWeight.w500))),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                      border: Border.all(
                        color: isDark ? AppColors.darkBorderStrong : AppColors.lightBorderStrong),
                    ),
                    child: Text(perk.$3,
                      style: AppTypography.labelSm.copyWith(color: muted)),
                  ),
                ]),
              ).animate(delay: Duration(milliseconds: 100 + e.key * 60))
               .fadeIn(duration: 350.ms)
               .slideX(begin: 0.04, end: 0, duration: 350.ms, curve: Curves.easeOut),
            );
          }),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}
