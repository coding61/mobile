//
//  BCGroupSettingsCell.h
//  ProgramGirl
//
//  Created by chen on 2017/11/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
@interface BCGroupSettingsCell : UITableViewCell

@property (nonatomic, strong) UILabel *leftLabel;
@property (nonatomic, strong) UILabel *rightLabel;
@property (nonatomic, strong) UISwitch *switchButton;
@property (nonatomic, strong) UIImageView *rightArrow;
@property (nonatomic, strong) UIView *bottomLine;

/*!
 cell的style
 */
typedef NS_ENUM(NSUInteger, BCGroupSettingCellStyle) {
  /*!
   Display：leftLabel,rightArrow
   */
  DefaultStyle = 0,
  
  /*!
   Display：leftLabel,rightLabel
   */
  DefaultStyle_RightLabel_WithoutRightArrow = 1,
  
  /*!
   Display：leftLabel,rightLabel,rightArrow
   */
  DefaultStyle_RightLabel = 2,
  
  /*!
   Display：leftLabel,switchButton
   */
  SwitchStyle = 3,
  
  /*!
   Display：leftLabel
   */
  OnlyDisplayLeftLabelStyle = 4
};

//设置cell的style
- (void)setCellStyle:(BCGroupSettingCellStyle)style;
- (void)onClickSwitchButton:(id)sender;
@end
