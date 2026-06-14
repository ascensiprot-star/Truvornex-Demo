import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_badge.dart';

class ProviderBookingsScreen extends StatefulWidget {
  const ProviderBookingsScreen({super.key});

  @override
  State<ProviderBookingsScreen> createState() => _ProviderBookingsScreenState();
}

class _ProviderBookingsScreenState extends State<ProviderBookingsScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  static const _bookings = [
    _Booking('Pipe Repair',     'Ahmed K.', '10:00 AM', 'Today',    'confirmed', '\$45/hr'),
    _Booking('Drain Cleaning',  'Sara M.',  '2:00 PM',  'Today',    'pending',   '\$60'),
    _Booking('Water Heater',    'Omar F.',  '9:00 AM',  'Tomorrow', 'confirmed', '\$120'),
    _Booking('Emergency Fix',   'Riya S.',  '4:00 PM',  'Today',    'in-progress', '\$80/hr'),
    _Booking('Full Inspection', 'Tariq A.', '11:00 AM', 'Jun 20',   'confirmed', '\$95'),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: 'My Bookings'),
      body: Column(
        children: [
          Container(
            color: surface,
            child: TabBar(
              controller: _tabs,
              indicatorColor: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
              indicatorWeight: 2,
              labelStyle: AppTypography.buttonSm,
              unselectedLabelStyle: AppTypography.buttonSm,
              labelColor: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
              unselectedLabelColor: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle,
              dividerColor: border,
              tabs: const [
                Tab(text: 'Upcoming'),
                Tab(text: 'Completed'),
                Tab(text: 'Cancelled'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabs,
              children: [
                _buildList(_bookings.where(
                  (b) => b.status != 'completed' && b.status != 'cancelled').toList(),
                  isDark),
                _buildList([], isDark, emptyMsg: 'No completed bookings yet'),
                _buildList([], isDark, emptyMsg: 'No cancelled bookings'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(List<_Booking> bookings, bool isDark,
      {String emptyMsg = 'No bookings'}) {
    final text  = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    if (bookings.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today_outlined, size: 40,
              color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle),
            const SizedBox(height: 12),
            Text(emptyMsg,
              style: AppTypography.body.copyWith(color: muted)),
          ],
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.base),
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemCount: bookings.length,
      itemBuilder: (_, i) {
        final b = bookings[i];
        return TxCard(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                Expanded(child: Text(b.service,
                  style: AppTypography.h3.copyWith(color: text, fontSize: 14))),
                TxBadge(
                  label: b.status.toUpperCase(),
                  variant: b.status == 'confirmed'  ? TxBadgeVariant.success
                    : b.status == 'in-progress' ? TxBadgeVariant.info
                    : TxBadgeVariant.warning,
                  dot: true),
              ]),
              const SizedBox(height: 4),
              Text('${b.customer} · ${b.time}, ${b.day}',
                style: AppTypography.caption.copyWith(color: muted)),
              const SizedBox(height: 8),
              Row(children: [
                Text(b.price,
                  style: AppTypography.bodySm.copyWith(
                    color: text, fontWeight: FontWeight.w600)),
                const Spacer(),
                if (b.status == 'pending')
                  Row(children: [
                    GestureDetector(
                      onTap: () => HapticFeedback.mediumImpact(),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.darkSuccess.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                        ),
                        child: Text('Accept',
                          style: AppTypography.buttonSm.copyWith(color: AppColors.darkSuccess)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () => HapticFeedback.mediumImpact(),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.darkError.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                        ),
                        child: Text('Decline',
                          style: AppTypography.buttonSm.copyWith(color: AppColors.darkError)),
                      ),
                    ),
                  ]),
              ]),
            ],
          ),
        );
      },
    );
  }
}

class _Booking {
  const _Booking(this.service, this.customer, this.time, this.day, this.status, this.price);
  final String service, customer, time, day, status, price;
}
