package com.truvornex.app.ui.screens.customer.neighborhood

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
import androidx.compose.ui.unit.sp
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

// ── Neighborhood Dashboard ────────────────────────────────────────────────────
@Composable
fun NeighborhoodDashboardScreen(onNavigate: (String) -> Unit) {
    val features = listOf(
        NeighborhoodFeature(Icons.Rounded.FlashOn, "Emergency", "Get urgent help now", BrandRed, "emergency"),
        NeighborhoodFeature(Icons.Rounded.Groups, "Group Buy", "Save with neighbors", BrandEmerald, "group_buy"),
        NeighborhoodFeature(Icons.Rounded.SwapHoriz, "Skill Swap", "Trade skills & time", BrandPurple, "skill_swap"),
        NeighborhoodFeature(Icons.Rounded.Gavel, "Community Jury", "Fair dispute resolution", BrandAmber, "jury"),
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentPadding = PaddingValues(24.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(36.dp).clip(RoundedCornerShape(10.dp)).background(BrandPurple.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                    Icon(Icons.Rounded.AccountTree, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(18.dp))
                }
                Spacer(Modifier.width(10.dp))
                Column {
                    Text("Neighborhood OS", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                    Text("Hyperlocal community tools", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                }
            }
            Spacer(Modifier.height(4.dp))
        }

        items(features) { feature ->
            Surface(
                modifier = Modifier.fillMaxWidth().clickable { onNavigate(feature.route) },
                color = DarkSurface,
                shape = RoundedCornerShape(16.dp),
                border = BorderStroke(1.dp, DarkBorder)
            ) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier.size(48.dp).clip(RoundedCornerShape(14.dp)).background(feature.accent.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(feature.icon, contentDescription = null, tint = feature.accent, modifier = Modifier.size(24.dp))
                    }
                    Spacer(Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(feature.title, style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary))
                        Text(feature.subtitle, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                    Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = DarkTextSubtle)
                }
            }
        }

        item {
            Spacer(Modifier.height(8.dp))
            TxSectionHeader("Community Activity")
            Spacer(Modifier.height(8.dp))
            listOf(
                Triple(Icons.Rounded.FlashOn, "Emergency resolved", "Water leak fixed in 23 min"),
                Triple(Icons.Rounded.Groups, "Group buy locked", "10 neighbors joined for AC service"),
                Triple(Icons.Rounded.SwapHoriz, "Skill swap matched", "Tutoring ↔ Graphic design"),
            ).forEach { (icon, title, sub) ->
                Row(modifier = Modifier.padding(vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(32.dp).clip(CircleShape).background(DarkSurfaceHigh), contentAlignment = Alignment.Center) {
                        Icon(icon, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(16.dp))
                    }
                    Spacer(Modifier.width(10.dp))
                    Column {
                        Text(title, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                        Text(sub, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                }
            }
        }
    }
}

data class NeighborhoodFeature(
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val title: String,
    val subtitle: String,
    val accent: Color,
    val route: String
)

// ── Emergency Request ─────────────────────────────────────────────────────────
@Composable
fun EmergencyRequestScreen(onBack: () -> Unit) {
    var category by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var urgency by remember { mutableStateOf("immediate") }
    var submitted by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface, tonalElevation = 0.dp) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                Spacer(Modifier.width(8.dp))
                Column {
                    Text("Emergency Request", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                    Text("Get urgent help within minutes", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                }
            }
        }

        if (submitted) {
            Column(modifier = Modifier.fillMaxSize().padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
                Box(modifier = Modifier.size(72.dp).clip(CircleShape).background(DarkSuccess.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                    Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = DarkSuccess, modifier = Modifier.size(36.dp))
                }
                Spacer(Modifier.height(16.dp))
                Text("Request Sent!", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                Spacer(Modifier.height(8.dp))
                Text("Matching you with nearby providers...", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                Spacer(Modifier.height(24.dp))
                TxButton(label = "Back to Home", onClick = onBack)
            }
        } else {
            Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp)) {
                // Urgency
                Text("URGENCY LEVEL", style = MaterialTheme.typography.labelSmall.copy(color = DarkTextSubtle))
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("immediate" to "Immediate", "urgent" to "Urgent", "today" to "Today").forEach { (key, label) ->
                        val sel = urgency == key
                        Surface(
                            modifier = Modifier.weight(1f).clickable { urgency = key },
                            color = if (sel) BrandRed.copy(alpha = 0.15f) else DarkSurface,
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, if (sel) BrandRed.copy(alpha = 0.4f) else DarkBorder)
                        ) {
                            Text(label, style = MaterialTheme.typography.bodySmall.copy(color = if (sel) BrandRed else DarkText, fontWeight = FontWeight.W600), modifier = Modifier.padding(10.dp), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                        }
                    }
                }
                Spacer(Modifier.height(16.dp))

                TxTextField(label = "Service Category", value = category, onValueChange = { category = it }, hint = "e.g. Plumbing, Electrical", leadingIcon = Icons.Rounded.Category)
                Spacer(Modifier.height(12.dp))

                Text("Description", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted, fontWeight = FontWeight.W500))
                Spacer(Modifier.height(6.dp))
                OutlinedTextField(
                    value = description, onValueChange = { description = it },
                    modifier = Modifier.fillMaxWidth().height(120.dp),
                    placeholder = { Text("Describe your emergency...", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextSubtle)) },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(focusedTextColor = DarkText, unfocusedTextColor = DarkText, focusedContainerColor = DarkSurface, unfocusedContainerColor = DarkSurface, focusedBorderColor = DarkBorderStrong, unfocusedBorderColor = DarkBorder),
                    textStyle = MaterialTheme.typography.bodyMedium.copy(color = DarkText)
                )
                Spacer(Modifier.height(24.dp))
                TxButton(
                    label = "Submit Emergency Request",
                    onClick = { if (category.isNotBlank() && description.isNotBlank()) submitted = true },
                    trailingIcon = Icons.Rounded.Send
                )
            }
        }
    }
}

