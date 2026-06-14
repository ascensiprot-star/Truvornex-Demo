import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_button.dart';
import '../../shared/widgets/tx_input.dart';
import '../../shared/widgets/tx_card.dart';

class EmergencyRequestScreen extends StatefulWidget {
  const EmergencyRequestScreen({super.key});

  @override
  State<EmergencyRequestScreen> createState() => _EmergencyRequestScreenState();
}

class _EmergencyRequestScreenState extends State<EmergencyRequestScreen>
    with TickerProviderStateMixin {
  String? _category;
  String _urgency = 'immediate';
  final _descCtrl = TextEditingController();
  bool _submitted = false;
  bool _loading   = false;

  late final AnimationController _pulseCtrl;

  static const _categories = [
    (Icons.plumbing_outlined,  'Plumbing',    'plumbing'),
    (Icons.bolt_rounded,       'Electrical',  'electrical'),
    (Icons.thermostat_rounded, 'HVAC',        'hvac'),
    (Icons.lock_outline,       'Locksmith',   'locksmith'),
    (Icons.home_outlined,      'Structural',  'structural'),
    (Icons.kitchen_rounded,    'Appliance',   'appliance'),
  ];

  static const _urgencyLevels = [
    ('immediate', 'Right Now',      'Within 1 hour'),
    ('urgent',    'Within 4 Hours', 'Same day'),
    ('today',     'Today',          'Within 8 hours'),
  ];

  @override
  void initState() {
    super.initState();
    _pulseCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    const red    = Color(0xFFEF4444);

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          AnimatedBuilder(
            animation: _pulseCtrl,
            builder: (_, __) => Container(
              width: 8, height: 8,
              decoration: BoxDecoration(
                color: red.withOpacity(0.5 + _pulseCtrl.value * 0.5),
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: red.withOpacity(0.4 * _pulseCtrl.value),
                    blurRadius: 8, spreadRadius: 2),
                ],
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text('Emergency Request',
            style: AppTypography.h3.copyWith(color: red)),
        ]),
      ),
      body: _submitted ? _buildSuccess() : _buildForm(isDark, red),
    );
  }

  Widget _buildForm(bool isDark, Color red) {
    final text  = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppSpacing.base),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Urgent banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.md),
            decoration: BoxDecoration(
              color: red.withOpacity(0.08),
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
              border: Border.all(color: red.withOpacity(0.2)),
            ),
            child: Row(children: [
              Icon(Icons.warning_amber_rounded, size: 18, color: red),
              const SizedBox(width: 10),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Emergency Services',
                    style: AppTypography.bodySm.copyWith(
                      color: red, fontWeight: FontWeight.w600)),
                  Text('Providers will be notified immediately',
                    style: AppTypography.caption.copyWith(color: red.withOpacity(0.7))),
                ]),
              ),
            ]),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          Text('What type of emergency?',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.md),

          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 3,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 1.1,
            children: _categories.map((cat) {
              final isSelected = _category == cat.$3;
              return GestureDetector(
                onTap: () {
                  HapticFeedback.lightImpact();
                  setState(() => _category = cat.$3);
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  decoration: BoxDecoration(
                    color: isSelected ? red.withOpacity(0.12) : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
                    borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                    border: Border.all(
                      color: isSelected ? red.withOpacity(0.4) : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                      width: isSelected ? 1.5 : 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(cat.$1, size: 22,
                        color: isSelected ? red : muted),
                      const SizedBox(height: 6),
                      Text(cat.$2,
                        style: AppTypography.caption.copyWith(
                          color: isSelected ? red : text,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400),
                        textAlign: TextAlign.center),
                    ],
                  ),
                ),
              );
            }).toList(),
          ).animate(delay: 100.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          Text('How urgent?',
            style: AppTypography.h3.copyWith(color: text)),
          const SizedBox(height: AppSpacing.md),

          Column(
            children: _urgencyLevels.map((u) {
              final isSelected = _urgency == u.$1;
              return Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GestureDetector(
                  onTap: () => setState(() => _urgency = u.$1),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppSpacing.md),
                    decoration: BoxDecoration(
                      color: isSelected ? red.withOpacity(0.08) : (isDark ? AppColors.darkSurface : AppColors.lightSurface),
                      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                      border: Border.all(
                        color: isSelected ? red.withOpacity(0.35) : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                        width: isSelected ? 1.5 : 1,
                      ),
                    ),
                    child: Row(children: [
                      Radio<String>(
                        value: u.$1,
                        groupValue: _urgency,
                        onChanged: (v) => setState(() => _urgency = v!),
                        activeColor: red,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      const SizedBox(width: 8),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(u.$2,
                          style: AppTypography.bodySm.copyWith(
                            color: text, fontWeight: FontWeight.w600)),
                        Text(u.$3,
                          style: AppTypography.caption.copyWith(color: muted)),
                      ]),
                    ]),
                  ),
                ),
              );
            }).toList(),
          ).animate(delay: 200.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          TxInput(
            label: 'Describe the problem',
            hint: 'e.g. Burst pipe in bathroom, water flooding floor…',
            controller: _descCtrl,
            maxLines: 3,
          ).animate(delay: 300.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          TxButton(
            label: 'Send Emergency Request',
            onTap: _category != null ? _submit : null,
            isLoading: _loading,
            icon: Icons.warning_amber_rounded,
            disabled: _category == null,
          ).animate(delay: 400.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl2),
        ],
      ),
    );
  }

  Widget _buildSuccess() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl2),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80, height: 80,
              decoration: const BoxDecoration(
                color: Color(0x1A6EE7B7), shape: BoxShape.circle),
              alignment: Alignment.center,
              child: const Icon(Icons.check_rounded, size: 40, color: AppColors.darkSuccess),
            ).animate().scale(
              begin: const Offset(0, 0), end: const Offset(1, 1),
              duration: 400.ms, curve: Curves.elasticOut),

            const SizedBox(height: 24),
            Text('Request Submitted!',
              style: AppTypography.h1.copyWith(color: AppColors.darkPrimary))
                .animate(delay: 200.ms).fadeIn(duration: 400.ms),
            const SizedBox(height: 8),
            Text('Providers near you are being notified. '
                'You\'ll receive a match within minutes.',
              textAlign: TextAlign.center,
              style: AppTypography.body.copyWith(color: AppColors.darkTextMuted))
                .animate(delay: 300.ms).fadeIn(duration: 400.ms),
          ],
        ),
      ),
    );
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    HapticFeedback.heavyImpact();
    await Future.delayed(const Duration(milliseconds: 1500));
    if (mounted) setState(() { _loading = false; _submitted = true; });
  }
}
