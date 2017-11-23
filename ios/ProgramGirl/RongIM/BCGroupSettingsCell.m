//
//  BCGroupSettingsCell.m
//  ProgramGirl
//
//  Created by chen on 2017/11/22.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "BCGroupSettingsCell.h"

@interface BCGroupSettingsCell ()

@property (nonatomic, strong) NSDictionary *cellSubViews;

@end
@implementation BCGroupSettingsCell

- (instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
  if (self == [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
    [self initialize];
  }
  return self;
}
- (void)initialize {
  self.leftLabel = [[UILabel alloc] init];
  self.leftLabel.font = [UIFont systemFontOfSize:16.f];
  self.leftLabel.textColor = [UIColor colorWithHexString:@"000000" alpha:1.0];
  self.leftLabel.translatesAutoresizingMaskIntoConstraints = NO;
  
  self.rightLabel = [[UILabel alloc] init];
  self.rightLabel.font = [UIFont systemFontOfSize:14.f];
  self.rightLabel.textColor = [UIColor colorWithHexString:@"999999" alpha:1.0];
  self.rightLabel.translatesAutoresizingMaskIntoConstraints = NO;
  
  self.rightArrow = [[UIImageView alloc] init];
  self.rightArrow.image = [UIImage imageNamed:@"right_arrow"];
  self.rightArrow.translatesAutoresizingMaskIntoConstraints = NO;
  
  self.switchButton = [[UISwitch alloc] init];
//  [self.switchButton addTarget:self action:@selector(onClickSwitch:) forControlEvents:UIControlEventValueChanged];
  self.switchButton.on = false;
  self.switchButton.translatesAutoresizingMaskIntoConstraints = NO;
  
//  self.bottomLine = [[UIView alloc] init];
//  self.bottomLine.backgroundColor = [UIColor colorWithHexString:@"dfdfdf" alpha:1.0];
//  self.bottomLine.translatesAutoresizingMaskIntoConstraints = NO;
  
  [self.contentView addSubview:self.leftLabel];
  [self.contentView addSubview:self.rightLabel];
  [self.contentView addSubview:self.rightArrow];
  [self.contentView addSubview:self.switchButton];
//  [self.contentView addSubview:self.bottomLine];
  
  self.cellSubViews =
  NSDictionaryOfVariableBindings(_leftLabel, _rightLabel, _rightArrow, _switchButton);
  [self setLayout];
}
- (void)setLayout {
  [self.contentView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[_leftLabel(21)]"
                                                                           options:0
                                                                           metrics:nil
                                                                             views:self.cellSubViews]];
  [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:_leftLabel
                                                               attribute:NSLayoutAttributeCenterY
                                                               relatedBy:NSLayoutRelationEqual
                                                                  toItem:self.contentView
                                                               attribute:NSLayoutAttributeCenterY
                                                              multiplier:1
                                                                constant:0]];
  
  [self.contentView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[_rightLabel(21)]"
                                                                           options:0
                                                                           metrics:nil
                                                                             views:self.cellSubViews]];
  [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:_rightLabel
                                                               attribute:NSLayoutAttributeCenterY
                                                               relatedBy:NSLayoutRelationEqual
                                                                  toItem:self.contentView
                                                               attribute:NSLayoutAttributeCenterY
                                                              multiplier:1
                                                                constant:0]];
  
  [self.contentView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[_rightArrow(13)]"
                                                                           options:0
                                                                           metrics:nil
                                                                             views:self.cellSubViews]];
  [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:_rightArrow
                                                               attribute:NSLayoutAttributeCenterY
                                                               relatedBy:NSLayoutRelationEqual
                                                                  toItem:self.contentView
                                                               attribute:NSLayoutAttributeCenterY
                                                              multiplier:1
                                                                constant:0]];
  /*
  [self.contentView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"H:|-10-[_bottomLine]|"
                                                                           options:0
                                                                           metrics:nil
                                                                             views:self.cellSubViews]];
  [self.contentView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:@"V:[_bottomLine(0.5)]|"
                                                                           options:0
                                                                           metrics:nil
                                                                             views:self.cellSubViews]];
  */
  [self.contentView addConstraint:[NSLayoutConstraint constraintWithItem:_switchButton
                                                               attribute:NSLayoutAttributeCenterY
                                                               relatedBy:NSLayoutRelationEqual
                                                                  toItem:self.contentView
                                                               attribute:NSLayoutAttributeCenterY
                                                              multiplier:1
                                                                constant:0]];
}
//设置cell的style
- (void)setCellStyle:(BCGroupSettingCellStyle)style {
  NSString *constraints;
  switch (style) {
    case DefaultStyle: {
      self.rightLabel.hidden = YES;
      self.switchButton.hidden = YES;
      constraints = @"H:|-10-[_leftLabel]-(>=10)-[_rightArrow(8)]-10-|";
    } break;
      
    case DefaultStyle_RightLabel_WithoutRightArrow: {
      self.rightArrow.hidden = YES;
      self.switchButton.hidden = YES;
      constraints = @"H:|-10-[_leftLabel]-(>=10)-[_rightLabel]-10-|";
    } break;
      
    case DefaultStyle_RightLabel: {
      self.switchButton.hidden = YES;
      constraints = @"H:|-10-[_leftLabel]-(>=10)-[_rightLabel]-13-[_rightArrow(8)]-10-|";
    } break;
      
    case OnlyDisplayLeftLabelStyle: {
      self.rightLabel.hidden = YES;
      self.rightArrow.hidden = YES;
      self.switchButton.hidden = YES;
      constraints = @"H:|-10-[_leftLabel]-10-|";
    } break;
      
    case SwitchStyle: {
      self.rightLabel.hidden = YES;
      self.rightArrow.hidden = YES;
      self.switchButton.hidden = NO;
      constraints = @"H:|-10-[_leftLabel]-(>=10)-[_switchButton]-10-|";
    } break;
    default:
      break;
  }
  [self.contentView addConstraints:[NSLayoutConstraint constraintsWithVisualFormat:constraints
                                                                           options:0
                                                                           metrics:nil
                                                                             views:self.cellSubViews]];
}
- (void)awakeFromNib {
    [super awakeFromNib];
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
