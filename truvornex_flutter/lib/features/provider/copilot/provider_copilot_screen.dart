import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';

class ProviderCopilotScreen extends StatelessWidget {
  const ProviderCopilotScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    const purple  = Color(0xFF7C6FCD);

    final insights = [
      _Insight('Peak hours detected: 9–11 AM has 3× more requests on Tuesdays.',
        'Optimize', Icons.schedule_rounded, purple),
      _Insight('Customers who book Drain Cleaning also book Water Heater in 68% of cases.',
        'Bundle', Icons.link_rounded, AppColors.darkSuccess),
      _Insight('Your response time is 2.4h avg. Top providers respond in <30min.',
        'Improve', Icons.speed_rounded, AppColors.darkWarning),
      _Insight('5 customers have searched "emergency plumbing" near your zone today.',
        'Capture', Icons.location_on_outlined, AppColors.darkInfo),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          Container(
            width: 30, height: 30,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF7C6FCD), Color(0xFF9F8FE0)]),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.auto_awesome_rounded, size: 14, color: Colors.white),
          ),
          const SizedBox(width: 8),
          Text('Provider Copilot',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(width: 8),
          const TxBadge(label: 'AI', variant: TxBadgeVariant.info),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Summary card
          Container(
            padding: const EdgeInsets.all(AppSpacing.xl),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF1A1033), Color(0xFF0F0B22)],
              ),
              borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
              border: Border.all(color: const Color(0x337C6FCD)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('WEEKLY INSIGHT SUMMARY',
                  style: AppTypography.labelSm.copyWith(
                    color: Colors.white38, letterSpacing: 2)),
                const SizedBox(height: AppSpacing.sm),
                Text('You\'re performing in the\ntop 12% of providers.',
                  style: AppTypography.display.copyWith(
                    color: Colors.white, fontSize: 22, height: 1.2)),
                const SizedBox(height: AppSpacing.base),
                Text('Simon AI identified 4 opportunities to grow your bookings by up to 35% this month.',
                  style: AppTypography.body.copyWith(color: Colors.white54, height: 1.5)),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.base),
          Text('AI Recommendations',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.sm),

          ...insights.asMap().entries.map((e) {
            final ins = e.value;
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: TxCard(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(
                        color: ins.color.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      alignment: Alignment.center,
                      child: Icon(ins.icon, size: 18, color: ins.color),
                    ),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(ins.body,
                            style: AppTypography.body.copyWith(
                              color: text, height: 1.4)),
                          const SizedBox(height: 8),
                          TxBadge(
                            label: ins.action,
                            variant: TxBadgeVariant.info),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate(delay: Duration(milliseconds: 100 + e.key * 80))
               .fadeIn(duration: 350.ms)
               .slideX(begin: 0.04, end: 0, duration: 350.ms, curve: Curves.easeOut),
            );
          }),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}

class _Insight {
  const _Insight(this.body, this.action, this.icon, this.color);
  final String body, action;
  final IconData icon;
  final Color color;
}
