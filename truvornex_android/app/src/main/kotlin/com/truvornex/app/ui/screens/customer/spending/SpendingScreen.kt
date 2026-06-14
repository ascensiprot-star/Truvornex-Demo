package com.truvornex.app.ui.screens.customer.spending

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

@Composable
fun SpendingScreen() {
    val categories = listOf(
        Triple("Cleaning", "\$240", 0.38f),
        Triple("Plumbing", "\$180", 0.28f),
        Triple("Fitness", "\$120", 0.19f),
        Triple("Other", "\$93", 0.15f),
    )
    val transactions = listOf(
        Triple("Deep House Cleaning", "Sarah Johnson", "-\$85"),
        Triple("Pipe Repair", "Mike Chen", "-\$120"),
        Triple("Personal Training", "Emma Davis", "-\$60"),
        Triple("AC Maintenance", "James Wilson", "-\$95"),
        Triple("Massage Therapy", "Aisha Patel", "-\$70"),
    )

    LazyColumn(
        modifier = Modifier.fillMaxSize().background(DarkBg),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Spending Analytics", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                Text("Track your service spending", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted))
                Spacer(Modifier.height(16.dp))

                // Total card
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = DarkSurface,
                    shape = RoundedCornerShape(16.dp),
                    border = BorderStroke(1.dp, DarkBorder)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text("This Month", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                        Spacer(Modifier.height(4.dp))
                        Text("\$633", style = MaterialTheme.typography.displayLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700, fontSize = 48.sp))
                        Spacer(Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Rounded.TrendingDown, contentDescription = null, tint = DarkSuccess, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("12% less than last month", style = MaterialTheme.typography.bodySmall.copy(color = DarkSuccess))
                        }
                    }
                }
            }
        }

        item {
            // Stats row
            Row(
                modifier = Modifier.padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                TxStatCard("5", "Services", modifier = Modifier.weight(1f))
                TxStatCard("4.8★", "Avg Rating", modifier = Modifier.weight(1f))
                TxStatCard("\$127", "Avg Cost", modifier = Modifier.weight(1f))
            }
        }

        item {
            Column(modifier = Modifier.padding(16.dp)) {
                Spacer(Modifier.height(8.dp))
                TxSectionHeader("By Category")
                Spacer(Modifier.height(12.dp))
                categories.forEach { (name, amount, fraction) ->
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(name, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W500), modifier = Modifier.width(100.dp))
                        Box(modifier = Modifier.weight(1f).height(6.dp).clip(RoundedCornerShape(3.dp)).background(DarkSurfaceHigh)) {
                            Box(modifier = Modifier.fillMaxHeight().fillMaxWidth(fraction).clip(RoundedCornerShape(3.dp)).background(DarkPrimary))
                        }
                        Spacer(Modifier.width(12.dp))
                        Text(amount, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600), modifier = Modifier.width(48.dp))
                    }
                }
            }
        }

        item {
            Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                TxSectionHeader("Recent Transactions")
                Spacer(Modifier.height(8.dp))
            }
        }

        items(transactions) { (service, provider, amount) ->
            TxCard(modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp).fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier.size(38.dp).clip(RoundedCornerShape(10.dp)).background(DarkSurfaceHigh),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Rounded.Receipt, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(18.dp))
                    }
                    Spacer(Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(service, style = MaterialTheme.typography.bodyMedium.copy(color = DarkText, fontWeight = FontWeight.W600))
                        Text(provider, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                    Text(amount, style = MaterialTheme.typography.bodyMedium.copy(color = DarkError, fontWeight = FontWeight.W600))
                }
            }
        }
    }
}
