package com.truvornex.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary          = DarkPrimary,
    onPrimary        = DarkOnPrimary,
    secondary        = DarkAccent2,
    onSecondary      = DarkOnPrimary,
    background       = DarkBg,
    onBackground     = DarkText,
    surface          = DarkSurface,
    onSurface        = DarkText,
    surfaceVariant   = DarkSurfaceHigh,
    onSurfaceVariant = DarkTextMuted,
    error            = DarkError,
    outline          = DarkBorder,
)

private val LightColorScheme = lightColorScheme(
    primary          = LightPrimary,
    onPrimary        = LightOnPrimary,
    secondary        = LightTextMuted,
    onSecondary      = LightOnPrimary,
    background       = LightBg,
    onBackground     = LightText,
    surface          = LightSurface,
    onSurface        = LightText,
    surfaceVariant   = LightSurfaceHigh,
    onSurfaceVariant = LightTextMuted,
    error            = LightError,
    outline          = LightBorder,
)

@Composable
fun TruvornexTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography  = TruvornexTypography,
        content     = content
    )
}
