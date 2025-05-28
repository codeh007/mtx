package com.tauri.app

import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity

class DemoActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Create a Button programmatically
        val button = Button(this).apply {
            text = "Hello World"
            setOnClickListener {
                // Add click handling here if needed
            }
        }
        
        // Set the button as the content view
        setContentView(button)
    }
} 