package com.cxy61.girls;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.Switch;
import android.widget.TextView;
import com.lidroid.xutils.HttpUtils;
import com.lidroid.xutils.exception.HttpException;
import com.lidroid.xutils.http.RequestParams;
import com.lidroid.xutils.http.ResponseInfo;
import com.lidroid.xutils.http.callback.RequestCallBack;
import com.lidroid.xutils.http.client.HttpRequest.HttpMethod;
import io.rong.imkit.RongIM;
import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.CountDownLatch;

public class IMSettingActivity extends Activity implements View.OnClickListener, CompoundButton.OnCheckedChangeListener {
    private String mTargetId;
    private Conversation.ConversationType mConversationType;
    private ImageButton backimage,rightimage;
    private TextView titletext, placardtext;
    private Switch messageswitch;
    private Boolean isleader;
    private String login_token;
    private Handler placardhandler;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_imsetting);
        backimage= (ImageButton)findViewById(R.id.left_btn);
        titletext= (TextView)findViewById(R.id.title_text);
        rightimage= (ImageButton) findViewById(R.id.right_btn);
        placardtext= (TextView) findViewById(R.id.tv_placard);
        messageswitch = (Switch) findViewById(R.id.sw_message);
        titletext.setText("群组信息");
        backimage.setOnClickListener(this);
        placardtext.setOnClickListener(this);
        Intent intent = getIntent();
        mConversationType = Conversation.ConversationType.setValue(intent.getIntExtra("mConversationType", 0));
        mTargetId = getIntent().getStringExtra("mTargetId");
        placardhandler = new Handler(){
            @Override
            public void handleMessage(Message msg) {
                super.handleMessage(msg);
                showPlacardDialog();
            }
        };
        messageswitch.setChecked(Utils.getBoolean(this,"notification_"+mTargetId,false));
        messageswitch.setOnCheckedChangeListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.left_btn:
                this.finish();
                break;
            case R.id.tv_placard:
                getGroupThread groupThread=new getGroupThread();
                groupThread.start();
                break;
        }
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if(isChecked){
            RongIM.getInstance().setConversationNotificationStatus(mConversationType, mTargetId, Conversation.ConversationNotificationStatus.DO_NOT_DISTURB, new RongIMClient.ResultCallback<Conversation.ConversationNotificationStatus>() {
                @Override
                public void onSuccess(Conversation.ConversationNotificationStatus conversationNotificationStatus) {
                    Utils.setBoolean(IMSettingActivity.this,"notification_"+mTargetId,true);
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    Utils.setBoolean(IMSettingActivity.this,"notification_"+mTargetId,false);
                }
            });
        }else{
            RongIM.getInstance().setConversationNotificationStatus(mConversationType, mTargetId, Conversation.ConversationNotificationStatus.NOTIFY, new RongIMClient.ResultCallback<Conversation.ConversationNotificationStatus>() {
                @Override
                public void onSuccess(Conversation.ConversationNotificationStatus conversationNotificationStatus) {
                    Utils.setBoolean(IMSettingActivity.this,"notification_"+mTargetId,false);
                }

                @Override
                public void onError(RongIMClient.ErrorCode errorCode) {
                    Utils.setBoolean(IMSettingActivity.this,"notification_"+mTargetId,true);
                }
            });
        }
    }

    public class getGroupThread extends Thread {
        @Override
        public void run() {
            final CountDownLatch latch = new CountDownLatch(1);
            MainApplication app = new MainApplication();
            login_token = app.token;
            HttpUtils utils = new HttpUtils(60 * 1000);
            utils.configCurrentHttpCacheExpiry(0);
            //String url = "https://app.bcjiaoyu.com/program_girl/club/club_detail/"+mTargetId+"/";
            String url = "https://www.cxy61.com/program_girl/club/club_detail/"+mTargetId+"/";
            RequestParams requestParams = new RequestParams();
            requestParams.addHeader("Authorization", "Token " + login_token);
            utils.send(HttpMethod.GET, url, requestParams, new RequestCallBack<String>() {
                @Override
                public void onSuccess(ResponseInfo<String> responseInfo) {
                    String json = responseInfo.result;
                    try {
                        JSONObject object = new JSONObject(json);
                        isleader = object.getBoolean("isleader");
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                    latch.countDown();
                }

                @Override
                public void onFailure(HttpException error, String msg) {
                    //Toast.makeText(IMSettingActivity.this, "上传失败，请查看网络连接", Toast.LENGTH_SHORT).show();
                    error.printStackTrace();
                    latch.countDown();
                }
            });

            try {
                latch.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }finally{
                latch.countDown();
            }

            if(isleader){
                Intent intent = new Intent(IMSettingActivity.this,PlacardActivity.class);
                intent.putExtra("mTargetId",mTargetId);
                intent.putExtra("mConversationType",Conversation.ConversationType.GROUP.getValue());
                startActivity(intent);
            }else{
                placardhandler.sendMessage(new Message());
            }
        }
    }

    private void showPlacardDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setIcon(R.mipmap.ic_launcher);
        builder.setMessage("只有群主可以发布公告");
        builder.setPositiveButton("确定", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.create().show();
    }
}
