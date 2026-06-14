import 'package:flutter/material.dart';
import 'app_colors.dart';

abstract class AppTypography {
  static const String _fontFamily      = 'Inter';
  static const String _monoFontFamily  = 'JetBrainsMono';

  // ── Display ────────────────────────────────────────────────────────
  static const TextStyle display = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 32,
    fontWeight: FontWeight.w900,
    letterSpacing: -0.5,
    height: 1.1,
  );

  // ── Headings ──────────────────────────────────────────────────────
  static const TextStyle h1 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 24,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.3,
    height: 1.2,
  );

  static const TextStyle h2 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 20,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.2,
    height: 1.3,
  );

  static const TextStyle h3 = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.1,
    height: 1.4,
  );

  // ── Body ──────────────────────────────────────────────────────────
  static const TextStyle bodyLg = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.6,
  );

  static const TextStyle body = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
  );

  static const TextStyle bodySm = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 13,
    fontWeight: FontWeight.w400,
    height: 1.5,
  );

  // ── Caption / Label ───────────────────────────────────────────────
  static const TextStyle caption = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.4,
  );

  static const TextStyle label = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 11,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.8,
    height: 1.3,
  );

  static const TextStyle labelSm = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 10,
    fontWeight: FontWeight.w600,
    letterSpacing: 1.0,
    height: 1.3,
  );

  // ── Mono ──────────────────────────────────────────────────────────
  static const TextStyle mono = TextStyle(
    fontFamily: _monoFontFamily,
    fontSize: 13,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.2,
    height: 1.5,
  );

  static const TextStyle monoSm = TextStyle(
    fontFamily: _monoFontFamily,
    fontSize: 11,
    fontWeight: FontWeight.w400,
    letterSpacing: 0.2,
    height: 1.4,
  );

  // ── Buttons ───────────────────────────────────────────────────────
  static const TextStyle button = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.1,
    height: 1.0,
  );

  static const TextStyle buttonSm = TextStyle(
    fontFamily: _fontFamily,
    fontSize: 12,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.1,
    height: 1.0,
  );

  // ── Dark ThemeData TextTheme ──────────────────────────────────────
  static TextTheme darkTextTheme = TextTheme(
    displayLarge:   display.copyWith(color: AppColors.darkPrimary),
    displayMedium:  h1.copyWith(color: AppColors.darkPrimary),
    displaySmall:   h2.copyWith(color: AppColors.darkPrimary),
    headlineLarge:  h1.copyWith(color: AppColors.darkPrimary),
    headlineMedium: h2.copyWith(color: AppColors.darkPrimary),
    headlineSmall:  h3.copyWith(color: AppColors.darkPrimary),
    titleLarge:     h2.copyWith(color: AppColors.darkPrimary),
    titleMedium:    h3.copyWith(color: AppColors.darkPrimary),
    titleSmall:     h3.copyWith(color: AppColors.darkTextMuted, fontSize: 14),
    bodyLarge:      bodyLg.copyWith(color: AppColors.darkText),
    bodyMedium:     body.copyWith(color: AppColors.darkText),
    bodySmall:      bodySm.copyWith(color: AppColors.darkTextMuted),
    labelLarge:     button.copyWith(color: AppColors.darkPrimary),
    labelMedium:    label.copyWith(color: AppColors.darkTextMuted),
    labelSmall:     labelSm.copyWith(color: AppColors.darkTextSubtle),
  );

  // ── Light ThemeData TextTheme ─────────────────────────────────────
  static TextTheme lightTextTheme = TextTheme(
    displayLarge:   display.copyWith(color: AppColors.lightPrimary),
    displayMedium:  h1.copyWith(color: AppColors.lightPrimary),
    displaySmall:   h2.copyWith(color: AppColors.lightPrimary),
    headlineLarge:  h1.copyWith(color: AppColors.lightPrimary),
    headlineMedium: h2.copyWith(color: AppColors.lightPrimary),
    headlineSmall:  h3.copyWith(color: AppColors.lightPrimary),
    titleLarge:     h2.copyWith(color: AppColors.lightPrimary),
    titleMedium:    h3.copyWith(color: AppColors.lightPrimary),
    titleSmall:     h3.copyWith(color: AppColors.lightTextMuted, fontSize: 14),
    bodyLarge:      bodyLg.copyWith(color: AppColors.lightText),
    bodyMedium:     body.copyWith(color: AppColors.lightText),
    bodySmall:      bodySm.copyWith(color: AppColors.lightTextMuted),
    labelLarge:     button.copyWith(color: AppColors.lightPrimary),
    labelMedium:    label.copyWith(color: AppColors.lightTextMuted),
    labelSmall:     labelSm.copyWith(color: AppColors.lightTextSubtle),
  );
}
