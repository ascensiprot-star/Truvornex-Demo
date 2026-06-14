import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_avatar.dart';
import '../../shared/widgets/tx_button.dart';

class SkillSwapScreen extends StatelessWidget {
  const SkillSwapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    const purple  = Color(0xFF7C6FCD);

    final swaps = [
      _Swap('Fatima R.', 'Baking & Pastry', 'Graphic Design', 2),
      _Swap('Hassan M.', 'Plumbing Basics', 'Language Tutoring (French)', 3),
      _Swap('Sara K.',   'Yoga Instruction', 'Web Dev Help', 1),
      _Swap('Ali B.',    'Photography', 'Home Cooking Lessons', 2),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          const Icon(Icons.swap_horiz_rounded, size: 18),
          const SizedBox(width: 8),
          Text('Skill Swap', style: AppTypography.h3.copyWith(color: text)),
        ]),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: purple.withOpacity(0.15),
              borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
              border: Border.all(color: purple.withOpacity(0.3)),
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              const Icon(Icons.access_time_rounded, size: 13, color: purple),
              const SizedBox(width: 5),
              Text('7 credits',
                style: AppTypography.labelSm.copyWith(color: purple)),
            ]),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: purple.withOpacity(0.08),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              border: Border.all(color: purple.withOpacity(0.2)),
            ),
            child: Text(
              'Exchange your skills with neighbors using time credits. '
              '1 hour of service = 1 credit. No money involved.',
              style: AppTypography.body.copyWith(color: muted, height: 1.5),
            ),
          ),

          const SizedBox(height: AppSpacing.base),

          Row(children: [
            Text('Available Swaps', style: AppTypography.h3.copyWith(color: text)),
            const Spacer(),
            TxButton(
              label: 'Offer Skill',
              onTap: () {},
              variant: TxButtonVariant.secondary,
              icon: Icons.add_rounded,
              width: 120,
              height: 36,
            ),
          ]),
          const SizedBox(height: AppSpacing.sm),

          ...swaps.map((s) => Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: TxCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    TxAvatar(name: s.name, size: 36),
                    const SizedBox(width: 10),
                    Expanded(child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(s.name,
                          style: AppTypography.bodySm.copyWith(
                            color: text, fontWeight: FontWeight.w600)),
                        TxBadge(
                          label: '${s.credits} credits offered',
                          variant: TxBadgeVariant.info),
                      ],
                    )),
                  ]),
                  const SizedBox(height: AppSpacing.md),
                  Row(children: [
                    Expanded(child: _skillPill(
                      s.offering, Icons.volunteer_activism_outlined,
                      purple, isDark)),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.swap_horiz_rounded, size: 18)),
                    Expanded(child: _skillPill(
                      s.seeking, Icons.search_rounded,
                      AppColors.darkWarning, isDark)),
                  ]),
                  const SizedBox(height: AppSpacing.md),
                  TxButton(
                    label: 'Propose Swap',
                    onTap: () {},
                    variant: TxButtonVariant.secondary,
                    height: 38,
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

  Widget _skillPill(String label, IconData icon, Color color, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        border: Border.all(color: color.withOpacity(0.25)),
      ),
      child: Row(children: [
        Icon(icon, size: 13, color: color),
        const SizedBox(width: 5),
        Expanded(child: Text(label,
          style: AppTypography.caption.copyWith(color: color, fontWeight: FontWeight.w500),
          overflow: TextOverflow.ellipsis)),
      ]),
    );
  }
}

class _Swap {
  const _Swap(this.name, this.offering, this.seeking, this.credits);
  final String name, offering, seeking;
  final int credits;
}
