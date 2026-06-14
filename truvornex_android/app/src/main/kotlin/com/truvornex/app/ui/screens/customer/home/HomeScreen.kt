package com.truvornex.app.ui.screens.customer.home

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.lazy.grid.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.data.repository.AuthRepository
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

data class CategoryItem(val icon: ImageVector, val label: String, val accent: Color = DarkSurfaceHigh)
data class EventItem(val title: String, val price: String, val venue: String, val isFree: Boolean)
data class NeighborhoodItem(val icon: ImageVector, val title: String, val subtitle: String, val accent: Color, val route: String)

@Composable
fun HomeScreen(onNavigate: (String) -> Unit) {
    val user by AuthRepository.currentUser.collectAsState()

    val categories = listOf(
        CategoryItem(Icons.Rounded.CleaningServices, "Cleaning", BrandBlue),
        CategoryItem(Icons.Rounded.Plumbing, "Plumbing", BrandAmber),
        CategoryItem(Icons.Rounded.Bolt, "Electrical", BrandWarning),
        CategoryItem(Icons.Rounded.LocalShipping, "Moving", BrandPurple),
        CategoryItem(Icons.Rounded.FaceRetouchingNatural, "Beauty", BrandRose),
        CategoryItem(Icons.Rounded.Restaurant, "Personal Chef", BrandEmerald),
        CategoryItem(Icons.Rounded.FitnessCenter, "Fitness", BrandRed),
        CategoryItem(Icons.Rounded.School, "Tutoring", BrandBlue),
        CategoryItem(Icons.Rounded.Pets, "Pet Care", BrandAmber),
        CategoryItem(Icons.Rounded.CameraAlt, "Photography", BrandPurple),
        CategoryItem(Icons.Rounded.Computer, "Tech Support", BrandEmerald),
        CategoryItem(Icons.Rounded.Yard, "Gardening", BrandEmerald),
    )

    val events = listOf(
        EventItem("Neighborhood Block Party", "Free", "Riverside Park", true),
        EventItem("Home Renovation Workshop", "\$15", "Community Hall", false),
        EventItem("Summer Food & Craft Market", "\$5", "Main Square", false),
    )

    val neighborhoodFeatures = listOf(
        NeighborhoodItem(Icons.Rounded.FlashOn, "Emergency", "Urgent help now", BrandRed, "emergency"),
        NeighborhoodItem(Icons.Rounded.Groups, "Group Buy", "Save together", BrandEmerald, "group_buy"),
        NeighborhoodItem(Icons.Rounded.SwapHoriz, "Skill Swap", "Trade skills", BrandPurple, "skill_swap"),
        NeighborhoodItem(Icons.Rounded.Gavel, "Community Jury", "Resolve disputes", BrandAmber, "jury"),
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // Header
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(listOf(Color(0xFF0F0F18), DarkBg))
                    )
                    .padding(24.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                "Good morning,",
                                style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted)
                            )
                            Text(
                                user?.fullName?.split(" ")?.firstOrNull() ?: "there",
                                style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700)
                            )
                        }
                        Row {
                            IconButton(onClick = { onNavigate("loyalty") }) {
                                Icon(Icons.Rounded.Stars, contentDescription = "Loyalty", tint = BrandAmber)
                            }
                            IconButton(onClick = {}) {
                                Icon(Icons.Rounded.Notifications, contentDescription = "Notifications", tint = DarkTextMuted)
                            }
                        }
                    }

                    Spacer(Modifier.height(20.dp))

                    // Search bar
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { },
                        color = DarkSurface,
                        shape = RoundedCornerShape(14.dp),
                        border = BorderStroke(1.dp, DarkBorder)
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Rounded.Search, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(10.dp))
                            Text("Search cleaning, plumbing, chef...", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextSubtle))
                            Spacer(Modifier.weight(1f))
                            Surface(color = DarkSurfaceHigh, shape = RoundedCornerShape(8.dp)) {
                                Text("⌘K", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted), modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp))
                            }
                        }
                    }

                    Spacer(Modifier.height(12.dp))

                    // Quick filters
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(listOf("Cleaning", "Plumbing", "Chef", "Moving", "Fitness")) { tag ->
                            Surface(
                                color = DarkSurface,
                                shape = RoundedCornerShape(100.dp),
                                border = BorderStroke(1.dp, DarkBorder)
                            ) {
                                Text(tag, style = MaterialTheme.typography.bodySmall.copy(color = DarkText), modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp))
                            }
                        }
                    }
                }
            }
        }

        // Stats row
        item {
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.padding(vertical = 8.dp)
            ) {
                items(listOf(
                    Pair("2,400+", "Verified Providers"),
                    Pair("98%", "Satisfaction Rate"),
                    Pair("15K+", "Jobs Completed"),
                    Pair("4.9★", "Avg Rating"),
                )) { (value, label) ->
                    TxStatCard(value = value, label = label, modifier = Modifier.width(130.dp))
                }
            }
        }

        // Categories
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                TxSectionHeader("Browse by Category", action = "See all", onAction = { onNavigate("services") })
                Spacer(Modifier.height(12.dp))
                LazyVerticalGrid(
                    columns = GridCells.Fixed(4),
                    modifier = Modifier.height(200.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    userScrollEnabled = false
                ) {
                    items(categories.take(8)) { cat ->
                        TxCategoryCard(
                            icon = cat.icon,
                            label = cat.label,
                            onClick = { onNavigate("services") },
                            accent = cat.accent
                        )
                    }
                }
            }
        }

        // Neighborhood OS
        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(BrandPurple.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Rounded.AccountTree, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(14.dp))
                    }
                    Spacer(Modifier.width(8.dp))
                    Text("Neighborhood OS", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary))
                }
                Spacer(Modifier.height(3.dp))
                Text("Hyperlocal community tools", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                Spacer(Modifier.height(12.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    neighborhoodFeatures.chunked(2).forEach { row ->
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            row.forEach { item ->
                                NeighborhoodCard(item = item, onClick = { onNavigate(item.route) }, modifier = Modifier.weight(1f))
                            }
                            if (row.size == 1) Spacer(Modifier.weight(1f))
                        }
                    }
                }
            }
        }

        // Events
        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                TxSectionHeader("Events Near You", action = "Browse all", onAction = { onNavigate("events") })
                Spacer(Modifier.height(12.dp))
            }
        }
        items(events) { event ->
            EventCard(event = event, modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp))
        }
    }
}

