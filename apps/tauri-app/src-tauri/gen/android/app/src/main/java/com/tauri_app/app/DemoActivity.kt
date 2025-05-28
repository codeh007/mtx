package com.tauri_app.app

import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.constraintlayout.widget.ConstraintSet

class DemoActivity : AppCompatActivity() {
    companion object {
        private const val TAG = "DemoActivity"
        private var nextId = 1
        
        private fun generateCustomId(): Int {
            return nextId++
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        try {
            super.onCreate(savedInstanceState)
            Log.d(TAG, "onCreate started")

            // Create ConstraintLayout as the root view
            val constraintLayout = ConstraintLayout(this).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }

            // Create the button
            val button = Button(this).apply {
                id = generateCustomId()
                text = "Hello World"
                layoutParams = ConstraintLayout.LayoutParams(
                    ConstraintLayout.LayoutParams.WRAP_CONTENT,
                    ConstraintLayout.LayoutParams.WRAP_CONTENT
                )
            }

            // Add button to constraint layout
            constraintLayout.addView(button)

            // Create and apply constraints programmatically
            ConstraintSet().apply {
                clone(constraintLayout)
                // Center horizontally
                connect(
                    button.id,
                    ConstraintSet.START,
                    ConstraintSet.PARENT_ID,
                    ConstraintSet.START
                )
                connect(
                    button.id,
                    ConstraintSet.END,
                    ConstraintSet.PARENT_ID,
                    ConstraintSet.END
                )
                // Center vertically
                connect(
                    button.id,
                    ConstraintSet.TOP,
                    ConstraintSet.PARENT_ID,
                    ConstraintSet.TOP
                )
                connect(
                    button.id,
                    ConstraintSet.BOTTOM,
                    ConstraintSet.PARENT_ID,
                    ConstraintSet.BOTTOM
                )
                applyTo(constraintLayout)
            }

            // Set click listener for the button
            button.setOnClickListener {
                Log.d(TAG, "Button clicked")
            }

            // Set the constraint layout as the content view
            setContentView(constraintLayout)
            Log.d(TAG, "onCreate completed successfully")
        } catch (e: Exception) {
            Log.e(TAG, "Error in onCreate", e)
            throw e
        }
    }

    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume called")
    }

    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause called")
    }
} 