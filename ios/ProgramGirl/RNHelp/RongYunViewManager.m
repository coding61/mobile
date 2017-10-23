//
//  RNViewManager.m
//  ProgramGirl
//
//  Created by chen on 2017/10/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RongYunViewManager.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import "RongYunView.h"
@implementation RongYunViewManager

RCT_EXPORT_MODULE()
- (UIView *)view {
  RongYunView *view = [[RongYunView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  return view;
}

@end