@Composable
private fun NeighborhoodCard(item: NeighborhoodItem, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Surface(
        modifier = modifier.clickable(onClick = onClick).height(64.dp),
        color = item.accent.copy(alpha = 0.08f),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, item.accent.copy(alpha = 0.2f))
    ) {
        Row(modifier = Modifier.padding(10.dp), verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(32.dp).clip(RoundedCornerShape(8.dp)).background(item.accent.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(item.icon, contentDescription = null, tint = item.accent, modifier = Modifier.size(16.dp))
            }
            Spacer(Modifier.width(8.dp))
            Column {
                Text(item.title, style = MaterialTheme.typography.bodySmall.copy(color = DarkText, fontWeight = FontWeight.W600))
                Text(item.subtitle, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted, fontSize = 10.sp))
            }
        }
    }
}

val BrandWarning = Color(0xFFF59E0B)

@Composable
private fun EventCard(event: EventItem, modifier: Modifier = Modifier) {
    TxCard(modifier = modifier.fillMaxWidth()) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier.size(40.dp).clip(RoundedCornerShape(10.dp)).background(DarkSurfaceHigh),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Rounded.Event, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(18.dp))
            }
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(event.title, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600), maxLines = 1)
                Text(event.venue, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
            }
            TxBadge(
                text = event.price,
                color = if (event.isFree) DarkSuccess.copy(alpha = 0.15f) else DarkInfo.copy(alpha = 0.15f),
                textColor = if (event.isFree) DarkSuccess else DarkInfo
            )
        }
    }
}
