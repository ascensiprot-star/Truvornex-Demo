package com.truvornex.app.ui.screens.provider

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

// ── Provider Dashboard ────────────────────────────────────────────────────────
@Composable
fun ProviderDashboardScreen() {
    val bookings = listOf(
        BookingItem("Deep Clean - 3BR", "Sarah M.", "Today 2:00 PM", "pending"),
        BookingItem("Office Cleaning", "Tech Corp", "Tomorrow 9:00 AM", "confirmed"),
        BookingItem("Move-in Cleaning", "John D.", "Jun 18", "confirmed"),
    )

    LazyColumn(modifier = Modifier.fillMaxSize().background(DarkBg), contentPadding = PaddingValues(bottom = 24.dp)) {
        item {
            Box(modifier = Modifier.fillMaxWidth().background(Brush.verticalGradient(listOf(Color(0xFF0F0F18), DarkBg))).padding(24.dp)) {
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Column {
                            Text("Provider Dashboard", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
                            Text("Welcome back!", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Rounded.Circle, contentDescription = null, tint = DarkSuccess, modifier = Modifier.size(8.dp))
                            Spacer(Modifier.width(5.dp))
                            Text("Online", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        }
                    }
                }
            }
        }

        item {
            Row(modifier = Modifier.padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                TxStatCard("\$3,240", "This Month", modifier = Modifier.weight(1f), valueColor = DarkSuccess)
                TxStatCard("4.9★", "Rating", modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(8.dp))
            Row(modifier = Modifier.padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                TxStatCard("28", "Jobs Done", modifier = Modifier.weight(1f))
                TxStatCard("95%", "Completion", modifier = Modifier.weight(1f))
            }
        }

        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Spacer(Modifier.height(8.dp))
                TxSectionHeader("Upcoming Bookings")
                Spacer(Modifier.height(8.dp))
            }
        }

        items(bookings) { booking ->
            TxCard(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp).fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(booking.service, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                        Text(booking.customer, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        Text(booking.time, style = MaterialTheme.typography.bodySmall.copy(color = DarkInfo))
                    }
                    TxBadge(
                        booking.status.replaceFirstChar { it.uppercase() },
                        color = if (booking.status == "confirmed") DarkSuccess.copy(alpha = 0.15f) else BrandAmber.copy(alpha = 0.15f),
                        textColor = if (booking.status == "confirmed") DarkSuccess else BrandAmber
                    )
                }
            }
        }

        item {
            Spacer(Modifier.height(16.dp))
            Row(modifier = Modifier.padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Surface(modifier = Modifier.weight(1f).clickable {}, color = DarkSurface, shape = RoundedCornerShape(12.dp), border = BorderStroke(1.dp, DarkBorder)) {
                    Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Rounded.CalendarToday, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(22.dp))
                        Spacer(Modifier.height(6.dp))
                        Text("Availability", style = MaterialTheme.typography.bodySmall.copy(color = DarkText, fontWeight = FontWeight.W600))
                    }
                }
                Surface(modifier = Modifier.weight(1f).clickable {}, color = DarkSurface, shape = RoundedCornerShape(12.dp), border = BorderStroke(1.dp, DarkBorder)) {
                    Column(modifier = Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Rounded.AutoAwesome, contentDescription = null, tint = BrandAmber, modifier = Modifier.size(22.dp))
                        Spacer(Modifier.height(6.dp))
                        Text("AI Copilot", style = MaterialTheme.typography.bodySmall.copy(color = DarkText, fontWeight = FontWeight.W600))
                    }
                }
            }
        }
    }
}

data class BookingItem(val service: String, val customer: String, val time: String, val status: String)

// ── Provider Bookings ─────────────────────────────────────────────────────────
@Composable
fun ProviderBookingsScreen() {
    var activeTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Upcoming", "Completed", "Cancelled")
    val all = listOf(
        BookingItem("Deep Cleaning", "Sarah M.", "Today 2:00 PM", "pending"),
        BookingItem("Office Cleaning", "Tech Corp", "Jun 18 9:00 AM", "confirmed"),
        BookingItem("Apartment Clean", "John D.", "Jun 15", "completed"),
        BookingItem("Studio Cleaning", "Maya P.", "Jun 10", "completed"),
        BookingItem("Cancelled Job", "Bob K.", "Jun 8", "cancelled"),
    )

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Column(modifier = Modifier.background(DarkSurface)) {
            Text("Bookings", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700), modifier = Modifier.padding(start = 16.dp, top = 20.dp, end = 16.dp, bottom = 0.dp))
            ScrollableTabRow(selectedTabIndex = activeTab, containerColor = DarkSurface, contentColor = DarkPrimary, edgePadding = 16.dp, divider = {}) {
                tabs.forEachIndexed { i, t -> Tab(selected = activeTab == i, onClick = { activeTab = i }, text = { Text(t) }) }
            }
        }
        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            val filtered = when (activeTab) {
                0 -> all.filter { it.status in listOf("pending", "confirmed") }
                1 -> all.filter { it.status == "completed" }
                else -> all.filter { it.status == "cancelled" }
            }
            items(filtered) { b ->
                TxCard(modifier = Modifier.fillMaxWidth()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(b.service, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                            Text(b.customer, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                            Text(b.time, style = MaterialTheme.typography.bodySmall.copy(color = DarkInfo))
                        }
                        TxBadge(
                            b.status.replaceFirstChar { it.uppercase() },
                            color = when (b.status) {
                                "confirmed" -> DarkSuccess.copy(alpha = 0.15f)
                                "completed" -> DarkInfo.copy(alpha = 0.15f)
                                "cancelled" -> DarkError.copy(alpha = 0.15f)
                                else -> BrandAmber.copy(alpha = 0.15f)
                            },
                            textColor = when (b.status) {
                                "confirmed" -> DarkSuccess
                                "completed" -> DarkInfo
                                "cancelled" -> DarkError
                                else -> BrandAmber
                            }
                        )
                    }
                }
            }
        }
    }
}

