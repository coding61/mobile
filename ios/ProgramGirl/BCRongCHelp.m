//
//  BCRongCHelp.m
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import "BCRongCHelp.h"

@implementation BCRongCHelp

+ (BCRongCHelp *)shareInstance{
    static BCRongCHelp * instance = nil;
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        instance = [[[self class] alloc] init];
    });
    return instance;
}

- (void)connectRongWithToken:(NSString *)token WithBlock:(void (^)(int))block{
    
    [[RCIM sharedRCIM] connectWithToken:token success:^(NSString *userId) {
        NSLog(@"connectRongWithToken-----%@", userId);
        block(ConnectSuccess);
    } error:^(RCConnectErrorCode status) {
        //失败，监听连接状态，让 SDK 自动重连
        block(ConnectFail);
        
    } tokenIncorrect:^{
        //token 不正确, 重新请求 token，然后连接
        block(TokenInCorrect);
    }];
}

@end
