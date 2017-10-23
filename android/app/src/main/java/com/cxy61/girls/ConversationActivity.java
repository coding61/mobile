package com.cxy61.girls;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import io.rong.imkit.fragment.ConversationFragment;
import io.rong.imlib.model.Conversation;

import java.util.Locale;

public class ConversationActivity extends FragmentActivity implements View.OnClickListener{
    private String mTargetId;
    private Conversation.ConversationType mConversationType;
    private ImageButton backimage;
    private TextView titletext;
    private String title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.conversation);
        backimage= (ImageButton)findViewById(R.id.left_btn);
        titletext= (TextView)findViewById(R.id.title_text);
        backimage.setOnClickListener(this);
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
        }
    }
}
