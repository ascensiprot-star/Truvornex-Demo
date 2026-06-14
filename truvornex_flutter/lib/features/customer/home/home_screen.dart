import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_category_card.dart';
import '../../shared/widgets/tx_stat_card.dart';
import '../../shared/widgets/tx_badge.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  static const _categories = [
    (Icons.cleaning_services_outlined, 'Cleaning',     null),
    (Icons.plumbing_outlined,          'Plumbing',     null),
    (Icons.bolt_rounded,               'Electrical',   null),
    (Icons.local_shipping_outlined,    'Moving',       null),
    (Icons.face_retouching_natural,    'Beauty',       null),
    (Icons.restaurant_outlined,        'Personal Chef',null),
    (Icons.fitness_center_outlined,    'Fitness',      null),
    (Icons.school_outlined,            'Tutoring',     null),
    (Icons.pets_outlined,              'Pet Care',     null),
    (Icons.camera_alt_outlined,        'Photography',  null),
    (Icons.computer_outlined,          'Tech Support', null),
    (Icons.yard_outlined,              'Gardening',    null),
  ];

  static const _stats = [
    ('2,400+', 'Verified Providers'),
    ('98%',    'Satisfaction Rate'),
    ('15K+',   'Jobs Completed'),
    ('4.9★',   'Avg Rating'),
  ];

  static const _quickFilters = [
    'Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness',
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor   = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final mutedColor  = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final subtleColor = isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle;
    final surfHigh    = isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      body: RefreshIndicator(
        color: textColor,
        backgroundColor: isDark ? AppColors.darkSurface : AppColors.lightSurface,
        onRefresh: () async => await Future.delayed(const Duration(milliseconds: 800)),
        child: CustomScrollView(
          slivers: [
            // ── App Bar ──────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppSpacing.base, AppSpacing.base, AppSpacing.base, 0),
                child: Row(children: [
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text('Good morning 👋',
                      style: AppTypography.caption.copyWith(color: mutedColor)),
                    const SizedBox(height: 2),
                    Text('Find a service',
                      style: AppTypography.h2.copyWith(color: textColor)),
                  ]),
                  const Spacer(),
                  TxIconButton(
                    icon: Icons.notifications_outlined,
                    onTap: () => context.pushNamed(RouteNames.notifications),
                  ),
                ]).animate().fadeIn(duration: 400.ms),
              ),
            ),

            // ── Hero ──────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.base),
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF0F0F18), Color(0xFF1A1030)],
                    ),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
                    border: Border.all(color: AppColors.darkBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.md, vertical: AppSpacing.xs),
                        decoration: BoxDecoration(
                          color: const Color(0x267C6FCD),
                          borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                          border: Border.all(color: const Color(0x4D7C6FCD)),
                        ),
                        child: Row(mainAxisSize: MainAxisSize.min, children: [
                          const Icon(Icons.auto_awesome_rounded,
                            size: 12, color: Color(0xFF7C6FCD)),
                          const SizedBox(width: 5),
                          Text('AI-powered neighborhood services',
                            style: AppTypography.labelSm.copyWith(
                              color: const Color(0xFF7C6FCD))),
                        ]),
                      ),
                      const SizedBox(height: 16),
                      Text('Every service,\nat your fingertips.',
                        style: AppTypography.display.copyWith(
                          color: Colors.white, fontSize: 26)),
                      const SizedBox(height: 8),
                      Text('Connect with trusted, verified providers\nin your neighborhood — instantly.',
                        style: AppTypography.body.copyWith(color: Colors.white54)),
                      const SizedBox(height: 20),

                      // Search bar
                      GestureDetector(
                        onTap: () => _showSearch(context),
                        child: Container(
                          height: 48,
                          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.07),
                            borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                            border: Border.all(color: Colors.white.withOpacity(0.1)),
                          ),
                          child: Row(children: [
                            const Icon(Icons.search_rounded, size: 18, color: Colors.white38),
                            const SizedBox(width: 10),
                            Expanded(child: Text('Search cleaning, plumbing, chef…',
                              style: AppTypography.body.copyWith(color: Colors.white30))),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text('⌘K',
                                style: AppTypography.monoSm.copyWith(color: Colors.white24)),
                            ),
                          ]),
                        ),
                      ),

                      const SizedBox(height: 14),

                      // Quick filter chips
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: _quickFilters.map((f) => Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: GestureDetector(
                              onTap: () {
                                HapticFeedback.lightImpact();
                                context.goNamed(RouteNames.services,
                                  queryParameters: {'q': f});
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: AppSpacing.md, vertical: 6),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.07),
                                  borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                                ),
                                child: Text(f,
                                  style: AppTypography.caption.copyWith(color: Colors.white70)),
                              ),
                            ),
                          )).toList(),
                        ),
                      ),
                    ],
                  ),
                ).animate().fadeIn(duration: 500.ms, delay: 100.ms)
                 .slideY(begin: 0.05, end: 0, duration: 500.ms, curve: Curves.easeOut),
              ),
            ),

            // ── Stats ──────────────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                child: Row(
                  children: _stats.asMap().entries.map((e) => Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(
                        right: e.key < _stats.length - 1 ? 8 : 0),
                      child: TxCard(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.sm, vertical: AppSpacing.md),
                        child: Column(children: [
                          Text(e.value.$1,
                            style: AppTypography.h3.copyWith(
                              color: textColor, letterSpacing: -0.3)),
                          const SizedBox(height: 3),
                          Text(e.value.$2,
                            textAlign: TextAlign.center,
                            style: AppTypography.labelSm.copyWith(
                              color: subtleColor, fontSize: 9)),
                        ]),
                      ),
                    ),
                  )).toList(),
                ).animate(delay: 300.ms).fadeIn(duration: 400.ms),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

            // ── Browse by Category ────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                child: Row(children: [
                  Text('Browse by Category',
                    style: AppTypography.h3.copyWith(color: textColor)),
                  const Spacer(),
                  GestureDetector(
                    onTap: () => context.goNamed(RouteNames.services),
                    child: Text('See all',
                      style: AppTypography.caption.copyWith(color: mutedColor)),
                  ),
                ]),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.md)),

            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 10,
                  crossAxisSpacing: 10,
                  childAspectRatio: 1,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, i) {
                    final cat = _categories[i];
                    return TxCategoryCard(
                      label: cat.$2,
                      icon: cat.$1,
                      onTap: () => context.goNamed(
                        RouteNames.categoryProviders,
                        pathParameters: {'slug': cat.$2.toLowerCase()},
                      ),
                    );
                  },
                  childCount: _categories.length,
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

            // ── Events Near You ────────────────────────────────────────
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                    child: Row(children: [
                      Text('Events Near You',
                        style: AppTypography.h3.copyWith(color: textColor)),
                      const Spacer(),
                      GestureDetector(
                        onTap: () => context.goNamed(RouteNames.events),
                        child: Text('Browse all',
                          style: AppTypography.caption.copyWith(color: mutedColor)),
                      ),
                    ]),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  SizedBox(
                    height: 160,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                      separatorBuilder: (_, __) => const SizedBox(width: 10),
                      itemCount: 5,
                      itemBuilder: (context, i) => _buildEventCard(context, i, isDark),
                    ),
                  ),
                ],
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl)),

            // ── Neighborhood OS ────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.base),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      Text('Neighborhood OS',
                        style: AppTypography.h3.copyWith(color: textColor)),
                      const SizedBox(width: 8),
                      const TxBadge(label: 'NEW', variant: TxBadgeVariant.info),
                    ]),
                    const SizedBox(height: 12),
                    GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 10,
                      crossAxisSpacing: 10,
                      childAspectRatio: 2.2,
                      children: [
                        _buildNeighborhoodCard(context,
                          Icons.warning_amber_rounded,
                          'Emergency', 'Urgent services now',
                          RouteNames.emergency, const Color(0xFFEF4444)),
                        _buildNeighborhoodCard(context,
                          Icons.group_outlined,
                          'Group Buy', 'Save together',
                          RouteNames.groupBuy, const Color(0xFF10B981)),
                        _buildNeighborhoodCard(context,
                          Icons.swap_horiz_rounded,
                          'Skill Swap', 'Trade your skills',
                          RouteNames.skillSwap, const Color(0xFF7C6FCD)),
                        _buildNeighborhoodCard(context,
                          Icons.balance_rounded,
                          'Jury', 'Dispute resolution',
                          RouteNames.jury, const Color(0xFFF59E0B)),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl2)),
          ],
        ),
      ),
    );
  }

  Widget _buildEventCard(BuildContext context, int i, bool isDark) {
    final events = [
      ('Neighborhood Block Party', 'Free',  'Riverside Park'),
      ('Home Renovation Workshop',  '\$15', 'Community Hall'),
      ('Summer Food & Craft Market', '\$5', 'Main Square'),
      ('Yoga in the Park',          'Free', 'City Garden'),
      ('Tech Skills Bootcamp',      '\$25', 'Innovation Hub'),
    ];
    final e = events[i % events.length];
    final isFree = e.$2 == 'Free';

    return GestureDetector(
      onTap: () => context.pushNamed(RouteNames.events),
      child: Container(
        width: 200,
        decoration: BoxDecoration(
          color: isDark ? AppColors.darkSurface : AppColors.lightSurface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          border: Border.all(
            color: isDark ? AppColors.darkBorder : AppColors.lightBorder),
        ),
        padding: const EdgeInsets.all(AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                  borderRadius: BorderRadius.circular(10),
                ),
                alignment: Alignment.center,
                child: Icon(Icons.event_outlined, size: 18,
                  color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isFree
                      ? AppColors.darkSuccess.withOpacity(0.15)
                      : AppColors.darkInfo.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                ),
                child: Text(e.$2,
                  style: AppTypography.labelSm.copyWith(
                    color: isFree ? AppColors.darkSuccess : AppColors.darkInfo)),
              ),
            ]),
            const Spacer(),
            Text(e.$1,
              style: AppTypography.bodySm.copyWith(
                color: isDark ? AppColors.darkText : AppColors.lightText,
                fontWeight: FontWeight.w600),
              maxLines: 2,
              overflow: TextOverflow.ellipsis),
            const SizedBox(height: 4),
            Text(e.$3,
              style: AppTypography.caption.copyWith(
                color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle)),
          ],
        ),
      ),
    );
  }

  Widget _buildNeighborhoodCard(
    BuildContext context,
    IconData icon,
    String title,
    String subtitle,
    String routeName,
    Color accent,
  ) {
    return GestureDetector(
      onTap: () {
        HapticFeedback.lightImpact();
        context.pushNamed(routeName);
      },
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: accent.withOpacity(0.08),
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          border: Border.all(color: accent.withOpacity(0.2)),
        ),
        child: Row(children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: accent.withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: Icon(icon, size: 16, color: accent),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(title,
                  style: AppTypography.bodySm.copyWith(
                    color: AppColors.darkText, fontWeight: FontWeight.w600)),
                Text(subtitle,
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.darkTextSubtle, fontSize: 10)),
              ],
            ),
          ),
        ]),
      ),
    );
  }

  void _showSearch(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SearchSheet(isDark: isDark),
    );
  }
}

