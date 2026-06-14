import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_card.dart';
import '../shared/widgets/tx_stat_card.dart';

class AdminAnalyticsScreen extends StatelessWidget {
  const AdminAnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final spots = [
      FlSpot(0, 2800), FlSpot(1, 3200), FlSpot(2, 2950),
      FlSpot(3, 3800), FlSpot(4, 3500), FlSpot(5, 4200), FlSpot(6, 4100),
    ];

    final categories = [
      ('Cleaning',   0.28, AppColors.darkPrimary),
      ('Plumbing',   0.22, AppColors.darkInfo),
      ('Electrical', 0.18, AppColors.darkSuccess),
      ('Moving',     0.14, AppColors.darkWarning),
      ('Beauty',     0.10, const Color(0xFF7C6FCD)),
      ('Other',      0.08, AppColors.darkTextSubtle),
    ];

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
          Text('Analytics',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Row(children: [
            Expanded(child: TxStatCard(
              value: '\$84.2K',
              label: 'Monthly GMV',
              icon: Icons.trending_up_rounded,
              trend: '+22%',
              trendPositive: true,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '3,847',
              label: 'Monthly bookings',
              icon: Icons.calendar_today_outlined,
              trend: '+18%',
              trendPositive: true,
            )),
          ]),
          const SizedBox(height: AppSpacing.sm),
          Row(children: [
            Expanded(child: TxStatCard(
              value: '\$21.89',
              label: 'Avg booking value',
              icon: Icons.bar_chart_rounded,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '89.3%',
              label: 'Booking completion',
              icon: Icons.check_circle_outline_rounded,
            )),
          ]),

          const SizedBox(height: AppSpacing.xl),

          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('GMV Trend (30 days)',
                  style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
                const SizedBox(height: AppSpacing.base),
                SizedBox(
                  height: 140,
                  child: LineChart(LineChartData(
                    gridData: FlGridData(show: false),
                    borderData: FlBorderData(show: false),
                    titlesData: FlTitlesData(show: false),
                    lineBarsData: [
                      LineChartBarData(
                        spots: spots,
                        isCurved: true,
                        color: AppColors.darkPrimary,
                        barWidth: 2,
                        dotData: FlDotData(show: false),
                        belowBarData: BarAreaData(
                          show: true,
                          color: AppColors.darkPrimary.withOpacity(0.06)),
                      ),
                    ],
                  )),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          Text('Bookings by Category',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              children: categories.map((c) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Column(children: [
                  Row(children: [
                    Container(
                      width: 8, height: 8,
                      decoration: BoxDecoration(color: c.$3, shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 8),
                    Text(c.$1,
                      style: AppTypography.caption.copyWith(
                        color: AppColors.darkText)),
                    const Spacer(),
                    Text('${(c.$2 * 100).toStringAsFixed(0)}%',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.darkTextMuted, fontWeight: FontWeight.w600)),
                  ]),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(2),
                    child: LinearProgressIndicator(
                      value: c.$2,
                      minHeight: 4,
                      backgroundColor: AppColors.darkSurfaceHigh,
                      valueColor: AlwaysStoppedAnimation(c.$3),
                    ),
                  ),
                ]),
              )).toList(),
            ),
          ),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}
