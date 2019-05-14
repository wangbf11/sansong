package com.sansong.doctor;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.sansong.doctor.view.MyCustomViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class DplusReactPackage implements ReactPackage {

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                new MyCustomViewManager());
    }

    /**
     * 如需要添加本地方法，只需在这里add
     *
     * @param reactContext
     * @return
     */
    @Override
    public List<NativeModule> createNativeModules(
        ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new UMShareModule(reactContext));
        modules.add(new OpenNativeModule(reactContext));
        return modules;
    }
}
