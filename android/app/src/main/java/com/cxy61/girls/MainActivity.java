package com.cxy61.girls;

import android.app.AlertDialog;
import android.content.*;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.qiniu.android.common.FixedZone;
import com.qiniu.android.http.ResponseInfo;
import com.qiniu.android.storage.*;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import com.lidroid.xutils.HttpUtils;
import com.lidroid.xutils.exception.HttpException;
import com.lidroid.xutils.http.RequestParams;
import com.lidroid.xutils.http.callback.RequestCallBack;
import com.lidroid.xutils.http.client.HttpRequest.HttpMethod;

public class MainActivity extends ReactActivity {
    int GALLERY_CODE = 0;
    int PHOTOGRAPH_CODE = 1;
    String login_token;
    String uploadkey;
    String uploadtoken;
    String filename;
    Boolean isPrivate;
    volatile boolean isCancelled = false;
    byte[] bytes;
    Bitmap bitmap;
    private BroadcastReceiver receiver;
    private File img;

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ProgramGirl";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            getServerVersionNumber();
        } catch (Exception e) {
            e.printStackTrace();
        }
        receiver = new InnerReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("CANCELUP");
        registerReceiver(receiver, filter);
    }
    private class InnerReceiver extends BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            if ("CANCELUP".equals(intent.getAction())) {
                isCancelled = true;
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        MainApplication app = new MainApplication();
        login_token = app.token;
        isPrivate = app.isPrivate;


        ContentResolver resolver = getContentResolver();

        if (resultCode != RESULT_OK ){
            Toast.makeText(MainActivity.this, "上传失败", Toast.LENGTH_SHORT).show();
            return;
        }

        if (requestCode == PHOTOGRAPH_CODE){
            Uri uri;
            Bundle bundle = data.getExtras();
            bitmap = (Bitmap)bundle.get("data");
            if(data.getData()!=null){
                uri = data.getData();
            }else {
                uri = Uri.parse(MediaStore.Images.Media.insertImage(getContentResolver(), bitmap, null,null));
            }
            getUriToBytes(uri,resolver);
        }

        if (requestCode == GALLERY_CODE ){
            Uri uri = data.getData();
            getUriToBytes(uri,resolver);
        }
    }

    public void getUriToBytes(Uri uri,ContentResolver resolver){
        Bitmap bitmap = null;
        int size = 1;
        try {
            //将图片内容解析成字节数组
            bytes = readStream(resolver.openInputStream(Uri.parse(uri.toString())));
            //将字节数组转换为ImageView可调用的Bitmap对象
            BitmapFactory.Options option = new BitmapFactory.Options();
            //option.inJustDecodeBounds = true;//并不会真的返回一个Bitmap给你，它仅仅会把它的宽，高取回来给你
            // 压缩图片:表示缩略图大小为原始图片大小的几分之一，1为原图
            //option.inSampleSize = option.outWidth / 1000;
            bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
            float width = bitmap.getWidth();
            float height = bitmap.getHeight();
            if (width <= 1000 || height <= 1000) {
                size = 1;
            } else {
                float Wsize = width / 800;
                float Hsize = height / 800;
                if (Wsize >= Hsize) {
                    size = (int) Hsize;
                } else {
                    size = (int) Wsize;
                }
                if (size % 2 != 0) {
                    size += 1;
                }
            }
            option.inSampleSize = size;
            bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length, option);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
        File tmpDir=new File(Environment.getExternalStorageDirectory(),File.separator+"child_girls/");
        if (!tmpDir.exists()) {
            tmpDir.mkdir();
        }
        String fileName = System.currentTimeMillis() + ".png";
        img = new File(tmpDir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(img);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }


        getTokenThread tokenThread=new getTokenThread();
        tokenThread.start();
    }

    public static byte[] readStream(InputStream inStream) throws Exception {
        byte[] buffer = new byte[1024];
        int len = -1;
        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        while ((len = inStream.read(buffer)) != -1) {
            outStream.write(buffer, 0, len);
        }
        byte[] data = outStream.toByteArray();
        outStream.close();
        inStream.close();
        return data;
    }


    public class getTokenThread extends Thread {
        @Override
        public void run() {
            String url = "https://app.cxy61.com/program_girl/upload/token/";
            HttpUtils utils = new HttpUtils(60 * 1000);
            utils.configCurrentHttpCacheExpiry(0);
            RequestParams requestParams = new RequestParams();
            requestParams.addHeader("Authorization","Token "+login_token);
            requestParams.addBodyParameter("filename", filename);
            if (isPrivate){
                requestParams.addBodyParameter("private", "true");
            }

            utils.send(HttpMethod.POST, url, requestParams, new RequestCallBack<String>() {
                @Override
                public void onSuccess(com.lidroid.xutils.http.ResponseInfo<String> responseInfo) {
                    String json = responseInfo.result;
                    try {
                        JSONObject object = new JSONObject(json);
                        uploadkey=object.getString("key");
                        uploadtoken=object.getString("token");
                        if (uploadkey !=null & uploadtoken!=null){
                            Configuration config = new Configuration.Builder().zone(FixedZone.zone0).build();
                            UploadManager uploadManager = new UploadManager(config);
                            File data=img;
                            String key = uploadkey;
                            String token = uploadtoken;
                            isCancelled = false;
                            WritableMap startSend = Arguments.createMap();
                            startSend.putString("start", "start");
                            sendTransMisson(MainActivity.this.getReactInstanceManager().getCurrentReactContext(),"uploadStrat_listener",startSend);
                            uploadManager.put(data, key, token,
                                    new UpCompletionHandler() {
                                        @Override
                                        public void complete(String key, ResponseInfo info, JSONObject res) {
                                            if (info.isOK()) {
                                                try {
                                                    String imageurl= res.getString("url");
                                                    String private_imageurl= res.getString("private_url");
                                                    Log.d("imageurl",res.toString());
                                                    Log.d("imageurl",imageurl);
                                                    Log.d("imageurl",private_imageurl);
                                                    WritableMap sendSuccess = Arguments.createMap();
                                                    sendSuccess.putString("imageurl", imageurl);
                                                    sendSuccess.putString("private_imageurl", private_imageurl);
                                                    sendTransMisson(MainActivity.this.getReactInstanceManager().getCurrentReactContext(), "uploadSuccess_listener", sendSuccess);

                                                    //Toast.makeText(MainActivity.this,imageurl,Toast.LENGTH_LONG).show();
                                                } catch (JSONException e) {
                                                    e.printStackTrace();
                                                }
                                            }
                                        }
                                    },
                                    new UploadOptions(null, null, false,
                                            new UpProgressHandler() {
                                                @Override
                                                public void progress(String key, double percent) {
                                                    int uploadpercent = (int) (percent * 100);
                                                    WritableMap sendMap = Arguments.createMap();
                                                    sendMap.putInt("progressNum", uploadpercent);
                                                    sendTransMisson(MainActivity.this.getReactInstanceManager().getCurrentReactContext(), "uploadProgress_listener", sendMap);
                                                    Log.d("uploadpercent",uploadpercent+"%");
                                                    //Toast.makeText(MainActivity.this,uploadpercent+"%",Toast.LENGTH_LONG).show();
                                                    if (uploadpercent == 100) {
                                                        Toast.makeText(MainActivity.this, "上传成功", Toast.LENGTH_SHORT).show();
                                                    }
                                                }
                                            }, new UpCancellationSignal() {
                                        @Override
                                        public boolean isCancelled() {
                                            return isCancelled;
                                        }
                                    })
                            );

                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                public void sendTransMisson(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
                    reactContext
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(eventName, params);

                }
                @Override
                public void onFailure(HttpException error, String msg) {
                    Log.d("error_msg",msg);
                    Toast.makeText(MainActivity.this, "上传失败，请查看网络连接", Toast.LENGTH_SHORT).show();
                    error.printStackTrace();
                }
            });
        }
    }

    @Override
    protected void onResume() {
        receiver = new InnerReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("CANCELUP");
        registerReceiver(receiver, filter);

        super.onResume();
    }

    private void getServerVersionNumber() throws Exception {
        String os="Android";
        String app_version=Utils.getVersionName(MainActivity.this);
        //String versionUrl="https://app.bcjiaoyu.com/program_girl/appversion/check_for_updates/?os="+os+"&app_version="+app_version;
        String versionUrl="https://app.cxy61.com/program_girl/appversion/check_for_updates/?os="+os+"&app_version="+app_version;

        HttpUtils utils=new HttpUtils(60*1000);
        utils.send(HttpMethod.GET, versionUrl, new RequestCallBack<String>() {
            @Override
            public void onSuccess(com.lidroid.xutils.http.ResponseInfo<String> responseInfo) {
                String json = responseInfo.result;
                try {
                    JSONObject object = new JSONObject(json);
                    //是否需要更新: false; true;
                    boolean need_update=object.getBoolean("need_update");
                    if (need_update){
                        showUpdateDialog();
                    }

                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(HttpException error, String msg) {
                error.printStackTrace();
            }
        });

    }

    private void showUpdateDialog() {
        final AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setIcon(R.mipmap.ic_launcher);
        String app_name= this.getString(R.string.app_name);
        builder.setTitle(app_name+"新版本更新");
        builder.setMessage(app_name+"最新版本来了，您可以升级至最新版本，立即更新！");
        builder.setCancelable(false);

        builder.setPositiveButton("立即更新", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                Uri uri = Uri.parse("http://android.myapp.com/myapp/detail.htm?apkName=com.cxy61.girls");
                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(uri);
                startActivity(intent);
            }
        });
        builder.setNegativeButton("取消", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });
        builder.create().show();
    }
}
