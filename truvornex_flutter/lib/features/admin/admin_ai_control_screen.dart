import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_card.dart';
import '../shared/widgets/tx_badge.dart';
import '../shared/widgets/tx_button.dart';

class AdminAIControlScreen extends StatefulWidget {
  const AdminAIControlScreen({super.key});

  @override
  State<AdminAIControlScreen> createState() => _AdminAIControlScreenState();
}

class _AdminAIControlScreenState extends State<AdminAIControlScreen> {
  bool _simonEnabled   = true;
  bool _matchingEnabled = true;
  bool _insightsEnabled = true;
  bool _moderationEnabled = true;

  @override
  Widget build(BuildContext context) {
    const purple = Color(0xFF7C6FCD);

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
          Text('AI Control',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(width: 8),
          const TxBadge(label: 'DEEPSEEK', variant: TxBadgeVariant.info),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Simon AI status
          Container(
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: purple.withOpacity(0.08),
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              border: Border.all(color: purple.withOpacity(0.2)),
            ),
            child: Row(children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF7C6FCD), Color(0xFF9F8FE0)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: const Icon(Icons.auto_awesome_rounded, size: 24, color: Colors.white),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Simon AI Engine',
                    style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
                  Text('DeepSeek-V3 · Context: 128K tokens',
                    style: AppTypography.caption.copyWith(color: AppColors.darkTextSubtle)),
                ]),
              ),
              Switch.adaptive(
                value: _simonEnabled,
                onChanged: (v) {
                  HapticFeedback.mediumImpact();
                  setState(() => _simonEnabled = v);
                },
                activeColor: AppColors.darkPrimary,
              ),
            ]),
          ),

          const SizedBox(height: AppSpacing.xl),
          Text('Feature Flags',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            child: Column(children: [
              _featureRow('AI Matching', 'Smart provider recommendations', _matchingEnabled,
                (v) => setState(() => _matchingEnabled = v)),
              const Divider(height: 1, color: AppColors.darkBorder),
              _featureRow('Insights Engine', 'Provider copilot & analytics', _insightsEnabled,
                (v) => setState(() => _insightsEnabled = v)),
              const Divider(height: 1, color: AppColors.darkBorder),
              _featureRow('AI Moderation', 'Review & content filtering', _moderationEnabled,
                (v) => setState(() => _moderationEnabled = v)),
            ]),
          ),

          const SizedBox(height: AppSpacing.xl),
          Text('Usage Statistics',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(children: [
              _usageStat('Daily requests', '47,832', 0.76),
              const SizedBox(height: 12),
              _usageStat('Tokens used', '2.4M / 5M', 0.48),
              const SizedBox(height: 12),
              _usageStat('API cost today', '\$12.40 / \$50', 0.25),
              const SizedBox(height: 12),
              _usageStat('Cache hit rate', '68%', 0.68),
            ]),
          ),

          const SizedBox(height: AppSpacing.xl),

          TxButton(
            label: 'Flush AI Cache',
            onTap: () {
              HapticFeedback.mediumImpact();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('AI cache flushed ✓')));
            },
            variant: TxButtonVariant.danger,
            icon: Icons.delete_sweep_outlined,
          ),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }

  Widget _featureRow(String label, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.base, vertical: AppSpacing.sm),
      child: Row(children: [
        Expanded(child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label,
              style: AppTypography.bodySm.copyWith(
                color: AppColors.darkText, fontWeight: FontWeight.w500)),
            Text(subtitle,
              style: AppTypography.caption.copyWith(color: AppColors.darkTextSubtle)),
          ],
        )),
        Switch.adaptive(
          value: value,
          onChanged: (v) {
            HapticFeedback.lightImpact();
            onChanged(v);
          },
          activeColor: AppColors.darkPrimary,
        ),
      ]),
    );
  }

  Widget _usageStat(String label, String value, double progress) {
    return Column(children: [
      Row(children: [
        Text(label,
          style: AppTypography.caption.copyWith(color: AppColors.darkTextMuted)),
        const Spacer(),
        Text(value,
          style: AppTypography.mono.copyWith(
            color: AppColors.darkText, fontSize: 12)),
      ]),
      const SizedBox(height: 5),
      ClipRRect(
        borderRadius: BorderRadius.circular(2),
        child: LinearProgressIndicator(
          value: progress,
          minHeight: 4,
          backgroundColor: AppColors.darkSurfaceHigh,
          valueColor: const AlwaysStoppedAnimation(AppColors.darkPrimary),
        ),
      ),
    ]);
  }
}
