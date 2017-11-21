package com.cxy61.girls;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import io.rong.imkit.RongContext;
import io.rong.imkit.RongIM;
import io.rong.imlib.IRongCallback;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.MentionedInfo;
import io.rong.message.TextMessage;

public class PlacardActivity extends Activity implements View.OnClickListener {
    private ImageButton backimage;
    private TextView titletext,righttext;
    private EditText placard;
    private String mTargetId;
    private Conversation.ConversationType mConversationType;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_placard);
        backimage= (ImageButton)findViewById(R.id.left_btn);
        titletext= (TextView)findViewById(R.id.title_text);
        righttext= (TextView) findViewById(R.id.right_text);
        placard= (EditText) findViewById(R.id.et_placard);
        backimage.setOnClickListener(this);
        righttext.setOnClickListener(this);
        Intent intent = getIntent();
        mConversationType = Conversation.ConversationType.setValue(intent.getIntExtra("mConversationType", 0));
        mTargetId = getIntent().getStringExtra("mTargetId");
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.left_btn:
                this.finish();
                break;
            case R.id.right_text:
                TextMessage textMessage = TextMessage.obtain(RongContext.getInstance().getString(R.string.group_notice_prefix) + placard.getText().toString());
                MentionedInfo mentionedInfo = new MentionedInfo(MentionedInfo.MentionedType.ALL, null, null);
                textMessage.setMentionedInfo(mentionedInfo);

                RongIM.getInstance().sendMessage(Message.obtain(mTargetId, mConversationType, textMessage), null, null, new IRongCallback.ISendMessageCallback() {
                    @Override
                    public void onAttached(Message message) {
                    }

                    @Override
                    public void onSuccess(Message message) {
                    }

                    @Override
                    public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                    }
                });
                finish();
        }
    }
}
