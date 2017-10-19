//
//  AFAppNetAPIClient.h
//  TeaShop
//
//  Created by chen on 16/11/25.
//  Copyright © 2016年 Ali Karagoz. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "AFHTTPSessionManager.h"

@interface AFAppNetAPIClient : AFHTTPSessionManager

+ (instancetype)shareClient;

@end
