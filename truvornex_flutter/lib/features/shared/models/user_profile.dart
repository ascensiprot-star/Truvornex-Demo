enum UserRole { customer, provider, admin }

class UserProfile {
  const UserProfile({
    required this.id,
    required this.email,
    required this.role,
    required this.createdAt,
    this.fullName,
    this.avatarUrl,
    this.phone,
    this.address,
    this.loyaltyPoints,
  });

  final String id;
  final String email;
  final UserRole role;
  final DateTime createdAt;
  final String? fullName;
  final String? avatarUrl;
  final String? phone;
  final String? address;
  final int? loyaltyPoints;

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    id:            json['id'] as String,
    email:         json['email'] as String,
    role:          UserRole.values.firstWhere(
        (r) => r.name == (json['role'] as String? ?? 'customer'),
        orElse: () => UserRole.customer),
    createdAt:     DateTime.parse(json['created_at'] as String),
    fullName:      json['full_name'] as String?,
    avatarUrl:     json['avatar_url'] as String?,
    phone:         json['phone'] as String?,
    address:       json['address'] as String?,
    loyaltyPoints: json['loyalty_points'] as int?,
  );

  Map<String, dynamic> toJson() => {
    'id':             id,
    'email':          email,
    'role':           role.name,
    'created_at':     createdAt.toIso8601String(),
    'full_name':      fullName,
    'avatar_url':     avatarUrl,
    'phone':          phone,
    'address':        address,
    'loyalty_points': loyaltyPoints,
  };
}
