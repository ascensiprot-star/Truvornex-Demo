import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';

enum TxButtonVariant { primary, secondary, ghost, danger }

class TxButton extends StatefulWidget {
  const TxButton({
    super.key,
    required this.label,
    required this.onTap,
    this.variant = TxButtonVariant.primary,
    this.isLoading = false,
    this.disabled = false,
    this.icon,
    this.iconTrailing = false,
    this.width,
    this.height = 48,
    this.borderRadius,
  });

  final String label;
  final VoidCallback? onTap;
  final TxButtonVariant variant;
  final bool isLoading;
  final bool disabled;
  final IconData? icon;
  final bool iconTrailing;
  final double? width;
  final double height;
  final BorderRadius? borderRadius;

  @override
  State<TxButton> createState() => _TxButtonState();
}

class _TxButtonState extends State<TxButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      reverseDuration: const Duration(milliseconds: 180),
    );
    _scale = Tween<double>(begin: 1.0, end: 0.97).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark   = Theme.of(context).brightness == Brightness.dark;
    final disabled = widget.disabled || widget.isLoading;

    Color bg, fg, borderC;
    switch (widget.variant) {
      case TxButtonVariant.primary:
        bg = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
        fg = isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary;
        borderC = Colors.transparent;
        break;
      case TxButtonVariant.secondary:
        bg = isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow;
        fg = isDark ? AppColors.darkText : AppColors.lightText;
        borderC = isDark ? AppColors.darkBorderStrong : AppColors.lightBorderStrong;
        break;
      case TxButtonVariant.ghost:
        bg = Colors.transparent;
        fg = isDark ? AppColors.darkText : AppColors.lightText;
        borderC = Colors.transparent;
        break;
      case TxButtonVariant.danger:
        bg = isDark
            ? AppColors.darkError.withOpacity(0.15)
            : AppColors.lightError.withOpacity(0.1);
        fg = isDark ? AppColors.darkError : AppColors.lightError;
        borderC = isDark
            ? AppColors.darkError.withOpacity(0.3)
            : AppColors.lightError.withOpacity(0.3);
        break;
    }

    final radius = widget.borderRadius ??
        BorderRadius.circular(AppSpacing.radiusMd);

    return GestureDetector(
      onTap: disabled
          ? null
          : () {
              HapticFeedback.lightImpact();
              widget.onTap?.call();
            },
      onTapDown: disabled ? null : (_) => _ctrl.forward(),
      onTapUp: disabled ? null : (_) => _ctrl.reverse(),
      onTapCancel: disabled ? null : () => _ctrl.reverse(),
      child: ScaleTransition(
        scale: _scale,
        child: AnimatedOpacity(
          opacity: disabled ? 0.45 : 1.0,
          duration: const Duration(milliseconds: 150),
          child: Container(
            width: widget.width ?? double.infinity,
            height: widget.height,
            decoration: BoxDecoration(
              color: bg,
              borderRadius: radius,
              border: Border.all(color: borderC, width: 1),
            ),
            alignment: Alignment.center,
            child: widget.isLoading
                ? SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 1.5,
                      color: fg,
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.icon != null && !widget.iconTrailing) ...[
                        Icon(widget.icon, size: 16, color: fg),
                        const SizedBox(width: AppSpacing.sm),
                      ],
                      Text(
                        widget.label,
                        style: AppTypography.button.copyWith(color: fg),
                      ),
                      if (widget.icon != null && widget.iconTrailing) ...[
                        const SizedBox(width: AppSpacing.sm),
                        Icon(widget.icon, size: 16, color: fg),
                      ],
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
