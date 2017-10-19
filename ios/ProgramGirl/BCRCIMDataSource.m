//
//  BCRCDataSource.m
//  BCRongCloud
//
//  Created by chen on 2017/10/13.
//  Copyright © 2017年 chen. All rights reserved.
//

#import "BCRCIMDataSource.h"

@implementation BCRCIMDataSource

+ (BCRCIMDataSource *)shareInstance{
    static BCRCIMDataSource * instance = nil;
    static dispatch_once_t predicate;
    dispatch_once(&predicate, ^{
        instance = [[[self class] alloc] init];
    });
    return instance;
}

#pragma mark - RCIMUserInfoDataSource
- (void)getUserInfoWithUserId:(NSString *)userId completion:(void (^)(RCUserInfo *))completion{
    NSLog(@"getUserInfoWithUserId------%@", userId);
    RCUserInfo *user = [RCUserInfo new];
    if (userId == nil || [userId length] == 0) {
        user.userId = userId;
        user.portraitUri = @"";
        user.name = @"";
        completion(user);
        return;
    }
    
    //调用服务器接口根据 userId 异步请求数据
    if (![userId isEqualToString: [RCIM sharedRCIM].currentUserInfo.userId]) {
        [[BCRCIMDataSource shareInstance] getOtherInfo:userId callback:^(RCUserInfo *otherUser) {
            completion(otherUser);
        }];
    }else{
        [[BCRCIMDataSource shareInstance] getOwnInfo:userId callback:^(RCUserInfo *ownUser) {
            completion(ownUser);
        }];
    }
}
//通过 userId 获取他人的信息
- (void)getOtherInfo:(NSString *)userId callback:(void (^)(RCUserInfo *))callback{
    [BCAFRequest getOtherInfo:[NSString stringWithFormat:OtherInfoUrl,userId] WithBlock:^(id obj, NSError *error) {
        if (error) {
            NSLog(@"获取他人信息失败");
            NSDictionary *info = user2;
            RCUserInfo *user = [[RCUserInfo alloc] initWithUserId:info[UserId]
                                                             name:info[NickName]
                                                         portrait:info[PortraitUri]];
            callback(user);
        }else{
            RCUserInfo *userinfo = [[RCUserInfo alloc] init];
            userinfo.userId = obj[UserId];
            userinfo.name = obj[NickName];
            userinfo.portraitUri = obj[PortraitUri];
            
            callback(userinfo);
        }
    }];
}
//通过 userId 获取自己的信息
- (void)getOwnInfo:(NSString *)userId callback:(void (^)(RCUserInfo *))callback{
    [BCAFRequest getOwnInfo:OwnInfoUrl WithBlock:^(id obj, NSError *error) {
        if (error) {
            NSLog(@"获取自己信息失败");
            NSDictionary *info = user1;
            RCUserInfo *user = [[RCUserInfo alloc] initWithUserId:info[UserId]
                                                             name:info[NickName]
                                                         portrait:info[PortraitUri]];
            callback(user);
        }else{
        
            RCUserInfo *userinfo = [[RCUserInfo alloc] init];
            userinfo.userId = obj[UserId];
            userinfo.name = obj[NickName];
            userinfo.portraitUri = obj[PortraitUri];
            
            callback(userinfo);
        }
    }];
}

#pragma mark - RCIMGroupInfoDataSource
- (void)getGroupInfoWithGroupId:(NSString *)groupId
                     completion:(void (^)(RCGroup *groupInfo))completion{
    NSLog(@"getGroupInfoWithGroupId------%@", groupId);
    RCGroup *group = [RCGroup new];
    if (groupId == nil || [groupId length] == 0) {
        group.groupId = group1[GroupId];
        group.groupName = group1[GroupName];
        group.portraitUri = group1[GroupPortraitUri];
        
        completion(group);
        return;
    }
    
    //调用服务器接口，根据 groupId获取群组信息
    [[BCRCIMDataSource shareInstance] getGroupInfo:groupId callback:^(RCGroup *groupInfo) {
        [[RCIM sharedRCIM] refreshGroupInfoCache:groupInfo withGroupId:groupId];
        RCGroup *groupI = [[RCIM sharedRCIM] getGroupInfoCache:groupId];
        NSLog(@"groupId:%@, groupName:%@, groupThumb:%@", groupI.groupId, groupI.groupName, groupI.portraitUri);
        completion(groupI);
    }];
}
//获取群组信息，根据 groupId
- (void)getGroupInfo:(NSString *)groupId callback:(void (^)(RCGroup *))callback{
    [BCAFRequest getGroupInfo:[NSString stringWithFormat:GroupInfoUrl, groupId] WithBlock:^(id obj, NSError *error) {
        if (error) {
            NSLog(@"获取群组信息失败");
            NSDictionary *info = group1;
            NSLog(@"%@", info);
            RCGroup *group = [[RCGroup alloc] initWithGroupId:info[GroupId] groupName:info[GroupName] portraitUri:info[GroupPortraitUri]];
            
            callback(group);
        }else{
            RCGroup *group = [[RCGroup alloc] init];
            group.groupId =  obj[GroupId];
            group.groupName = obj[GroupName];
            group.portraitUri = obj[GroupPortraitUri]?obj[GroupPortraitUri]:GroupThumb;
          
            callback(group);
        }
    }];
}
@end
