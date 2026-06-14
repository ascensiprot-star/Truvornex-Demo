// Stub screens for profile-related routes
// These are lightweight placeholder screens wired to their routes
import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';

class _StubScreen extends StatelessWidget {
  const _StubScreen({required this.title, required this.icon, this.subtitle});
  final String title;
  final IconData icon;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final subtle  = isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: title),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.xl2),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 72, height: 72,
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                  borderRadius: BorderRadius.circular(20),
                ),
                alignment: Alignment.center,
                child: Icon(icon, size: 32, color: muted),
              ),
              const SizedBox(height: 20),
              Text(title,
                style: AppTypography.h2.copyWith(color: text),
                textAlign: TextAlign.center),
              const SizedBox(height: 8),
              Text(subtitle ?? 'This feature is coming soon.',
                style: AppTypography.body.copyWith(color: muted, height: 1.5),
                textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
}

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    final notifs = [
      _N(Icons.check_circle_outline_rounded, AppColors.darkSuccess,
        'Booking Confirmed', 'Your plumbing booking with Ahmed K. is confirmed for 10:00 AM today.', '2m'),
      _N(Icons.star_border_rounded, AppColors.darkWarning,
        'Leave a Review', 'How was your cleaning service with Sara K.? Rate your experience.', '1h'),
      _N(Icons.group_outlined, AppColors.darkInfo,
        'Group Buy Locked!', 'Deep Cleaning group buy reached 10 members. Discount activated!', '3h'),
      _N(Icons.auto_awesome_rounded, const Color(0xFF7C6FCD),
        'Simon AI', 'Based on your history, you may need AC service this month. Want me to find providers?', '1d'),
      _N(Icons.local_offer_outlined, AppColors.darkSuccess,
        'Loyalty Reward', 'You\'ve earned 50 loyalty points from your last booking!', '2d'),
    ];

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        title: 'Notifications',
        actions: [
          TextButton(
            onPressed: () {},
            child: Text('Mark all read',
              style: AppTypography.caption.copyWith(color: muted)),
          ),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        separatorBuilder: (_, __) => Divider(height: 1, color: border),
        itemCount: notifs.length,
        itemBuilder: (_, i) {
          final n = notifs[i];
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 40, height: 40,
                  decoration: BoxDecoration(
                    color: n.color.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  alignment: Alignment.center,
                  child: Icon(n.icon, size: 18, color: n.color),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      Expanded(child: Text(n.title,
                        style: AppTypography.bodySm.copyWith(
                          color: text, fontWeight: FontWeight.w600))),
                      Text(n.time,
                        style: AppTypography.caption.copyWith(color: muted)),
                    ]),
                    const SizedBox(height: 3),
                    Text(n.body,
                      style: AppTypography.caption.copyWith(color: muted, height: 1.4)),
                  ],
                )),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _N {
  const _N(this.icon, this.color, this.title, this.body, this.time);
  final IconData icon;
  final Color color;
  final String title, body, time;
}

class BookingHistoryScreen extends StatelessWidget {
  const BookingHistoryScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Booking History',
    icon: Icons.history_rounded,
    subtitle: 'Your complete booking history with all providers will appear here.',
  );
}

class SavedAddressesScreen extends StatelessWidget {
  const SavedAddressesScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Saved Addresses',
    icon: Icons.bookmark_border_rounded,
    subtitle: 'Save your frequently used locations for faster booking.',
  );
}

class ReviewsScreen extends StatelessWidget {
  const ReviewsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'My Reviews',
    icon: Icons.star_border_rounded,
    subtitle: 'Reviews you\'ve left for providers will appear here.',
  );
}

class PaymentMethodsScreen extends StatelessWidget {
  const PaymentMethodsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Payment Methods',
    icon: Icons.credit_card_outlined,
    subtitle: 'Manage your saved payment methods for faster checkout.',
  );
}

class InvoicesScreen extends StatelessWidget {
  const InvoicesScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Invoices',
    icon: Icons.receipt_long_outlined,
    subtitle: 'Download and view all your service invoices.',
  );
}

class GiftCardsScreen extends StatelessWidget {
  const GiftCardsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Gift Cards',
    icon: Icons.card_giftcard_outlined,
    subtitle: 'Redeem gift cards or purchase them for friends and family.',
  );
}

class ReferralScreen extends StatelessWidget {
  const ReferralScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Referral Program',
    icon: Icons.group_outlined,
    subtitle: 'Refer friends and earn rewards for every successful signup.',
  );
}

class HelpCenterScreen extends StatelessWidget {
  const HelpCenterScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Help Center',
    icon: Icons.help_outline_rounded,
    subtitle: 'Browse FAQs, guides, and troubleshooting tips.',
  );
}

class SupportTicketsScreen extends StatelessWidget {
  const SupportTicketsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Support Tickets',
    icon: Icons.support_agent_outlined,
    subtitle: 'Create and track your support requests with our team.',
  );
}

class NotifSettingsScreen extends StatelessWidget {
  const NotifSettingsScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Notification Settings',
    icon: Icons.notifications_outlined,
    subtitle: 'Control what notifications you receive and how.',
  );
}

class PrivacyScreen extends StatelessWidget {
  const PrivacyScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Privacy & Security',
    icon: Icons.lock_outline_rounded,
    subtitle: 'Manage your privacy settings, data, and account security.',
  );
}

class TrackServiceScreen extends StatelessWidget {
  const TrackServiceScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Track Service',
    icon: Icons.location_on_outlined,
    subtitle: 'Real-time tracking of your booked provider is coming soon.',
  );
}

class RecurringServicesScreen extends StatelessWidget {
  const RecurringServicesScreen({super.key});
  @override
  Widget build(BuildContext context) => const _StubScreen(
    title: 'Recurring Services',
    icon: Icons.repeat_rounded,
    subtitle: 'Set up automatic recurring bookings for your regular services.',
  );
}
