package com.tombot.app;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.GestureDescription;
import android.graphics.Path;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import java.util.List;

public class MyAccessibilityService extends AccessibilityService {

    public static MyAccessibilityService instance;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        instance = this;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        // هنا يشتغل الدماغ، يقرأ الأحداث من الشاشة
    }

    @Override
    public void onInterrupt() {
    }

    // 🖐️ أمر اليد: النقر على إحداثيات معينة في الشاشة
    public void clickScreen(float x, float y) {
        Path path = new Path();
        path.moveTo(x, y);
        GestureDescription.Builder gestureBuilder = new GestureDescription.Builder();
        gestureBuilder.addStroke(new GestureDescription.StrokeDescription(path, 0, 100));
        dispatchGesture(gestureBuilder.build(), null, null);
    }

    // 🧠 أمر الدماغ: البحث عن نص معين في الشاشة
    public void findText(String textToFind) {
        AccessibilityNodeInfo rootNode = getRootInActiveWindow();
        if (rootNode != null) {
            List<AccessibilityNodeInfo> nodes = rootNode.findAccessibilityNodeInfosByText(textToFind);
            if (nodes != null && !nodes.isEmpty()) {
                // لقينا النص! 
                // هنا تقدر تخلي البوت يضغط عليه
            }
        }
    }
}
