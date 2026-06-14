class Service {
  const Service({
    required this.id,
    required this.providerId,
    required this.name,
    required this.category,
    required this.price,
    required this.priceType,
    required this.isActive,
    this.description,
    this.imageUrl,
    this.durationMinutes,
  });

  final String id;
  final String providerId;
  final String name;
  final String category;
  final double price;
  final String priceType; // hourly | flat | starting_from
  final bool isActive;
  final String? description;
  final String? imageUrl;
  final int? durationMinutes;

  factory Service.fromJson(Map<String, dynamic> json) => Service(
    id:              json['id'] as String,
    providerId:      json['provider_id'] as String,
    name:            json['name'] as String,
    category:        json['category'] as String,
    price:           (json['price'] as num).toDouble(),
    priceType:       json['price_type'] as String,
    isActive:        json['is_active'] as bool,
    description:     json['description'] as String?,
    imageUrl:        json['image_url'] as String?,
    durationMinutes: json['duration_minutes'] as int?,
  );

  Map<String, dynamic> toJson() => {
    'id':               id,
    'provider_id':      providerId,
    'name':             name,
    'category':         category,
    'price':            price,
    'price_type':       priceType,
    'is_active':        isActive,
    'description':      description,
    'image_url':        imageUrl,
    'duration_minutes': durationMinutes,
  };
}
