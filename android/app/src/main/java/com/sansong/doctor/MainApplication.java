package com.sansong.doctor;

import android.support.multidex.MultiDexApplication;

import com.BV.LinearGradient.LinearGradientPackage;
import com.bumptech.glide.Glide;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.yamill.orientation.OrientationPackage;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
import com.sansong.doctor.RecyclerView.RNRecyclerviewListPackage;
import com.sansong.doctor.smartrefreshlayout.SmartRefreshLayoutPackage;
import com.sansong.doctor.utils.GlideUtils;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;

import org.devio.rn.splashscreen.SplashScreenReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
              new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey),
                      getApplicationContext(), BuildConfig.DEBUG,getResources().getString(R.string.reactNativeCodePush_androidDeploymentServer)),
            new SmartRefreshLayoutPackage(),
            new RNRecyclerviewListPackage(),
            new SplashScreenReactPackage(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new OrientationPackage(),
            new DplusReactPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    initUmeng();
    SoLoader.init(this, /* native exopackage */ false);
  }

    /**
     * 友盟初始化
     */
    private void initUmeng() {
        RNUMConfigure.init(this, "5bdfeb20b465f5a1ed0001ad", null, UMConfigure.DEVICE_TYPE_PHONE, "");  // 友盟初始化
    }

    {
        //设置分享平台
        PlatformConfig.setWeixin("wx6c9d879505173326", "b94c6dc7d0065d852c3c8545a0f60a51");
        PlatformConfig.setQQZone("100424468", "c7394704798a158208a74ab60104f0ba");
        PlatformConfig.setSinaWeibo("3921700954", "04b48b094faeb16683c32669824ebdad", "http://sns.whalecloud.com");

    }

  @Override
  public void onTrimMemory(int level) {
    super.onTrimMemory(level);
    if (level == TRIM_MEMORY_UI_HIDDEN) {
        GlideUtils.clearCacheMemory(this);
    }
    Glide.get(this).trimMemory(level);
  }

  @Override
  public void onLowMemory() {
    super.onLowMemory();
    //内存低的时候，清理Glide缓存
    GlideUtils.clearCacheMemory(this);
  }
}
