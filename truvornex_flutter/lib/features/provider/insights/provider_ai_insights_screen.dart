import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_stat_card.dart';

class ProviderAIInsightsScreen extends StatelessWidget {
  const ProviderAIInsightsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'AI Insights'),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Row(children: [
            Expanded(child: TxStatCard(
              value: '94%',
              label: 'Customer satisfaction',
              icon: Icons.sentiment_satisfied_rounded,
              trend: '+2%',
              trendPositive: true,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: 'Top 12%',
              label: 'Ranking in your city',
              icon: Icons.emoji_events_outlined,
            )),
          ]),
          const SizedBox(height: AppSpacing.sm),
          Row(children: [
            Expanded(child: TxStatCard(
              value: '28 min',
              label: 'Avg response time',
              icon: Icons.schedule_rounded,
              trend: '-12min',
              trendPositive: true,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '1.8×',
              label: 'Repeat customer rate',
              icon: Icons.repeat_rounded,
            )),
          ]),

          const SizedBox(height: AppSpacing.xl),

          Text('Demand Heatmap',
            style: AppTypography.h3.copyWith(color: text)),
          Text('Request volume by hour this week',
            style: AppTypography.caption.copyWith(color: muted)),
          const SizedBox(height: AppSpacing.md),

          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: SizedBox(
              height: 160,
              child: BarChart(BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: 20,
                barGroups: List.generate(8, (i) => BarChartGroupData(
                  x: i,
                  barRods: [BarChartRodData(
                    toY: [3, 8, 15, 18, 12, 10, 7, 4][i].toDouble(),
                    color: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
                    width: 20,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                  )],
                )),
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
                        const hrs = ['8a','10a','12p','2p','4p','6p','8p','10p'];
                        return Text(hrs[v.toInt() % 8],
                          style: AppTypography.monoSm.copyWith(color: muted));
                      },
                    ),
                  ),
                ),
              )),
            ),
          ),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}
