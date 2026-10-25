package com.tombot.app;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    
    private boolean isRunning = false;
    private Handler handler = new Handler(Looper.getMainLooper());
    private TextView tvStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button btnStart = findViewById(R.id.btnStart);
        Button btnStop = findViewById(R.id.btnStop);
        tvStatus = findViewById(R.id.tvStatus);

        btnStart.setOnClickListener(v -> {
            if (!isRunning) {
                isRunning = true;
                tvStatus.setText("الحالة: يعمل...");
                tvStatus.setTextColor(android.graphics.Color.GREEN);
                Toast.makeText(this, "افتح اللعبة الآن!", Toast.LENGTH_SHORT).show();
                startBotLoop();
            }
        });

        btnStop.setOnClickListener(v -> {
            isRunning = false;
            tvStatus.setText("الحالة: متوقف");
            tvStatus.setTextColor(android.graphics.Color.GRAY);
            Toast.makeText(this, "تم إيقاف البوت", Toast.LENGTH_SHORT).show();
        });
    }

    private void startBotLoop() {
        new Thread(() -> {
            try {
                Thread.sleep(3000);
                while (isRunning) {
                    if (MyAccessibilityService.instance != null) {
                        MyAccessibilityService.instance.clickButtonByText("Attack");
                    }
                    Thread.sleep(2000);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
