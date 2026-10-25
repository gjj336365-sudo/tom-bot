package com.tombot.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // تسجيل الجسر قبل تشغيل التطبيق
        registerPlugin(TomBotPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
