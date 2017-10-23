//
//  BCRNConversationView.m
//  ProgramGirl
//
//  Created by chen on 2017/10/23.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RongYunView.h"

@interface RongYunView ()

@property (nonatomic, strong) UINavigationController *RongYun;
@property (weak, nonatomic) UIView *RongYunView;

@end
@implementation RongYunView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
//原生UI 的提供
- (instancetype)initWithFrame:(CGRect)frame{
  self = [super initWithFrame:frame];
  if (self) {
    [self addSubview:self.RongYunView];
  }
  return self;
}
#pragma mark - 懒加载
- (UIView *)RongYunView{
  if (!_RongYunView) {
    BCRCConversationListViewFirstVC *vc = [[BCRCConversationListViewFirstVC alloc] init];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:vc];
    nav.navigationBarHidden = YES;
    [nav setNavigationBarHidden:YES animated:YES];
    _RongYun = nav;
    _RongYunView = nav.view;
  }
  return _RongYunView;
}
@end
