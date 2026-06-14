package com.truvornex.app.ui.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.truvornex.app.ui.screens.admin.*
import com.truvornex.app.ui.screens.auth.*
import com.truvornex.app.ui.screens.customer.ai.AIAssistantScreen
import com.truvornex.app.ui.screens.customer.home.HomeScreen
import com.truvornex.app.ui.screens.customer.misc.*
import com.truvornex.app.ui.screens.customer.neighborhood.*
import com.truvornex.app.ui.screens.customer.profile.ProfileScreen
import com.truvornex.app.ui.screens.customer.services.ServicesScreen
import com.truvornex.app.ui.screens.customer.spending.SpendingScreen
import com.truvornex.app.ui.screens.provider.*
import com.truvornex.app.ui.screens.splash.SplashScreen
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Scaffold
import androidx.compose.ui.unit.dp

@Composable
fun TruvornexNavGraph() {
    val navController = rememberNavController()
    val currentBackStack by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackStack?.destination?.route

    // Determine user mode
    var userMode by remember { mutableStateOf<String?>(null) } // null = loading, "customer", "provider", "admin"

    // Routes that show customer bottom nav
    val customerBottomNavRoutes = setOf(
        NavRoutes.HOME, NavRoutes.SERVICES, NavRoutes.AI, NavRoutes.SPENDING, NavRoutes.PROFILE
    )
    // Routes that show provider bottom nav
    val providerBottomNavRoutes = setOf(
        NavRoutes.PROVIDER_DASHBOARD, NavRoutes.PROVIDER_BOOKINGS,
        NavRoutes.PROVIDER_SERVICES, NavRoutes.PROVIDER_EARNINGS, NavRoutes.PROFILE
    )

    val showCustomerNav = userMode == "customer" && currentRoute in customerBottomNavRoutes
    val showProviderNav = userMode == "provider" && currentRoute in providerBottomNavRoutes

    Scaffold(
        bottomBar = {
            when {
                showCustomerNav -> TxBottomNavBar(
                    items = customerNavItems,
                    currentRoute = currentRoute ?: NavRoutes.HOME,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
                showProviderNav -> TxBottomNavBar(
                    items = providerNavItems,
                    currentRoute = currentRoute ?: NavRoutes.PROVIDER_DASHBOARD,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = NavRoutes.SPLASH,
            modifier = Modifier.padding(
                bottom = if (showCustomerNav || showProviderNav) innerPadding.calculateBottomPadding() else 0.dp
            )
        ) {
            // ── Splash ─────────────────────────────────────────────────────────
            composable(NavRoutes.SPLASH) {
                SplashScreen(
                    onAuthenticated = {
                        userMode = "customer"
                        navController.navigate(NavRoutes.HOME) { popUpTo(NavRoutes.SPLASH) { inclusive = true } }
                    },
                    onUnauthenticated = {
                        navController.navigate(NavRoutes.LOGIN) { popUpTo(NavRoutes.SPLASH) { inclusive = true } }
                    }
                )
            }

            // ── Auth ───────────────────────────────────────────────────────────
            composable(NavRoutes.LOGIN) {
                LoginScreen(
                    onLoginSuccess = { role ->
                        userMode = if (role == "provider") "provider" else if (role == "admin") "admin" else "customer"
                        navController.navigate(NavRoutes.ONBOARDING) { popUpTo(NavRoutes.LOGIN) { inclusive = true } }
                    }
                )
            }
            composable(NavRoutes.ONBOARDING) {
                OnboardingScreen(
                    onCustomer = {
                        userMode = "customer"
                        navController.navigate(NavRoutes.HOME) { popUpTo(NavRoutes.ONBOARDING) { inclusive = true } }
                    },
                    onProvider = {
                        userMode = "provider"
                        navController.navigate(NavRoutes.PROVIDER_DASHBOARD) { popUpTo(NavRoutes.ONBOARDING) { inclusive = true } }
                    }
                )
            }

            // ── Customer ───────────────────────────────────────────────────────
            composable(NavRoutes.HOME) {
                HomeScreen(onNavigate = { route ->
                    navController.navigate(route)
                })
            }
            composable(NavRoutes.SERVICES) {
                ServicesScreen(onNavigate = { navController.navigate(it) })
            }
            composable(NavRoutes.AI) {
                AIAssistantScreen()
            }
            composable(NavRoutes.SPENDING) {
                SpendingScreen()
            }
            composable(NavRoutes.PROFILE) {
                ProfileScreen(onLogout = {
                    userMode = null
                    navController.navigate(NavRoutes.LOGIN) {
                        popUpTo(0) { inclusive = true }
                    }
                })
            }

            // ── Neighborhood OS ────────────────────────────────────────────────
            composable(NavRoutes.NEIGHBORHOOD) {
                NeighborhoodDashboardScreen(onNavigate = { navController.navigate(it) })
            }
            composable(NavRoutes.EMERGENCY) {
                EmergencyRequestScreen(onBack = { navController.popBackStack() })
            }
            composable(NavRoutes.GROUP_BUY) {
                GroupBuyScreen(onBack = { navController.popBackStack() })
            }
            composable(NavRoutes.SKILL_SWAP) {
                SkillSwapScreen(onBack = { navController.popBackStack() })
            }
            composable(NavRoutes.JURY) {
                JuryScreen(onBack = { navController.popBackStack() })
            }

            // ── Customer Extras ────────────────────────────────────────────────
            composable(NavRoutes.EVENTS) {
                EventsScreen(onBack = { navController.popBackStack() })
            }
            composable(NavRoutes.COMMUNITY) {
                CommunityScreen(onBack = { navController.popBackStack() })
            }
            composable(NavRoutes.LOYALTY) {
                LoyaltyScreen(onBack = { navController.popBackStack() })
            }

            // ── Provider ───────────────────────────────────────────────────────
            composable(NavRoutes.PROVIDER_DASHBOARD) {
                ProviderDashboardScreen()
            }
            composable(NavRoutes.PROVIDER_BOOKINGS) {
                ProviderBookingsScreen()
            }
            composable(NavRoutes.PROVIDER_SERVICES) {
                ProviderServicesScreen()
            }
            composable(NavRoutes.PROVIDER_EARNINGS) {
                ProviderEarningsScreen()
            }

            // ── Admin ──────────────────────────────────────────────────────────
            composable(NavRoutes.ADMIN_DASHBOARD) {
                AdminDashboardScreen(onNavigate = { navController.navigate(it) })
            }
            composable(NavRoutes.ADMIN_USERS) {
                AdminUsersScreen(onBack = { navController.popBackStack() })
            }
            composable(NavRoutes.ADMIN_ANALYTICS) {
                AdminAnalyticsScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}
