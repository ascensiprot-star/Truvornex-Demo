import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_typography.dart';
import '../../../core/theme/app_spacing.dart';
import '../../shared/widgets/tx_app_bar.dart';

class _Message {
  _Message({required this.role, required this.content});
  final String role;
  String content;
}

class AIAssistantScreen extends ConsumerStatefulWidget {
  const AIAssistantScreen({super.key});

  @override
  ConsumerState<AIAssistantScreen> createState() => _AIAssistantScreenState();
}

class _AIAssistantScreenState extends ConsumerState<AIAssistantScreen> {
  final _ctrl   = TextEditingController();
  final _scroll = ScrollController();
  final _msgs   = <_Message>[];
  bool _typing  = false;

  static const _suggestedPrompts = [
    'Who are the best plumbers near me?',
    'Book a cleaner for next Saturday',
    'What\'s the average price for tutoring?',
    'Find emergency electricians available now',
  ];

  @override
  void initState() {
    super.initState();
    _msgs.add(_Message(
      role: 'assistant',
      content: "Hi! I'm **Simon**, your AI neighborhood services assistant. "
          "I can help you find providers, book services, compare prices, "
          "and navigate the Truvornex platform. What can I do for you today?",
    ));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _sendMessage(String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    HapticFeedback.lightImpact();
    _ctrl.clear();
    setState(() {
      _msgs.add(_Message(role: 'user', content: trimmed));
      _typing = true;
    });
    _scrollToBottom();

    await Future.delayed(const Duration(milliseconds: 1200));

    // Demo response (replace with real API call via /api/ai/chat)
    final response = 'Great question! Based on your neighborhood data, '
        'I\'d recommend checking providers in the **${trimmed.split(' ').first}** '
        'category. I found **12 verified providers** within 2 km of your location. '
        'Would you like me to show their availability and pricing?';

    if (mounted) {
      setState(() {
        _typing = false;
        _msgs.add(_Message(role: 'assistant', content: response));
      });
      _scrollToBottom();
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark  = Theme.of(context).brightness == Brightness.dark;
    final text    = isDark ? AppColors.darkPrimary  : AppColors.lightPrimary;
    final muted   = isDark ? AppColors.darkTextMuted : AppColors.lightTextMuted;
    final surface = isDark ? AppColors.darkSurface  : AppColors.lightSurface;
    final border  = isDark ? AppColors.darkBorder   : AppColors.lightBorder;
    final bg      = isDark ? AppColors.darkBg       : AppColors.lightBg;

    return Scaffold(
      backgroundColor: bg,
      appBar: TxAppBar(
        titleWidget: Row(children: [
          Container(
            width: 32, height: 32,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF7C6FCD), Color(0xFF9F8FE0)]),
              borderRadius: BorderRadius.circular(8),
            ),
            alignment: Alignment.center,
            child: const Icon(Icons.auto_awesome_rounded, size: 16, color: Colors.white),
          ),
          const SizedBox(width: 10),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Simon AI',
              style: AppTypography.h3.copyWith(color: text)),
            Row(children: [
              Container(
                width: 6, height: 6,
                decoration: const BoxDecoration(
                  color: AppColors.darkSuccess, shape: BoxShape.circle),
              ),
              const SizedBox(width: 5),
              Text('Online',
                style: AppTypography.labelSm.copyWith(color: AppColors.darkSuccess)),
            ]),
          ]),
        ]),
        actions: [
          TxIconButton(icon: Icons.more_horiz_rounded, onTap: () {}),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(AppSpacing.base),
              itemCount: _msgs.length + (_typing ? 1 : 0),
              itemBuilder: (context, i) {
                if (_typing && i == _msgs.length) {
                  return _buildTypingIndicator(isDark, surface, border);
                }
                final msg = _msgs[i];
                return _buildMessage(msg, isDark, text, muted, surface, border);
              },
            ),
          ),

          // Suggested prompts (when empty)
          if (_msgs.length == 1)
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.base, vertical: AppSpacing.sm),
              child: Row(
                children: _suggestedPrompts.map((p) => Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => _sendMessage(p),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.md, vertical: 8),
                      decoration: BoxDecoration(
                        color: surface,
                        borderRadius: BorderRadius.circular(AppSpacing.radiusFull),
                        border: Border.all(color: border),
                      ),
                      child: Text(p,
                        style: AppTypography.caption.copyWith(color: muted)),
                    ),
                  ),
                )).toList(),
              ),
            ).animate().fadeIn(duration: 400.ms),

          // Input bar
          Container(
            padding: EdgeInsets.fromLTRB(
              AppSpacing.base, AppSpacing.sm, AppSpacing.base,
              AppSpacing.sm + MediaQuery.of(context).viewPadding.bottom),
            decoration: BoxDecoration(
              color: surface,
              border: Border(top: BorderSide(color: border)),
            ),
            child: Row(children: [
              Expanded(
                child: TextField(
                  controller: _ctrl,
                  style: AppTypography.body.copyWith(color: text),
                  maxLines: 4,
                  minLines: 1,
                  textInputAction: TextInputAction.send,
                  onSubmitted: _sendMessage,
                  decoration: InputDecoration(
                    hintText: 'Ask Simon anything…',
                    hintStyle: AppTypography.body.copyWith(
                      color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle),
                    filled: true,
                    fillColor: isDark ? AppColors.darkSurfaceHigh : AppColors.lightSurfaceLow,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.base, vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              GestureDetector(
                onTap: () => _sendMessage(_ctrl.text),
                child: Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(
                    color: isDark ? AppColors.darkPrimary : AppColors.lightPrimary,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
                  ),
                  alignment: Alignment.center,
                  child: Icon(Icons.send_rounded, size: 18,
                    color: isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary),
                ),
              ),
            ]),
          ),
        ],
      ),
    );
  }

  Widget _buildMessage(
      _Message msg, bool isDark, Color text, Color muted, Color surface, Color border) {
    final isUser = msg.role == 'user';
    final bg = isUser
        ? (isDark ? AppColors.darkPrimary : AppColors.lightPrimary)
        : surface;
    final fg = isUser
        ? (isDark ? AppColors.darkOnPrimary : AppColors.lightOnPrimary)
        : text;

    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.78),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.base, vertical: 12),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.only(
            topLeft:     const Radius.circular(16),
            topRight:    const Radius.circular(16),
            bottomLeft:  isUser ? const Radius.circular(16) : const Radius.circular(4),
            bottomRight: isUser ? const Radius.circular(4)  : const Radius.circular(16),
          ),
          border: isUser ? null : Border.all(color: border),
        ),
        child: Text(
          msg.content.replaceAll('**', ''),
          style: AppTypography.body.copyWith(color: fg, height: 1.5),
        ),
      ),
    ).animate().fadeIn(duration: 300.ms).slideY(
      begin: 0.08, end: 0, duration: 300.ms, curve: Curves.easeOut);
  }

  Widget _buildTypingIndicator(bool isDark, Color surface, Color border) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: surface,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomRight: Radius.circular(16),
            bottomLeft: Radius.circular(4),
          ),
          border: Border.all(color: border),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(3, (i) => Container(
            width: 6, height: 6,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkTextSubtle : AppColors.lightTextSubtle,
              shape: BoxShape.circle,
            ),
          ).animate(delay: Duration(milliseconds: i * 150))
           .then(delay: Duration(milliseconds: (2 - i) * 150))
           .fadeIn(duration: 300.ms)
           .then().fadeOut(duration: 300.ms)),
        ),
      ),
    );
  }
}