class _SearchSheet extends StatefulWidget {
  const _SearchSheet({required this.isDark});
  final bool isDark;

  @override
  State<_SearchSheet> createState() => _SearchSheetState();
}

class _SearchSheetState extends State<_SearchSheet> {
  final _ctrl = TextEditingController();

  static const _trending = [
    'Cleaning', 'Plumbing', 'Chef', 'Moving', 'Fitness', 'Tutoring',
  ];

  @override
  Widget build(BuildContext context) {
    final bg     = widget.isDark ? AppColors.darkSurface : AppColors.lightBg;
    final border = widget.isDark ? AppColors.darkBorder : AppColors.lightBorder;
    final text   = widget.isDark ? AppColors.darkText : AppColors.lightText;

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
        border: Border(top: BorderSide(color: border)),
      ),
      padding: EdgeInsets.only(
        top: AppSpacing.sm,
        left: AppSpacing.base,
        right: AppSpacing.base,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.xl,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36, height: 4,
              decoration: BoxDecoration(
                color: widget.isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.base),

          TextField(
            controller: _ctrl,
            autofocus: true,
            style: AppTypography.body.copyWith(color: text),
            decoration: InputDecoration(
              hintText: 'Search services, providers…',
              hintStyle: AppTypography.body.copyWith(
                color: widget.isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle),
              prefixIcon: const Icon(Icons.search_rounded, size: 18),
              filled: true,
              fillColor: widget.isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                borderSide: BorderSide.none,
              ),
            ),
            onSubmitted: (v) {
              Navigator.pop(context);
              context.goNamed(RouteNames.services, queryParameters: {'q': v});
            },
          ),

          const SizedBox(height: AppSpacing.xl),

          Text('TRENDING',
            style: AppTypography.labelSm.copyWith(
              color: widget.isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle)),
          const SizedBox(height: AppSpacing.sm),

          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _trending.map((t) => GestureDetector(
              onTap: () {
                Navigator.pop(context);
                context.goNamed(RouteNames.services, queryParameters: {'q': t});
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 7),
                decoration: BoxDecoration(
                  color: widget.isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                  border: Border.all(
                    color: widget.isDark ? AppColors.darkBorder : AppColors.lightBorder),
                ),
                child: Text(t,
                  style: AppTypography.caption.copyWith(color: text)),
              ),
            )).toList(),
          ),
        ],
      ),
    );
  }
}
