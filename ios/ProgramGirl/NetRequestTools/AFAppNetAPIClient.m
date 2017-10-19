//
//  AFAppNetAPIClient.m
//  TeaShop
//
//  Created by chen on 16/11/25.
//  Copyright © 2016年 Ali Karagoz. All rights reserved.
//

#import "AFAppNetAPIClient.h"

@implementation AFAppNetAPIClient

+ (instancetype)shareClient{
    static AFAppNetAPIClient *_shareClient = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _shareClient = [[AFAppNetAPIClient alloc] initWithBaseURL:nil];
        _shareClient.securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
        //数据下载完成，数据为JSON
        _shareClient.responseSerializer = [AFJSONResponseSerializer serializer];
        //数据为XML
//        _shareClient.responseSerializer = [AFHTTPResponseSerializer serializer];
        //数据为PLIST
        //_shareClient.responseSerializer = [AFPropertyListResponseSerializer serializer];
        //_shareClient.responseSerializer = [AFXMLDocumentResponseSerializer serializer];
        
        
        //AFHTTPResponseSerializer 返回原生的数据
        //AFJSONResponseSerializer 数组或者是字典
        //AFXMLParserResponseSerializer  NSXMLParser对象
    });
    return _shareClient;
}

@end
