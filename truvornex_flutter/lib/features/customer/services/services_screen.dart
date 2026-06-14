import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_category_card.dart';
import '../../shared/widgets/tx_provider_card.dart';

class ServicesScreen extends ConsumerWidget {
  const ServicesScreen({super.key});

  static const _categories = [
    (Icons.cleaning_services_outlined, 'Cleaning',      'cleaning'),
    (Icons.plumbing_outlined,          'Plumbing',       'plumbing'),
    (Icons.bolt_rounded,               'Electrical',     'electrical'),
    (Icons.local_shipping_outlined,    'Moving',         'moving'),
    (Icons.face_retouching_natural,    'Beauty',         'beauty'),
    (Icons.restaurant_outlined,        'Personal Chef',  'chef'),
    (Icons.fitness_center_outlined,    'Fitness',        'fitness'),
    (Icons.school_outlined,            'Tutoring',       'tutoring'),
    (Icons.pets_outlined,              'Pet Care',       'pet-care'),
    (Icons.camera_alt_outlined,        'Photography',    'photography'),
    (Icons.computer_outlined,          'Tech Support',   'tech'),
    (Icons.yard_outlined,              'Gardening',      'gardening'),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark    = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? AppColors.darkPrimary : AppColors.lightPrimary;
    final muted     = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          const Icon(Icons.explore_outlined, size: 18),
          const SizedBox(width: 8),
          Text('Explore Services',
            style: AppTypography.h3.copyWith(color: textColor)),
        ]),
        actions: [
          TxIconButton(
            icon: Icons.tune_rounded,
            onTap: () {},
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.all(AppSpacing.base),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                childAspectRatio: 1,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, i) => TxCategoryCard(
                  label: _categories[i].$2,
                  icon: _categories[i].$1,
                  onTap: () => context.pushNamed(
                    RouteNames.categoryProviders,
                    pathParameters: {'slug': _categories[i].$3},
                  ),
                ),
                childCount: _categories.length,
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.base, AppSpacing.sm, AppSpacing.base, AppSpacing.sm),
              child: Text('Top Providers',
                style: AppTypography.h3.copyWith(color: textColor)),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, i) => Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppSpacing.base, vertical: 5),
                child: TxProviderCard(
                  name: 'Provider ${i + 1}',
                  category: _categories[i % _categories.length].$2,
                  rating: 4.5 + (i % 3) * 0.1,
                  reviewCount: 120 + i * 17,
                  isVerified: i % 2 == 0,
                  distance: '${(i + 1) * 0.3 + 0.5} km',
                  priceFrom: (15 + i * 5).toDouble(),
                  heroTag: 'provider_$i',
                  onTap: () => context.pushNamed(
                    RouteNames.providerDetail,
                    pathParameters: {'providerId': 'p$i'},
                  ),
                ),
              ),
              childCount: 10,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: AppSpacing.xl2)),
        ],
      ),
    );
  }
}
