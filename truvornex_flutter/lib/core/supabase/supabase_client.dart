import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String _supabaseUrl  = String.fromEnvironment('SUPABASE_URL',  defaultValue: '');
  static const String _supabaseKey  = String.fromEnvironment('SUPABASE_ANON_KEY', defaultValue: '');

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: _supabaseUrl,
      anonKey: _supabaseKey,
    );
  }

  static SupabaseClient get client => Supabase.instance.client;
}

// ── Convenience extension ─────────────────────────────────────────────────────
extension SupabaseClientX on SupabaseClient {
  String? get userId => auth.currentUser?.id;
  User?   get currentUser => auth.currentUser;
}
