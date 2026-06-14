import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_card.dart';
import '../shared/widgets/tx_stat_card.dart';
import '../shared/widgets/tx_badge.dart';

class AdminFinancialScreen extends StatelessWidget {
  const AdminFinancialScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final barData = [18.0, 24.0, 21.0, 28.0, 26.0, 32.0, 30.0];

    const payouts = [
      _Payout('Ahmed Karimi',   '\$2,840',  'Jun 10', 'paid'),
      _Payout('Sara Khan',      '\$1,620',  'Jun 10', 'paid'),
      _Payout('Nadia Salem',    '\$890',    'Jun 14', 'pending'),
      _Payout('Hassan M.',      '\$1,240',  'Jun 14', 'pending'),
    ];

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
          Text('Financial Dashboard',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          Row(children: [
            Expanded(child: TxStatCard(
              value: '\$84.2K',
              label: 'Platform GMV',
              icon: Icons.account_balance_wallet_outlined,
              trend: '+22%',
              trendPositive: true,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '\$8.4K',
              label: 'Platform fees (10%)',
              icon: Icons.percent_rounded,
              trend: '+22%',
              trendPositive: true,
            )),
          ]),
          const SizedBox(height: AppSpacing.sm),
          Row(children: [
            Expanded(child: TxStatCard(
              value: '\$75.8K',
              label: 'Provider payouts',
              icon: Icons.send_rounded,
            )),
            const SizedBox(width: AppSpacing.sm),
            Expanded(child: TxStatCard(
              value: '\$2.1K',
              label: 'Pending payouts',
              icon: Icons.pending_outlined,
              iconColor: AppColors.darkWarning,
            )),
          ]),

          const SizedBox(height: AppSpacing.xl),

          TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('GMV (K\$) · Last 7 days',
                  style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
                const SizedBox(height: AppSpacing.base),
                SizedBox(
                  height: 130,
                  child: BarChart(BarChartData(
                    alignment: BarChartAlignment.spaceAround,
                    maxY: 40,
                    barGroups: barData.asMap().entries.map((e) => BarChartGroupData(
                      x: e.key,
                      barRods: [BarChartRodData(
                        toY: e.value,
                        color: AppColors.darkPrimary,
                        width: 22,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                      )],
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
                            const d = ['M','T','W','T','F','S','S'];
                            return Text(d[v.toInt() % 7],
                              style: AppTypography.monoSm.copyWith(
                                color: AppColors.darkTextSubtle));
                          },
                        ),
                      ),
                    ),
                  )),
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.xl),

          Text('Provider Payouts',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
          const SizedBox(height: AppSpacing.sm),

          TxCard(
            child: Column(
              children: payouts.asMap().entries.map((e) {
                final p = e.value;
                final isLast = e.key == payouts.length - 1;
                return Column(children: [
                  Padding(
                    padding: const EdgeInsets.all(AppSpacing.md),
                    child: Row(children: [
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(p.name,
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.darkText, fontWeight: FontWeight.w500)),
                          Text(p.date,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.darkTextSubtle)),
                        ],
                      )),
                      Text(p.amount,
                        style: AppTypography.h3.copyWith(
                          color: AppColors.darkPrimary, fontSize: 15)),
                      const SizedBox(width: 10),
                      TxBadge(
                        label: p.status,
                        variant: p.status == 'paid'
                            ? TxBadgeVariant.success
                            : TxBadgeVariant.warning),
                    ]),
                  ),
                  if (!isLast)
                    const Divider(height: 1, color: AppColors.darkBorder),
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

class _Payout {
  const _Payout(this.name, this.amount, this.date, this.status);
  final String name, amount, date, status;
}
