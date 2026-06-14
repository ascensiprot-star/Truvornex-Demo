import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_avatar.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_button.dart';

class CustomerProfileScreen extends ConsumerWidget {
  const CustomerProfileScreen({super.key, this.isProvider = false});
  final bool isProvider;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user    = ref.watch(currentUserProvider);
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    final name  = user?.userMetadata?['full_name'] as String? ?? 'User';
    final email = user?.email ?? '';

    final _menuItems = [
      _MenuItem(Icons.bookmark_border_rounded,    'Saved Addresses',      RouteNames.savedAddresses),
      _MenuItem(Icons.history_rounded,            'Booking History',      RouteNames.bookingHistory),
      _MenuItem(Icons.star_border_rounded,        'My Reviews',           RouteNames.reviews),
      _MenuItem(Icons.credit_card_outlined,       'Payment Methods',      RouteNames.paymentMethods),
      _MenuItem(Icons.receipt_long_outlined,      'Invoices',             RouteNames.invoices),
      _MenuItem(Icons.card_giftcard_outlined,     'Gift Cards',           RouteNames.giftCards),
      _MenuItem(Icons.loyalty_outlined,           'Loyalty Program',      RouteNames.loyalty),
      _MenuItem(Icons.group_outlined,             'Referral Program',     RouteNames.referral),
      _MenuItem(Icons.notifications_outlined,     'Notifications',        RouteNames.notifSettings),
      _MenuItem(Icons.lock_outline_rounded,       'Privacy & Security',   RouteNames.privacy),
      _MenuItem(Icons.help_outline_rounded,       'Help Center',          RouteNames.helpCenter),
      _MenuItem(Icons.support_agent_outlined,     'Support Tickets',      RouteNames.supportTickets),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        title: 'Profile',
        actions: [
          TxIconButton(icon: Icons.edit_outlined, onTap: () {}),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppSpacing.base),
        children: [
          // Profile card
          TxCard(
            padding: const EdgeInsets.all(AppSpacing.xl),
            child: Column(
              children: [
                TxAvatar(name: name, size: 72, showRing: true),
                const SizedBox(height: AppSpacing.md),
                Text(name,
                  style: AppTypography.h2.copyWith(color: text)),
                const SizedBox(height: 4),
                Text(email,
                  style: AppTypography.caption.copyWith(color: muted)),
                const SizedBox(height: AppSpacing.md),
                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  const TxBadge(label: 'Customer', variant: TxBadgeVariant.neutral),
                  const SizedBox(width: 8),
                  const TxBadge(label: 'Verified', variant: TxBadgeVariant.success, dot: true),
                ]),
                const SizedBox(height: AppSpacing.base),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _statItem('12', 'Bookings', text, muted),
                    _divider(isDark),
                    _statItem('4.9★', 'Rating', text, muted),
                    _divider(isDark),
                    _statItem('240', 'Points', text, muted),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: AppSpacing.base),

          // Menu
          TxCard(
            child: Column(
              children: _menuItems.asMap().entries.map((e) {
                final item = e.value;
                final isLast = e.key == _menuItems.length - 1;
                return Column(
                  children: [
                    ListTile(
                      dense: true,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.base, vertical: 2),
                      leading: Icon(item.icon, size: 18, color: muted),
                      title: Text(item.label,
                        style: AppTypography.body.copyWith(color: text)),
                      trailing: Icon(Icons.chevron_right_rounded, size: 16, color: muted),
                      onTap: () => context.pushNamed(item.routeName),
                    ),
                    if (!isLast) Divider(height: 1, color: border, indent: 56),
                  ],
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: AppSpacing.base),

          TxButton(
            label: 'Sign Out',
            onTap: () => AuthService.signOut().then((_) {
              if (context.mounted) context.goNamed(RouteNames.login);
            }),
            variant: TxButtonVariant.danger,
            icon: Icons.logout_rounded,
          ),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }

  Widget _statItem(String val, String lbl, Color text, Color muted) => Column(
    children: [
      Text(val, style: AppTypography.h3.copyWith(color: text)),
      const SizedBox(height: 3),
      Text(lbl, style: AppTypography.labelSm.copyWith(color: muted)),
    ],
  );

  Widget _divider(bool isDark) => Container(
    height: 28, width: 1,
    color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
  );
}

class _MenuItem {
  const _MenuItem(this.icon, this.label, this.routeName);
  final IconData icon;
  final String label;
  final String routeName;
}
