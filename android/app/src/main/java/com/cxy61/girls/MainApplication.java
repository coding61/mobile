package com.cxy61.girls;

import android.app.ActivityManager;
import android.app.Application;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.support.annotation.Nullable;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lidroid.xutils.HttpUtils;
import com.lidroid.xutils.exception.HttpException;
import com.lidroid.xutils.http.RequestParams;
import com.lidroid.xutils.http.ResponseInfo;
import com.lidroid.xutils.http.callback.RequestCallBack;
import com.lidroid.xutils.http.client.HttpRequest.HttpMethod;
import com.tendcloud.tenddata.TCAgent;
import com.umeng.socialize.Config;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.rong.imkit.RongIM;
import io.rong.imkit.manager.IUnReadMessageObserver;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Group;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.UserInfo;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CountDownLatch;

public class MainApplication extends Application implements ReactApplication {
  public static String token;
  public static Boolean isPrivate;
  public long id;
  public Group group;
  public static ReactNativeHost myReactNativeHost;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNDeviceInfo(),
            new RNSoundPackage(),
              //new MainReactPackage(),
              new MyReactPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    myReactNativeHost = mReactNativeHost;
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    TCAgent.LOG_ON=true;
    // App ID: 在TalkingData创建应用后，进入数据报表页中，在“系统设置”-“编辑应用”页面里查看App ID。
    // 渠道 ID: 是渠道标识符，可通过不同渠道单独追踪数据。
    TCAgent.init(this, "16FACCF446A4432F8434C703CEAF04B4", "tencent_app_market");
    // 如果已经在AndroidManifest.xml配置了App ID和渠道ID，调用TCAgent.init(this)即可；或与AndroidManifest.xml中的对应参数保持一致。
    TCAgent.setReportUncaughtExceptions(true);

    /* 融云初始化 */
    if (getApplicationInfo().packageName.equals(getCurProcessName(getApplicationContext())) ||
            "io.rong.push".equals(getCurProcessName(getApplicationContext()))) {
      RongIM.init(this);
      RongIM.setUserInfoProvider(new RongIM.UserInfoProvider() {
        @Override
        public UserInfo getUserInfo(String username) {
          HttpUtils utils = new HttpUtils(60 * 1000);
          utils.configCurrentHttpCacheExpiry(0);
          return getUserMessage(utils, username);
        }
      }, true);
      RongIM.setGroupInfoProvider(new RongIM.GroupInfoProvider() {
        @Override
        public Group getGroupInfo(String groupid) {
          HttpUtils utils = new HttpUtils(60 * 1000);
          utils.configCurrentHttpCacheExpiry(0);
          return getGroupMessage(utils, groupid);
        }
      },true);

      RongIM.getInstance().setSendMessageListener(new MySendMessageListener());

      RongIM.getInstance().addUnReadMessageCountChangedObserver(new MyUnReadMessageCount(), Conversation.ConversationType.GROUP);

    }

