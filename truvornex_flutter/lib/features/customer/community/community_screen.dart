import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_card.dart';
import '../../shared/widgets/tx_avatar.dart';
import '../../shared/widgets/tx_badge.dart';
import '../../shared/widgets/tx_button.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        title: 'Community',
        actions: [
          TxIconButton(icon: Icons.add_rounded, onTap: () {}),
        ],
      ),
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
                Tab(text: 'Feed'),
                Tab(text: 'Jobs'),
                Tab(text: 'Events'),
                Tab(text: 'Polls'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabs,
              children: [
                _buildFeed(isDark, text),
                _buildJobs(isDark, text),
                _buildEvents(isDark, text),
                _buildPolls(isDark, text),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeed(bool isDark, Color text) {
    final posts = [
      _Post('Zara A.',  'Looking for a reliable plumber — anyone have recommendations? The ones I\'ve tried keep cancelling.', 12, 3, 'question'),
      _Post('Omar K.',  'Just had an amazing experience with Ahmed from Truvornex. Fixed my AC in under an hour! ⭐⭐⭐⭐⭐', 34, 7, 'review'),
      _Post('Nadia S.', 'Community garden cleanup this Saturday at 9am. All welcome! Bringing refreshments 🌱', 28, 5, 'event'),
    ];
    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.base),
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemCount: posts.length,
      itemBuilder: (_, i) {
        final p = posts[i];
        return TxCard(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(children: [
                TxAvatar(name: p.author, size: 34),
                const SizedBox(width: 10),
                Expanded(child: Text(p.author,
                  style: AppTypography.bodySm.copyWith(
                    color: text, fontWeight: FontWeight.w600))),
                TxBadge(
                  label: p.type,
                  variant: p.type == 'review' ? TxBadgeVariant.success
                    : p.type == 'event' ? TxBadgeVariant.info
                    : TxBadgeVariant.neutral),
              ]),
              const SizedBox(height: 10),
              Text(p.body,
                style: AppTypography.body.copyWith(
                  color: isDark ? AppColors.darkText : AppColors.lightText,
                  height: 1.5)),
              const SizedBox(height: 12),
              Row(children: [
                GestureDetector(
                  onTap: () => HapticFeedback.lightImpact(),
                  child: Row(children: [
                    Icon(Icons.favorite_border_rounded, size: 16,
                      color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle),
                    const SizedBox(width: 4),
                    Text('${p.likes}',
                      style: AppTypography.caption.copyWith(
                        color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted)),
                  ]),
                ),
                const SizedBox(width: 16),
                Row(children: [
                  Icon(Icons.chat_bubble_outline_rounded, size: 16,
                    color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle),
                  const SizedBox(width: 4),
                  Text('${p.comments}',
                    style: AppTypography.caption.copyWith(
                      color: isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted)),
                ]),
              ]),
            ],
          ),
        );
      },
    );
  }

  Widget _buildJobs(bool isDark, Color text) {
    return Center(
      child: Text('Jobs Board — Coming soon',
        style: AppTypography.body.copyWith(
          color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle)),
    );
  }

  Widget _buildEvents(bool isDark, Color text) {
    return Center(
      child: Text('Community Events — see Events tab',
        style: AppTypography.body.copyWith(
          color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle)),
    );
  }

  Widget _buildPolls(bool isDark, Color text) {
    final muted  = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final polls  = [
      _Poll('What service should we bulk-buy this month?', ['Cleaning', 'Pest Control', 'AC Service'], [45, 30, 25]),
      _Poll('Best day for the community garden cleanup?', ['Saturday', 'Sunday'], [62, 38]),
    ];

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.base),
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemCount: polls.length,
      itemBuilder: (_, i) {
        final p = polls[i];
        return TxCard(
          padding: const EdgeInsets.all(AppSpacing.base),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(p.question,
                style: AppTypography.h3.copyWith(color: text, fontSize: 14)),
              const SizedBox(height: AppSpacing.md),
              ...p.options.asMap().entries.map((e) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Column(children: [
                  Row(children: [
                    Text(e.value, style: AppTypography.caption.copyWith(color: muted)),
                    const Spacer(),
                    Text('${p.votes[e.key]}%',
                      style: AppTypography.caption.copyWith(color: text, fontWeight: FontWeight.w600)),
                  ]),
                  const SizedBox(height: 4),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(2),
                    child: LinearProgressIndicator(
                      value: p.votes[e.key] / 100,
                      minHeight: 6,
                      backgroundColor: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                      valueColor: AlwaysStoppedAnimation(
                        isDark ? AppColors.darkPrimary : AppColors.lightPrimary),
                    ),
                  ),
                ]),
              )),
            ],
          ),
        );
      },
    );
  }
}

class _Post {
  const _Post(this.author, this.body, this.likes, this.comments, this.type);
  final String author, body, type;
  final int likes, comments;
}

class _Poll {
  const _Poll(this.question, this.options, this.votes);
  final String question;
  final List<String> options;
  final List<int> votes;
}
