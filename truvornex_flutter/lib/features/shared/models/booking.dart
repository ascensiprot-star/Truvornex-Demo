class Booking {
  const Booking({
    required this.id,
    required this.serviceId,
    required this.providerId,
    required this.customerId,
    required this.status,
    required this.scheduledAt,
    required this.createdAt,
    this.totalAmount,
    this.address,
    this.notes,
  });

  final String id;
  final String serviceId;
  final String providerId;
  final String customerId;
  final String status;
  final DateTime scheduledAt;
  final DateTime createdAt;
  final double? totalAmount;
  final String? address;
  final String? notes;

  factory Booking.fromJson(Map<String, dynamic> json) => Booking(
    id:          json['id'] as String,
    serviceId:   json['service_id'] as String,
    providerId:  json['provider_id'] as String,
    customerId:  json['customer_id'] as String,
    status:      json['status'] as String,
    scheduledAt: DateTime.parse(json['scheduled_at'] as String),
    createdAt:   DateTime.parse(json['created_at'] as String),
    totalAmount: (json['total_amount'] as num?)?.toDouble(),
    address:     json['address'] as String?,
    notes:       json['notes'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'id':           id,
    'service_id':   serviceId,
    'provider_id':  providerId,
    'customer_id':  customerId,
    'status':       status,
    'scheduled_at': scheduledAt.toIso8601String(),
    'created_at':   createdAt.toIso8601String(),
    'total_amount': totalAmount,
    'address':      address,
    'notes':        notes,
  };
}
