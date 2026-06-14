package com.truvornex.app.ui.screens.splash

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Bolt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.data.repository.AuthRepository
import com.truvornex.app.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onAuthenticated: () -> Unit,
    onUnauthenticated: () -> Unit
) {
    var visible by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        visible = true
        delay(300)
        val result = AuthRepository.checkSession()
        delay(800)
        if (result.getOrNull() != null) onAuthenticated() else onUnauthenticated()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg),
        contentAlignment = Alignment.Center
    ) {
        AnimatedVisibility(
            visible = visible,
            enter = fadeIn() + scaleIn(initialScale = 0.85f)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(RoundedCornerShape(18.dp))
                        .background(DarkSurface),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Rounded.Bolt, contentDescription = null, tint = DarkPrimary, modifier = Modifier.size(32.dp))
                }
                Spacer(Modifier.height(16.dp))
                Text(
                    "TRUVORNEX",
                    style = MaterialTheme.typography.headlineLarge.copy(
                        color = DarkPrimary,
                        fontWeight = FontWeight.W800,
                        letterSpacing = 3.sp
                    )
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    "Service Platform",
                    style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted)
                )
                Spacer(Modifier.height(48.dp))
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = DarkTextSubtle,
                    strokeWidth = 2.dp
                )
            }
        }
    }
}
