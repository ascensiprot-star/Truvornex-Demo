import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';

class EventsScreen extends StatelessWidget {
  const EventsScreen({super.key});

  static const _events = [
    _Event('Neighborhood Block Party', 'Riverside Park', 'Jun 22', 'Free', true, 'Community'),
    _Event('Home Renovation Workshop', 'Community Hall', 'Jun 24', '\$15', false, 'Workshop'),
    _Event('Summer Food & Craft Market', 'Main Square', 'Jun 25', '\$5', false, 'Market'),
    _Event('Yoga in the Park', 'City Garden', 'Jun 26', 'Free', true, 'Wellness'),
    _Event('Tech Skills Bootcamp', 'Innovation Hub', 'Jun 28', '\$25', false, 'Education'),
    _Event('Community Cleanup Day', 'Various Locations', 'Jul 2', 'Free', true, 'Community'),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'Events Near You'),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemCount: _events.length,
        itemBuilder: (context, i) {
          final e = _events[i];
          return TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Row(
              children: [
                Container(
                  width: 56, height: 56,
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  alignment: Alignment.center,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(e.date.split(' ')[0],
                        style: AppTypography.labelSm.copyWith(color: muted)),
                      Text(e.date.split(' ')[1],
                        style: AppTypography.h3.copyWith(color: text, fontSize: 15)),
                    ],
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Expanded(child: Text(e.title,
                          style: AppTypography.bodySm.copyWith(
                            color: text, fontWeight: FontWeight.w600),
                          maxLines: 1, overflow: TextOverflow.ellipsis)),
                        const SizedBox(width: 6),
                        TxBadge(
                          label: e.price,
                          variant: e.isFree
                              ? TxBadgeVariant.success
                              : TxBadgeVariant.info),
                      ]),
                      const SizedBox(height: 3),
                      Text(e.venue,
                        style: AppTypography.caption.copyWith(color: muted)),
                      const SizedBox(height: 4),
                      TxBadge(label: e.category, variant: TxBadgeVariant.neutral),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Event {
  const _Event(this.title, this.venue, this.date, this.price, this.isFree, this.category);
  final String title, venue, date, price, category;
  final bool isFree;
}