// ── Provider Services ─────────────────────────────────────────────────────────
@Composable
fun ProviderServicesScreen() {
    val services = remember {
        mutableStateListOf(
            ServiceItem("Deep House Cleaning", "\$85/hr", true),
            ServiceItem("Office Cleaning", "\$70/hr", true),
            ServiceItem("Post-Renovation Clean", "\$120 flat", false),
        )
    }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Column(modifier = Modifier.background(DarkSurface).padding(16.dp)) {
            Text("My Services", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
            Text("Manage your service listings", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
        }
        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(services) { svc ->
                TxCard(modifier = Modifier.fillMaxWidth()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(svc.name, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                            Text(svc.price, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        }
                        Switch(checked = svc.isActive, onCheckedChange = { svc.isActive = it }, colors = SwitchDefaults.colors(checkedThumbColor = DarkOnPrimary, checkedTrackColor = DarkSuccess))
                    }
                }
            }
            item {
                Spacer(Modifier.height(8.dp))
                TxButton(label = "Add New Service", onClick = {}, trailingIcon = Icons.Rounded.Add)
            }
        }
    }
}

data class ServiceItem(val name: String, val price: String, var isActive: Boolean)

// ── Provider Earnings ─────────────────────────────────────────────────────────
@Composable
fun ProviderEarningsScreen() {
    LazyColumn(modifier = Modifier.fillMaxSize().background(DarkBg), contentPadding = PaddingValues(bottom = 24.dp)) {
        item {
            Column(modifier = Modifier.background(DarkSurface).padding(16.dp)) {
                Text("Earnings", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                Text("Your financial overview", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
            }
        }
        item {
            Surface(modifier = Modifier.fillMaxWidth().padding(16.dp), color = DarkSurface, shape = RoundedCornerShape(16.dp), border = BorderStroke(1.dp, DarkBorder)) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Total Earned", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    Spacer(Modifier.height(4.dp))
                    Text("\$3,240", style = MaterialTheme.typography.displayMedium.copy(color = DarkSuccess, fontWeight = FontWeight.W800))
                    Spacer(Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.TrendingUp, contentDescription = null, tint = DarkSuccess, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("+18% from last month", style = MaterialTheme.typography.bodySmall.copy(color = DarkSuccess))
                    }
                }
            }
        }
        item {
            Row(modifier = Modifier.padding(horizontal = 16.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                TxStatCard("28", "Jobs", modifier = Modifier.weight(1f))
                TxStatCard("\$116", "Avg Job", modifier = Modifier.weight(1f))
                TxStatCard("0%", "Platform Fee", modifier = Modifier.weight(1f))
            }
        }
        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Spacer(Modifier.height(8.dp))
                TxSectionHeader("Recent Payouts")
                Spacer(Modifier.height(8.dp))
            }
        }
        items(listOf(
            Triple("Deep Cleaning · Sarah M.", "Jun 14", "+\$85"),
            Triple("Office Clean · Tech Corp", "Jun 12", "+\$140"),
            Triple("Apartment · John D.", "Jun 10", "+\$95"),
            Triple("Studio · Maya P.", "Jun 8", "+\$75"),
        )) { (desc, date, amount) ->
            TxCard(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp).fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(desc, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W500))
                        Text(date, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                    Text(amount, style = MaterialTheme.typography.bodyMedium.copy(color = DarkSuccess, fontWeight = FontWeight.W700))
                }
            }
        }
        item {
            Spacer(Modifier.height(16.dp))
            TxButton(label = "Request Payout", onClick = {}, modifier = Modifier.padding(horizontal = 16.dp), trailingIcon = Icons.Rounded.AccountBalanceWallet)
        }
    }
}
