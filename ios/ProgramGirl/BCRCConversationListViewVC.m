//
//  BCRCConversationListViewVC.m
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import "BCRCConversationListViewVC.h"
#import "BCRCConversationViewVC.h"
@interface BCRCConversationListViewVC ()

@end

@implementation BCRCConversationListViewVC

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
    //设置需要将哪些类型的会话在会话列表中聚合显示
//    [self setCollectionConversationType:@[@(ConversationType_DISCUSSION),
//                                          @(ConversationType_GROUP)]];
  
  self.emptyConversationView = [[UIView alloc] init];
  self.title = @"会话列表";
  self.navigationController.navigationBar.translucent = NO;
  
}
//重写RCConversationListViewController的onSelectedTableRow事件
- (void)onSelectedTableRow:(RCConversationModelType)conversationModelType
         conversationModel:(RCConversationModel *)model
               atIndexPath:(NSIndexPath *)indexPath {
    BCRCConversationViewVC *chat = [[BCRCConversationViewVC alloc] init];
    chat.conversationType = model.conversationType;
    chat.targetId = model.targetId;
    chat.title = model.conversationTitle;
    [self.navigationController pushViewController:chat animated:YES];
}
- (void)back:(id)sender{
  [self.navigationController popViewControllerAnimated:YES];
}
- (void)viewWillAppear:(BOOL)animated{
  [super viewWillAppear:animated];
  
  [self.navigationController setNavigationBarHidden:NO animated:YES];
  
  [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];//设置导航栏返回按钮的颜色
  [self.navigationController.navigationBar setBackIndicatorImage:[UIImage imageNamed:@"back"]];
  [self.navigationController.navigationBar setBackIndicatorTransitionMaskImage:[UIImage imageNamed:@"back"]];
  [self.navigationController.navigationBar setBarTintColor:[UIColor colorWithRed:250/255.0 green:80/255.0 blue:131/255.0 alpha:1]];
  self.navigationController.navigationBar.titleTextAttributes = [NSDictionary dictionaryWithObject:[UIColor whiteColor] forKey:NSForegroundColorAttributeName];
  [self.navigationItem setHidesBackButton:YES animated:YES];
  UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back"] style:UIBarButtonItemStylePlain target:self action:@selector(back:)];
  self.navigationItem.leftBarButtonItem = item;
  
}
- (void)viewWillDisappear:(BOOL)animated{
  [super viewWillDisappear:animated];
  [self.navigationController setNavigationBarHidden:YES animated:YES];
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
