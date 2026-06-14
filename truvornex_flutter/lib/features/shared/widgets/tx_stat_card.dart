import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import 'tx_card.dart';

class TxStatCard extends StatelessWidget {
  const TxStatCard({
    super.key,
    required this.value,
    required this.label,
    this.icon,
    this.iconColor,
    this.trend,
    this.trendPositive,
    this.onTap,
  });

  final String value;
  final String label;
  final IconData? icon;
  final Color? iconColor;
  final String? trend;
  final bool? trendPositive;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor  = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
    final mutedColor = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return TxCard(
      onTap: onTap,
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (icon != null) ...[
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: (iconColor ?? AppColors.darkPrimary).withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              ),
              alignment: Alignment.center,
              child: Icon(
                icon,
                size: 18,
                color: iconColor ?? (isDark ? AppColors.darkPrimary : AppColors.lightPrimary),
              ),
            ),
            const SizedBox(height: AppSpacing.md),
          ],
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Text(
                  value,
                  style: AppTypography.h2.copyWith(
                    color: textColor,
                    fontSize: 22,
                    letterSpacing: -0.4,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (trend != null) ...[
                const SizedBox(width: 6),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      trendPositive == true
                          ? Icons.trending_up_rounded
                          : Icons.trending_down_rounded,
                      size: 14,
                      color: trendPositive == true
                          ? (isDark ? AppColors.darkSuccess : AppColors.lightSuccess)
                          : (isDark ? AppColors.darkError : AppColors.lightError),
                    ),
                    const SizedBox(width: 2),
                    Text(
                      trend!,
                      style: AppTypography.caption.copyWith(
                        color: trendPositive == true
                            ? (isDark ? AppColors.darkSuccess : AppColors.lightSuccess)
                            : (isDark ? AppColors.darkError : AppColors.lightError),
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppTypography.caption.copyWith(color: mutedColor),
          ),
        ],
      ),
    );
  }
}
