import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_button.dart';

class ManageServicesScreen extends StatelessWidget {
  const ManageServicesScreen({super.key});

  static const _services = [
    _Service('Pipe Repair & Replacement',  '\$45/hr',   true,  '1,423 bookings'),
    _Service('Drain Cleaning',             '\$60 flat', true,  '845 bookings'),
    _Service('Water Heater Installation',  '\$120',     true,  '312 bookings'),
    _Service('Emergency Plumbing',         '\$80/hr',   false, '89 bookings'),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        title: 'My Services',
        actions: [
          TxIconButton(icon: Icons.add_rounded, onTap: () => _showAddService(context)),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.base),
              separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
              itemCount: _services.length,
              itemBuilder: (_, i) {
                final s = _services[i];
                return TxCard(
                  padding: const EdgeInsets.all(AppSpacing.base),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Expanded(child: Text(s.name,
                          style: AppTypography.h3.copyWith(color: text, fontSize: 14))),
                        Switch.adaptive(
                          value: s.active,
                          onChanged: (v) => HapticFeedback.lightImpact(),
                          activeColor: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
                        ),
                      ]),
                      Row(children: [
                        Text(s.price,
                          style: AppTypography.bodySm.copyWith(
                            color: text, fontWeight: FontWeight.w600)),
                        const SizedBox(width: 10),
                        Text(s.bookings,
                          style: AppTypography.caption.copyWith(color: muted)),
                        const Spacer(),
                        TxBadge(
                          label: s.active ? 'Active' : 'Paused',
                          variant: s.active
                              ? TxBadgeVariant.success
                              : TxBadgeVariant.neutral,
                          dot: true),
                      ]),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: EdgeInsets.fromLTRB(
              AppSpacing.base, 0, AppSpacing.base,
              AppSpacing.base + MediaQuery.of(context).viewPadding.bottom),
            child: TxButton(
              label: 'Add New Service',
              onTap: () => _showAddService(context),
              variant: TxButtonVariant.secondary,
              icon: Icons.add_rounded,
            ),
          ),
        ],
      ),
    );
  }

  void _showAddService(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const _AddServiceSheet(),
    );
  }
}

class _AddServiceSheet extends StatelessWidget {
  const _AddServiceSheet();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bg     = isDark ? AppColors.darkSurface : AppColors.lightBg;
    final border = isDark ? AppColors.darkBorder : AppColors.lightBorder;

    return Container(
      height: MediaQuery.of(context).size.height * 0.6,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        border: Border(top: BorderSide(color: border)),
      ),
      padding: EdgeInsets.fromLTRB(
        AppSpacing.base, AppSpacing.sm, AppSpacing.base,
        AppSpacing.base + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36, height: 4,
              decoration: BoxDecoration(
                color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.base),
          Text('Add New Service',
            style: AppTypography.h2.copyWith(
              color: isDark ? AppColors.darkPrimary : AppColors.lightPrimary)),
          const SizedBox(height: AppSpacing.xl),
          Text('Service details form would appear here with name, pricing, description, and availability settings.',
            style: AppTypography.body.copyWith(
              color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted)),
        ],
      ),
    );
  }
}

class _Service {
  const _Service(this.name, this.price, this.active, this.bookings);
  final String name, price, bookings;
  final bool active;
}
