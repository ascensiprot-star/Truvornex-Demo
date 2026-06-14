import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';
import '../../shared/widgets/tx_button.dart';
import '../../shared/widgets/tx_input.dart';

class BookServiceScreen extends StatefulWidget {
  const BookServiceScreen({
    super.key,
    required this.providerId,
    required this.serviceId,
  });
  final String providerId;
  final String serviceId;

  @override
  State<BookServiceScreen> createState() => _BookServiceScreenState();
}

class _BookServiceScreenState extends State<BookServiceScreen> {
  DateTime? _selectedDate;
  String? _selectedTime;
  int _step = 0;
  bool _loading = false;

  static const _timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  ];

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;

    return Scaffold(
      backgroundColor: isDark ? AppColors.darkBg : AppColors.lightBg,
      appBar: TxAppBar(
        title: 'Book Service',
        actions: [
          Container(
            margin: const EdgeInsets.only(right: AppSpacing.base),
            child: Row(children: List.generate(3, (i) => Container(
              width: 24, height: 3, margin: const EdgeInsets.only(left: 3),
              decoration: BoxDecoration(
                color: i <= _step
                    ? (isDark ? AppColors.darkPrimary : AppColors.lightPrimary)
                    : (isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow),
                borderRadius: BorderRadius.circular(2),
              ),
            ))),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.base),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Step indicator text
            Text(
              _step == 0 ? 'Select Date & Time'
                : _step == 1 ? 'Service Details'
                : 'Confirm Booking',
              style: AppTypography.h2.copyWith(color: text),
            ).animate(key: ValueKey(_step)).fadeIn(duration: 300.ms),
            const SizedBox(height: 4),
            Text(
              'Step ${_step + 1} of 3',
              style: AppTypography.caption.copyWith(color: muted),
            ),
            const SizedBox(height: AppSpacing.xl),

            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _step == 0
                    ? _buildDateTimeStep(isDark, text, muted, surface, border)
                    : _step == 1
                        ? _buildDetailsStep(isDark, text, muted)
                        : _buildConfirmStep(isDark, text, muted, surface, border),
              ),
            ),

            const SizedBox(height: AppSpacing.base),

            TxButton(
              label: _step < 2 ? 'Continue' : 'Confirm Booking',
              onTap: _step < 2
                  ? () => setState(() => _step++)
                  : _confirmBooking,
              isLoading: _loading,
              icon: _step < 2 ? Icons.arrow_forward_rounded : Icons.check_rounded,
              iconTrailing: true,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDateTimeStep(
      bool isDark, Color text, Color muted, Color surface, Color border) {
    final now = DateTime.now();
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Date', style: AppTypography.label.copyWith(color: muted)),
          const SizedBox(height: AppSpacing.sm),

          CalendarDatePicker(
            initialDate: _selectedDate ?? now,
            firstDate: now,
            lastDate: now.add(const Duration(days: 90)),
            onDateChanged: (d) => setState(() => _selectedDate = d),
          ),

          const SizedBox(height: AppSpacing.base),
          Text('Time Slot', style: AppTypography.label.copyWith(color: muted)),
          const SizedBox(height: AppSpacing.sm),

          Wrap(
            spacing: 8, runSpacing: 8,
            children: _timeSlots.map((t) {
              final selected = _selectedTime == t;
              return GestureDetector(
                onTap: () => setState(() => _selectedTime = t),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 150),
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.md, vertical: 10),
                  decoration: BoxDecoration(
                    color: selected
                        ? (isDark ? AppColors.darkPrimary : AppColors.lightPrimary)
                        : surface,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                    border: Border.all(
                      color: selected
                          ? Colors.transparent
                          : border,
                    ),
                  ),
                  child: Text(t,
                    style: AppTypography.bodySm.copyWith(
                      color: selected
                          ? (isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary)
                          : text,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    )),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailsStep(bool isDark, Color text, Color muted) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TxInput(
            label: 'Service Address',
            hint: '123 Main St, Karachi',
            keyboardType: TextInputType.streetAddress,
            prefixIcon: const Icon(Icons.location_on_outlined, size: 18),
          ),
          const SizedBox(height: AppSpacing.base),
          TxInput(
            label: 'Additional Notes',
            hint: 'Describe the problem or any special instructions…',
            maxLines: 4,
          ),
          const SizedBox(height: AppSpacing.base),
          TxInput(
            label: 'Phone Number',
            hint: '+92 300 0000000',
            keyboardType: TextInputType.phone,
            prefixIcon: const Icon(Icons.phone_outlined, size: 18),
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmStep(
      bool isDark, Color text, Color muted, Color surface, Color border) {
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(AppSpacing.base),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              border: Border.all(color: border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Booking Summary',
                  style: AppTypography.h3.copyWith(color: text)),
                const SizedBox(height: AppSpacing.base),
                _confirmRow('Service', 'Pipe Repair & Replacement', text, muted),
                _confirmRow('Provider', 'Ahmed K.', text, muted),
                _confirmRow('Date',
                  _selectedDate != null
                      ? '${_selectedDate!.day}/${_selectedDate!.month}/${_selectedDate!.year}'
                      : '—',
                  text, muted),
                _confirmRow('Time', _selectedTime ?? '—', text, muted),
                _confirmRow('Address', '123 Main St, Karachi', text, muted),
                const Divider(height: 24),
                Row(children: [
                  Text('Total Estimate',
                    style: AppTypography.bodySm.copyWith(
                      color: text, fontWeight: FontWeight.w600)),
                  const Spacer(),
                  Text('\$45/hr',
                    style: AppTypography.h3.copyWith(color: text)),
                ]),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _confirmRow(String label, String value, Color text, Color muted) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(children: [
        Text(label,
          style: AppTypography.caption.copyWith(color: muted)),
        const Spacer(),
        Text(value,
          style: AppTypography.caption.copyWith(
            color: text, fontWeight: FontWeight.w500)),
      ]),
    );
  }

  Future<void> _confirmBooking() async {
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 1200));
    if (mounted) {
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Booking confirmed! ✓')),
      );
      context.pop();
    }
  }
}
