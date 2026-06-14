package com.truvornex.app.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.truvornex.app.ui.theme.*

@Composable
fun TxButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    trailingIcon: ImageVector? = null,
    variant: ButtonVariant = ButtonVariant.Primary
) {
    val bg = when (variant) {
        ButtonVariant.Primary   -> DarkPrimary
        ButtonVariant.Secondary -> DarkSurfaceHigh
        ButtonVariant.Ghost     -> Color.Transparent
        ButtonVariant.Danger    -> DarkError.copy(alpha = 0.15f)
    }
    val textColor = when (variant) {
        ButtonVariant.Primary   -> DarkOnPrimary
        ButtonVariant.Secondary -> DarkText
        ButtonVariant.Ghost     -> DarkText
        ButtonVariant.Danger    -> DarkError
    }

    Button(
        onClick = { if (!isLoading) onClick() },
        enabled = enabled && !isLoading,
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(12.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = bg,
            contentColor = textColor,
            disabledContainerColor = bg.copy(alpha = 0.5f),
            disabledContentColor = textColor.copy(alpha = 0.5f)
        ),
        contentPadding = PaddingValues(horizontal = 20.dp)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(18.dp),
                color = textColor,
                strokeWidth = 2.dp
            )
        } else {
            Text(
                text = label,
                style = MaterialTheme.typography.labelLarge.copy(
                    color = textColor,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.W600
                )
            )
            if (trailingIcon != null) {
                Spacer(Modifier.width(8.dp))
                Icon(trailingIcon, contentDescription = null, modifier = Modifier.size(16.dp), tint = textColor)
            }
        }
    }
}

enum class ButtonVariant { Primary, Secondary, Ghost, Danger }

@Composable
fun TxTextField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    hint: String = "",
    isPassword: Boolean = false,
    leadingIcon: ImageVector? = null,
    error: String? = null
) {
    var passwordVisible by remember { mutableStateOf(false) }

    Column(modifier = modifier) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall.copy(
                color = DarkTextMuted,
                fontWeight = FontWeight.W500,
                fontSize = 12.sp
            ),
            modifier = Modifier.padding(bottom = 6.dp)
        )
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            placeholder = {
                Text(hint, style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextSubtle))
            },
            leadingIcon = if (leadingIcon != null) {
                { Icon(leadingIcon, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(18.dp)) }
            } else null,
            trailingIcon = if (isPassword) {
                {
                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                        Icon(
                            if (passwordVisible) Icons.Rounded.Visibility else Icons.Rounded.VisibilityOff,
                            contentDescription = null,
                            tint = DarkTextMuted,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            } else null,
            visualTransformation = if (isPassword && !passwordVisible) PasswordVisualTransformation() else VisualTransformation.None,
            singleLine = true,
            shape = RoundedCornerShape(12.dp),
            colors = OutlinedTextFieldDefaults.colors(
                focusedTextColor = DarkText,
                unfocusedTextColor = DarkText,
                focusedContainerColor = DarkSurfaceHigh,
                unfocusedContainerColor = DarkSurfaceHigh,
                focusedBorderColor = DarkBorderStrong,
                unfocusedBorderColor = DarkBorder,
                cursorColor = DarkPrimary,
            ),
            textStyle = MaterialTheme.typography.bodyMedium.copy(color = DarkText),
            isError = error != null
        )
        if (error != null) {
            Text(
                text = error,
                style = MaterialTheme.typography.bodySmall.copy(color = DarkError),
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}

@Composable
fun TxCard(
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val m = if (onClick != null) modifier.clickable(onClick = onClick) else modifier
    Surface(
        modifier = m,
        color = DarkSurface,
        shape = RoundedCornerShape(16.dp),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Column(modifier = Modifier.padding(16.dp), content = content)
    }
}

@Composable
fun TxStatCard(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
    valueColor: Color = DarkPrimary
) {
    TxCard(modifier = modifier) {
        Text(value, style = MaterialTheme.typography.headlineMedium.copy(color = valueColor, fontWeight = FontWeight.W700))
        Spacer(Modifier.height(2.dp))
        Text(label, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
    }
}

@Composable
fun TxCategoryCard(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    accent: Color = DarkSurfaceHigh
) {
    Surface(
        modifier = modifier
            .aspectRatio(1f)
            .clickable(onClick = onClick),
        color = DarkSurface,
        shape = RoundedCornerShape(14.dp),
        border = BorderStroke(1.dp, DarkBorder)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(accent.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = label, tint = accent, modifier = Modifier.size(18.dp))
            }
            Spacer(Modifier.height(8.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.bodySmall.copy(
                    color = DarkText,
                    fontWeight = FontWeight.W500,
                    fontSize = 11.sp
                )
            )
        }
    }
}

@Composable
fun TxProviderCard(
    name: String,
    category: String,
    rating: Double,
    reviewCount: Int,
    isVerified: Boolean,
    priceFrom: Double?,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    TxCard(modifier = modifier, onClick = onClick) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(DarkSurfaceHigh),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = name.firstOrNull()?.uppercase() ?: "?",
                    style = MaterialTheme.typography.titleLarge.copy(color = DarkPrimary, fontWeight = FontWeight.W700)
                )
            }
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(name, style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.W600))
                    if (isVerified) {
                        Spacer(Modifier.width(4.dp))
                        Icon(Icons.Rounded.Verified, contentDescription = "Verified", tint = DarkInfo, modifier = Modifier.size(14.dp))
                    }
                }
                Text(category, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
            }
            Column(horizontalAlignment = Alignment.End) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Rounded.Star, contentDescription = null, tint = BrandAmber, modifier = Modifier.size(13.dp))
                    Spacer(Modifier.width(3.dp))
                    Text(String.format("%.1f", rating), style = MaterialTheme.typography.bodySmall.copy(color = DarkText, fontWeight = FontWeight.W600))
                }
                if (priceFrom != null) {
                    Text("From \$${priceFrom.toInt()}", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted, fontSize = 10.sp))
                }
            }
        }
    }
}

@Composable
fun TxSectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    action: String? = null,
    onAction: (() -> Unit)? = null
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.W700))
        if (action != null && onAction != null) {
            TextButton(onClick = onAction, contentPadding = PaddingValues(0.dp)) {
                Text(action, style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(14.dp))
            }
        }
    }
}

@Composable
fun TxBadge(text: String, color: Color = DarkSurfaceHigh, textColor: Color = DarkText) {
    Surface(
        color = color,
        shape = RoundedCornerShape(100.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall.copy(color = textColor, fontWeight = FontWeight.W600),
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
        )
    }
}

@Composable
fun TxEmptyState(icon: ImageVector, title: String, subtitle: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxWidth().padding(40.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(icon, contentDescription = null, tint = DarkTextSubtle, modifier = Modifier.size(48.dp))
        Spacer(Modifier.height(16.dp))
        Text(title, style = MaterialTheme.typography.headlineSmall.copy(color = DarkText), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        Spacer(Modifier.height(6.dp))
        Text(subtitle, style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextMuted), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
    }
}
