
package com.sansong.doctor.RecyclerView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class RNRecyclerviewListModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNRecyclerviewListModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNRecyclerviewList";
  }
}