package com.truvornex.app.ui.screens.admin

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.CircleShape
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
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

// ── Admin Dashboard ───────────────────────────────────────────────────────────
@Composable
fun AdminDashboardScreen(onNavigate: (String) -> Unit) {
    val adminModules = listOf(
        AdminModule(Icons.Rounded.People, "Users", "2,400 registered", BrandBlue, "admin_users"),
        AdminModule(Icons.Rounded.Storefront, "Providers", "847 active", BrandEmerald, "admin_providers"),
        AdminModule(Icons.Rounded.CalendarToday, "Bookings", "15K completed", BrandPurple, "admin_bookings"),
        AdminModule(Icons.Rounded.BarChart, "Analytics", "View reports", BrandAmber, "admin_analytics"),
        AdminModule(Icons.Rounded.MonitorHeart, "System Health", "All systems OK", DarkSuccess, "admin_health"),
        AdminModule(Icons.Rounded.AutoAwesome, "AI Control", "Simon AI settings", BrandRose, "admin_ai"),
    )

    LazyColumn(modifier = Modifier.fillMaxSize().background(DarkBg), contentPadding = PaddingValues(bottom = 24.dp)) {
        item {
            Column(modifier = Modifier.background(DarkSurface).padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Rounded.AdminPanelSettings, contentDescription = null, tint = BrandRed, modifier = Modifier.size(22.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Admin Panel", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                }
                Text("Truvornex platform management", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
            }
        }
        item {
            Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                TxStatCard("\$48K", "Monthly Rev", modifier = Modifier.weight(1f), valueColor = DarkSuccess)
                TxStatCard("98%", "Uptime", modifier = Modifier.weight(1f))
            }
        }
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                TxSectionHeader("Management")
                Spacer(Modifier.height(8.dp))
                adminModules.chunked(2).forEach { row ->
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.padding(bottom = 10.dp)) {
                        row.forEach { mod ->
                            AdminModuleCard(mod, onClick = { onNavigate(mod.route) }, modifier = Modifier.weight(1f))
                        }
                        if (row.size == 1) Spacer(Modifier.weight(1f))
                    }
                }
            }
        }
    }
}

data class AdminModule(val icon: ImageVector, val title: String, val subtitle: String, val accent: Color, val route: String)

@Composable
private fun AdminModuleCard(mod: AdminModule, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Surface(modifier = modifier.clickable(onClick = onClick), color = DarkSurface, shape = RoundedCornerShape(14.dp), border = BorderStroke(1.dp, DarkBorder)) {
        Column(modifier = Modifier.padding(14.dp)) {
            Box(modifier = Modifier.size(36.dp).clip(RoundedCornerShape(10.dp)).background(mod.accent.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                Icon(mod.icon, contentDescription = null, tint = mod.accent, modifier = Modifier.size(18.dp))
            }
            Spacer(Modifier.height(10.dp))
            Text(mod.title, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W700))
            Text(mod.subtitle, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
        }
    }
}

// ── Admin Users ────────────────────────────────────────────────────────────────
@Composable
fun AdminUsersScreen(onBack: () -> Unit) {
    val users = listOf(
        AdminUser("Sarah Johnson", "sarah@example.com", "customer", true),
        AdminUser("Mike Chen", "mike@example.com", "provider", true),
        AdminUser("Emma Davis", "emma@example.com", "provider", true),
        AdminUser("Bob Smith", "bob@example.com", "customer", false),
    )

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                Spacer(Modifier.width(8.dp))
                Column {
                    Text("Users", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                    Text("2,400 registered", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                }
            }
        }
        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(users) { user ->
                TxCard(modifier = Modifier.fillMaxWidth()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(40.dp).clip(CircleShape).background(DarkSurfaceHigh), contentAlignment = Alignment.Center) {
                            Text(user.name.first().uppercase(), style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W700))
                        }
                        Spacer(Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(user.name, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                            Text(user.email, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            TxBadge(user.role.replaceFirstChar { it.uppercase() }, color = DarkSurfaceHigh, textColor = DarkTextMuted)
                            Spacer(Modifier.height(3.dp))
                            TxBadge(if (user.active) "Active" else "Inactive", color = if (user.active) DarkSuccess.copy(alpha = 0.15f) else DarkError.copy(alpha = 0.15f), textColor = if (user.active) DarkSuccess else DarkError)
                        }
                    }
                }
            }
        }
    }
}

data class AdminUser(val name: String, val email: String, val role: String, val active: Boolean)

// ── Admin Analytics ────────────────────────────────────────────────────────────
@Composable
fun AdminAnalyticsScreen(onBack: () -> Unit) {
    LazyColumn(modifier = Modifier.fillMaxSize().background(DarkBg), contentPadding = PaddingValues(bottom = 24.dp)) {
        item {
            Surface(color = DarkSurface) {
                Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                    Spacer(Modifier.width(8.dp))
                    Text("Platform Analytics", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                }
            }
        }
        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    TxStatCard("2,400", "Total Users", modifier = Modifier.weight(1f))
                    TxStatCard("847", "Providers", modifier = Modifier.weight(1f))
                }
                Spacer(Modifier.height(10.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    TxStatCard("15K", "Bookings", modifier = Modifier.weight(1f))
                    TxStatCard("\$48K", "Revenue", modifier = Modifier.weight(1f), valueColor = DarkSuccess)
                }
                Spacer(Modifier.height(16.dp))
                TxSectionHeader("Top Categories")
                Spacer(Modifier.height(8.dp))
                listOf(
                    Triple("Cleaning", "\$12,400", 0.78f),
                    Triple("Plumbing", "\$9,200", 0.58f),
                    Triple("Electrical", "\$7,800", 0.49f),
                    Triple("Fitness", "\$5,100", 0.32f),
                    Triple("Moving", "\$4,600", 0.29f),
                ).forEach { (cat, rev, frac) ->
                    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(cat, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText), modifier = Modifier.width(90.dp))
                        Box(modifier = Modifier.weight(1f).height(6.dp).clip(RoundedCornerShape(3.dp)).background(DarkSurfaceHigh)) {
                            Box(modifier = Modifier.fillMaxHeight().fillMaxWidth(frac).clip(RoundedCornerShape(3.dp)).background(DarkSuccess))
                        }
                        Spacer(Modifier.width(12.dp))
                        Text(rev, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted), modifier = Modifier.width(56.dp))
                    }
                }
            }
        }
    }
}
