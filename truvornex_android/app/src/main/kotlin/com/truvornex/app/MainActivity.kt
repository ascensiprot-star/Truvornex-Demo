package com.truvornex.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.isSystemInDarkTheme
import com.truvornex.app.ui.navigation.TruvornexNavGraph
import com.truvornex.app.ui.theme.TruvornexTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            TruvornexTheme(darkTheme = true) {
                TruvornexNavGraph()
            }
        }
    }
}
