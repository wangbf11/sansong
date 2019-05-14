//
//  OpenNativeModule.h
//  DouDouSee
//
//  Created by 突突兔 on 2019/2/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface OpenNativeModule : NSObject<RCTBridgeModule, BUNativeAdsManagerDelegate>

@end

NS_ASSUME_NONNULL_END
