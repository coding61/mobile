//
//  RNBridgeModule.m
//  ProgramGirl
//
//  Created by chen on 2017/9/11.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RNBridgeModule.h"

@implementation RNBridgeModule{
  bool hasListeners;
}

+ (id)allocWithZone:(NSZone *)zone {
  static RNBridgeModule *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

//导出这个类，不然js不能使用 默认导出当前类名
RCT_EXPORT_MODULE();   //RNBridgeModule实现模块协议方法

//连接融云，并设置当前用户信息
//RCT_EXPORT_METHOD(RNConnectRongIM:(NSString *)rongToken userInfo:(NSDictionary *)info){
//  dispatch_async(dispatch_get_main_queue(), ^{
//    NSDictionary *dic = @{RongToken:rongToken, Info:info};
//    [[NSNotificationCenter defaultCenter] postNotificationName:@"RNConnectRongIMNotification" object:nil userInfo:dic];
//  });
//}
//连接融云，并存储用户 token，融云 token
RCT_EXPORT_METHOD(RNConnectRongIM:(NSString *)rongToken userToken:(NSString *)token){
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
//退出融云，即断开与融云的连接
RCT_EXPORT_METHOD(disconnect) {
  [[RCIM sharedRCIM] logout];
}
#pragma mark - 监听相关，iOS-》JS
// 在添加第一个监听函数时触发
-(void)startObserving {
  hasListeners = YES;
}
// 取消监听时触发
-(void)stopObserving {
  hasListeners = NO;
}
//这里注册一个退出登录的事件(通知名)
- (NSArray<NSString *> *)supportedEvents {
  return @[@"connectRongSuccess"];
}
- (void)sendMsg{
  if(hasListeners){
    //发送事件，可以携带数据
    [self sendEventWithName:@"connectRongSuccess" body:@{}];
  }
}
@end
