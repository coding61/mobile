//
//  RNBridgeModule.m
//  ProgramGirl
//
//  Created by chen on 2017/9/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RNBridgeModule.h"

@implementation RNBridgeModule
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()   //RNBridgeModule实现模块协议方法

//连接融云
RCT_EXPORT_METHOD(RNConnectRongIM:(NSString *)rongToken userInfo:(NSDictionary *)info failTimes:(int)times){
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *dic = @{RongToken:rongToken, Info:info};
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RNConnectRongIMNotification" object:nil userInfo:dic];
  });
}
RCT_EXPORT_METHOD(RNConnectRongIM:(NSString *)rongToken userToken:(NSString *)token failTimes:(int)times){
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *dic = @{RongToken:rongToken, UserToken:token};
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RNConnectRongIMTokenNotification" object:nil userInfo:dic];
  });
}
//开始聊天,单聊，群组等
RCT_EXPORT_METHOD(RNEnterChatView:(NSString *)targetId name:(NSString *)name tag:(NSString *)tag){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *dic = @{TargetID:targetId, TargetName:name, TargetTag:tag};
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RNEnterRongChatViewNotification" object:nil userInfo:dic];
  });
}
//会话列表
RCT_EXPORT_METHOD(RNEnterChatListView){
  
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RNEnterRongChatListViewNotification" object:nil userInfo:nil];
  });
}

@end
