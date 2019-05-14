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

//html 转json
#import "OCGumbo+Query.h"
#import "OCGumbo.h"

@interface OpenNativeModule()

@property (nonatomic, copy) NSString *listenerName;

@property (nonatomic,strong)NSMutableArray * detailArr;

@end

@implementation OpenNativeModule

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(OpenNativeModule)
//加入qq群
RCT_EXPORT_METHOD(RNOpenQQGroup:(RCTResponseSenderBlock)completion) {
  dispatch_async(dispatch_get_main_queue(), ^{
    BOOL result = [self joinGroup];
    if (completion) {
      if (result) {
        completion(@[@(1), @"open success"]);
      }
      else {
        completion(@[@(0), @"no qq"]);
      }
    }
  });
}

//获取版本信息
RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock)completion) {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
    completion(@[[NSNull null],version]);
  });
}

- (BOOL)joinGroup {
  NSString *urlStr = [NSString stringWithFormat:@"mqqapi://card/show_pslcard?src_type=internal&version=1&uin=%@&key=%@&card_type=group&source=external", @"815348510",@"e856c12e4f7debda82631f33a2d460f38e9523efd59106809d85ababa4a151e2"];
  NSURL *url = [NSURL URLWithString:urlStr];
  if([[UIApplication sharedApplication] canOpenURL:url]){
    [[UIApplication sharedApplication] openURL:url];
    return YES;
  }
  return NO;
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

RCT_EXPORT_METHOD(getAdData:(NSString*)num slotId: (NSString*)slotId listenerName: (NSString *)name scale:(NSString *)scale) {
  dispatch_async(dispatch_get_main_queue(), ^{
    self.listenerName = name;
    [self loadAd:num slotId:slotId scale:scale];
  });
}

-(void)loadAd:(NSString *)num slotId:(NSString *)slotId scale:(NSString *)scale {
  BUSize *size = [self byScale:scale];
  BUNativeAdsManager *nad = [BUNativeAdsManager new];
  BUAdSlot *slot1 = [[BUAdSlot alloc] init];
  slot1.ID = slotId;
  slot1.AdType = BUAdSlotAdTypeFeed;
  slot1.position = BUAdSlotPositionTop;
  slot1.imgSize = size;
  slot1.isSupportDeepLink = YES;
  nad.adslot = slot1;
  nad.delegate = self;
  [nad loadAdDataWithCount:[num integerValue]];
}

- (void)nativeAdsManagerSuccessToLoad:(BUNativeAdsManager *)adsManager nativeAds:(NSArray<BUNativeAd *> *_Nullable)nativeAdDataArray {
  NSMutableArray *dataArr = [NSMutableArray new];
  for (BUNativeAd *model in nativeAdDataArray) {
    NSMutableDictionary *ad = [NSMutableDictionary new];
    NSMutableArray * imageArr = [NSMutableArray new];
    for (BUImage *image in model.data.imageAry) {
      [imageArr addObject:image.imageURL];
    }
    [ad setObject:imageArr forKey:@"imageArr"];
    [ad setObject:model.data.icon.imageURL forKey:@"icon"];
    [ad setObject:model.data.AdTitle forKey:@"title"];
    [ad setObject:model.data.AdDescription forKey:@"description"];
    [ad setObject:(model.data.source)?model.data.source:@"" forKey:@"source"];
    [dataArr addObject:ad];
  }
  [self.bridge.eventDispatcher sendAppEventWithName:self.listenerName body:dataArr];
}

- (BUSize *)byScale:(NSString *)scale {
  CGFloat ss = [scale floatValue];
  if (ss < 1) {
    return [BUSize sizeBy:BUProposalSize_Banner600_388];
  }
  if (ss == 1) {
    return [BUSize sizeBy:BUProposalSize_Interstitial600_600];
  }
  if (ss > 1) {
    return [BUSize sizeBy:BUProposalSize_Interstitial600_900];
  }
  return [BUSize sizeBy:BUProposalSize_DrawFullScreen];
}

- (void)nativeAdsManager:(BUNativeAdsManager *)adsManager didFailWithError:(NSError *_Nullable)error {
  NSLog(@"%s %@", __PRETTY_FUNCTION__, error);
}

RCT_EXPORT_METHOD(parseHtml:(NSString *)htmlS completion:(RCTResponseSenderBlock)completion) {
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    self.detailArr = [NSMutableArray array];
    NSMutableAttributedString *attr = [NSMutableAttributedString new];
    OCGumboDocument *document = [[OCGumboDocument alloc] initWithHTMLString:htmlS];
    OCGumboElement *body = document.body;
    NSMutableDictionary *attributeDict = [NSMutableDictionary new];////空的字典，用来储存HTML中指定标签的内容
    [self logNode:body dic:attributeDict content:attr];//对HTML文本进行解析
    if (completion) {
      completion(@[[NSNull null],self.detailArr]);
    }
  });
}

