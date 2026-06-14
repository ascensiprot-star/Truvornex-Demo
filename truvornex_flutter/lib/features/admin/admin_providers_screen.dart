import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_badge.dart';
import '../shared/widgets/tx_avatar.dart';
import '../shared/widgets/tx_card.dart';

class AdminProvidersScreen extends StatelessWidget {
  const AdminProvidersScreen({super.key});

  static const _providers = [
    _Provider('Ahmed Karimi',    'Plumbing',    4.9, 1423, 'verified'),
    _Provider('Sara Khan',       'Cleaning',    4.8, 234,  'verified'),
    _Provider('Nadia Salem',     'Electrical',  4.7, 89,   'pending'),
    _Provider('Hassan Mohammed', 'Fitness',     4.6, 312,  'verified'),
    _Provider('Riya Singh',      'Beauty',      4.9, 567,  'verified'),
    _Provider('Tariq Ali',       'Gardening',   4.5, 45,   'pending'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
          Text('Providers (${_providers.length})',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemCount: _providers.length,
        itemBuilder: (_, i) {
          final p = _providers[i];
          return TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Row(children: [
              TxAvatar(name: p.name, size: 40, showRing: p.status == 'verified'),
              const SizedBox(width: AppSpacing.md),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(p.name,
                      style: AppTypography.bodySm.copyWith(
                        color: AppColors.darkPrimary, fontWeight: FontWeight.w600)),
                    Text('${p.category} · ${p.jobs} jobs',
                      style: AppTypography.caption.copyWith(color: AppColors.darkTextMuted)),
                    Row(children: [
                      const Icon(Icons.star_rounded, size: 12, color: Color(0xFFFCD34D)),
                      const SizedBox(width: 3),
                      Text('${p.rating}',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.darkText, fontWeight: FontWeight.w600)),
                    ]),
                  ],
                ),
              ),
              Column(children: [
                TxBadge(
                  label: p.status,
                  variant: p.status == 'verified'
                      ? TxBadgeVariant.success
                      : TxBadgeVariant.warning,
                  dot: true),
                const SizedBox(height: 6),
                if (p.status == 'pending')
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.darkPrimary,
                      borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                    ),
                    child: Text('Review',
                      style: AppTypography.buttonSm.copyWith(
                        color: AppColors.darkOnPrimary, fontSize: 11)),
                  ),
              ]),
            ]),
          );
        },
      ),
    );
  }
}

class _Provider {
  const _Provider(this.name, this.category, this.rating, this.jobs, this.status);
  final String name, category, status;
  final double rating;
  final int jobs;
}
