import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_card.dart';
import '../shared/widgets/tx_badge.dart';
import '../shared/widgets/tx_stat_card.dart';

class AdminSystemHealthScreen extends StatelessWidget {
  const AdminSystemHealthScreen({super.key});

  static const _services = [
    _ServiceStatus('API Gateway',      'Healthy',   98.7, AppColors.darkSuccess),
    _ServiceStatus('Database',         'Healthy',   99.9, AppColors.darkSuccess),
    _ServiceStatus('Auth Service',     'Healthy',   99.8, AppColors.darkSuccess),
    _ServiceStatus('AI (DeepSeek)',    'Degraded',  87.2, AppColors.darkWarning),
    _ServiceStatus('Realtime Engine',  'Healthy',   98.1, AppColors.darkSuccess),
    _ServiceStatus('Storage',          'Healthy',   99.5, AppColors.darkSuccess),
    _ServiceStatus('Email Service',    'Down',      0.0,  AppColors.darkError),
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
          Text('System Health',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            child: Row(children: [
              Container(
                width: 7, height: 7,
                decoration: const BoxDecoration(
                  color: AppColors.darkWarning, shape: BoxShape.circle),
              ),
              const SizedBox(width: 6),
              Text('1 issue',
                style: AppTypography.caption.copyWith(color: AppColors.darkWarning)),
            ]),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Row(children: [
            Expanded(child: TxStatCard(
              value: '98.7%',
              label: 'Overall uptime',
              icon: Icons.monitor_heart_outlined,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '42 ms',
              label: 'Avg API latency',
              icon: Icons.speed_rounded,
              trend: '-8ms',
              trendPositive: true,
            )),
          ]),

          const SizedBox(height: AppSpacing.xl),

          Text('Service Status',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            child: Column(
              children: _services.asMap().entries.map((e) {
                final s = e.value;
                final isLast = e.key == _services.length - 1;
                return Column(children: [
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Row(children: [
                      Container(
                        width: 8, height: 8,
                        decoration: BoxDecoration(
                          color: s.statusColor, shape: BoxShape.circle),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.name,
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.darkText, fontWeight: FontWeight.w500)),
                          Text('${s.uptime.toStringAsFixed(1)}% uptime',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.darkTextSubtle)),
                        ],
                      )),
                      TxBadge(
                        label: s.status,
                        variant: s.status == 'Healthy'  ? TxBadgeVariant.success
                            : s.status == 'Degraded'  ? TxBadgeVariant.warning
                            : TxBadgeVariant.error),
                    ]),
                  ),
                  if (!isLast)
                    const Divider(height: 1, color: AppColors.darkBorder, indent: 32),
                ]);
              }).toList(),
            ),
          ),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}

class _ServiceStatus {
  const _ServiceStatus(this.name, this.status, this.uptime, this.statusColor);
  final String name, status;
  final double uptime;
  final Color statusColor;
}