- (void)logNode:(OCGumboNode *)node dic:(NSMutableDictionary *)dic content:(NSMutableAttributedString *)content {
  NSMutableDictionary *copyDict = [dic mutableCopy];
  for (int i = 0; i< node.childNodes.count; i++) {
    OCGumboNode *child = node.childNodes[i];
    if ([child isKindOfClass:[OCGumboText class]]) { //node为OCGumboText类型时候，它的nodeValue值就是HTML里面的普通文本
      OCGumboText *test = (OCGumboText *)child;
      if ([child.nodeName isEqualToString:@"#text"]) {
        if (copyDict.count >0) {
          if ([copyDict.allKeys containsObject:@"strong"]) {
            [self.detailArr addObject:@{@"strong_text":child.nodeValue}];
          }else{
            [self.detailArr addObject:@{@"text":child.nodeValue}];
          }
        }else{
          [self.detailArr addObject:@{@"text":child.nodeValue}];
        }
        NSMutableAttributedString *subContent = [[NSMutableAttributedString alloc] initWithString:child.nodeValue attributes:@{NSForegroundColorAttributeName: [UIColor blackColor], NSFontAttributeName:[UIFont systemFontOfSize:15]}];//根据默认的颜色和字体生成普通的NSAttributeString
        NSLog(@"========== textNode ===========");
        NSLog(@" nodeName: %@, nodeValue:%@", child.nodeName, child.nodeValue);
        NSLog(@"text: %@", test.data);
        NSLog(@"========================== \n\n");
        if (copyDict.count > 0) {
          //对之前扫描到的属性字段进行遍历，并把属性设置到NSAtributeString上
          [copyDict enumerateKeysAndObjectsUsingBlock:^(NSString*  _Nonnull key, id  _Nonnull obj, BOOL * _Nonnull stop) {
            if ([key isEqualToString:@"color"]) {
              [subContent addAttribute:NSForegroundColorAttributeName value:obj range:NSMakeRange(0, subContent.string.length)];
            }
            if ([key isEqualToString:@"strong"]) {
              [subContent addAttribute:NSFontAttributeName value:[UIFont boldSystemFontOfSize:20] range:NSMakeRange(0, subContent.string.length)];
            }
          }];
        }
        
        [content appendAttributedString:subContent];
      }
    }
    if ([child isKindOfClass:[OCGumboElement class]]) { //判断是否是普通的node
      NSArray *attributeArray = ((OCGumboElement *)child).attributes;
      NSLog(@"************* attrbuteNode *************");
      NSLog(@" nodeName: %@, nodeValue:%@", child.nodeName, child.nodeValue);
      NSMutableDictionary *dic1 = [dic mutableCopy];
      if ([child.nodeName isEqualToString:@"span"]) { //判断是否是span标签
        for (OCGumboAttribute *attr in attributeArray) {
          NSLog(@"name: %@， value: %@",attr.name,attr.value);
          if ([attr.name isEqualToString:@"style"]) { //判断是否是style属性
            if ([attr.value containsString:@"color"]) { //判断style属性中是否颜色,有则取出来
              unsigned rgbValue;
              NSScanner *scanner = [NSScanner scannerWithString:attr.value];
              [scanner scanUpToString:@"color:#" intoString:NULL];
              [scanner scanString:@"color:#" intoString:NULL];
              [scanner scanHexInt:&rgbValue];
              
              if (rgbValue > 0) {
                UIColor *color = [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
                dic1[@"color"] = color;
              }
            }
            
          }
        }
      }
      if ([child.nodeName isEqualToString:@"strong"]) { //判断是否是strong标签
        dic1[@"strong"] = @(1);
      }
      if ([child.nodeName isEqualToString:@"img"]) { //判断是否img标签
        NSMutableDictionary * dic =[NSMutableDictionary dictionary];
        for (OCGumboAttribute *attr in attributeArray) {
          NSLog(@"name: %@， value: %@",attr.name,attr.value);
          if ([attr.name isEqualToString:@"src"]) { //抽出img的src属性 并生成相应的NSAtributeString拼接上去
            NSString *img = attr.value;
            //                        [self.detailArr addObject:@{@"image":img}];
            [dic setValue:img forKey:@"image"];
            //            [self.imageURLArr addObject:img];
            //                        YYImage * image = [YYImage imageWithData:[NSData dataWithContentsOfURL:[NSURL URLWithString:img]]];
            //                        if (image) {
            //                          [self.yyImageArr addObject:@{img:image}];
            //                            [self.imageURLArr addObject:img];
            //
            //                        }else{
            //                            [self.yyImageArr addObject:@{img:[UIImage imageNamed:@"noImage"]}];
            //                        }
            
            NSLog(@"img: %@",img);
            NSAttributedString *imgstr = [[NSAttributedString alloc]initWithString:@"img" attributes:@{NSForegroundColorAttributeName: [UIColor blueColor],NSFontAttributeName:[UIFont systemFontOfSize:15]}];
            [content appendAttributedString:imgstr];
          }
          if ([attr.name isEqualToString:@"img_width"]) {
            [dic setValue:attr.value forKey:@"img_width"];
          }
          if ([attr.name isEqualToString:@"img_height"]) {
            [dic setValue:attr.value forKey:@"img_height"];
          }
        }
        NSLog(@"%@", dic);
        [self.detailArr addObject:dic];
      }
      
      NSLog(@"************************** \n\n");
      NSLog(@"> > > > > > > > > > > > > > > \n\n");
      //      [self configComment];
      [self logNode:child dic:dic1 content:content];
    }
  }
  
}

@end

