import 'package:intl/intl.dart';

abstract class AppFormatters {
  static final _currency = NumberFormat.currency(symbol: '\$', decimalDigits: 2);
  static final _currencyCompact = NumberFormat.compactCurrency(symbol: '\$');
  static final _date = DateFormat('MMM d, yyyy');
  static final _dateShort = DateFormat('MMM d');
  static final _time = DateFormat('h:mm a');
  static final _dateTime = DateFormat('MMM d, h:mm a');

  static String currency(double amount) => _currency.format(amount);
  static String currencyCompact(double amount) => _currencyCompact.format(amount);
  static String date(DateTime dt) => _date.format(dt);
  static String dateShort(DateTime dt) => _dateShort.format(dt);
  static String time(DateTime dt) => _time.format(dt);
  static String dateTime(DateTime dt) => _dateTime.format(dt);

  static String relativeTime(DateTime dt) {
    final diff = DateTime.now().difference(dt);
    if (diff.inSeconds < 60) return 'just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays < 7) return '${diff.inDays}d ago';
    return dateShort(dt);
  }

  static String compact(int n) {
    if (n >= 1000000) return '${(n / 1000000).toStringAsFixed(1)}M';
    if (n >= 1000) return '${(n / 1000).toStringAsFixed(1)}K';
    return n.toString();
  }

  static String rating(double r) => r.toStringAsFixed(1);
}
