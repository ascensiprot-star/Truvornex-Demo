package com.truvornex.app.data.network

import com.truvornex.app.data.models.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @GET("api/auth/user")
    suspend fun getUser(): Response<AuthResponse>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("api/auth/signup")
    suspend fun signup(@Body request: SignupRequest): Response<AuthResponse>

    @POST("api/auth/logout")
    suspend fun logout(): Response<Map<String, Boolean>>

    @POST("api/ai/chat")
    suspend fun chat(@Body request: Map<String, Any>): Response<Map<String, String>>

    @GET("api/health")
    suspend fun health(): Response<Map<String, String>>
}