// ── Group Buy ────────────────────────────────────────────────────────────────
@Composable
fun GroupBuyScreen(onBack: () -> Unit) {
    val groupBuys = listOf(
        GroupBuy("AC Servicing", "10/10 joined", "20% off", true, BrandEmerald),
        GroupBuy("Deep Cleaning", "7/10 joined", "15% off", false, BrandBlue),
        GroupBuy("Pest Control", "4/10 joined", "25% off", false, BrandAmber),
    )

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                Spacer(Modifier.width(8.dp))
                Text("Group Buys", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
            }
        }

        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            item {
                Surface(color = BrandEmerald.copy(alpha = 0.1f), shape = RoundedCornerShape(12.dp), border = BorderStroke(1.dp, BrandEmerald.copy(alpha = 0.25f))) {
                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Info, contentDescription = null, tint = BrandEmerald, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(10.dp))
                        Text("Join a group to unlock discounts for your neighborhood!", style = MaterialTheme.typography.bodySmall.copy(color = DarkText))
                    }
                }
            }
            items(groupBuys) { gb ->
                GroupBuyCard(gb)
            }
            item {
                Spacer(Modifier.height(8.dp))
                TxButton(label = "Start a Group Buy", onClick = {}, trailingIcon = Icons.Rounded.Add)
            }
        }
    }
}

data class GroupBuy(val service: String, val participants: String, val discount: String, val locked: Boolean, val accent: Color)

@Composable
private fun GroupBuyCard(gb: GroupBuy) {
    TxCard(modifier = Modifier.fillMaxWidth()) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text(gb.service, style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary))
                Text(gb.participants, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
            }
            Column(horizontalAlignment = Alignment.End) {
                TxBadge(gb.discount, color = gb.accent.copy(alpha = 0.15f), textColor = gb.accent)
                Spacer(Modifier.height(4.dp))
                if (gb.locked) {
                    TxBadge("Locked", color = DarkSurfaceHigh, textColor = DarkTextMuted)
                } else {
                    Surface(color = DarkPrimary, shape = RoundedCornerShape(8.dp), modifier = Modifier.clickable {}) {
                        Text("Join", style = MaterialTheme.typography.bodySmall.copy(color = DarkOnPrimary, fontWeight = FontWeight.W700), modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp))
                    }
                }
            }
        }
    }
}

