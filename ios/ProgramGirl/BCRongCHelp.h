//
//  BCRongCHelp.h
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface BCRongCHelp : NSObject

+ (BCRongCHelp *)shareInstance;

- (void)connectRongWithToken:(NSString *)token WithBlock:(void (^)(int))block;

@end
