package com.tombot.app;

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
            call.reject("Accessibility Service not running. Please enable it in settings.");
        }
    }
    
    @PluginMethod
    public void findText(PluginCall call) {
        String text = call.getString("text", "");
        if (MyAccessibilityService.instance != null) {
            MyAccessibilityService.instance.findText(text);
            call.resolve();
        } else {
            call.reject("Accessibility Service not running.");
        }
    }
}
