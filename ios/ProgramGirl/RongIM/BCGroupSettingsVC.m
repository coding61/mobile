//
//  BCGroupSettingsVC.m
//  ProgramGirl
//
//  Created by chen on 2017/11/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "BCGroupSettingsVC.h"
#import "BCGroupSettingsCell.h"
#import "BCGroupAnnouncementVC.h"
#define SwitchButtonTag 1
@interface BCGroupSettingsVC ()

@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, assign) BOOL enableNotification;

@end

@implementation BCGroupSettingsVC{
  BOOL isCreator;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  //标题
  self.view.backgroundColor = [UIColor whiteColor];
  self.navigationItem.title = @"群组信息";
  
  //视图
  [self.view addSubview:self.tableView];
  
  //是否是管理员
  [self getGroupCreator:self.groupId];
  
  //获取群组"免打扰"状态
  [[RCIMClient sharedRCIMClient] getConversationNotificationStatus:ConversationType_GROUP targetId:self.groupId success:^(RCConversationNotificationStatus nStatus) {
    self.enableNotification = NO;
    if (nStatus == NOTIFY) {
      self.enableNotification = YES;
    }
  } error:^(RCErrorCode status) {
    
  }];
}
- (void)viewWillAppear:(BOOL)animated{
  [super viewWillAppear:animated];
  [self.navigationController setNavigationBarHidden:NO animated:YES];
}
- (void)viewWillDisappear:(BOOL)animated{
  [super viewWillDisappear:animated];
  [self.navigationController setNavigationBarHidden:YES animated:YES];
}
- (UITableView *)tableView{
  if (!_tableView) {
    _tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStyleGrouped];
    
    _tableView.dataSource = self;
    _tableView.delegate = self;
    _tableView.estimatedSectionHeaderHeight = 0;
    _tableView.estimatedSectionFooterHeight = 0;
  }
  return _tableView;
}
#pragma mark - UITableViewDataSource
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
  return 2;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
  return 1;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
  static NSString *idtifier = @"cell";
  BCGroupSettingsCell *cell = [tableView dequeueReusableCellWithIdentifier:idtifier];
  if (!cell) {
    cell = [[BCGroupSettingsCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:idtifier];
  }
  if (indexPath.section == 0 && indexPath.row == 0) {
    [cell setCellStyle:DefaultStyle_RightLabel];
    cell.leftLabel.text = @"群公告";
    cell.rightLabel.text = @"编辑公告";
  }else{
    [cell setCellStyle:SwitchStyle];
    cell.leftLabel.text = @"消息免打扰";
    cell.switchButton.tag = SwitchButtonTag;
    cell.switchButton.on = !self.enableNotification;
    [cell.switchButton addTarget:self action:@selector(onClickSwitch:) forControlEvents:UIControlEventValueChanged];
  }
  
  return cell;
}
#pragma mark - UITableViewDelegate
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section {
  return 14;
}
- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{
  return 0.1;
}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
  return 44.f;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
  [tableView deselectRowAtIndexPath:indexPath animated:YES];
  switch (indexPath.section) {
    case 0:
      switch (indexPath.row) {
        case 0:{
          if (isCreator == YES) {
            //修改群公告
            BCGroupAnnouncementVC *vc = [[BCGroupAnnouncementVC alloc] init];
            vc.groupId = self.groupId;
            [self.navigationController pushViewController:vc animated:YES];
          }else{
            [self showAlert:@"只有群主可以发布群公告"];
          }
        }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
      
}
- (void)onClickSwitch:(id)sender {
  UISwitch *switchBtn = (UISwitch *)sender;
  //“消息免打扰”的switch点击
  if (switchBtn.tag == SwitchButtonTag) {
    [[RCIMClient sharedRCIMClient] setConversationNotificationStatus:ConversationType_GROUP targetId:self.groupId isBlocked:switchBtn.on success:^(RCConversationNotificationStatus nStatus) {
      NSLog(@"成功");
     }
     error:^(RCErrorCode status) {
       NSLog(@"失败");
     }];
  }
}

//获取群组创建者
- (void)getGroupCreator:(NSString *)groupId{
  dispatch_async(dispatch_get_global_queue(0, 0), ^{
    [BCAFRequest getGroupInfo:[NSString stringWithFormat:GroupInfoUrl, groupId] WithBlock:^(id obj, NSError *error) {
      if (error) {
        //NSLog(@"获取群组信息失败");
      }else{
        NSLog(@"获取群组信息成功:\n%@\n", obj);
        if([[[RCIM sharedRCIM] currentUserInfo].userId isEqualToString:obj[@"leader"][@"owner"]]){
          //创建者
          isCreator = YES;
        }else{
          isCreator = NO;
        }
      }
    }];
  });
}
//弹框提示
- (void)showAlert:(NSString *)alertContent {
  UIAlertView *alert = [[UIAlertView alloc] initWithTitle:nil
                                                  message:alertContent
                                                 delegate:nil
                                        cancelButtonTitle:@"确定"
                                        otherButtonTitles:nil];
  [alert show];
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
