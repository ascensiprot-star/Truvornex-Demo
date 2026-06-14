package com.truvornex.app.ui.screens.customer.profile

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.truvornex.app.data.repository.AuthRepository
import com.truvornex.app.ui.components.TxButton
import com.truvornex.app.ui.components.ButtonVariant
import com.truvornex.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(onLogout: () -> Unit) {
    val user by AuthRepository.currentUser.collectAsState()
    val scope = rememberCoroutineScope()
    var showLogoutDialog by remember { mutableStateOf(false) }

    val menuSections = listOf(
        "Account" to listOf(
            Triple(Icons.Rounded.Person, "Edit Profile", {}),
            Triple(Icons.Rounded.Notifications, "Notifications", {}),
            Triple(Icons.Rounded.LocationOn, "Saved Addresses", {}),
            Triple(Icons.Rounded.Star, "My Reviews", {}),
        ),
        "Payments" to listOf(
            Triple(Icons.Rounded.CreditCard, "Payment Methods", {}),
            Triple(Icons.Rounded.Receipt, "Invoices & History", {}),
            Triple(Icons.Rounded.CardGiftcard, "Gift Cards", {}),
            Triple(Icons.Rounded.Groups, "Referral Program", {}),
        ),
        "Support" to listOf(
            Triple(Icons.Rounded.HelpOutline, "Help Center", {}),
            Triple(Icons.Rounded.SupportAgent, "Support Tickets", {}),
            Triple(Icons.Rounded.Lock, "Privacy Settings", {}),
        ),
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
            .verticalScroll(rememberScrollState())
    ) {
        // Profile header
        Column(
            modifier = Modifier.fillMaxWidth().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(DarkSurface)
                    .border(2.dp, DarkBorderStrong, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    user?.fullName?.firstOrNull()?.uppercase() ?: user?.email?.firstOrNull()?.uppercase() ?: "?",
                    style = MaterialTheme.typography.displayMedium.copy(color = DarkPrimary, fontWeight = FontWeight.W700)
                )
            }
            Spacer(Modifier.height(12.dp))
            Text(user?.fullName ?: "User", style = MaterialTheme.typography.headlineMedium.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
            Spacer(Modifier.height(3.dp))
            Text(user?.email ?: "", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
            Spacer(Modifier.height(8.dp))
            Surface(color = DarkSurface, shape = RoundedCornerShape(100.dp), border = BorderStroke(1.dp, DarkBorder)) {
                Text(
                    user?.role?.replaceFirstChar { it.uppercase() } ?: "Customer",
                    style = MaterialTheme.typography.labelSmall.copy(color = DarkTextMuted, fontWeight = FontWeight.W600),
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 5.dp)
                )
            }
        }

        // Stats
        Row(
            modifier = Modifier.padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            listOf(Triple("12", "Bookings", Icons.Rounded.CalendarToday), Triple("4.9★", "Avg Rating", Icons.Rounded.Star), Triple("350", "Loyalty pts", Icons.Rounded.Stars)).forEach { (v, l, icon) ->
                Surface(modifier = Modifier.weight(1f), color = DarkSurface, shape = RoundedCornerShape(12.dp), border = BorderStroke(1.dp, DarkBorder)) {
                    Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(icon, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.height(4.dp))
                        Text(v, style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                        Text(l, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                }
            }
        }

        Spacer(Modifier.height(16.dp))

        menuSections.forEach { (section, items) ->
            Text(
                section.uppercase(),
                style = MaterialTheme.typography.labelSmall.copy(color = DarkTextSubtle),
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )
            Surface(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                color = DarkSurface,
                shape = RoundedCornerShape(14.dp),
                border = BorderStroke(1.dp, DarkBorder)
            ) {
                Column {
                    items.forEachIndexed { i, (icon, label, action) ->
                        Row(
                            modifier = Modifier.fillMaxWidth().clickable { action() }.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(icon, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(12.dp))
                            Text(label, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText), modifier = Modifier.weight(1f))
                            Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = DarkTextSubtle, modifier = Modifier.size(16.dp))
                        }
                        if (i < items.size - 1) HorizontalDivider(color = DarkBorder, thickness = 1.dp, modifier = Modifier.padding(start = 48.dp))
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
        }

        Spacer(Modifier.height(8.dp))
        TxButton(
            label = "Sign Out",
            onClick = { showLogoutDialog = true },
            modifier = Modifier.padding(horizontal = 16.dp),
            variant = ButtonVariant.Danger,
            trailingIcon = Icons.Rounded.Logout
        )
        Spacer(Modifier.height(32.dp))
    }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            containerColor = DarkSurface,
            title = { Text("Sign Out", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary)) },
            text = { Text("Are you sure you want to sign out?", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted)) },
            confirmButton = {
                TextButton(onClick = {
                    showLogoutDialog = false
                    scope.launch { AuthRepository.logout(); onLogout() }
                }) { Text("Sign Out", color = DarkError) }
            },
            dismissButton = { TextButton(onClick = { showLogoutDialog = false }) { Text("Cancel", color = DarkTextMuted) } }
        )
    }
}
