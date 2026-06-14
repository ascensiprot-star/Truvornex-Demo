import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_stat_card.dart';
import '../../shared/widgets/tx_badge.dart';

class ProviderEarningsScreen extends StatefulWidget {
  const ProviderEarningsScreen({super.key});

  @override
  State<ProviderEarningsScreen> createState() => _ProviderEarningsScreenState();
}

class _ProviderEarningsScreenState extends State<ProviderEarningsScreen> {
  int _period = 1;
  static const _periods = ['Week', 'Month', 'Year'];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    final spots = [
      FlSpot(0, 320), FlSpot(1, 450), FlSpot(2, 380), FlSpot(3, 520),
      FlSpot(4, 410), FlSpot(5, 580), FlSpot(6, 490),
    ];

    final payouts = [
      _Payout('Jun 10', '\$840.00', 'Completed', true),
      _Payout('May 28', '\$620.00', 'Completed', true),
      _Payout('May 14', '\$755.00', 'Completed', true),
      _Payout('Apr 30', '\$490.00', 'Pending',   false),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'Earnings'),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Period selector
          Container(
            height: 36,
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
            ),
            child: Row(
              children: List.generate(_periods.length, (i) {
                final active = _period == i;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _period = i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: active
                            ? (isDark ? AppColors.darkSurface : AppColors.lightBg)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                      ),
                      child: Text(_periods[i],
                        style: AppTypography.buttonSm.copyWith(
                          color: active ? text : muted)),
                    ),
                  ),
                );
              }),
            ),
          ),

          const SizedBox(height: AppSpacing.base),

          // Main earnings card
          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Total Earned',
                  style: AppTypography.caption.copyWith(color: muted)),
                const SizedBox(height: 4),
                Text('\$2,840.00',
                  style: AppTypography.display.copyWith(
                    color: text, fontSize: 36, letterSpacing: -1)),
                Row(children: [
                  const Icon(Icons.trending_up_rounded, size: 14, color: AppColors.darkSuccess),
                  const SizedBox(width: 4),
                  Text('+18% vs last month',
                    style: AppTypography.caption.copyWith(color: AppColors.darkSuccess)),
                ]),
                const SizedBox(height: AppSpacing.base),

                SizedBox(
                  height: 120,
                  child: LineChart(LineChartData(
                    gridData: FlGridData(show: false),
                    borderData: FlBorderData(show: false),
                    titlesData: FlTitlesData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: spots,
                        isCurved: true,
                        color: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
                        barWidth: 2,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: (isDark ? AppColors.darkPrimary : AppColors.lightPrimary)
                              .withOpacity(0.08),
                        ),
                      ),
                    ],
                  )),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.md),

          // Stats
          Row(children: [
            Expanded(child: TxStatCard(
              value: '34',
              label: 'Jobs done',
              icon: Icons.check_circle_outline_rounded,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '\$83.5',
              label: 'Avg per job',
              icon: Icons.bar_chart_rounded,
            )),
          ]),

          const SizedBox(height: AppSpacing.xl),
          Text('Payout History', style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.sm),

          ...payouts.map((p) => Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: TxCard(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.base, vertical: AppSpacing.md),
              child: Row(children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(p.date,
                    style: AppTypography.bodySm.copyWith(
                      color: text, fontWeight: FontWeight.w500)),
                  Text('Bank transfer',
                    style: AppTypography.caption.copyWith(color: muted)),
                ]),
                const Spacer(),
                Text(p.amount,
                  style: AppTypography.h3.copyWith(color: text, fontSize: 15)),
                const SizedBox(width: 10),
                TxBadge(
                  label: p.status,
                  variant: p.paid ? TxBadgeVariant.success : TxBadgeVariant.warning),
              ]),
            ),
          )),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}

class _Payout {
  const _Payout(this.date, this.amount, this.status, this.paid);
  final String date, amount, status;
  final bool paid;
}
