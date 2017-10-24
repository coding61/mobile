//
//  BCRCConversationListViewFirstVC.m
//  ProgramGirl
//
//  Created by chen on 2017/10/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "BCRCConversationListViewFirstVC.h"

@interface BCRCConversationListViewFirstVC ()

@end

@implementation BCRCConversationListViewFirstVC

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  
  //设置需要显示哪些类型的会话
  [self setDisplayConversationTypes:@[@(ConversationType_PRIVATE),
                                      @(ConversationType_DISCUSSION),
                                      @(ConversationType_CHATROOM),
                                      @(ConversationType_GROUP),
                                      @(ConversationType_APPSERVICE),
                                      @(ConversationType_SYSTEM)]];
  self.emptyConversationView = [[UIView alloc] init];
}
//重写RCConversationListViewController的onSelectedTableRow事件
- (void)onSelectedTableRow:(RCConversationModelType)conversationModelType
         conversationModel:(RCConversationModel *)model
               atIndexPath:(NSIndexPath *)indexPath {
  BCRCConversationViewVC *chat = [[BCRCConversationViewVC alloc] init];
  chat.conversationType = model.conversationType;
  chat.targetId = model.targetId;
  chat.title = model.conversationTitle;
  
  [CXYAppDelegate.nav pushViewController:chat animated:YES];
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