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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.truvornex.app.ui.components.TxButton
import com.truvornex.app.ui.theme.*

@Composable
fun OnboardingScreen(
    onCustomer: () -> Unit,
    onProvider: () -> Unit
) {
    var selected by remember { mutableIntStateOf(0) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
            .padding(24.dp)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            Spacer(Modifier.weight(1f))

            Text(
                "How will you\nuse Truvornex?",
                style = MaterialTheme.typography.displayLarge.copy(color = DarkPrimary)
            )
            Spacer(Modifier.height(8.dp))
            Text(
                "You can switch between roles anytime.",
                style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted)
            )

            Spacer(Modifier.height(36.dp))

            RoleCard(
                index = 0,
                selected = selected,
                icon = Icons.Rounded.Person,
                title = "I need services",
                subtitle = "Book trusted providers in your neighborhood",
                onClick = { selected = 0 }
            )

            Spacer(Modifier.height(12.dp))

            RoleCard(
                index = 1,
                selected = selected,
                icon = Icons.Rounded.Storefront,
                title = "I offer services",
                subtitle = "Grow your business and manage bookings",
                onClick = { selected = 1 }
            )

            Spacer(Modifier.weight(1f))

            TxButton(
                label = "Get Started",
                onClick = { if (selected == 0) onCustomer() else onProvider() },
                trailingIcon = Icons.Rounded.ArrowForward
            )
            Spacer(Modifier.height(16.dp))
        }
    }
}

@Composable
private fun RoleCard(
    index: Int,
    selected: Int,
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    val isSelected = selected == index
    val borderColor = if (isSelected) DarkBorderStrong else DarkBorder
    val bgColor = if (isSelected) DarkSurface else DarkSurfaceLow

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        color = bgColor,
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(if (isSelected) 1.5.dp else 1.dp, borderColor)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (isSelected) DarkPrimary else DarkSurfaceHigh),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = if (isSelected) DarkOnPrimary else DarkTextMuted,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary))
                Spacer(Modifier.height(2.dp))
                Text(subtitle, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
            }
            if (isSelected) {
                Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = DarkSuccess, modifier = Modifier.size(20.dp))
            }
        }
    }
}
