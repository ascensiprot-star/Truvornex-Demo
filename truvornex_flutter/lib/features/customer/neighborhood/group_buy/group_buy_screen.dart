import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_button.dart';
import '../../shared/widgets/tx_badge.dart';

class GroupBuyScreen extends StatelessWidget {
  const GroupBuyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    const green   = Color(0xFF10B981);

    final _deals = [
      _Deal('Deep Home Cleaning', 'Cleaning', 8, 10, 25, 'expires in 2 days'),
      _Deal('Electrical Inspection', 'Electrical', 3, 5, 15, 'expires tomorrow'),
      _Deal('Garden Landscaping', 'Gardening', 6, 8, 20, 'expires in 5 days'),
      _Deal('AC Service & Repair', 'HVAC', 11, 12, 30, 'expires in 1 day'),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          const Icon(Icons.group_outlined, size: 18),
          const SizedBox(width: 8),
          Text('Group Buy', style: AppTypography.h3.copyWith(color: text)),
        ]),
        actions: [
          TxIconButton(icon: Icons.add_rounded, onTap: () {}),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Header card
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: green.withOpacity(0.08),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              border: Border.all(color: green.withOpacity(0.2)),
            ),
            child: Row(children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(
                  color: green.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.savings_outlined, size: 22, color: green),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Pool & Save Together',
                    style: AppTypography.h3.copyWith(color: text)),
                  Text('Join neighbors to unlock bulk discounts up to 30%',
                    style: AppTypography.caption.copyWith(color: muted)),
                ]),
              ),
            ]),
          ),

          const SizedBox(height: AppSpacing.base),

          Text('Active Group Buys',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.sm),

          ..._deals.map((d) => Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: TxCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Expanded(child: Text(d.title,
                      style: AppTypography.h3.copyWith(color: text))),
                    TxBadge(
                      label: '${d.discount}% off',
                      variant: TxBadgeVariant.success),
                  ]),
                  const SizedBox(height: 4),
                  Text(d.category,
                    style: AppTypography.caption.copyWith(color: muted)),
                  const SizedBox(height: AppSpacing.md),

                  // Progress bar
                  Row(children: [
                    Text('${d.current}/${d.target} joined',
                      style: AppTypography.caption.copyWith(color: muted)),
                    const Spacer(),
                    Text(d.expires,
                      style: AppTypography.caption.copyWith(
                        color: isDark ? AppColors.darkWarning : AppColors.lightWarning)),
                  ]),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: d.current / d.target,
                      minHeight: 6,
                      backgroundColor:
                          isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                      valueColor: AlwaysStoppedAnimation(
                        d.current >= d.target ? green : green.withOpacity(0.6)),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.md),

                  TxButton(
                    label: d.current >= d.target ? 'Deal Locked In ✓' : 'Join Group Buy',
                    onTap: () => HapticFeedback.mediumImpact(),
                    variant: d.current >= d.target
                        ? TxButtonVariant.secondary
                        : TxButtonVariant.primary,
                    height: 40,
                  ),
                ],
              ),
            ),
          )),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}

class _Deal {
  const _Deal(this.title, this.category, this.current, this.target, this.discount, this.expires);
  final String title, category, expires;
  final int current, target, discount;
}
