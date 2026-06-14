import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';

class TxAppBar extends StatelessWidget implements PreferredSizeWidget {
  const TxAppBar({
    super.key,
    this.title,
    this.titleWidget,
    this.leading,
    this.actions,
    this.showBorder = true,
    this.transparent = false,
    this.centerTitle = false,
  });

  final String? title;
  final Widget? titleWidget;
  final Widget? leading;
  final List<Widget>? actions;
  final bool showBorder;
  final bool transparent;
  final bool centerTitle;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg = transparent
        ? Colors.transparent
        : (isDark ? AppColors.darkBg : AppColors.lightBg);
    final borderColor = isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final textColor   = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
    final iconColor   = isDark ? AppColors.darkText : AppColors.lightText;

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: isDark ? SystemUiOverlayStyle.light : SystemUiOverlayStyle.dark,
      child: Container(
        decoration: BoxDecoration(
          color: bg,
          border: showBorder && !transparent
              ? Border(bottom: BorderSide(color: borderColor, width: 1))
              : null,
        ),
        child: SafeArea(
          bottom: false,
          child: SizedBox(
            height: 56,
            child: Row(
              children: [
                // Leading
                if (leading != null)
                  Padding(
                    padding: const EdgeInsets.only(left: AppSpacing.sm),
                    child: leading!,
                  )
                else if (Navigator.of(context).canPop())
                  TxIconButton(
                    icon: Icons.arrow_back_ios_new_rounded,
                    onTap: () => Navigator.of(context).pop(),
                  )
                else
                  const SizedBox(width: AppSpacing.base),

                // Title
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm),
                    child: titleWidget ??
                        (title != null
                            ? Text(
                                title!,
                                textAlign: centerTitle ? TextAlign.center : TextAlign.left,
                                style: AppTypography.h3.copyWith(color: textColor),
                                overflow: TextOverflow.ellipsis,
                              )
                            : const SizedBox.shrink()),
                  ),
                ),

                // Actions
                if (actions != null)
                  Row(mainAxisSize: MainAxisSize.min, children: actions!)
                else
                  const SizedBox(width: AppSpacing.base),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class TxIconButton extends StatelessWidget {
  const TxIconButton({
    super.key,
    required this.icon,
    required this.onTap,
    this.size = 20,
    this.color,
  });

  final IconData icon;
  final VoidCallback onTap;
  final double size;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final icColor = color ?? (isDark ? AppColors.darkText : AppColors.lightText);

    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        onTap();
      },
      child: Container(
        width: 40,
        height: 40,
        alignment: Alignment.center,
        child: Icon(icon, size: size, color: icColor),
      ),
    );
  }
}
