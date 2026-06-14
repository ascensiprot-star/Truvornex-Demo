import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';

class TxAvatar extends StatelessWidget {
  const TxAvatar({
    super.key,
    required this.name,
    this.imageUrl,
    this.size = 40,
    this.heroTag,
    this.showRing = false,
    this.ringColor,
  });

  final String name;
  final String? imageUrl;
  final double size;
  final String? heroTag;
  final bool showRing;
  final Color? ringColor;

  String get _initials {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    }
    return name.isNotEmpty ? name[0].toUpperCase() : '?';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    Widget avatar;
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      avatar = CachedNetworkImage(
        imageUrl: imageUrl!,
        width: size,
        height: size,
        fit: BoxFit.cover,
        placeholder: (_, __) => _buildPlaceholder(isDark),
        errorWidget: (_, __, ___) => _buildPlaceholder(isDark),
      );
    } else {
      avatar = _buildPlaceholder(isDark);
    }

    avatar = ClipRRect(
      borderRadius: BorderRadius.circular(size / 2),
      child: avatar,
    );

    if (showRing) {
      avatar = Container(
        width: size + 4,
        height: size + 4,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: ringColor ?? (isDark ? AppColors.darkPrimary : AppColors.lightPrimary),
            width: 2,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(2),
          child: avatar,
        ),
      );
    }

    if (heroTag != null) {
      avatar = Hero(tag: heroTag!, child: avatar);
    }

    return avatar;
  }

  Widget _buildPlaceholder(bool isDark) {
    return Container(
      width: size,
      height: size,
      color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
      alignment: Alignment.center,
      child: Text(
        _initials,
        style: AppTypography.label.copyWith(
          color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted,
          fontSize: size * 0.32,
        ),
      ),
    );
  }
}
