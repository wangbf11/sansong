//
//  OpenNativeModule.m
//  DouDouSee
//
//  Created by 突突兔 on 2019/2/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "OpenNativeModule.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface OpenNativeModule()

@property (nonatomic, copy) NSString *listenerName;

@property (nonatomic,strong)NSMutableArray * detailArr;

@end

@implementation OpenNativeModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(OpenNativeModule)


//获取版本信息
RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock)completion) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
    completion(@[[NSNull null],version]);
  });
}

//打开外部链接
RCT_EXPORT_METHOD(RNOpenUrl:(NSString *)urlStr completion:(RCTResponseSenderBlock)completion) {
  dispatch_async(dispatch_get_main_queue(), ^{
    BOOL result = [self openURL:urlStr];
    if (completion) {
      if (result) {
        completion(@[@(1), @"open url"]);
      }
      else {
        completion(@[@(0), @"no url"]);
      }
    }
  });
}

- (BOOL)openURL: (NSString *)urlStr {
  NSURL *url = [NSURL URLWithString:urlStr];
  if([[UIApplication sharedApplication] canOpenURL:url]){
    [[UIApplication sharedApplication] openURL:url];
    return YES;
  }
  return NO;
}

@end

