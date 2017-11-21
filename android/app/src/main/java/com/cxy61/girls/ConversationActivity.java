package com.cxy61.girls;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import io.rong.imkit.RongIM;
import io.rong.imkit.fragment.ConversationFragment;
import io.rong.imkit.manager.IUnReadMessageObserver;
import io.rong.imlib.model.Conversation;

import java.util.Locale;

public class ConversationActivity extends FragmentActivity implements View.OnClickListener{
    private String mTargetId;
    private Conversation.ConversationType mConversationType;
    private ImageButton backimage;
    private TextView titletext,righttext;
    private String title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.conversation);
        backimage= (ImageButton)findViewById(R.id.left_btn);
        titletext= (TextView)findViewById(R.id.title_text);
        righttext= (TextView) findViewById(R.id.right_text);
        backimage.setOnClickListener(this);
        righttext.setOnClickListener(this);
        Intent intent = getIntent();
        getIntentDate(intent);
    }

    private void getIntentDate(Intent intent) {
        mTargetId = intent.getData().getQueryParameter("targetId");
        title = intent.getData().getQueryParameter("title");
        //intent.getData().getLastPathSegment();//获得当前会话类型
        mConversationType = Conversation.ConversationType.valueOf(intent.getData().getLastPathSegment().toUpperCase(Locale.getDefault()));
        titletext.setText(title);
        enterFragment(mConversationType, mTargetId);
    }

    private void enterFragment(Conversation.ConversationType mConversationType, String mTargetId) {
        ConversationFragment fragment = (ConversationFragment) getSupportFragmentManager().findFragmentById(R.id.conversation);
        Uri uri = Uri.parse("rong://" + getApplicationInfo().packageName).buildUpon()
                .appendPath("conversation").appendPath(mConversationType.getName().toLowerCase())
                .appendQueryParameter("targetId", mTargetId).build();
        fragment.setUri(uri);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.left_btn:
                this.finish();
                break;
            case R.id.right_text:
                Intent intent = new Intent(this,PlacardActivity.class);
                intent.putExtra("mTargetId",mTargetId);
                intent.putExtra("mConversationType",Conversation.ConversationType.GROUP.getValue());
                this.startActivity(intent);
        }
    }

    @Override
    protected void onResume() {
        RongIM.getInstance().addUnReadMessageCountChangedObserver(new MyUnReadMessageCount(), Conversation.ConversationType.GROUP);
        super.onResume();
    }

    @Override
    protected void onPause() {
        RongIM.getInstance().removeUnReadMessageCountChangedObserver(new MyUnReadMessageCount());
        super.onPause();
    }

    private class MyUnReadMessageCount implements IUnReadMessageObserver {

        @Override
        public void onCountChanged(int i) {
            WritableMap sendSuccess = Arguments.createMap();
            sendSuccess.putInt("unread_message_count",i);
            sendTransMisson(MainApplication.myReactNativeHost.getReactInstanceManager().getCurrentReactContext(), "unreadmessagecount_listener", sendSuccess);
        }
    }

    public void sendTransMisson(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
}
