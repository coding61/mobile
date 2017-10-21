
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#import "TalkingData.h"   //应用统计分析

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //应用统计分析初始化
  [TalkingData sessionStarted:@"16FACCF446A4432F8434C703CEAF04B4" withChannelId:@"AppStore"];
//  [TalkingData setLogEnabled:YES];
  
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"ProgramGirl"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
//  self.window.rootViewController = rootViewController;
  self.nav=[[UINavigationController alloc]initWithRootViewController:rootViewController];
  self.nav.navigationBarHidden = YES;
  self.window.rootViewController = self.nav;
  
  [[UIApplication sharedApplication] setStatusBarHidden:YES];  //隐藏状态栏
  [self.window makeKeyAndVisible];
  
#pragma mark - RongIM
  [[RCIM sharedRCIM] initWithAppKey:Rong_Key_Test];  //初始化融云环境
  //设置用户信息源和群组信息源
  [RCIM sharedRCIM].userInfoDataSource = BCRCDataSource;
  [RCIM sharedRCIM].groupInfoDataSource = BCRCDataSource;
  
  //设置Log级别，开发阶段打印详细log
//  [RCIMClient sharedRCIMClient].logLevel = RC_Log_Level_Info;
  

  //注册RN 连接融云监听者
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(RNConnectRongIMNotification:) name:@"RNConnectRongIMNotification" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(RNConnectRongIMTokenNotification:) name:@"RNConnectRongIMTokenNotification" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(RNEnterRongChatViewNotification:) name:@"RNEnterRongChatViewNotification" object:nil];
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(RNEnterRongChatListViewNotification:) name:@"RNEnterRongChatListViewNotification" object:nil];
  
  //已经登录的用户
  [[RCIM sharedRCIM] setConnectionStatusDelegate:self];
  
  return YES;
}
//连接融云通知实现
-(void)RNConnectRongIMNotification:(NSNotification *)noti{
  NSDictionary  *dic = noti.userInfo;
  
  NSString *token = dic[RongToken];
  NSDictionary *info = dic[Info];
  int failTimes = 0;
  
  [self loginRongWithToken:token userInfo:info failTimes:failTimes];
}
//连接融云通知实现,融token，用户 token
-(void)RNConnectRongIMTokenNotification:(NSNotification *)noti{
  NSDictionary  *dic = noti.userInfo;
  
  NSString *token = dic[RongToken];
  NSString *userToken = dic[UserToken];
  int failTimes = 0;
  
  
  [[NSUserDefaults standardUserDefaults] setObject:userToken forKey:UserToken];   //用户 token
  [[NSUserDefaults standardUserDefaults] setObject:token forKey:RongToken];       //融云 token
  
  [self loginRongWithToken:token userInfo:nil failTimes:failTimes];
}
//进入聊天界面
- (void)RNEnterRongChatViewNotification:(NSNotification *)noti{
  NSDictionary *dic = noti.userInfo;
  
  NSString *tag = dic[TargetTag];
  NSString *targetId = dic[TargetID];
  NSString *targetName = dic[TargetName];
  
  RCConversationType type = ConversationType_PRIVATE;
  if ([tag isEqualToString: SingleTag]) {
    type = ConversationType_PRIVATE;
  }else if([tag isEqualToString:GroupTag]){
    type = ConversationType_GROUP;
  }else if([tag isEqualToString:KefuTag]){
    type = ConversationType_CUSTOMERSERVICE;
  }
  
  //新建一个聊天会话View Controller对象
  BCRCConversationViewVC *chat = [[BCRCConversationViewVC alloc] initWithConversationType:type targetId:targetId];
  //设置会话的类型，如单聊、讨论组、群聊、聊天室、客服、公众服务会话等
  chat.conversationType = type;
  //设置会话的目标会话ID。（单聊、客服、公众服务会话为对方的ID，讨论组、群聊、聊天室为会话的ID）
  chat.targetId = targetId;
  
  //设置聊天会话界面要显示的标题
  chat.title = targetName;
  //显示聊天会话界面
  [self.nav pushViewController:chat animated:YES];
}
//进入会话列表
- (void)RNEnterRongChatListViewNotification:(NSNotification *)noti{
  BCRCConversationListViewVC *chatList = [[BCRCConversationListViewVC alloc] init];
  [self.nav pushViewController:chatList animated:YES];
}
- (void)loginRongWithToken:(NSString *)rongToken userInfo:(NSDictionary *)info failTimes:(int)times{
  __block int failTimes = times;
  [[BCRongCHelp shareInstance] connectRongWithToken:rongToken WithBlock:^(int ConnectStatus) {
    if (ConnectStatus == ConnectSuccess) {
      
      //连接融云成功
      /*
      RCUserInfo *user = [[RCUserInfo alloc] initWithUserId:info[UserId]
                                                       name:info[NickName]
                                                   portrait:info[PortraitUri]];
      [RCIM sharedRCIM].currentUserInfo = user;
       
      [[RCIM sharedRCIM] refreshUserInfoCache:user withUserId:info[UserId]];
       */
      
    }else if(ConnectStatus == ConnectFail){
      //连接融云失败
      dispatch_async(dispatch_get_main_queue(), ^{
        //SDK会自动重连登录，这时候需要监听连接状态
        [[RCIM sharedRCIM] setConnectionStatusDelegate:self];
      });
      
    }else if(ConnectStatus == TokenInCorrect){
      //token 错误
      if (failTimes < 1) {
        failTimes++;
        [BCAFRequest getRongTokenWithURL:RongTokenUrl WithParams:nil WithBlock:^(id obj, NSError *error) {
          if (error) {
            NSLog(@"请求 token 失败");
            return;
          }
          NSString *token = obj[RongToken];
          [self loginRongWithToken:token userInfo:info failTimes:failTimes];
        }];
      }
    }
  }];
}

#pragma mark - RCIMConnectionStatusDelegate

/**
 *  网络状态变化。
 *
 *  @param status 网络状态。
 */
- (void)onRCIMConnectionStatusChanged:(RCConnectionStatus)status {
  NSLog(@"status:%ld", (long)status);
  if (status == ConnectionStatus_KICKED_OFFLINE_BY_OTHER_CLIENT) {
    UIAlertView *alert = [[UIAlertView alloc]
                          initWithTitle:@"提示"
                          message:
                          @"您的帐号在别的设备上登录，"
                          @"您被迫下线！"
                          delegate:nil
                          cancelButtonTitle:@"知道了"
                          otherButtonTitles:nil, nil];
    [alert show];
    //让用户去登录
  } else if (status == ConnectionStatus_TOKEN_INCORRECT) {
    NSLog(@"重新请求去连接");
    //重新请求去连接
    [BCAFRequest getRongTokenWithURL:RongTokenUrl WithParams:nil WithBlock:^(id obj, NSError *error) {
      NSString *token = obj[RongToken];
      [[BCRongCHelp shareInstance] connectRongWithToken:token WithBlock:^(int ConnectStatus) {
        
      }];
    }];
  }else if (status == ConnectionStatus_DISCONN_EXCEPTION){
    [[RCIMClient sharedRCIMClient] disconnect];
    UIAlertView *alert = [[UIAlertView alloc]
                          initWithTitle:@"提示"
                          message:
                          @"您的帐号被封禁"
                          delegate:nil
                          cancelButtonTitle:@"知道了"
                          otherButtonTitles:nil, nil];
    [alert show];
    //让用户去登录
  }
}
@end
