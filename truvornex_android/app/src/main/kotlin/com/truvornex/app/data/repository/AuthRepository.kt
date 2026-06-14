package com.truvornex.app.data.repository

import com.truvornex.app.data.models.*
import com.truvornex.app.data.network.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object AuthRepository {
    private val _currentUser = MutableStateFlow<User?>(null)
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    suspend fun checkSession(): Result<User?> = runCatching {
        val response = ApiClient.apiService.getUser()
        if (response.isSuccessful) {
            val user = response.body()?.user
            _currentUser.value = user
            user
        } else null
    }

    suspend fun login(email: String, password: String): Result<User> = runCatching {
        val response = ApiClient.apiService.login(LoginRequest(email.trim(), password))
        if (response.isSuccessful) {
            val user = response.body()?.user ?: error("No user in response")
            _currentUser.value = user
            user
        } else {
            error("Invalid email or password")
        }
    }

    suspend fun signup(email: String, password: String, fullName: String?): Result<User> = runCatching {
        val response = ApiClient.apiService.signup(SignupRequest(email.trim(), password, fullName))
        if (response.isSuccessful) {
            val user = response.body()?.user ?: error("Signup failed")
            user
        } else {
            error("An account with this email already exists")
        }
    }

    suspend fun logout(): Result<Unit> = runCatching {
        ApiClient.apiService.logout()
        _currentUser.value = null
    }
}
