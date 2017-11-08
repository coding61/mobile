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

/**
 连接融云成功的监听
 */
- (void)sendMsg;

/**
 发监听，通知 rn 融云是否含有未读消息

 @param hasUnread true 有，false 无
 */
- (void)hasUnreadMsg:(NSString *)hasUnread;
@end
