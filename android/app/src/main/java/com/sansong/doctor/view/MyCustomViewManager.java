package com.sansong.doctor.view;

import android.view.View;
import android.widget.ImageView;

import com.sansong.doctor.utils.GlideUtils;
import com.sansong.doctor.utils.StringUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

public class MyCustomViewManager extends SimpleViewManager<WebpImageView> {
    private static final int AD_CLICK = 1;

    @Override
    public String getName() {
        return "WebpImageView";
    }

    @Override
    protected WebpImageView createViewInstance(ThemedReactContext reactContext) {
        return new WebpImageView(reactContext); // 创建一个View实例供JS使用。
    }

    // 设置属性，一定需要加这个注解，不然不认识
    @ReactProp(name = "imageUri")
    public void setImageUri(WebpImageView view, String url) {
        GlideUtils.load(view.getContext(),url,view);
    }

    // 设置图片的展示方式 以后需要添加再这里加上
    @ReactProp(name = "ScaleType")
    public void setScaleType(WebpImageView view, String scaleType) {
        if (StringUtils.isNotBlank(scaleType)){
            switch(scaleType) {
                case "fit_xy":
                    view.setScaleType(ImageView.ScaleType.FIT_XY);
                    break;
                case "fit_center":
                    view.setScaleType(ImageView.ScaleType.FIT_CENTER);
                    break;
                case "center_crop":
                    view.setScaleType(ImageView.ScaleType.CENTER_CROP);
                    break;
                default:
                    view.setScaleType(ImageView.ScaleType.FIT_XY);
            }
        }
    }

    /**
     * 可以接收的JS发过来的事件，返回来的数据是一组对应了方法名以及方法对应的一个ID(这个ID需要唯一区分)的Map。
     * 这个在进入App的时候就会运行，得到相应的一组Map。
     */
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("adClick", AD_CLICK);
    }

    /**
     * 接收JS事件以后的处理。JS会通过一些发送发送相应的指令过来，Native会由receiveCommand来处理。
     * 事件过来时才会执行。
     */
    @Override
    public void receiveCommand(WebpImageView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        switch (commandId) {
            case AD_CLICK:
                List data = new ArrayList<>();
                for(int i = 0; i < args.size(); i++){
                    data.add(args.getString(i));
                }
                try {
                    String url = (String)data.get(0);
                    if ("url".equals(url)){
//                        GlideUtils.load();
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }

                break;
        }
    }

    /**
     * 暴露了在JS中定义的方法，例如下面的"onClick"是定义在JS中的方法。
     * 这个在进入App的时候就会运行  将注册的click 映射到js上就是onClick
     */
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("adClick", MapBuilder.of("registrationName", "onChange"))
                .build();
    }

    /**
     * 发射入口，相当于将Native的一些事件也注册给JS。
     * 这个在进入App的时候就会运行。
     */
    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final WebpImageView view) {
        super.addEventEmitters(reactContext, view);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 正常写法 也可以 直接 调用
                 RCTEventEmitter mEventEmitter=reactContext.getJSModule(RCTEventEmitter.class);
                 mEventEmitter.receiveEvent(view.getId(),"adClick", Arguments.createMap());
            }
        });
    }

}
