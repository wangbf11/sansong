package com.sansong.doctor;

import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class OpenNativeModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;

    public OpenNativeModule(ReactApplicationContext context) {
        super(context);
        mContext = context;
    }

    @Override
    public String getName() {
        return "OpenNativeModule";
    }

    @ReactMethod
    public void getAppVersion(Callback callback) {
        PackageInfo info = null;
        String versionName = "";
        int versionCode = -1;
        try {
            info = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
            versionCode = info.versionCode;
            versionName = info.versionName;
            callback.invoke(versionName);
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke("");
        }
    }

    @ReactMethod
    public void getAdData(String num,String slotId,String listenerName) {
        WritableArray writableArray = new WritableNativeArray();
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(listenerName, writableArray);
    }

    @ReactMethod
    public void RNOpenUrl(String url,Callback callback) {
        try {
            Uri uri = Uri.parse(url);
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            mContext.startActivity(intent);
            callback.invoke("1","打开成功");
        }catch (Exception e){
            e.printStackTrace();
            callback.invoke("0","打开失败");
        }
    }
}
