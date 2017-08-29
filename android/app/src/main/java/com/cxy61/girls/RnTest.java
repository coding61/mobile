package com.cxy61.girls;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by shihualiu on 2017/8/28.
 */

public class RnTest extends ReactContextBaseJavaModule {

    public RnTest(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RongYunRN";
    }

    @ReactMethod
    public void rnQiniu(String token, boolean isPrivate, String type) {
        MainApplication app = new MainApplication();
        app.token = token;
        app.isPrivate = isPrivate;

        int GALLERY_CODE = 0;
        int PHOTOGRAPH_CODE = 1;
        if (type.equals("photograph")) {
            Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
            getCurrentActivity().startActivityForResult(intent, PHOTOGRAPH_CODE);
        } else if (type.equals("gallery")) {
            Intent intent = new Intent();
            intent.setAction(Intent.ACTION_PICK);
            intent.setType("image/*");
            getCurrentActivity().startActivityForResult(intent, GALLERY_CODE);
        }
    }

    @ReactMethod
    public void rnCancelUp() {
        Intent intent = new Intent("CANCELUP");
        getCurrentActivity().sendBroadcast(intent);
    }
}
