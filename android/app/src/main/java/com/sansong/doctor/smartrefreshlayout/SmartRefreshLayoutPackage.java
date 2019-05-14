package com.sansong.doctor.smartrefreshlayout;

import com.sansong.doctor.header.AnyHeaderManager;
import com.sansong.doctor.header.ClassicsHeaderManager;
import com.sansong.doctor.header.DefaultHeaderMananger;
import com.sansong.doctor.header.MaterialHeaderManager;
import com.sansong.doctor.header.StoreHouseHeaderManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by painter.g on 2018/3/6.
 */

public class SmartRefreshLayoutPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(
                new RCTSpinnerStyleModule(reactContext)
        );
    }
    //@Override >=0.47已经过期
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }
    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new SmartRefreshLayoutManager(),
                new ClassicsHeaderManager(),
                new StoreHouseHeaderManager(),
                new MaterialHeaderManager(),
                new AnyHeaderManager(),
                new DefaultHeaderMananger()
                );
    }
}
