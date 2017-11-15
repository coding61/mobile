//
//  BCGroupAnnouncementVC.h
//  ProgramGirl
//
//  Created by chen on 2017/11/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface BCGroupAnnouncementVC : UIViewController<UITextViewDelegate,UIAlertViewDelegate>

@property (nonatomic, strong) UITextViewAndPlaceholder *AnnouncementContent;
@property (nonatomic, strong) NSString *groupId;

@end
