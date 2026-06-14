package com.truvornex.app.ui.screens.auth

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.data.repository.AuthRepository
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onLoginSuccess: (role: String) -> Unit
) {
    var isSignUp by remember { mutableStateOf(false) }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var fullName by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()

    val features = listOf(
        Triple(Icons.Rounded.Search, "Find Services", "2,400+ trusted providers nearby"),
        Triple(Icons.Rounded.AutoAwesome, "Simon AI", "Smart service discovery"),
        Triple(Icons.Rounded.Shield, "Safe & Verified", "Background-checked providers"),
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(48.dp))

            // Logo
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorderStrong, RoundedCornerShape(12.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Rounded.Bolt, contentDescription = null, tint = DarkPrimary, modifier = Modifier.size(20.dp))
                }
                Spacer(Modifier.width(10.dp))
                Column {
                    Text("TRUVORNEX", style = MaterialTheme.typography.headlineSmall.copy(
                        color = DarkPrimary, fontWeight = FontWeight.W800, letterSpacing = 1.sp))
                    Text("Service Platform", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle))
                }
            }

            Spacer(Modifier.height(40.dp))

            // Headline
            Text(
                if (!isSignUp) "Welcome back" else "Create account",
                style = MaterialTheme.typography.displayMedium.copy(color = DarkPrimary),
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(6.dp))
            Text(
                if (!isSignUp) "Sign in to access your services and Simon AI"
                else "Join 2,400+ users on Truvornex today",
                style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted),
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(28.dp))

            // Tab toggle
            Surface(
                color = DarkSurfaceHigh,
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(modifier = Modifier.padding(3.dp)) {
                    listOf("Sign In", "Sign Up").forEachIndexed { i, label ->
                        val selected = (i == 0) == !isSignUp
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(10.dp))
                                .background(if (selected) DarkSurface else Color.Transparent)
                                .clickable { isSignUp = (i == 1); error = null }
                                .padding(vertical = 9.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                label,
                                style = MaterialTheme.typography.labelLarge.copy(
                                    color = if (selected) DarkPrimary else DarkTextMuted,
                                    fontWeight = if (selected) FontWeight.W700 else FontWeight.W500
                                )
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(24.dp))

            // Error
            if (error != null) {
                Surface(
                    color = DarkError.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(10.dp),
                    border = BorderStroke(1.dp, DarkError.copy(alpha = 0.25f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        error!!,
                        style = MaterialTheme.typography.bodySmall.copy(color = DarkError),
                        modifier = Modifier.padding(12.dp)
                    )
                }
                Spacer(Modifier.height(12.dp))
            }

            // Fields
            if (isSignUp) {
                TxTextField(
                    label = "Full Name",
                    value = fullName,
                    onValueChange = { fullName = it },
                    hint = "Alex Johnson",
                    leadingIcon = Icons.Rounded.Person
                )
                Spacer(Modifier.height(12.dp))
            }

            TxTextField(
                label = "Email",
                value = email,
                onValueChange = { email = it },
                hint = "you@example.com",
                leadingIcon = Icons.Rounded.Email
            )
            Spacer(Modifier.height(12.dp))

            TxTextField(
                label = "Password",
                value = password,
                onValueChange = { password = it },
                hint = "••••••••",
                isPassword = true,
                leadingIcon = Icons.Rounded.Lock
            )

            Spacer(Modifier.height(20.dp))

            TxButton(
                label = if (!isSignUp) "Sign In" else "Create Account",
                onClick = {
                    if (email.isBlank() || password.isBlank()) {
                        error = "Please fill in all fields"; return@TxButton
                    }
                    scope.launch {
                        isLoading = true; error = null
                        if (!isSignUp) {
                            val result = AuthRepository.login(email, password)
                            if (result.isSuccess) {
                                onLoginSuccess(result.getOrNull()?.role ?: "customer")
                            } else {
                                error = result.exceptionOrNull()?.message ?: "Login failed"
                            }
                        } else {
                            val result = AuthRepository.signup(email, password, fullName.ifBlank { null })
                            if (result.isSuccess) {
                                isSignUp = false
                                error = null
                            } else {
                                error = result.exceptionOrNull()?.message ?: "Signup failed"
                            }
                        }
                        isLoading = false
                    }
                },
                isLoading = isLoading,
                trailingIcon = Icons.Rounded.ArrowForward
            )

            Spacer(Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.Center) {
                Text(
                    if (!isSignUp) "Don't have an account? " else "Already have an account? ",
                    style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted)
                )
                Text(
                    if (!isSignUp) "Sign up free" else "Sign in",
                    style = MaterialTheme.typography.bodySmall.copy(
                        color = DarkAccent2, fontWeight = FontWeight.W600
                    ),
                    modifier = Modifier.clickable { isSignUp = !isSignUp; error = null }
                )
            }

            Spacer(Modifier.height(36.dp))

            // Features preview
            features.forEach { (icon, title, sub) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(DarkSurface)
                        .border(1.dp, DarkBorder, RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(36.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(BrandPurple.copy(alpha = 0.12f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(icon, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(17.dp))
                    }
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text(title, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                        Text(sub, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                }
                Spacer(Modifier.height(4.dp))
            }

            Spacer(Modifier.height(24.dp))
            Text(
                "By continuing you agree to our Terms of Service and Privacy Policy · Truvornex © 2026",
                style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle, fontSize = 10.sp),
                textAlign = TextAlign.Center
            )
            Spacer(Modifier.height(16.dp))
        }
    }
}
