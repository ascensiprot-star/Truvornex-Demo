import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import 'tx_card.dart';
import 'tx_badge.dart';
import 'tx_avatar.dart';

class TxProviderCard extends StatelessWidget {
  const TxProviderCard({
    super.key,
    required this.name,
    required this.category,
    required this.rating,
    required this.reviewCount,
    this.avatarUrl,
    this.distance,
    this.priceFrom,
    this.isVerified = false,
    this.onTap,
    this.onBook,
    this.heroTag,
  });

  final String name;
  final String category;
  final double rating;
  final int reviewCount;
  final String? avatarUrl;
  final String? distance;
  final double? priceFrom;
  final bool isVerified;
  final VoidCallback? onTap;
  final VoidCallback? onBook;
  final String? heroTag;

  @override
  Widget build(BuildContext context) {
    final isDark     = Theme.of(context).brightness == Brightness.dark;
    final textColor  = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
    final mutedColor = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final subtleColor = isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle;

    Widget avatar = TxAvatar(
      name: name,
      imageUrl: avatarUrl,
      size: 48,
      heroTag: heroTag,
    );

    return TxCard(
      onTap: onTap,
      pressable: true,
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Row(
        children: [
          avatar,
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        name,
                        style: AppTypography.h3.copyWith(color: textColor),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    if (isVerified)
                      const Padding(
                        padding: EdgeInsets.only(left: 6),
                        child: TxBadge(
                          label: 'Verified',
                          variant: TxBadgeVariant.success,
                          dot: true,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  category,
                  style: AppTypography.caption.copyWith(color: mutedColor),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 13, color: Color(0xFFFCD34D)),
                    const SizedBox(width: 3),
                    Text(
                      rating.toStringAsFixed(1),
                      style: AppTypography.caption.copyWith(
                        color: textColor,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      ' (${reviewCount})',
                      style: AppTypography.caption.copyWith(color: subtleColor),
                    ),
                    if (distance != null) ...[
                      Text(
                        ' · $distance',
                        style: AppTypography.caption.copyWith(color: subtleColor),
                      ),
                    ],
                    if (priceFrom != null) ...[
                      const Spacer(),
                      Text(
                        'from \$${priceFrom!.toStringAsFixed(0)}',
                        style: AppTypography.caption.copyWith(
                          color: textColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          if (onBook != null) ...[
            const SizedBox(width: AppSpacing.sm),
            GestureDetector(
              onTap: onBook,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.md,
                  vertical: AppSpacing.xs + 2,
                ),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                ),
                child: Text(
                  'Book',
                  style: AppTypography.buttonSm.copyWith(
                    color: isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