    PlatformConfig.setWeixin("wx1ace10b30a9d5d70", "f5c4439b9e49498828324fb4a9aaad91");
    //PlatformConfig.setSinaWeibo("3921700954", "04b48b094faeb16683c32669824ebdad", "http://sns.whalecloud.com");
    UMShareAPI.get(this);
  }

  private class MySendMessageListener implements RongIM.OnSendMessageListener{

    @Override
    public Message onSend(Message message) {
      return message;
    }

    @Override
    public boolean onSent(Message message, RongIM.SentMessageErrorCode sentMessageErrorCode) {
      if (message.getConversationType() == Conversation.ConversationType.GROUP){
        if (message.getSentStatus() != Message.SentStatus.FAILED && sentMessageErrorCode==null){
          HttpUtils utils = new HttpUtils(60 * 1000);
          utils.configCurrentHttpCacheExpiry(0);
          updateGroupLastTime(utils,message.getTargetId());
        }
      }
      return false;
    }
  }

  private class MyUnReadMessageCount implements IUnReadMessageObserver{

    @Override
    public void onCountChanged(int i) {
      WritableMap sendSuccess = Arguments.createMap();
      sendSuccess.putInt("unread_message_count",i);
      sendTransMisson(getReactNativeHost().getReactInstanceManager().getCurrentReactContext(), "unreadmessagecount_listener", sendSuccess);
    }
  }

  public static String getCurProcessName(Context context) {
    int pid = android.os.Process.myPid();
    ActivityManager activityManager = (ActivityManager) context
            .getSystemService(Context.ACTIVITY_SERVICE);
    for (ActivityManager.RunningAppProcessInfo appProcess : activityManager
            .getRunningAppProcesses()) {
      if (appProcess.pid == pid) {
        return appProcess.processName;
      }
    }
    return null;
  }

  public UserInfo getUserMessage(HttpUtils utils,String username) {
    final CountDownLatch latch = new CountDownLatch(1);
    //String getUserinfoUrl = "https://app.bcjiaoyu.com/program_girl/userinfo/username_userinfo/?username="+username;
    String getUserinfoUrl = "https://app.cxy61.com/program_girl/userinfo/username_userinfo/?username="+username;
    utils.send(HttpMethod.GET, getUserinfoUrl, new RequestCallBack<String>() {
      @Override
      public void onSuccess(ResponseInfo<String> responseInfo) {
        String json = responseInfo.result;
        try {
          JSONObject object = new JSONObject(json);
          String username = object.getString("owner");
          String nickname = object.getString("name");
          String thumb = object.getString("avatar");
          if (username != null & nickname != null & thumb != null){
            SQLiteDatabase db = new DBOpenHelper(getApplicationContext()).getWritableDatabase();
            id = Utils.insert(db, username, nickname, thumb);
          }
        } catch (JSONException e) {
          e.printStackTrace();
        }

        latch.countDown();
      }

      @Override
      public void onFailure(HttpException error, String msg) {
        //Toast.makeText(getReactApplicationContext(), "获取用户信息失败，请查看网络连接", Toast.LENGTH_SHORT).show();
        error.printStackTrace();
        latch.countDown();
      }
    });

    try {
      latch.await();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

    if (id > 0) {
      SQLiteDatabase read = new DBOpenHelper(getApplicationContext()).getReadableDatabase();
      return Utils.query(read, username);
    }else {
      String defaultusername = username;
      String defaultnickname = "暂无昵称";
      String defaultthumb = "https://fqs.haorenao.cn/defaultavatar.png";
      UserInfo userInfo = new UserInfo(defaultusername,defaultnickname, Uri.parse(defaultthumb));
      return userInfo;
    }
  }

  public Group getGroupMessage(HttpUtils utils,String groupid) {
    final CountDownLatch latch = new CountDownLatch(1);
    //String getUserinfoUrl = "https://app.bcjiaoyu.com/program_girl/club/club_detail/"+groupid+"/";
    String getUserinfoUrl = "https://app.cxy61.com/program_girl/club/club_detail/"+groupid+"/";
    utils.send(HttpMethod.GET, getUserinfoUrl, new RequestCallBack<String>() {
      @Override
      public void onSuccess(ResponseInfo<String> responseInfo) {
        String json = responseInfo.result;
        try {
          JSONObject object = new JSONObject(json);
          String username = object.getString("pk");
          String name = object.getString("name");
          String thumb = "https://fqs.haorenao.cn/defaultavatar.png";
          group = new Group(username,name,Uri.parse(thumb));
        } catch (JSONException e) {
          e.printStackTrace();
        }

        latch.countDown();
      }

      @Override
      public void onFailure(HttpException error, String msg) {
        //Toast.makeText(getReactApplicationContext(), "获取用户信息失败，请查看网络连接", Toast.LENGTH_SHORT).show();
        error.printStackTrace();
        latch.countDown();
      }
    });

    try {
      latch.await();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    return group;
  }

  public void updateGroupLastTime(HttpUtils utils,String groupid) {
    RequestParams requestParams = new RequestParams();
    requestParams.addHeader("Authorization","Token "+token);
    //String updateLastTimeUrl = "https://app.bcjiaoyu.com/program_girl/club/club_last_reply_time_update/"+groupid+"/";
    String updateLastTimeUrl = "https://app.cxy61.com/program_girl/club/club_last_reply_time_update/"+groupid+"/";
    utils.send(HttpMethod.PUT, updateLastTimeUrl, requestParams, new RequestCallBack<String>() {
      @Override
      public void onSuccess(ResponseInfo<String> responseInfo) {

      }

      @Override
      public void onFailure(HttpException error, String msg) {
        //Toast.makeText(getReactApplicationContext(), "获取用户信息失败，请查看网络连接", Toast.LENGTH_SHORT).show();
        error.printStackTrace();
      }
    });
  }

  public void sendTransMisson(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}

