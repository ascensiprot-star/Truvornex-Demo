class Review {
  const Review({
    required this.id,
    required this.bookingId,
    required this.providerId,
    required this.customerId,
    required this.rating,
    required this.createdAt,
    this.comment,
    this.customerName,
    this.customerAvatarUrl,
  });

  final String id;
  final String bookingId;
  final String providerId;
  final String customerId;
  final double rating;
  final DateTime createdAt;
  final String? comment;
  final String? customerName;
  final String? customerAvatarUrl;

  factory Review.fromJson(Map<String, dynamic> json) => Review(
    id:                 json['id'] as String,
    bookingId:          json['booking_id'] as String,
    providerId:         json['provider_id'] as String,
    customerId:         json['customer_id'] as String,
    rating:             (json['rating'] as num).toDouble(),
    createdAt:          DateTime.parse(json['created_at'] as String),
    comment:            json['comment'] as String?,
    customerName:       json['customer_name'] as String?,
    customerAvatarUrl:  json['customer_avatar_url'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'id':                 id,
    'booking_id':         bookingId,
    'provider_id':        providerId,
    'customer_id':        customerId,
    'rating':             rating,
    'created_at':         createdAt.toIso8601String(),
    'comment':            comment,
    'customer_name':      customerName,
    'customer_avatar_url':customerAvatarUrl,
  };
}
