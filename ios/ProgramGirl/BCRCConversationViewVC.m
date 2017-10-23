//
//  BCRCConversationViewVC.m
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import "BCRCConversationViewVC.h"

@interface BCRCConversationViewVC ()

@end

@implementation BCRCConversationViewVC

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
  
  
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
