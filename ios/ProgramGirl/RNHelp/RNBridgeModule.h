//
//  RNBridgeModule.h
//  ProgramGirl
//
//  Created by chen on 2017/9/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>   //RN 交互
#import <React/RCTEventEmitter.h>

@interface RNBridgeModule : RCTEventEmitter<RCTBridgeModule>

- (void)sendMsg;

@end
