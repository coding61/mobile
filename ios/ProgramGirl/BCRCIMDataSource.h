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

@end
