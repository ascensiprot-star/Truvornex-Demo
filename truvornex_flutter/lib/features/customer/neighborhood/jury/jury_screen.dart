import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_button.dart';

class JuryScreen extends StatelessWidget {
  const JuryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    const amber   = Color(0xFFF59E0B);

    final cases = [
      _Case('Provider no-show', 'Service dispute', 3, 5, true, 'active'),
      _Case('Overcharge claim', 'Billing dispute', 5, 5, false, 'resolved'),
      _Case('Quality issue', 'Service quality', 1, 5, true, 'voting'),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          const Icon(Icons.balance_rounded, size: 18),
          const SizedBox(width: 8),
          Text('Community Jury', style: AppTypography.h3.copyWith(color: text)),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: amber.withOpacity(0.08),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              border: Border.all(color: amber.withOpacity(0.2)),
            ),
            child: Row(children: [
              Icon(Icons.info_outline_rounded, size: 18, color: amber),
              const SizedBox(width: 10),
              Expanded(child: Text(
                'As a jury member you earn 1 time credit per vote. '
                'Your vote is private and binding.',
                style: AppTypography.caption.copyWith(color: muted, height: 1.5))),
            ]),
          ),

          const SizedBox(height: AppSpacing.base),
          Text('Cases Awaiting Verdict',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.sm),

          ...cases.map((c) => Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: TxCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    Expanded(child: Text(c.title,
                      style: AppTypography.h3.copyWith(color: text))),
                    TxBadge(
                      label: c.status.toUpperCase(),
                      variant: c.status == 'resolved'
                          ? TxBadgeVariant.success
                          : c.status == 'voting'
                              ? TxBadgeVariant.warning
                              : TxBadgeVariant.info),
                  ]),
                  const SizedBox(height: 4),
                  Text(c.category,
                    style: AppTypography.caption.copyWith(color: muted)),
                  const SizedBox(height: AppSpacing.md),

                  // Verdict progress card
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                    ),
                    child: Column(children: [
                      Row(children: [
                        Text('${c.votes}/${c.needed} votes cast',
                          style: AppTypography.caption.copyWith(color: muted)),
                        const Spacer(),
                        Text('${c.votes * 100 ~/ c.needed}% complete',
                          style: AppTypography.caption.copyWith(color: muted)),
                      ]),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(3),
                        child: LinearProgressIndicator(
                          value: c.votes / c.needed,
                          minHeight: 6,
                          backgroundColor:
                              isDark ? AppColors.darkSurface : AppColors.lightSurface,
                          valueColor: AlwaysStoppedAnimation(
                            c.votes >= c.needed ? AppColors.darkSuccess : amber),
                        ),
                      ),
                    ]),
                  ),

                  if (c.canVote) ...[
                    const SizedBox(height: AppSpacing.md),
                    Row(children: [
                      Expanded(child: TxButton(
                        label: 'For Plaintiff',
                        onTap: () => HapticFeedback.mediumImpact(),
                        variant: TxButtonVariant.secondary,
                        height: 38,
                      )),
                      const SizedBox(width: 8),
                      Expanded(child: TxButton(
                        label: 'For Provider',
                        onTap: () => HapticFeedback.mediumImpact(),
                        variant: TxButtonVariant.secondary,
                        height: 38,
                      )),
                    ]),
                  ],
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

class _Case {
  const _Case(this.title, this.category, this.votes, this.needed, this.canVote, this.status);
  final String title, category, status;
  final int votes, needed;
  final bool canVote;
}
