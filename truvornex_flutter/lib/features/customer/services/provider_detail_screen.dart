import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_button.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_avatar.dart';

class ProviderDetailScreen extends StatelessWidget {
  const ProviderDetailScreen({super.key, required this.providerId});
  final String providerId;

  @override
  Widget build(BuildContext context) {
    final isDark    = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted     = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final subtle    = isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle;
    final surface   = isDark ? AppColors.darkSurface : AppColors.lightSurface;
    final border    = isDark ? AppColors.darkBorder : AppColors.lightBorder;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        title: 'Provider Profile',
        actions: [
          TxIconButton(icon: Icons.share_outlined, onTap: () {}),
          TxIconButton(icon: Icons.favorite_border_rounded, onTap: () {}),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                children: [
                  // Provider header
                  Row(children: [
                    Hero(
                      tag: 'provider_${providerId}',
                      child: TxAvatar(name: 'Provider Name', size: 72, showRing: true),
                    ),
                    const SizedBox(width: AppSpacing.base),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [
                            Text('Ahmed K.',
                              style: AppTypography.h2.copyWith(color: textColor)),
                            const SizedBox(width: 8),
                            const TxBadge(label: 'Verified', variant: TxBadgeVariant.success, dot: true),
                          ]),
                          const SizedBox(height: 4),
                          Text('Professional Plumber · 7 years exp.',
                            style: AppTypography.caption.copyWith(color: muted)),
                          const SizedBox(height: 8),
                          Row(children: [
                            const Icon(Icons.star_rounded, size: 14, color: Color(0xFFFCD34D)),
                            const SizedBox(width: 4),
                            Text('4.9',
                              style: AppTypography.bodySm.copyWith(
                                color: textColor, fontWeight: FontWeight.w600)),
                            Text(' (247 reviews)',
                              style: AppTypography.caption.copyWith(color: subtle)),
                            const SizedBox(width: 12),
                            Icon(Icons.location_on_outlined, size: 13, color: subtle),
                            Text(' 0.8 km away',
                              style: AppTypography.caption.copyWith(color: subtle)),
                          ]),
                        ],
                      ),
                    ),
                  ]).animate().fadeIn(duration: 400.ms),

                  const SizedBox(height: AppSpacing.xl),

                  // Stats row
                  Row(children: [
                    _statBox('247', 'Reviews', textColor, muted, isDark),
                    _divider(isDark),
                    _statBox('1,423', 'Jobs Done', textColor, muted, isDark),
                    _divider(isDark),
                    _statBox('99%', 'On Time', textColor, muted, isDark),
                    _divider(isDark),
                    _statBox('7 yrs', 'Experience', textColor, muted, isDark),
                  ]).animate(delay: 100.ms).fadeIn(duration: 400.ms),
                ],
              ),
            ),
          ),

          // Services section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.base, 0, AppSpacing.base, AppSpacing.sm),
              child: Text('Services Offered',
                style: AppTypography.h3.copyWith(color: textColor)),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _buildServiceItem(context, i, isDark, textColor, muted),
              childCount: 4,
            ),
          ),

          // Reviews
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.base, AppSpacing.xl, AppSpacing.base, AppSpacing.sm),
              child: Text('Recent Reviews',
                style: AppTypography.h3.copyWith(color: textColor)),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => _buildReviewItem(i, isDark, textColor, muted, subtle, border),
              childCount: 5,
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.fromLTRB(
          AppSpacing.base, AppSpacing.base, AppSpacing.base,
          AppSpacing.base + MediaQuery.of(context).viewPadding.bottom),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightBg,
          border: Border(top: BorderSide(color: border)),
        ),
        child: Row(children: [
          Expanded(
            child: TxButton(
              label: 'Message',
              onTap: () {},
              variant: TxButtonVariant.secondary,
              icon: Icons.chat_outlined,
              height: 48,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            flex: 2,
            child: TxButton(
              label: 'Book Now',
              onTap: () => context.pushNamed(
                RouteNames.bookService,
                pathParameters: {'providerId': providerId, 'serviceId': 's0'},
              ),
              icon: Icons.calendar_today_outlined,
              height: 48,
            ),
          ),
        ]),
      ),
    );
  }

  Widget _statBox(String val, String lbl, Color text, Color muted, bool isDark) => Expanded(
    child: Column(children: [
      Text(val, style: AppTypography.h3.copyWith(color: text)),
      const SizedBox(height: 3),
      Text(lbl, style: AppTypography.labelSm.copyWith(color: muted, fontSize: 10)),
    ]),
  );

  Widget _divider(bool isDark) => Container(
    height: 32, width: 1,
    color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
  );

  Widget _buildServiceItem(
      BuildContext ctx, int i, bool isDark, Color text, Color muted) {
    final services = [
      ('Pipe Repair & Replacement', '\$45/hr'),
      ('Drain Cleaning',             '\$60 flat'),
      ('Water Heater Install',       '\$120 flat'),
      ('Emergency Plumbing',         '\$80/hr + parts'),
    ];
    final s = services[i];
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base, vertical: 5),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
        ),
        child: Row(children: [
          Expanded(child: Text(s.$1,
            style: AppTypography.bodySm.copyWith(color: text, fontWeight: FontWeight.w500))),
          Text(s.$2,
            style: AppTypography.caption.copyWith(color: muted, fontWeight: FontWeight.w600)),
          const SizedBox(width: AppSpacing.sm),
          const Icon(Icons.arrow_forward_ios_rounded, size: 12),
        ]),
      ),
    );
  }

  Widget _buildReviewItem(
      int i, bool isDark, Color text, Color muted, Color subtle, Color border) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base, vertical: 5),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          border: Border.all(color: border),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            TxAvatar(name: 'User ${i + 1}', size: 32),
            const SizedBox(width: 10),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('User ${i + 1}',
                  style: AppTypography.bodySm.copyWith(color: text, fontWeight: FontWeight.w600)),
                Row(children: List.generate(5, (j) => Icon(
                  Icons.star_rounded,
                  size: 11,
                  color: j < (5 - i % 2)
                      ? const Color(0xFFFCD34D)
                      : (isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle),
                ))),
              ]),
            ),
            Text('${i + 1}d ago',
              style: AppTypography.caption.copyWith(color: subtle)),
          ]),
          const SizedBox(height: 8),
          Text(
            'Excellent service, arrived on time and did a thorough job. '
            'Would definitely recommend to others in the neighborhood.',
            style: AppTypography.caption.copyWith(color: muted, height: 1.5),
          ),
        ]),
      ),
    );
  }
}
