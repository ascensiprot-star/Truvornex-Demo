abstract class AppValidators {
  static String? email(String? value) {
    if (value == null || value.isEmpty) return 'Email is required';
    final re = RegExp(r'^[^@]+@[^@]+\.[^@]+');
    if (!re.hasMatch(value)) return 'Enter a valid email';
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  static String? required(String? value, [String field = 'This field']) {
    if (value == null || value.trim().isEmpty) return '$field is required';
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.isEmpty) return null;
    final re = RegExp(r'^\+?[\d\s\-()]{7,15}$');
    if (!re.hasMatch(value)) return 'Enter a valid phone number';
    return null;
  }
}
