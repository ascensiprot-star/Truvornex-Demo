import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_badge.dart';
import '../shared/widgets/tx_card.dart';

class AdminBookingsScreen extends StatelessWidget {
  const AdminBookingsScreen({super.key});

  static const _bookings = [
    _Booking('BK-0847', 'Pipe Repair',   'Fatima R.',  'Ahmed K.',  '\$85',  'confirmed'),
    _Booking('BK-0846', 'AC Service',    'Hassan M.',  'Sara K.',   '\$120', 'in-progress'),
    _Booking('BK-0845', 'Drain Clean',   'Omar F.',    'Nadia S.',  '\$60',  'completed'),
    _Booking('BK-0844', 'Electrical Fix','Riya S.',    'Tariq A.',  '\$95',  'cancelled'),
    _Booking('BK-0843', 'Deep Clean',    'Ali B.',     'Priya M.',  '\$150', 'completed'),
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
          Text('Bookings',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemCount: _bookings.length,
        itemBuilder: (_, i) {
          final b = _bookings[i];
          return TxCard(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(children: [
                  Text(b.id,
                    style: AppTypography.mono.copyWith(
                      color: AppColors.darkTextSubtle, fontSize: 11)),
                  const Spacer(),
                  TxBadge(
                    label: b.status.toUpperCase(),
                    variant: b.status == 'completed'    ? TxBadgeVariant.success
                        : b.status == 'confirmed'       ? TxBadgeVariant.info
                        : b.status == 'in-progress'     ? TxBadgeVariant.warning
                        : TxBadgeVariant.error,
                    dot: true),
                ]),
                const SizedBox(height: 6),
                Text(b.service,
                  style: AppTypography.h3.copyWith(
                    color: AppColors.darkPrimary, fontSize: 14)),
                const SizedBox(height: 4),
                Row(children: [
                  Icon(Icons.person_outline_rounded, size: 13,
                    color: AppColors.darkTextSubtle),
                  const SizedBox(width: 4),
                  Text(b.customer,
                    style: AppTypography.caption.copyWith(color: AppColors.darkTextMuted)),
                  const SizedBox(width: 12),
                  Icon(Icons.handyman_outlined, size: 13,
                    color: AppColors.darkTextSubtle),
                  const SizedBox(width: 4),
                  Text(b.provider,
                    style: AppTypography.caption.copyWith(color: AppColors.darkTextMuted)),
                  const Spacer(),
                  Text(b.amount,
                    style: AppTypography.bodySm.copyWith(
                      color: AppColors.darkPrimary, fontWeight: FontWeight.w600)),
                ]),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _Booking {
  const _Booking(this.id, this.service, this.customer, this.provider, this.amount, this.status);
  final String id, service, customer, provider, amount, status;
}
