import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../supabase/supabase_client.dart';

part 'auth_provider.g.dart';

@riverpod
Stream<AuthState> authNotifier(AuthNotifierRef ref) {
  return SupabaseConfig.client.auth.onAuthStateChange;
}

@riverpod
User? currentUser(CurrentUserRef ref) {
  final authState = ref.watch(authNotifierProvider).valueOrNull;
  return authState?.session?.user ?? SupabaseConfig.client.currentUser;
}

// ── Auth Actions ──────────────────────────────────────────────────────────────
class AuthService {
  static Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    return SupabaseConfig.client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  static Future<AuthResponse> signUp({
    required String email,
    required String password,
    String? fullName,
  }) async {
    return SupabaseConfig.client.auth.signUp(
      email: email,
      password: password,
      data: fullName != null ? {'full_name': fullName} : null,
    );
  }

  static Future<void> signOut() async {
    await SupabaseConfig.client.auth.signOut();
  }

  static Future<void> resetPassword(String email) async {
    await SupabaseConfig.client.auth.resetPasswordForEmail(email);
  }
}
