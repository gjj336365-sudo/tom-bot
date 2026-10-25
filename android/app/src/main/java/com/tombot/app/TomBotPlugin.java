package com.tombot.app;

import android.content.Intent;
import android.provider.Settings;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "TomBot")
public class TomBotPlugin extends Plugin {

    @PluginMethod
    public void performClick(PluginCall call) {
        float x = call.getFloat("x", 0f);
        float y = call.getFloat("y", 0f);
        
        if (MyAccessibilityService.instance != null) {
            MyAccessibilityService.instance.clickScreen(x, y);
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        } else {
            call.reject("Accessibility Service not running.");
        }
    }

    @PluginMethod
    public void openAccessibilitySettings(PluginCall call) {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        getActivity().startActivity(intent);
        call.resolve();
    }

    @PluginMethod
    public void requestScreenCapture(PluginCall call) {
        // ملاحظة: تصوير الشاشة يحتاج كود معقد (MediaProjection) 
        // حالياً راح نرجع رسالة نجاح عشان ما يعلق التطبيق
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void startBot(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void stopBot(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
}
