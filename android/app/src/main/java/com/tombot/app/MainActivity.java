package com.tombot.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // تسجيل الجسر (Plugin) عشان واجهة React تقدر تستخدمه
        registerPlugin(TomBotPlugin.class);
    }
}
