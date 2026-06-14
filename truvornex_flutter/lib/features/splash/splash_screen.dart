import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/routing/route_names.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 2600), () {
      if (mounted) context.goNamed(RouteNames.login);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo mark
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.darkSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.darkBorderStrong, width: 1),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.bolt_rounded,
                color: AppColors.darkPrimary,
                size: 28,
              ),
            )
                .animate()
                .fadeIn(duration: 600.ms, curve: Curves.easeOut)
                .scale(
                  begin: const Offset(0.85, 0.85),
                  end: const Offset(1, 1),
                  duration: 600.ms,
                  curve: Curves.elasticOut,
                ),

            const SizedBox(height: 20),

            // Wordmark
            Text(
              'TRUVORNEX',
              style: AppTypography.display.copyWith(
                color: AppColors.darkPrimary,
                fontSize: 28,
                letterSpacing: 4,
                fontWeight: FontWeight.w900,
              ),
            )
                .animate(delay: 200.ms)
                .fadeIn(duration: 500.ms)
                .slideY(begin: 0.12, end: 0, duration: 500.ms, curve: Curves.easeOut),

            const SizedBox(height: 8),

            Text(
              'SERVICE PLATFORM',
              style: AppTypography.labelSm.copyWith(
                color: AppColors.darkTextSubtle,
                letterSpacing: 5,
              ),
            )
                .animate(delay: 400.ms)
                .fadeIn(duration: 500.ms),
          ],
        ),
      ),
    );
  }
}
