import 'package:flutter/material.dart';

abstract class AppColors {
  // ── Dark Mode ──────────────────────────────────────────────────────
  static const darkBg             = Color(0xFF080808);
  static const darkSurface        = Color(0xFF111111);
  static const darkSurfaceLow     = Color(0xFF0C0C0C);
  static const darkSurfaceHigh    = Color(0xFF1A1A1A);
  static const darkSurfaceHighest = Color(0xFF222222);
  static const darkSurfaceLowest  = Color(0xFF050505);

  static const darkPrimary    = Color(0xFFFFFFFF);
  static const darkOnPrimary  = Color(0xFF080808);
  static const darkAccent     = Color(0xFFFFFFFF);
  static const darkAccent2    = Color(0xFFD4D4D4);
  static const darkAccent3    = Color(0xFFA3A3A3);

  static const darkText       = Color(0xFFE8E8E8);
  static const darkTextMuted  = Color(0xFF888888);
  static const darkTextSubtle = Color(0xFF444444);

  static const darkBorder        = Color(0x12FFFFFF);
  static const darkBorderStrong  = Color(0x1FFFFFFF);

  static const darkSuccess = Color(0xFF6EE7B7);
  static const darkWarning = Color(0xFFFCD34D);
  static const darkError   = Color(0xFFFCA5A5);
  static const darkInfo    = Color(0xFF93C5FD);

  // ── Light Mode ────────────────────────────────────────────────────
  static const lightBg            = Color(0xFFFFFFFF);
  static const lightSurface       = Color(0xFFF7F7F7);
  static const lightSurfaceLow    = Color(0xFFEFEFEF);
  static const lightSurfaceHigh   = Color(0xFFE8E8E8);

  static const lightPrimary   = Color(0xFF080808);
  static const lightOnPrimary = Color(0xFFFFFFFF);
  static const lightAccent    = Color(0xFF080808);

  static const lightText       = Color(0xFF111111);
  static const lightTextMuted  = Color(0xFF555555);
  static const lightTextSubtle = Color(0xFF999999);

  static const lightBorder       = Color(0x14000000);
  static const lightBorderStrong = Color(0x1F000000);

  static const lightSuccess = Color(0xFF059669);
  static const lightWarning = Color(0xFFD97706);
  static const lightError   = Color(0xFFDC2626);
  static const lightInfo    = Color(0xFF2563EB);

  // ── Brand / Accent (consistent across modes) ─────────────────────
  static const purple    = Color(0xFF7C6FCD);
  static const amber     = Color(0xFFF59E0B);
  static const emerald   = Color(0xFF10B981);
  static const red       = Color(0xFFEF4444);
  static const blue      = Color(0xFF3B82F6);
  static const rose      = Color(0xFFF43F5E);
}
