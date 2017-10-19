//
//  BCAFRequest.m
//  TeaShop
//
//  Created by chen on 16/11/25.
//  Copyright © 2016年 Ali Karagoz. All rights reserved.
//

#import "BCAFRequest.h"

@implementation BCAFRequest

//获取融云 token
+ (NSURLSessionDataTask *)getRongTokenWithURL:(NSString *)url WithParams:(NSDictionary *)param WithBlock:(void (^)(id, NSError *))block{
  NSString *string = [NSString stringWithFormat:@"Token %@",[[NSUserDefaults standardUserDefaults] objectForKey:UserToken]];
  [[[AFAppNetAPIClient shareClient] requestSerializer] setValue:string forHTTPHeaderField:@"Authorization"];

  
    return [[AFAppNetAPIClient shareClient] GET:url parameters:param progress:nil success:^(NSURLSessionDataTask *task, id responseObject) {
        if (block) {
            block(responseObject, nil);
        }
    } failure:^(NSURLSessionDataTask *task, NSError *error) {
        if (block) {
            block(nil, error);
        }
    }];
}
//获取个人信息
+ (NSURLSessionDataTask *)getOwnInfo:(NSString *)url WithBlock:(void (^)(id, NSError *))block{
  NSString *string = [NSString stringWithFormat:@"Token %@",[[NSUserDefaults standardUserDefaults] objectForKey:UserToken]];
  [[[AFAppNetAPIClient shareClient] requestSerializer] setValue:string forHTTPHeaderField:@"Authorization"];
  
    return [[AFAppNetAPIClient shareClient] GET:url parameters:nil progress:nil success:^(NSURLSessionDataTask *task, id responseObject) {
        if (block) {
            block(responseObject, nil);
        }
    } failure:^(NSURLSessionDataTask *task, NSError *error) {
        if (block) {
            block(nil, error);
        }
    }];
}
//获取他人信息
+ (NSURLSessionDataTask *)getOtherInfo:(NSString *)url WithBlock:(void (^)(id, NSError *))block{
  NSString *string = [NSString stringWithFormat:@"Token %@",[[NSUserDefaults standardUserDefaults] objectForKey:UserToken]];
  [[[AFAppNetAPIClient shareClient] requestSerializer] setValue:string forHTTPHeaderField:@"Authorization"];
    return [[AFAppNetAPIClient shareClient] GET:url parameters:nil progress:nil success:^(NSURLSessionDataTask *task, id responseObject) {
        if (block) {
            block(responseObject, nil);
        }
    } failure:^(NSURLSessionDataTask *task, NSError *error) {
        if (block) {
            block(nil, error);
        }
    }];
}

//获取群组信息
+ (NSURLSessionDataTask *)getGroupInfo:(NSString *)url WithBlock:(void (^)(id, NSError *))block{
    return [[AFAppNetAPIClient shareClient] GET:url parameters:nil progress:nil success:^(NSURLSessionDataTask *task, id responseObject) {
        if (block) {
            block(responseObject, nil);
        }
    } failure:^(NSURLSessionDataTask *task, NSError *error) {
        if (block) {
            block(nil, error);
        }
    }];
}
@end
