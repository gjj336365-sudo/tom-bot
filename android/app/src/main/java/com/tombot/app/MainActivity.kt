package com.tombot.app

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    
    private var isRunning = false
    private val handler = Handler(Looper.getMainLooper())
    private lateinit var tvStatus: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val btnStart = findViewById<Button>(R.id.btnStart)
        val btnStop = findViewById<Button>(R.id.btnStop)
        tvStatus = findViewById(R.id.tvStatus)

        btnStart.setOnClickListener {
            if (!isRunning) {
                isRunning = true
                tvStatus.text = "الحالة: يعمل..."
                tvStatus.setTextColor(android.graphics.Color.GREEN)
                Toast.makeText(this, "افتح اللعبة الآن!", Toast.LENGTH_SHORT).show()
                startBotLoop()
            }
        }

        btnStop.setOnClickListener {
            isRunning = false
            tvStatus.text = "الحالة: متوقف"
            tvStatus.setTextColor(android.graphics.Color.GRAY)
            Toast.makeText(this, "تم إيقاف البوت", Toast.LENGTH_SHORT).show()
        }
    }

    private fun startBotLoop() {
        Thread {
            Thread.sleep(3000)
            while (isRunning) {
                MyAccessibilityService.instance?.clickButtonByText("Attack")
                Thread.sleep(2000) 
            }
        }.start()
    }
}
