//
//  BCRCDataSource.h
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import <Foundation/Foundation.h>


#define BCRCDataSource [BCRCIMDataSource shareInstance]

/**
 * 此类用来实现融云用户信息的提供者
 */
@interface BCRCIMDataSource : NSObject<RCIMUserInfoDataSource, RCIMGroupInfoDataSource, RCIMGroupMemberDataSource>

+ (BCRCIMDataSource *)shareInstance;


/**
 获取融云个人信息

 @param userId 用户 id
 @param callback  融云用户信息
 */
- (void)getOtherInfo:(NSString *)userId callback:(void (^)(RCUserInfo *))callback;

/**
 获取融云群组成员信息

 @param groupId 群组 id
 @param callback  融云群组成员
 */
- (void)getGroupMemberInfo:(NSString *)groupId callback:(void (^)(NSArray *))callback;

@end
