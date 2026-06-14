import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_typography.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/auth/auth_provider.dart';
import '../../core/routing/route_names.dart';
import '../../core/utils/validators.dart';
import '../shared/widgets/tx_button.dart';
import '../shared/widgets/tx_input.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _formKey     = GlobalKey<FormState>();
  final _emailCtrl   = TextEditingController();
  final _pwCtrl      = TextEditingController();
  final _nameCtrl    = TextEditingController();
  late final TabController _tabCtrl;

  bool _loading = false;
  String? _error;

  static const _features = [
    (Icons.bolt_rounded,     '2,400+ Verified Providers',  'Trusted professionals near you'),
    (Icons.shield_outlined,  'AI-Powered Matching',        'Simon finds the perfect provider'),
    (Icons.schedule_rounded, 'Book in 60 Seconds',         'Real-time availability'),
    (Icons.star_rounded,     '4.9★ Average Rating',        '98% satisfaction, 15K+ bookings'),
  ];

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 2, vsync: this);
    _tabCtrl.addListener(() => setState(() => _error = null));
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _emailCtrl.dispose();
    _pwCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });

    try {
      if (_tabCtrl.index == 0) {
        await AuthService.signIn(
          email: _emailCtrl.text.trim(),
          password: _pwCtrl.text,
        );
        if (mounted) context.goNamed(RouteNames.home);
      } else {
        await AuthService.signUp(
          email: _emailCtrl.text.trim(),
          password: _pwCtrl.text,
          fullName: _nameCtrl.text.trim().isEmpty ? null : _nameCtrl.text.trim(),
        );
        if (mounted) {
          _tabCtrl.animateTo(0);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Account created! Check your email to confirm, then sign in.'),
            ),
          );
        }
      }
    } catch (e) {
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isTablet = size.width > 600;

    return Scaffold(
      backgroundColor: AppColors.darkBg,
      body: SafeArea(
        child: isTablet
            ? Row(children: [
                Expanded(flex: 5, child: _buildBranding()),
                Expanded(flex: 4, child: _buildForm()),
              ])
            : SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(children: [
                    _buildMobileLogo(),
                    const SizedBox(height: AppSpacing.xl2),
                    _buildForm(compact: true),
                  ]),
                ),
              ),
      ),
    );
  }

  Widget _buildMobileLogo() {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: AppColors.darkSurface,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: AppColors.darkBorderStrong),
          ),
          alignment: Alignment.center,
          child: const Icon(Icons.bolt_rounded, size: 18, color: AppColors.darkPrimary),
        ),
        const SizedBox(width: 10),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('TRUVORNEX',
              style: AppTypography.h3.copyWith(color: AppColors.darkPrimary, letterSpacing: 1)),
            Text('Service Platform',
              style: AppTypography.labelSm.copyWith(color: AppColors.darkTextSubtle)),
          ],
        ),
      ],
    ).animate().fadeIn(duration: 400.ms);
  }

  Widget _buildBranding() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F0F18), Color(0xFF12131A), Color(0xFF1A1030)],
        ),
      ),
      padding: const EdgeInsets.all(AppSpacing.xl2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Spacer(),
          Row(children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: const Color(0x337C6FCD),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0x4D7C6FCD)),
              ),
              alignment: Alignment.center,
              child: const Icon(Icons.bolt_rounded, size: 22, color: Color(0xFF7C6FCD)),
            ),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('TRUVORNEX',
                style: AppTypography.h3.copyWith(color: Colors.white, letterSpacing: 1)),
              Text('Service Platform',
                style: AppTypography.labelSm.copyWith(color: Colors.white38)),
            ]),
          ])
              .animate().fadeIn(duration: 500.ms),

          const SizedBox(height: 48),

          Text(
            'Every service,\nat your fingertips.',
            style: AppTypography.display.copyWith(
              color: Colors.white,
              fontSize: 36,
              height: 1.1,
            ),
          )
              .animate(delay: 100.ms)
              .fadeIn(duration: 500.ms)
              .slideX(begin: -0.05, end: 0, duration: 500.ms, curve: Curves.easeOut),

          const SizedBox(height: 16),

          Text(
            'Connect with trusted, verified service providers\nin your neighborhood — powered by Simon AI.',
            style: AppTypography.bodyLg.copyWith(color: Colors.white54),
          )
              .animate(delay: 200.ms).fadeIn(duration: 500.ms),

          const SizedBox(height: 40),

          ...List.generate(_features.length, (i) {
            final f = _features[i];
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.07)),
                ),
                child: Row(children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: const Color(0x267C6FCD),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: const Color(0x337C6FCD)),
                    ),
                    alignment: Alignment.center,
                    child: Icon(f.$1, size: 18, color: const Color(0xFF7C6FCD)),
                  ),
                  const SizedBox(width: 14),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(f.$2,
                      style: AppTypography.bodySm.copyWith(
                        color: Colors.white, fontWeight: FontWeight.w600)),
                    Text(f.$3,
                      style: AppTypography.caption.copyWith(color: Colors.white38)),
                  ]),
                ]),
              ).animate(delay: Duration(milliseconds: 300 + i * 80))
                .fadeIn(duration: 400.ms)
                .slideX(begin: -0.05, end: 0, duration: 400.ms, curve: Curves.easeOut),
            );
          }),

          const Spacer(),

          Row(children: [
            Container(
              width: 7, height: 7,
              decoration: const BoxDecoration(
                color: Color(0xFF10B981), shape: BoxShape.circle),
            ),
            const SizedBox(width: 8),
            Text('Simon AI · Online',
              style: AppTypography.labelSm.copyWith(color: Colors.white24)),
          ]).animate(delay: 700.ms).fadeIn(duration: 500.ms),
        ],
      ),
    );
  }

  Widget _buildForm({bool compact = false}) {
    return Padding(
      padding: EdgeInsets.all(compact ? 0 : AppSpacing.xl2),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: compact ? MainAxisAlignment.start : MainAxisAlignment.center,
        children: [
          // Heading
          AnimatedBuilder(
            animation: _tabCtrl,
            builder: (_, __) => Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _tabCtrl.index == 0 ? 'Welcome back' : 'Create account',
                  style: AppTypography.h1.copyWith(color: AppColors.darkPrimary),
                ),
                const SizedBox(height: 6),
                Text(
                  _tabCtrl.index == 0
                      ? 'Sign in to access your services and Simon AI'
                      : 'Join 2,400+ users on Truvornex today',
                  style: AppTypography.body.copyWith(color: AppColors.darkTextMuted),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          // Tab toggle
          Container(
            height: 44,
            padding: const EdgeInsets.all(3),
            decoration: BoxDecoration(
              color: AppColors.darkSurfaceHigh,
              borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
            ),
            child: TabBar(
              controller: _tabCtrl,
              indicator: BoxDecoration(
                color: AppColors.darkSurface,
                borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              labelStyle: AppTypography.button.copyWith(fontSize: 13),
              unselectedLabelStyle: AppTypography.button.copyWith(fontSize: 13),
              labelColor: AppColors.darkPrimary,
              unselectedLabelColor: AppColors.darkTextSubtle,
              tabs: const [
                Tab(text: 'Sign In'),
                Tab(text: 'Sign Up'),
              ],
            ),
          ).animate(delay: 100.ms).fadeIn(duration: 400.ms),

          const SizedBox(height: AppSpacing.xl),

          // Error
          if (_error != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.md),
              margin: const EdgeInsets.only(bottom: AppSpacing.base),
              decoration: BoxDecoration(
                color: AppColors.darkError.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                border: Border.all(color: AppColors.darkError.withOpacity(0.25)),
              ),
              child: Text(
                _error!,
                style: AppTypography.bodySm.copyWith(color: AppColors.darkError),
              ),
            ).animate().fadeIn(duration: 250.ms).shakeX(),

          // Form
          Form(
            key: _formKey,
            child: Column(
              children: [
                // Full name (signup only)
                AnimatedBuilder(
                  animation: _tabCtrl,
                  builder: (_, __) => AnimatedSize(
                    duration: const Duration(milliseconds: 250),
                    curve: Curves.easeInOut,
                    child: _tabCtrl.index == 1
                        ? Padding(
                            padding: const EdgeInsets.only(bottom: AppSpacing.base),
                            child: TxInput(
                              label: 'Full Name',
                              hint: 'Alex Johnson',
                              controller: _nameCtrl,
                              keyboardType: TextInputType.name,
                              textInputAction: TextInputAction.next,
                            ),
                          )
                        : const SizedBox.shrink(),
                  ),
                ),

                TxInput(
                  label: 'Email',
                  hint: 'you@example.com',
                  controller: _emailCtrl,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  validator: AppValidators.email,
                  autofillHints: const [AutofillHints.email],
                ),
                const SizedBox(height: AppSpacing.base),

                TxInput(
                  label: 'Password',
                  hint: '••••••••',
                  controller: _pwCtrl,
                  obscureText: true,
                  textInputAction: TextInputAction.done,
                  validator: AppValidators.password,
                  autofillHints: const [AutofillHints.password],
                ),

                const SizedBox(height: AppSpacing.xl),

                TxButton(
                  label: _tabCtrl.index == 0 ? 'Sign In' : 'Create Account',
                  onTap: _submit,
                  isLoading: _loading,
                  icon: Icons.arrow_forward_rounded,
                  iconTrailing: true,
                ).animate(delay: 200.ms).fadeIn(duration: 400.ms),

                const SizedBox(height: AppSpacing.base),

                Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text(
                    _tabCtrl.index == 0
                        ? "Don't have an account? "
                        : 'Already have an account? ',
                    style: AppTypography.caption.copyWith(color: AppColors.darkTextSubtle),
                  ),
                  GestureDetector(
                    onTap: () {
                      HapticFeedback.lightImpact();
                      _tabCtrl.animateTo(_tabCtrl.index == 0 ? 1 : 0);
                    },
                    child: Text(
                      _tabCtrl.index == 0 ? 'Sign up free' : 'Sign in',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.darkAccent2,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ]).animate(delay: 300.ms).fadeIn(duration: 400.ms),

                const SizedBox(height: AppSpacing.xl),

                Text(
                  'By continuing you agree to our Terms of Service\nand Privacy Policy · Truvornex © 2026',
                  textAlign: TextAlign.center,
                  style: AppTypography.labelSm.copyWith(
                    color: AppColors.darkTextSubtle,
                    fontSize: 10,
                    height: 1.6,
                  ),
                ).animate(delay: 400.ms).fadeIn(duration: 400.ms),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