// ── Skill Swap ───────────────────────────────────────────────────────────────
@Composable
fun SkillSwapScreen(onBack: () -> Unit) {
    val swaps = listOf(
        SkillSwapItem("English Tutoring", "Graphic Design", "Alex M.", 2),
        SkillSwapItem("Web Development", "Home Cooking", "Sara K.", 3),
        SkillSwapItem("Photography", "Guitar Lessons", "Chris P.", 1),
    )

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                Spacer(Modifier.width(8.dp))
                Column {
                    Text("Skill Swap", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                    Text("Trade skills with neighbors", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                }
            }
        }

        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(swaps) { swap ->
                TxCard(modifier = Modifier.fillMaxWidth()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Offering:", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted, fontSize = 10.sp))
                            Text(swap.offering, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                        }
                        Icon(Icons.Rounded.SwapHoriz, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(22.dp))
                        Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.End) {
                            Text("Seeking:", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted, fontSize = 10.sp))
                            Text(swap.seeking, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                    HorizontalDivider(color = DarkBorder)
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Person, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        Text(swap.offerer, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        Spacer(Modifier.weight(1f))
                        TxBadge("${swap.credits} credits", color = BrandPurple.copy(alpha = 0.15f), textColor = BrandPurple)
                        Spacer(Modifier.width(8.dp))
                        Surface(color = DarkPrimary, shape = RoundedCornerShape(8.dp), modifier = Modifier.clickable {}) {
                            Text("Match", style = MaterialTheme.typography.bodySmall.copy(color = DarkOnPrimary, fontWeight = FontWeight.W700), modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp))
                        }
                    }
                }
            }
            item {
                Spacer(Modifier.height(8.dp))
                TxButton(label = "Post a Skill Swap", onClick = {}, trailingIcon = Icons.Rounded.Add)
            }
        }
    }
}

data class SkillSwapItem(val offering: String, val seeking: String, val offerer: String, val credits: Int)

// ── Jury Screen ───────────────────────────────────────────────────────────────
@Composable
fun JuryScreen(onBack: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        Surface(color = DarkSurface) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onBack) { Icon(Icons.Rounded.ArrowBack, contentDescription = null, tint = DarkPrimary) }
                Spacer(Modifier.width(8.dp))
                Column {
                    Text("Community Jury", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                    Text("Fair peer-to-peer dispute resolution", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                }
            }
        }

        LazyColumn(contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            item {
                Surface(color = BrandAmber.copy(alpha = 0.08f), shape = RoundedCornerShape(12.dp), border = BorderStroke(1.dp, BrandAmber.copy(alpha = 0.2f))) {
                    Row(modifier = Modifier.padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Gavel, contentDescription = null, tint = BrandAmber, modifier = Modifier.size(22.dp))
                        Spacer(Modifier.width(12.dp))
                        Column {
                            Text("Earn 1 time credit per vote", style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                            Text("Help your community resolve disputes fairly", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        }
                    }
                }
            }
            items(listOf(
                DisputeItem("Case #1042", "Service not completed", "Cleaning", "voting"),
                DisputeItem("Case #1039", "Provider was late", "Plumbing", "open"),
                DisputeItem("Case #1031", "Wrong service provided", "Electrical", "resolved"),
            )) { dispute ->
                TxCard(modifier = Modifier.fillMaxWidth()) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(dispute.id, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                            Text(dispute.description, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                            Text(dispute.category, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        }
                        TxBadge(
                            dispute.status.replaceFirstChar { it.uppercase() },
                            color = when (dispute.status) {
                                "voting" -> BrandAmber.copy(alpha = 0.15f)
                                "resolved" -> DarkSuccess.copy(alpha = 0.15f)
                                else -> DarkSurfaceHigh
                            },
                            textColor = when (dispute.status) {
                                "voting" -> BrandAmber
                                "resolved" -> DarkSuccess
                                else -> DarkTextMuted
                            }
                        )
                    }
                    if (dispute.status == "voting") {
                        Spacer(Modifier.height(12.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Surface(modifier = Modifier.weight(1f).clickable {}, color = DarkSuccess.copy(alpha = 0.12f), shape = RoundedCornerShape(8.dp), border = BorderStroke(1.dp, DarkSuccess.copy(alpha = 0.25f))) {
                                Text("For", style = MaterialTheme.typography.bodySmall.copy(color = DarkSuccess, fontWeight = FontWeight.W700), modifier = Modifier.padding(10.dp), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                            }
                            Surface(modifier = Modifier.weight(1f).clickable {}, color = DarkError.copy(alpha = 0.12f), shape = RoundedCornerShape(8.dp), border = BorderStroke(1.dp, DarkError.copy(alpha = 0.25f))) {
                                Text("Against", style = MaterialTheme.typography.bodySmall.copy(color = DarkError, fontWeight = FontWeight.W700), modifier = Modifier.padding(10.dp), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
                            }
                        }
                    }
                }
            }
        }
    }
}

data class DisputeItem(val id: String, val description: String, val category: String, val status: String)
