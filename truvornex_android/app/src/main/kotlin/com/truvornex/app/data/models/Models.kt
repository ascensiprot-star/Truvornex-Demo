package com.truvornex.app.data.models

import com.google.gson.annotations.SerializedName

data class User(
    val id: String = "",
    val email: String = "",
    @SerializedName("full_name") val fullName: String? = null,
    val role: String = "customer",
    @SerializedName("avatar_url") val avatarUrl: String? = null
)

data class Provider(
    val id: String = "",
    @SerializedName("user_id") val userId: String = "",
    val name: String = "",
    val category: String = "",
    val rating: Double = 0.0,
    @SerializedName("review_count") val reviewCount: Int = 0,
    @SerializedName("is_verified") val isVerified: Boolean = false,
    @SerializedName("avatar_url") val avatarUrl: String? = null,
    val bio: String? = null,
    val lat: Double? = null,
    val lng: Double? = null,
    @SerializedName("price_from") val priceFrom: Double? = null,
    @SerializedName("years_experience") val yearsExperience: Int? = null
)

data class Service(
    val id: String = "",
    val name: String = "",
    val description: String? = null,
    val price: Double = 0.0,
    @SerializedName("price_type") val priceType: String = "hourly",
    @SerializedName("is_active") val isActive: Boolean = true,
    val category: String = ""
)

data class Booking(
    val id: String = "",
    @SerializedName("service_id") val serviceId: String = "",
    @SerializedName("provider_id") val providerId: String = "",
    @SerializedName("customer_id") val customerId: String = "",
    val status: String = "pending",
    @SerializedName("scheduled_at") val scheduledAt: String = "",
    @SerializedName("created_at") val createdAt: String = "",
    @SerializedName("total_amount") val totalAmount: Double? = null,
    val address: String? = null,
    val notes: String? = null,
    @SerializedName("provider_name") val providerName: String? = null,
    @SerializedName("service_name") val serviceName: String? = null
)

data class Review(
    val id: String = "",
    val rating: Int = 5,
    val comment: String? = null,
    @SerializedName("reviewer_name") val reviewerName: String = "Anonymous",
    @SerializedName("created_at") val createdAt: String = ""
)

data class LoginRequest(val email: String, val password: String)
data class SignupRequest(val email: String, val password: String, val fullName: String?)
data class AuthResponse(val user: User?)
data class ErrorResponse(val error: String?)
