class Provider {
  const Provider({
    required this.id,
    required this.userId,
    required this.name,
    required this.category,
    required this.rating,
    required this.reviewCount,
    required this.isVerified,
    this.avatarUrl,
    this.bio,
    this.lat,
    this.lng,
    this.priceFrom,
    this.yearsExperience,
  });

  final String id;
  final String userId;
  final String name;
  final String category;
  final double rating;
  final int reviewCount;
  final bool isVerified;
  final String? avatarUrl;
  final String? bio;
  final double? lat;
  final double? lng;
  final double? priceFrom;
  final int? yearsExperience;

  factory Provider.fromJson(Map<String, dynamic> json) => Provider(
    id:              json['id'] as String,
    userId:          json['user_id'] as String,
    name:            json['name'] as String,
    category:        json['category'] as String,
    rating:          (json['rating'] as num).toDouble(),
    reviewCount:     json['review_count'] as int,
    isVerified:      json['is_verified'] as bool,
    avatarUrl:       json['avatar_url'] as String?,
    bio:             json['bio'] as String?,
    lat:             (json['lat'] as num?)?.toDouble(),
    lng:             (json['lng'] as num?)?.toDouble(),
    priceFrom:       (json['price_from'] as num?)?.toDouble(),
    yearsExperience: json['years_experience'] as int?,
  );

  Map<String, dynamic> toJson() => {
    'id':               id,
    'user_id':          userId,
    'name':             name,
    'category':         category,
    'rating':           rating,
    'review_count':     reviewCount,
    'is_verified':      isVerified,
    'avatar_url':       avatarUrl,
    'bio':              bio,
    'lat':              lat,
    'lng':              lng,
    'price_from':       priceFrom,
    'years_experience': yearsExperience,
  };
}
