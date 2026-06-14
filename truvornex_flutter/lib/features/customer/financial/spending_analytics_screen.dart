import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_stat_card.dart';

class SpendingAnalyticsScreen extends StatefulWidget {
  const SpendingAnalyticsScreen({super.key});

  @override
  State<SpendingAnalyticsScreen> createState() => _SpendingAnalyticsScreenState();
}

class _SpendingAnalyticsScreenState extends State<SpendingAnalyticsScreen> {
  int _periodIndex = 1; // 0=week, 1=month, 2=year
  static const _periods = ['Week', 'Month', 'Year'];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    final bars = [40.0, 85.0, 55.0, 120.0, 70.0, 95.0, 60.0];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'Spending Analytics'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
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
                  final active = _periodIndex == i;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _periodIndex = i),
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

            // Total
            TxCard(
              padding: const EdgeInsets.all(AppSpacing.base),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Total Spent',
                    style: AppTypography.caption.copyWith(color: muted)),
                  const SizedBox(height: 4),
                  Row(children: [
                    Text('\$525.40',
                      style: AppTypography.display.copyWith(
                        color: text, letterSpacing: -1)),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.darkSuccess.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                      ),
                      child: Row(children: [
                        const Icon(Icons.trending_down_rounded,
                          size: 12, color: AppColors.darkSuccess),
                        const SizedBox(width: 4),
                        Text('12% vs last month',
                          style: AppTypography.labelSm.copyWith(
                            color: AppColors.darkSuccess)),
                      ]),
                    ),
                  ]),
                  const SizedBox(height: AppSpacing.base),

                  // Bar chart
                  SizedBox(
                    height: 140,
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        maxY: 150,
                        barGroups: bars.asMap().entries.map((e) => BarChartGroupData(
                          x: e.key,
                          barRods: [
                            BarChartRodData(
                              toY: e.value,
                              color: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
                              width: 18,
                              borderRadius: const BorderRadius.vertical(
                                top: Radius.circular(4)),
                            ),
                          ],
                        )).toList(),
                        gridData: FlGridData(show: false),
                        borderData: FlBorderData(show: false),
                        titlesData: FlTitlesData(
                          leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (v, _) {
                                const days = ['M','T','W','T','F','S','S'];
                                return Text(days[v.toInt() % 7],
                                  style: AppTypography.monoSm.copyWith(color: muted));
                              },
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.md),

            // Stats grid
            Row(children: [
              Expanded(child: TxStatCard(
                value: '12',
                label: 'Bookings',
                icon: Icons.calendar_today_outlined,
                trend: '+3',
                trendPositive: true,
              )),
              const SizedBox(width: AppSpacing.sm),
              Expanded(child: TxStatCard(
                value: '\$43.8',
                label: 'Avg per booking',
                icon: Icons.account_balance_wallet_outlined,
                trend: '-8%',
                trendPositive: true,
              )),
            ]),

            const SizedBox(height: AppSpacing.md),

            // Breakdown
            Text('Spending by Category',
              style: AppTypography.h3.copyWith(color: text)),
            const SizedBox(height: AppSpacing.sm),

            ...([
              ('Cleaning',  '\$185.00', 0.35),
              ('Plumbing',  '\$120.00', 0.23),
              ('Electrical','\$95.00',  0.18),
              ('Moving',    '\$80.00',  0.15),
              ('Other',     '\$45.40',  0.09),
            ].map((item) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: TxCard(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(children: [
                  Row(children: [
                    Text(item.$1,
                      style: AppTypography.bodySm.copyWith(
                        color: text, fontWeight: FontWeight.w500)),
                    const Spacer(),
                    Text(item.$2,
                      style: AppTypography.bodySm.copyWith(
                        color: text, fontWeight: FontWeight.w600)),
                  ]),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(2),
                    child: LinearProgressIndicator(
                      value: item.$3,
                      minHeight: 4,
                      backgroundColor:
                          isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                      valueColor: AlwaysStoppedAnimation(
                          isDark ? AppColors.darkPrimary : AppColors.lightPrimary),
                    ),
                  ),
                ]),
              ),
            ))),

            const SizedBox(height: AppSpacing.xl2),
          ],
        ),
      ),
    );
  }
}
