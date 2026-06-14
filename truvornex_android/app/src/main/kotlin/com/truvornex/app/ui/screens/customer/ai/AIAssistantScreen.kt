package com.truvornex.app.ui.screens.customer.ai

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.truvornex.app.data.network.ApiClient
import com.truvornex.app.ui.components.TxCard
import com.truvornex.app.ui.theme.*
import kotlinx.coroutines.launch

data class Message(val content: String, val isUser: Boolean)

@Composable
fun AIAssistantScreen() {
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()
    var input by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    val messages = remember {
        mutableStateListOf(
            Message("Hi! I'm Simon, your AI assistant. I can help you find the right service provider, answer questions about bookings, and more. What do you need today?", false)
        )
    }

    val suggestions = listOf(
        "Find a cleaning service",
        "Book a plumber urgently",
        "What's the best rated chef nearby?",
        "How do group buys work?",
    )

    fun sendMessage(text: String) {
        if (text.isBlank() || isLoading) return
        messages.add(Message(text, true))
        input = ""
        isLoading = true
        scope.launch {
            try {
                val response = ApiClient.apiService.chat(mapOf(
                    "messages" to listOf(mapOf("role" to "user", "content" to text)),
                    "systemPrompt" to "You are Simon, the AI assistant for Truvornex, a hyperlocal service marketplace. Help users find service providers, understand bookings, and navigate the platform. Be concise and helpful.",
                    "temperature" to 0.7,
                    "maxTokens" to 500
                ))
                val reply = response.body()?.get("content") ?: "I'm here to help! Could you tell me more about what you're looking for?"
                messages.add(Message(reply, false))
            } catch (e: Exception) {
                messages.add(Message("I'm having trouble connecting right now. Please make sure the DEEPSEEK_API_KEY is configured.", false))
            } finally {
                isLoading = false
                listState.animateScrollToItem(messages.size - 1)
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(DarkBg)) {
        // Header
        Surface(color = DarkSurface, tonalElevation = 0.dp) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier.size(40.dp).clip(CircleShape).background(BrandPurple.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Rounded.AutoAwesome, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(20.dp))
                }
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Simon AI", style = MaterialTheme.typography.headlineSmall.copy(color = DarkPrimary, fontWeight = FontWeight.W700))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(7.dp).clip(CircleShape).background(DarkSuccess))
                        Spacer(Modifier.width(5.dp))
                        Text("Online · Ready to help", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                    }
                }
            }
        }

        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).padding(horizontal = 16.dp),
            contentPadding = PaddingValues(vertical = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(messages) { msg ->
                MessageBubble(msg)
            }
            if (isLoading) {
                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(32.dp).clip(CircleShape).background(BrandPurple.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                            Icon(Icons.Rounded.AutoAwesome, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(16.dp))
                        }
                        Spacer(Modifier.width(8.dp))
                        Surface(color = DarkSurface, shape = RoundedCornerShape(16.dp, 16.dp, 16.dp, 4.dp)) {
                            Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                                CircularProgressIndicator(modifier = Modifier.size(14.dp), color = DarkTextMuted, strokeWidth = 2.dp)
                                Spacer(Modifier.width(8.dp))
                                Text("Simon is thinking...", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextMuted))
                            }
                        }
                    }
                }
            }
            if (messages.size == 1) {
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("Suggested", style = MaterialTheme.typography.bodySmall.copy(color = DarkTextSubtle))
                        suggestions.forEach { s ->
                            Surface(
                                modifier = Modifier.fillMaxWidth().clickable { sendMessage(s) },
                                color = DarkSurface,
                                shape = RoundedCornerShape(10.dp),
                                border = BorderStroke(1.dp, DarkBorder)
                            ) {
                                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Rounded.Lightbulb, contentDescription = null, tint = BrandAmber, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(10.dp))
                                    Text(s, style = MaterialTheme.typography.bodySmall.copy(color = DarkText))
                                }
                            }
                        }
                    }
                }
            }
        }

        // Input
        Surface(color = DarkSurface, tonalElevation = 0.dp) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = input,
                    onValueChange = { input = it },
                    modifier = Modifier.weight(1f),
                    placeholder = { Text("Ask Simon anything...", style = MaterialTheme.typography.bodyMedium.copy(color = DarkTextSubtle)) },
                    singleLine = false,
                    maxLines = 4,
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = DarkText,
                        unfocusedTextColor = DarkText,
                        focusedContainerColor = DarkSurfaceHigh,
                        unfocusedContainerColor = DarkSurfaceHigh,
                        focusedBorderColor = DarkBorderStrong,
                        unfocusedBorderColor = DarkBorder
                    ),
                    textStyle = MaterialTheme.typography.bodyMedium.copy(color = DarkText)
                )
                Spacer(Modifier.width(8.dp))
                IconButton(
                    onClick = { sendMessage(input) },
                    enabled = input.isNotBlank() && !isLoading,
                    modifier = Modifier.size(48.dp).clip(CircleShape).background(if (input.isNotBlank() && !isLoading) DarkPrimary else DarkSurfaceHigh)
                ) {
                    Icon(Icons.Rounded.Send, contentDescription = "Send", tint = if (input.isNotBlank() && !isLoading) DarkOnPrimary else DarkTextSubtle, modifier = Modifier.size(20.dp))
                }
            }
        }
    }
}

@Composable
private fun MessageBubble(msg: Message) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (msg.isUser) Arrangement.End else Arrangement.Start
    ) {
        if (!msg.isUser) {
            Box(modifier = Modifier.size(32.dp).clip(CircleShape).background(BrandPurple.copy(alpha = 0.15f)), contentAlignment = Alignment.Center) {
                Icon(Icons.Rounded.AutoAwesome, contentDescription = null, tint = BrandPurple, modifier = Modifier.size(16.dp))
            }
            Spacer(Modifier.width(8.dp))
        }
        Surface(
            color = if (msg.isUser) DarkPrimary else DarkSurface,
            shape = RoundedCornerShape(
                topStart = 16.dp, topEnd = 16.dp,
                bottomStart = if (msg.isUser) 16.dp else 4.dp,
                bottomEnd = if (msg.isUser) 4.dp else 16.dp
            ),
            modifier = Modifier.widthIn(max = 280.dp)
        ) {
            Text(
                msg.content,
                style = MaterialTheme.typography.bodyMedium.copy(color = if (msg.isUser) DarkOnPrimary else DarkText),
                modifier = Modifier.padding(12.dp)
            )
        }
    }
}
