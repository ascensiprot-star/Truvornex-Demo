import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';

enum TxBadgeVariant { success, warning, error, info, neutral, primary }

class TxBadge extends StatelessWidget {
  const TxBadge({
    super.key,
    required this.label,
    this.variant = TxBadgeVariant.neutral,
    this.dot = false,
    this.icon,
  });

  final String label;
  final TxBadgeVariant variant;
  final bool dot;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Color bg, fg;
    switch (variant) {
      case TxBadgeVariant.success:
        bg = isDark
            ? AppColors.darkSuccess.withOpacity(0.15)
            : AppColors.lightSuccess.withOpacity(0.12);
        fg = isDark ? AppColors.darkSuccess : AppColors.lightSuccess;
        break;
      case TxBadgeVariant.warning:
        bg = isDark
            ? AppColors.darkWarning.withOpacity(0.15)
            : AppColors.lightWarning.withOpacity(0.12);
        fg = isDark ? AppColors.darkWarning : AppColors.lightWarning;
        break;
      case TxBadgeVariant.error:
        bg = isDark
            ? AppColors.darkError.withOpacity(0.15)
            : AppColors.lightError.withOpacity(0.12);
        fg = isDark ? AppColors.darkError : AppColors.lightError;
        break;
      case TxBadgeVariant.info:
        bg = isDark
            ? AppColors.darkInfo.withOpacity(0.15)
            : AppColors.lightInfo.withOpacity(0.12);
        fg = isDark ? AppColors.darkInfo : AppColors.lightInfo;
        break;
      case TxBadgeVariant.primary:
        bg = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
        fg = isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary;
        break;
      case TxBadgeVariant.neutral:
        bg = isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow;
        fg = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: 3,
      ),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (dot) ...[
            Container(
              width: 6,
              height: 6,
              decoration: BoxDecoration(color: fg, shape: BoxShape.circle),
            ),
            const SizedBox(width: 5),
          ],
          if (icon != null) ...[
            Icon(icon, size: 11, color: fg),
            const SizedBox(width: 4),
          ],
          Text(label, style: AppTypography.labelSm.copyWith(color: fg)),
        ],
      ),
    );
  }
}
