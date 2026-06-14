import 'package:supabase_flutter/supabase_flutter.dart';
import 'supabase_client.dart';

class RealtimeService {
  static RealtimeChannel watchTable({
    required String table,
    required void Function(Map<String, dynamic> payload) onInsert,
    required void Function(Map<String, dynamic> payload) onUpdate,
    required void Function(Map<String, dynamic> payload) onDelete,
    String? filterColumn,
    String? filterValue,
  }) {
    var channel = SupabaseConfig.client.channel('realtime:$table');

    channel = channel.onPostgresChanges(
      event: PostgresChangeEvent.insert,
      schema: 'public',
      table: table,
      filter: filterColumn != null && filterValue != null
          ? PostgresChangeFilter(type: PostgresChangeFilterType.eq, column: filterColumn, value: filterValue)
          : null,
      callback: (payload) => onInsert(payload.newRecord),
    );

    channel = channel.onPostgresChanges(
      event: PostgresChangeEvent.update,
      schema: 'public',
      table: table,
      filter: filterColumn != null && filterValue != null
          ? PostgresChangeFilter(type: PostgresChangeFilterType.eq, column: filterColumn, value: filterValue)
          : null,
      callback: (payload) => onUpdate(payload.newRecord),
    );

    channel = channel.onPostgresChanges(
      event: PostgresChangeEvent.delete,
      schema: 'public',
      table: table,
      callback: (payload) => onDelete(payload.oldRecord),
    );

    channel.subscribe();
    return channel;
  }

  static Future<void> dispose(RealtimeChannel channel) async {
    await SupabaseConfig.client.removeChannel(channel);
  }
}
