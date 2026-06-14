import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../shared/widgets/tx_app_bar.dart';
import '../shared/widgets/tx_badge.dart';
import '../shared/widgets/tx_avatar.dart';

class AdminUsersScreen extends StatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  State<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends State<AdminUsersScreen> {
  final _searchCtrl = TextEditingController();
  String _filter = 'all';
  static const _filters = ['all', 'active', 'suspended', 'new'];

  static const _users = [
    _User('Fatima Rashid', 'fatima@example.com', 'customer', 'active', '14 bookings'),
    _User('Hassan Mohammed', 'hassan@example.com', 'customer', 'active', '7 bookings'),
    _User('Sara Khan', 'sara@example.com', 'provider', 'active', '234 jobs'),
    _User('Omar Farooq', 'omar@example.com', 'customer', 'suspended', '0 bookings'),
    _User('Nadia Salem', 'nadia@example.com', 'provider', 'active', '89 jobs'),
    _User('Riya Singh', 'riya@example.com', 'customer', 'new', '1 booking'),
    _User('Ahmed Karimi', 'ahmed@example.com', 'provider', 'active', '1,423 jobs'),
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _users.where((u) =>
      _filter == 'all' || u.status == _filter).toList();

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
          Text('Users (${_users.length})',
            style: AppTypography.h3.copyWith(color: AppColors.darkPrimary)),
        ]),
        actions: [
          TxIconButton(icon: Icons.filter_list_rounded, onTap: () {}),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(AppSpacing.base),
            child: TextField(
              controller: _searchCtrl,
              style: AppTypography.body.copyWith(color: AppColors.darkPrimary),
              decoration: InputDecoration(
                hintText: 'Search users…',
                hintStyle: AppTypography.body.copyWith(color: AppColors.darkTextSubtle),
                prefixIcon: const Icon(Icons.search_rounded, size: 18,
                  color: AppColors.darkTextSubtle),
                filled: true,
                fillColor: AppColors.darkSurfaceHigh,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                  borderSide: BorderSide.none),
              ),
            ),
          ),

          // Filter chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
            child: Row(
              children: _filters.map((f) {
                final active = _filter == f;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _filter = f),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 150),
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                      decoration: BoxDecoration(
                        color: active ? AppColors.darkPrimary : AppColors.darkSurfaceHigh,
                        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                      ),
                      child: Text(f.toUpperCase(),
                        style: AppTypography.labelSm.copyWith(
                          color: active ? AppColors.darkOnPrimary : AppColors.darkTextSubtle)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: AppSpacing.sm),

          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(AppSpacing.base),
              separatorBuilder: (_, __) => const Divider(
                height: 1, color: AppColors.darkBorder),
              itemCount: filtered.length,
              itemBuilder: (_, i) {
                final u = filtered[i];
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
                  child: Row(children: [
                    TxAvatar(name: u.name, size: 38),
                    const SizedBox(width: AppSpacing.md),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(u.name,
                            style: AppTypography.bodySm.copyWith(
                              color: AppColors.darkPrimary, fontWeight: FontWeight.w500)),
                          Text(u.email,
                            style: AppTypography.caption.copyWith(
                              color: AppColors.darkTextSubtle)),
                        ],
                      ),
                    ),
                    Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                      TxBadge(
                        label: u.role.toUpperCase(),
                        variant: u.role == 'provider'
                            ? TxBadgeVariant.info
                            : TxBadgeVariant.neutral),
                      const SizedBox(height: 4),
                      TxBadge(
                        label: u.status,
                        variant: u.status == 'active'   ? TxBadgeVariant.success
                            : u.status == 'suspended' ? TxBadgeVariant.error
                            : TxBadgeVariant.warning,
                        dot: true),
                    ]),
                  ]),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _User {
  const _User(this.name, this.email, this.role, this.status, this.activity);
  final String name, email, role, status, activity;
}
