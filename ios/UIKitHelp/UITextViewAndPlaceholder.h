//
//  UITextViewAndPlaceholder.h
//  ProgramGirl
//
//  Created by chen on 2017/11/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface UITextViewAndPlaceholder : UITextView

@property(nonatomic,copy) NSString *myPlaceholder;  //文字
@property(nonatomic,strong) UIColor *myPlaceholderColor; //文字颜色

@end
