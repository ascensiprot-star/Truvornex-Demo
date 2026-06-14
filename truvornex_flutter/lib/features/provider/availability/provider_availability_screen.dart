import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_button.dart';

class ProviderAvailabilityScreen extends StatefulWidget {
  const ProviderAvailabilityScreen({super.key});

  @override
  State<ProviderAvailabilityScreen> createState() =>
      _ProviderAvailabilityScreenState();
}

class _ProviderAvailabilityScreenState extends State<ProviderAvailabilityScreen> {
  final Map<String, bool> _days = {
    'Mon': true, 'Tue': true, 'Wed': true,
    'Thu': true, 'Fri': true, 'Sat': false, 'Sun': false,
  };
  String _startTime = '8:00 AM';
  String _endTime   = '6:00 PM';

  static const _times = [
    '6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM',
    '7:00 PM','8:00 PM',
  ];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'Availability'),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Text('Working Days',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.md),

          Row(
            children: _days.entries.map((e) {
              final active = e.value;
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 3),
                  child: GestureDetector(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      setState(() => _days[e.key] = !active);
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      height: 56,
                      decoration: BoxDecoration(
                        color: active
                            ? (isDark ? AppColors.darkPrimary : AppColors.lightPrimary)
                            : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
                        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                        border: Border.all(
                          color: active
                              ? Colors.transparent
                              : (isDark ? AppColors.darkBorder : AppColors.lightBorder)),
                      ),
                      alignment: Alignment.center,
                      child: Text(e.key,
                        style: AppTypography.buttonSm.copyWith(
                          color: active
                              ? (isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary)
                              : muted)),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),

          const SizedBox(height: AppSpacing.xl),
          Text('Working Hours',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.md),

          Row(children: [
            Expanded(
              child: TxCard(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.base, vertical: AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Start Time',
                      style: AppTypography.labelSm.copyWith(color: muted)),
                    const SizedBox(height: 4),
                    DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _startTime,
                        isExpanded: true,
                        dropdownColor:
                            isDark ? AppColors.darkSurface : AppColors.lightSurface,
                        style: AppTypography.body.copyWith(color: text),
                        items: _times.map((t) => DropdownMenuItem(
                          value: t,
                          child: Text(t))).toList(),
                        onChanged: (v) => setState(() => _startTime = v!),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: TxCard(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.base, vertical: AppSpacing.md),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('End Time',
                      style: AppTypography.labelSm.copyWith(color: muted)),
                    const SizedBox(height: 4),
                    DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _endTime,
                        isExpanded: true,
                        dropdownColor:
                            isDark ? AppColors.darkSurface : AppColors.lightSurface,
                        style: AppTypography.body.copyWith(color: text),
                        items: _times.map((t) => DropdownMenuItem(
                          value: t,
                          child: Text(t))).toList(),
                        onChanged: (v) => setState(() => _endTime = v!),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ]),

          const SizedBox(height: AppSpacing.xl),

          TxButton(
            label: 'Save Availability',
            onTap: () {
              HapticFeedback.mediumImpact();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Availability saved ✓')));
            },
          ),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}
