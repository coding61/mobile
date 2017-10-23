package com.cxy61.girls;

import android.content.Intent;

import android.net.Uri;
import android.util.Log;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import io.rong.imkit.RongIM;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.UserInfo;

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

    @ReactMethod
    public void rnIMStart(){
        Intent intent = new Intent(getCurrentActivity(),ConversationListActivity.class);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void rnIMDisconnect(){
        RongIM.getInstance().logout();
    }

    @ReactMethod
    public void rnIMConnect(final String token, final Callback callback){
        if(getReactApplicationContext().getApplicationInfo().packageName.equals(MainApplication.getCurProcessName(getReactApplicationContext().getApplicationContext()))){
            RongIM.connect(token, new RongIMClient.ConnectCallback() {
                @Override
                public void onTokenIncorrect() {
                    callback.invoke("失败");
                }

                @Override
                public void onSuccess(String s) {
                    callback.invoke("成功");
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    callback.invoke("失败");
                }
            });
        }
    }

    @ReactMethod
    public void rnIMChat(String username,String type,String name){
        if (type.equals("private")){
            RongIM.getInstance().startPrivateChat(getCurrentActivity(), username, name);
        }else if (type.equals("group")){
            RongIM.getInstance().startGroupChat(getCurrentActivity(), username, name);
        }

    }

    @ReactMethod
    public void reIMFreshUserInfo(String username,String nick,String avatar){
        RongIM.getInstance().refreshUserInfoCache(new UserInfo(username, nick, Uri.parse(avatar)));
    }
}
