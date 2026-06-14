import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/routing/route_names.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_provider_card.dart';
import '../../shared/widgets/tx_loading.dart';

class NearbyProvidersScreen extends ConsumerWidget {
  const NearbyProvidersScreen({super.key, this.categorySlug});
  final String? categorySlug;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final title  = categorySlug != null
        ? categorySlug!.replaceAll('-', ' ').toUpperCase()
        : 'Nearby Providers';

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(title: title),
      body: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.base),
        separatorBuilder: (_, __) => const SizedBox(height: 10),
        itemCount: 12,
        itemBuilder: (context, i) => TxProviderCard(
          name: 'Provider ${i + 1}',
          category: categorySlug ?? 'Services',
          rating: 4.0 + (i % 5) * 0.2,
          reviewCount: 40 + i * 11,
          isVerified: i % 3 != 0,
          distance: '${(0.3 + i * 0.4).toStringAsFixed(1)} km',
          priceFrom: (12 + i * 5).toDouble(),
          heroTag: 'nearby_$i',
          onTap: () => context.pushNamed(
            RouteNames.providerDetail,
            pathParameters: {'providerId': 'pn$i'},
          ),
          onBook: () => context.pushNamed(
            RouteNames.bookService,
            pathParameters: {'providerId': 'pn$i', 'serviceId': 's0'},
          ),
        ),
      ),
    );
  }
}
