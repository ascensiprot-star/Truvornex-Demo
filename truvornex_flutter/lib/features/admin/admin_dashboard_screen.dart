import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_card.dart';
import '../shared/widgets/tx_stat_card.dart';
import '../shared/widgets/tx_badge.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final spots = [
      FlSpot(0, 420), FlSpot(1, 580), FlSpot(2, 510), FlSpot(3, 720),
      FlSpot(4, 640), FlSpot(5, 810), FlSpot(6, 760),
    ];

    const recentActivity = [
      _Activity('New user signup', 'Fatima R. joined', '2 min ago', AppColors.darkInfo),
      _Activity('Booking confirmed', 'Plumbing · Ahmed K.', '5 min ago', AppColors.darkSuccess),
      _Activity('Provider verified', 'Hassan M. approved', '12 min ago', AppColors.darkSuccess),
      _Activity('Support ticket', 'Payment dispute opened', '18 min ago', AppColors.darkWarning),
      _Activity('Refund processed', '\$45 to Sara K.', '24 min ago', AppColors.darkError),
    ];

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
          Text('Admin Dashboard',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
        actions: [
          const TxBadge(label: 'LIVE', variant: TxBadgeVariant.success, dot: true),
          const SizedBox(width: AppSpacing.base),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // KPI grid
          Row(children: [
            Expanded(child: TxStatCard(
              value: '12,483',
              label: 'Total users',
              icon: Icons.people_outline_rounded,
              trend: '+142',
              trendPositive: true,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '2,847',
              label: 'Providers',
              icon: Icons.handyman_outlined,
              trend: '+23',
              trendPositive: true,
            )),
          ]).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.sm),

          Row(children: [
            Expanded(child: TxStatCard(
              value: '\$84.2K',
              label: 'GMV this month',
              icon: Icons.account_balance_wallet_outlined,
              trend: '+22%',
              trendPositive: true,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '98.7%',
              label: 'Platform uptime',
              icon: Icons.monitor_heart_outlined,
            )),
          ]).animate(delay: 100.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          // Revenue chart
          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Text('GMV Trend',
                    style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
                  const Spacer(),
                  const TxBadge(label: 'This week', variant: TxBadgeVariant.neutral),
                ]),
                const SizedBox(height: AppSpacing.base),
                SizedBox(
                  height: 130,
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
          ).animate(delay: 200.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          Text('Recent Activity',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            child: Column(
              children: recentActivity.asMap().entries.map((e) {
                final a = e.value;
                final isLast = e.key == recentActivity.length - 1;
                return Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(AppSpacing.md),
                      child: Row(children: [
                        Container(
                          width: 8, height: 8,
                          decoration: BoxDecoration(
                            color: a.color, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(a.title,
                                style: AppTypography.bodySm.copyWith(
                                  color: AppColors.darkText, fontWeight: FontWeight.w500)),
                              Text(a.subtitle,
                                style: AppTypography.caption.copyWith(
                                  color: AppColors.darkTextSubtle)),
                            ],
                          ),
                        ),
                        Text(a.time,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.darkTextSubtle)),
                      ]),
                    ),
                    if (!isLast)
                      const Divider(height: 1, color: AppColors.darkBorder, indent: 32),
                  ],
                );
              }).toList(),
            ),
          ).animate(delay: 300.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }
}

class _Activity {
  const _Activity(this.title, this.subtitle, this.time, this.color);
  final String title, subtitle, time;
  final Color color;
}
