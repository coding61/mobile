package com.cxy61.girls;

import android.content.Intent;
import android.net.Uri;
import android.support.v4.app.FragmentActivity;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import io.rong.imkit.fragment.ConversationListFragment;
import io.rong.imlib.model.Conversation;

import java.util.Locale;

public class ConversationListActivity extends FragmentActivity implements View.OnClickListener {
    private ImageButton backimage;
    private TextView titletext;
    private String title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.conversationlist);
        backimage= (ImageButton)findViewById(R.id.left_btn);
        titletext= (TextView)findViewById(R.id.title_text);
        backimage.setOnClickListener(this);
        enterFragment();
    }

    private void enterFragment() {
        ConversationListFragment fragment = (ConversationListFragment) getSupportFragmentManager().findFragmentById(R.id.conversationlist);
        Uri uri = Uri.parse("rong://" + getApplicationInfo().packageName).buildUpon()
                .appendPath("conversationlist")
                .appendQueryParameter(Conversation.ConversationType.PRIVATE.getName(), "false") //设置私聊会话非聚合显示
                .appendQueryParameter(Conversation.ConversationType.SYSTEM.getName(), "false")//设置系统会话非聚合显示
                .appendQueryParameter(Conversation.ConversationType.GROUP.getName(), "false")
                .build();
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
