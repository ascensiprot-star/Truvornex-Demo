package com.truvornex.app.ui.screens.customer.services

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.lazy.grid.*
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
import com.truvornex.app.data.models.Provider
import com.truvornex.app.ui.components.*
import com.truvornex.app.ui.theme.*

@Composable
fun ServicesScreen(onNavigate: (String) -> Unit) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf<String?>(null) }

    val categories = listOf(
        "Cleaning" to Icons.Rounded.CleaningServices,
        "Plumbing" to Icons.Rounded.Plumbing,
        "Electrical" to Icons.Rounded.Bolt,
        "Moving" to Icons.Rounded.LocalShipping,
        "Beauty" to Icons.Rounded.FaceRetouchingNatural,
        "Personal Chef" to Icons.Rounded.Restaurant,
        "Fitness" to Icons.Rounded.FitnessCenter,
        "Tutoring" to Icons.Rounded.School,
        "Pet Care" to Icons.Rounded.Pets,
        "Photography" to Icons.Rounded.CameraAlt,
        "Tech Support" to Icons.Rounded.Computer,
        "Gardening" to Icons.Rounded.Yard,
    )

    val mockProviders = listOf(
        Provider("1", "u1", "Sarah Johnson", "Cleaning", 4.9, 127, true, priceFrom = 25.0, yearsExperience = 5),
        Provider("2", "u2", "Mike Chen", "Plumbing", 4.8, 89, true, priceFrom = 60.0, yearsExperience = 8),
        Provider("3", "u3", "Emma Davis", "Fitness", 4.9, 203, true, priceFrom = 40.0, yearsExperience = 3),
        Provider("4", "u4", "James Wilson", "Electrical", 4.7, 156, true, priceFrom = 55.0, yearsExperience = 10),
        Provider("5", "u5", "Aisha Patel", "Beauty", 5.0, 44, true, priceFrom = 35.0, yearsExperience = 4),
    )

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        // Search header
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Explore Services", style = MaterialTheme.typography.headlineLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Search services or providers...", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextSubtle)) },
                leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(18.dp)) },
                trailingIcon = if (searchQuery.isNotEmpty()) { { IconButton(onClick = { searchQuery = "" }) { Icon(Icons.Rounded.Close, contentDescription = null, tint = DarkTextMuted) } } } else null,
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedTextColor = DarkText,
                    unfocusedTextColor = DarkText,
                    focusedContainerColor = DarkSurface,
                    unfocusedContainerColor = DarkSurface,
                    focusedBorderColor = DarkBorderStrong,
                    unfocusedBorderColor = DarkBorder
                ),
                textStyle = MaterialTheme.typography.bodyMedium.copy(color = DarkText)
            )
        }

        LazyColumn(contentPadding = PaddingValues(bottom = 24.dp)) {
            item {
                // Category chips
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = selectedCategory == null,
                            onClick = { selectedCategory = null },
                            label = { Text("All") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = DarkPrimary,
                                selectedLabelColor = DarkOnPrimary,
                                containerColor = DarkSurface,
                                labelColor = DarkTextMuted
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true,
                                selected = selectedCategory == null,
                                borderColor = DarkBorder,
                                selectedBorderColor = DarkPrimary
                            )
                        )
                    }
                    items(categories) { (name, icon) ->
                        FilterChip(
                            selected = selectedCategory == name,
                            onClick = { selectedCategory = if (selectedCategory == name) null else name },
                            label = { Text(name) },
                            leadingIcon = { Icon(icon, contentDescription = null, modifier = Modifier.size(14.dp)) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = DarkPrimary,
                                selectedLabelColor = DarkOnPrimary,
                                selectedLeadingIconColor = DarkOnPrimary,
                                containerColor = DarkSurface,
                                labelColor = DarkTextMuted
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true,
                                selected = selectedCategory == name,
                                borderColor = DarkBorder,
                                selectedBorderColor = DarkPrimary
                            )
                        )
                    }
                }
                Spacer(Modifier.height(16.dp))
            }

            item {
                Column(modifier = Modifier.padding(horizontal = 16.dp)) {
                    TxSectionHeader("Top Providers", action = "View all on map", onAction = {})
                    Spacer(Modifier.height(8.dp))
                }
            }

            val filtered = if (selectedCategory != null)
                mockProviders.filter { it.category == selectedCategory }
            else
                mockProviders.filter {
                    searchQuery.isBlank() || it.name.contains(searchQuery, ignoreCase = true) || it.category.contains(searchQuery, ignoreCase = true)
                }

            items(filtered) { provider ->
                TxProviderCard(
                    name = provider.name,
                    category = provider.category,
                    rating = provider.rating,
                    reviewCount = provider.reviewCount,
                    isVerified = provider.isVerified,
                    priceFrom = provider.priceFrom,
                    onClick = {},
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp).fillMaxWidth()
                )
            }

            if (filtered.isEmpty()) {
                item {
                    TxEmptyState(
                        icon = Icons.Rounded.SearchOff,
                        title = "No providers found",
                        subtitle = "Try a different category or search term"
                    )
                }
            }
        }
    }
}
