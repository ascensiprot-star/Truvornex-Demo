import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/routing/route_names.dart';
import '../shared/widgets/tx_button.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _selected = 0; // 0 = customer, 1 = provider

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Spacer(),
              Text('How will you\nuse Truvornex?',
                style: AppTypography.display.copyWith(color: AppColors.darkPrimary))
                  .animate().fadeIn(duration: 500.ms)
                  .slideY(begin: 0.1, end: 0, duration: 500.ms, curve: Curves.easeOut),

              const SizedBox(height: 8),
              Text('You can switch between roles anytime.',
                style: AppTypography.body.copyWith(color: AppColors.darkTextMuted))
                  .animate(delay: 100.ms).fadeIn(duration: 400.ms),

              const SizedBox(height: 40),

              _buildRoleCard(
                index: 0,
                icon: Icons.person_outline_rounded,
                title: 'I need services',
                subtitle: 'Book trusted providers in your neighborhood',
              ).animate(delay: 200.ms).fadeIn(duration: 400.ms)
               .slideX(begin: -0.06, end: 0, duration: 400.ms, curve: Curves.easeOut),

              const SizedBox(height: 12),

              _buildRoleCard(
                index: 1,
                icon: Icons.storefront_outlined,
                title: 'I offer services',
                subtitle: 'Grow your business and manage bookings',
              ).animate(delay: 300.ms).fadeIn(duration: 400.ms)
               .slideX(begin: -0.06, end: 0, duration: 400.ms, curve: Curves.easeOut),

              const Spacer(),

              TxButton(
                label: 'Get Started',
                onTap: () => context.goNamed(
                  _selected == 0 ? RouteNames.home : RouteNames.providerHome,
                ),
                icon: Icons.arrow_forward_rounded,
                iconTrailing: true,
              ).animate(delay: 400.ms).fadeIn(duration: 400.ms),

              const SizedBox(height: AppSpacing.base),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleCard({
    required int index,
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    final isSelected = _selected == index;
    return GestureDetector(
      onTap: () => setState(() => _selected = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppSpacing.base),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.darkSurface : AppColors.darkSurfaceLow,
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          border: Border.all(
            color: isSelected ? AppColors.darkBorderStrong : AppColors.darkBorder,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: isSelected ? AppColors.darkPrimary : AppColors.darkSurfaceHigh,
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Icon(icon, size: 20,
              color: isSelected ? AppColors.darkOnPrimary : AppColors.darkTextMuted),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(title,
                style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
              const SizedBox(height: 3),
              Text(subtitle,
                style: AppTypography.caption.copyWith(color: AppColors.darkTextMuted)),
            ]),
          ),
          if (isSelected)
            const Icon(Icons.check_circle_rounded, size: 20, color: AppColors.darkSuccess),
        ]),
      ),
    );
  }
}
