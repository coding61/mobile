//
//  BCAFRequest.h
//  TeaShop
//
//  Created by chen on 16/11/25.
//  Copyright © 2016年 Ali Karagoz. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFAppNetAPIClient.h"

@interface BCAFRequest : NSObject

/**
 获取融云的token
 
 @param url   请求url
 @param param 请求参数
 @param block 请求回调
 
 @return 发起网络请求
 */
+ (NSURLSessionDataTask *)getRongTokenWithURL:(NSString *)url WithParams:(NSDictionary *)param WithBlock:(void (^) (id obj, NSError *error))block;


/**
 获取个人信息

 @param url 请求 url
 @param block  请求回调
 @return 发起网络请求
 */
+ (NSURLSessionDataTask *)getOwnInfo:(NSString *)url WithBlock:(void (^)(id obj, NSError *error))block;


/**
 请求他人信息

 @param url 请求 url
 @param block  请求回调
 @return 发起网络请求
 */
+ (NSURLSessionDataTask *)getOtherInfo:(NSString *)url WithBlock:(void (^)(id obj, NSError *error))block;

/**
 请求群组信息
 
 @param url 请求 url
 @param block  请求回调
 @return 发起网络请求
 */
+ (NSURLSessionDataTask *)getGroupInfo:(NSString *)url WithBlock:(void (^)(id obj, NSError *error))block;

/**
 更新活动排序信息
 
 @param url 请求 url
 @param block  请求回调
 @return 发起网络请求
 */
+ (NSURLSessionDataTask *)updateActivitySort:(NSString *)url WithBlock:(void (^) (id obj, NSError *error))block;
@end
