//
//  BCRCConversationViewVC.m
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import "BCRCConversationViewVC.h"
#import "BCGroupAnnouncementVC.h"
@interface BCRCConversationViewVC ()

@end

@implementation BCRCConversationViewVC

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
//   self.navigationController.navigationBar.translucent = NO;
}
- (void)back:(id)sender{
  [self.navigationController popViewControllerAnimated:YES];
}
- (void)rightBtnClick:(id)sender{
  BCGroupAnnouncementVC *vc = [[BCGroupAnnouncementVC alloc] init];
  vc.groupId = self.targetId;
  [self.navigationController pushViewController:vc animated:YES];
}
- (void)viewWillAppear:(BOOL)animated{
  [super viewWillAppear:animated];
  
//  self.navigationController.navigationBar.translucent = NO;
  [self.navigationController setNavigationBarHidden:NO animated:YES];
//  [[UIApplication sharedApplication] setStatusBarHidden:NO];  //隐藏状态栏
  
  [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];//设置导航栏返回按钮的颜色
  [self.navigationController.navigationBar setBackIndicatorImage:[UIImage imageNamed:@"back"]];
  [self.navigationController.navigationBar setBackIndicatorTransitionMaskImage:[UIImage imageNamed:@"back"]];
  [self.navigationController.navigationBar setBarTintColor:[UIColor colorWithRed:250/255.0 green:80/255.0 blue:131/255.0 alpha:1]];
  self.navigationController.navigationBar.titleTextAttributes = [NSDictionary dictionaryWithObject:[UIColor whiteColor] forKey:NSForegroundColorAttributeName];
  //去掉系统返回键后文字
  [[UIBarButtonItem appearance] setBackButtonTitlePositionAdjustment:UIOffsetMake(-100,0) forBarMetrics:UIBarMetricsDefault];
  
//  [self.navigationItem setHidesBackButton:YES animated:YES];
//  UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back"] style:UIBarButtonItemStylePlain target:self action:@selector(back:)];
//  self.navigationItem.leftBarButtonItem = item;
  
  if(self.conversationType == ConversationType_GROUP){
    //如果是群组，添加群公告，右按钮
    UIButton *btn = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, 50, 34)];
    [btn setTitle:@"群公告" forState:UIControlStateNormal];
    [btn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [btn addTarget:self action:@selector(rightBtnClick:) forControlEvents:UIControlEventTouchUpInside];
    
    UIBarButtonItem *rightButton = [[UIBarButtonItem alloc] initWithCustomView:btn];
    self.navigationItem.rightBarButtonItem = rightButton;
    
    [self refreshGroupMembers];
  }
}

- (void)viewWillDisappear:(BOOL)animated{
  [super viewWillDisappear:animated];
//  self.navigationController.navigationBar.translucent = YES;
  [self.navigationController setNavigationBarHidden:YES animated:YES];
//  [[UIApplication sharedApplication] setStatusBarHidden:YES];  //隐藏状态栏
}
- (void)refreshGroupMembers{
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    [[BCRCIMDataSource shareInstance] getGroupMemberInfo:self.targetId callback:^(NSArray * arr) {
      if (!arr.count) {
        return;
      }
      for (RCUserInfo *user in arr) {
        if ([user.portraitUri isEqualToString:@""]) {
          user.portraitUri = UserThumb;
        }
        [[RCIM sharedRCIM] refreshUserInfoCache:user withUserId:user.userId];
      }
    }];
  });
}
- (void)didSendMessage:(NSInteger)status content:(RCMessageContent *)messageContent{
  NSLog(@"%ld", (long)status);
  if(status == 0){
    if(self.conversationType == ConversationType_GROUP){
      NSLog(@"消息发送成功");
      [self updateActivitySort];
    }
  }
}
//通知服务器修改活动的排序
- (void)updateActivitySort{
  [BCAFRequest updateActivitySort:[NSString stringWithFormat:GroupReplyTimeUrl, self.targetId] WithBlock:^(id obj, NSError *error) {
    
  }];
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
