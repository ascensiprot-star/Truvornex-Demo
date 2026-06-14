package com.truvornex.app.ui.screens.customer.misc

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

// ── Events Screen ────────────────────────────────────────────────────────────
@Composable
fun EventsScreen(onBack: () -> Unit) {
    val events = listOf(
        EventData("Neighborhood Block Party", "Free", "Riverside Park", "Jun 20", "200 attending"),
        EventData("Home Renovation Workshop", "\$15", "Community Hall", "Jun 22", "48 attending"),
        EventData("Summer Food & Craft Market", "\$5", "Main Square", "Jun 25", "130 attending"),
        EventData("Tech for Seniors Day", "Free", "Public Library", "Jul 1", "32 attending"),
        EventData("Yoga in the Park", "Free", "Central Park", "Jul 3", "75 attending"),
    )

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                Spacer(Modifier.width(8.dp))
                Text("Events Near You", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
            }
        }

        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(events) { event ->
                TxCard(modifier = Modifier.fillMaxWidth()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(48.dp).clip(RoundedCornerShape(12.dp)).background(BrandPurple.copy(alpha = 0.12f)), contentAlignment = Alignment.Center) {
                            Icon(Icons.Rounded.Event, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(22.dp))
                        }
                        Spacer(Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(event.title, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                            Text(event.venue, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                            Text("${event.date} · ${event.attending}", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle))
                        }
                        TxBadge(event.price, color = if (event.price == "Free") DarkSuccess.copy(alpha = 0.15f) else DarkInfo.copy(alpha = 0.15f), textColor = if (event.price == "Free") DarkSuccess else DarkInfo)
                    }
                }
            }
        }
    }
}

data class EventData(val title: String, val price: String, val venue: String, val date: String, val attending: String)

// ── Community Screen ─────────────────────────────────────────────────────────
@Composable
fun CommunityScreen(onBack: () -> Unit) {
    var activeTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Feed", "Jobs", "Events", "Polls")

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface) {
            Column {
                Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                    Spacer(Modifier.width(8.dp))
                    Text("Community", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                }
                ScrollableTabRow(selectedTabIndex = activeTab, containerColor = DarkSurface, contentColor = DarkPrimary, edgePadding = 16.dp, divider = {}) {
                    tabs.forEachIndexed { i, t ->
                        Tab(selected = activeTab == i, onClick = { activeTab = i }, text = { Text(t, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = if (activeTab == i) FontWeight.W700 else FontWeight.W400)) })
                    }
                }
            }
        }

        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            when (activeTab) {
                0 -> {
                    items(listOf(
                        FeedPost("Maria L.", "Anyone know a good plumber? My kitchen sink is leaking.", "2h ago", 12),
                        FeedPost("James W.", "Shoutout to Sarah's Cleaning — absolutely amazing service!", "4h ago", 28),
                        FeedPost("Ahmed K.", "Group buy for AC servicing now open — join before Friday!", "6h ago", 15),
                    )) { post ->
                        TxCard(modifier = Modifier.fillMaxWidth()) {
                            Row(verticalAlignment = Alignment.Top) {
                                Box(modifier = Modifier.size(36.dp).clip(CircleShape).background(DarkSurfaceHigh), contentAlignment = Alignment.Center) {
                                    Text(post.author.first().uppercase(), style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W700))
                                }
                                Spacer(Modifier.width(10.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Row {
                                        Text(post.author, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                                        Spacer(Modifier.weight(1f))
                                        Text(post.time, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle))
                                    }
                                    Spacer(Modifier.height(4.dp))
                                    Text(post.content, style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
                                    Spacer(Modifier.height(8.dp))
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Rounded.ThumbUp, contentDescription = null, tint = DarkTextSubtle, modifier = Modifier.size(14.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("${post.likes}", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle))
                                        Spacer(Modifier.width(16.dp))
                                        Icon(Icons.Rounded.Comment, contentDescription = null, tint = DarkTextSubtle, modifier = Modifier.size(14.dp))
                                        Spacer(Modifier.width(4.dp))
                                        Text("Reply", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle))
                                    }
                                }
                            }
                        }
                    }
                }
                else -> {
                    item {
                        TxEmptyState(Icons.Rounded.Explore, "Coming soon", "This tab is under development", modifier = Modifier.padding(top = 40.dp))
                    }
                }
            }
        }
    }
}

data class FeedPost(val author: String, val content: String, val time: String, val likes: Int)

// ── Loyalty Screen ───────────────────────────────────────────────────────────
@Composable
fun LoyaltyScreen(onBack: () -> Unit) {
    val transactions = listOf(
        Pair("Booking completed", "+50"),
        Pair("Referral bonus", "+100"),
        Pair("First review", "+25"),
        Pair("Redeemed for discount", "-75"),
    )

    LazyColumn(modifier = Modifier.fillMaxSize().background(DarkBg), contentPadding = PaddingValues(bottom = 24.dp)) {
        item {
            Surface(color = DarkSurface) {
                Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                    Spacer(Modifier.width(8.dp))
                    Text("Loyalty Rewards", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                }
            }
        }
        item {
            Box(modifier = Modifier.fillMaxWidth().background(color = Color(0xFF0F0F18)).padding(24.dp)) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                    Icon(Icons.Rounded.Stars, contentDescription = null, tint = BrandAmber, modifier = Modifier.size(36.dp))
                    Spacer(Modifier.height(8.dp))
                    Text("350", style = MaterialTheme.typography.displayLarge.copy(color = BrandAmber, fontWeight = FontWeight.W800))
                    Text("Loyalty Points", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
                    Spacer(Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        TxBadge("Silver Tier", color = DarkSurfaceHigh, textColor = DarkAccent2)
                        TxBadge("150 pts to Gold", color = BrandAmber.copy(alpha = 0.15f), textColor = BrandAmber)
                    }
                }
            }
        }
        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Spacer(Modifier.height(8.dp))
                TxSectionHeader("Point History")
                Spacer(Modifier.height(8.dp))
            }
        }
        items(transactions) { (label, amount) ->
            TxCard(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp).fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(36.dp).clip(CircleShape).background(if (amount.startsWith("+")) DarkSuccess.copy(alpha = 0.12f) else DarkError.copy(alpha = 0.12f)), contentAlignment = Alignment.Center) {
                        Icon(if (amount.startsWith("+")) Icons.Rounded.Add else Icons.Rounded.Remove, contentDescription = null, tint = if (amount.startsWith("+")) DarkSuccess else DarkError, modifier = Modifier.size(16.dp))
                    }
                    Spacer(Modifier.width(12.dp))
                    Text(label, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText), modifier = Modifier.weight(1f))
                    Text(amount, style = MaterialTheme.typography.bodyMedium.copy(color = if (amount.startsWith("+")) DarkSuccess else DarkError, fontWeight = FontWeight.W700))
                }
            }
        }
        item {
            Spacer(Modifier.height(16.dp))
            TxButton(label = "Redeem Points", onClick = {}, modifier = Modifier.padding(horizontal = 16.dp), trailingIcon = Icons.Rounded.Redeem)
        }
    }
}
