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

@end

@implementation BCGroupSettingsVC

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  //标题
  self.view.backgroundColor = [UIColor whiteColor];
  self.navigationItem.title = @"群组信息";
  
  //视图
  [self.view addSubview:self.tableView];
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
          //修改群公告
          BCGroupAnnouncementVC *vc = [[BCGroupAnnouncementVC alloc] init];
          vc.groupId = self.groupId;
          [self.navigationController pushViewController:vc animated:YES];
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
