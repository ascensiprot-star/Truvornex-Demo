package com.truvornex.app.ui.navigation

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.ui.theme.*

data class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector,
    val activeIcon: ImageVector
)

val customerNavItems = listOf(
    BottomNavItem(NavRoutes.HOME, "Home", Icons.Outlined.Home, Icons.Rounded.Home),
    BottomNavItem(NavRoutes.SERVICES, "Explore", Icons.Outlined.Explore, Icons.Rounded.Explore),
    BottomNavItem(NavRoutes.AI, "Simon", Icons.Outlined.AutoAwesome, Icons.Rounded.AutoAwesome),
    BottomNavItem(NavRoutes.SPENDING, "Spending", Icons.Outlined.BarChart, Icons.Rounded.BarChart),
    BottomNavItem(NavRoutes.PROFILE, "Profile", Icons.Outlined.Person, Icons.Rounded.Person),
)

val providerNavItems = listOf(
    BottomNavItem(NavRoutes.PROVIDER_DASHBOARD, "Dashboard", Icons.Outlined.Dashboard, Icons.Rounded.Dashboard),
    BottomNavItem(NavRoutes.PROVIDER_BOOKINGS, "Bookings", Icons.Outlined.CalendarToday, Icons.Rounded.CalendarToday),
    BottomNavItem(NavRoutes.PROVIDER_SERVICES, "Services", Icons.Outlined.Storefront, Icons.Rounded.Storefront),
    BottomNavItem(NavRoutes.PROVIDER_EARNINGS, "Earnings", Icons.Outlined.AccountBalanceWallet, Icons.Rounded.AccountBalanceWallet),
    BottomNavItem(NavRoutes.PROFILE, "Profile", Icons.Outlined.Person, Icons.Rounded.Person),
)

@Composable
fun TxBottomNavBar(
    items: List<BottomNavItem>,
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    Surface(
        color = DarkSurface,
        tonalElevation = 0.dp,
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        NavigationBar(
            containerColor = DarkSurface,
            contentColor = DarkText,
            modifier = Modifier.height(64.dp)
        ) {
            items.forEach { item ->
                val isSelected = currentRoute == item.route
                NavigationBarItem(
                    selected = isSelected,
                    onClick = { onNavigate(item.route) },
                    icon = {
                        Icon(
                            if (isSelected) item.activeIcon else item.icon,
                            contentDescription = item.label,
                            modifier = Modifier.size(22.dp)
                        )
                    },
                    label = {
                        Text(
                            item.label,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 10.sp,
                                fontWeight = if (isSelected) FontWeight.W700 else FontWeight.W500
                            )
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = DarkPrimary,
                        selectedTextColor = DarkPrimary,
                        unselectedIconColor = DarkTextSubtle,
                        unselectedTextColor = DarkTextSubtle,
                        indicatorColor = DarkSurfaceHigh
                    )
                )
            }
        }
    }
}
