//
//  UpLoad.m
//  feiqingsong
//
//  Created by varwym on 2017/4/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "UpLoad.h"

@implementation UpLoad
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(uploadImage:(NSString *)path andToken:(NSString *)token andKey:(NSString *)key andCallback:(RCTResponseSenderBlock)callback) {
	
	UIImage *acceptImage = [[UIImage alloc] initWithContentsOfFile:path];
	NSDate *date=[NSDate date];
	NSDateFormatter *dataFormat=[[NSDateFormatter alloc]init];
	[dataFormat setDateFormat:@"yyyy-MM-dd-HH-mm-ss"];
	NSString *dataStr=[dataFormat stringFromDate:date];
	NSString *homePath = NSHomeDirectory();
	NSArray *extensionArr = [path componentsSeparatedByString:@"."];
	NSString *extensionStr = [@"." stringByAppendingString:extensionArr[1]];
	NSString *acceptPath = [[[homePath stringByAppendingPathComponent:@"/Documents/"] stringByAppendingPathComponent:dataStr] stringByAppendingString:extensionStr];
	[UIImageJPEGRepresentation(acceptImage, 0.5) writeToFile:acceptPath atomically:YES];
  
  QNUploadManager *upManager = [[QNUploadManager alloc] init];
  [upManager putFile:acceptPath key:key token:token complete:^(QNResponseInfo *info, NSString *key, NSDictionary *resp) {
    NSLog(@"%@",info);
    NSLog(@"%@",key);
    NSLog(@"%@",resp);
    if (info.statusCode == 200) {
        callback(@[[NSNull null], resp]);
    } else {
      callback(@[[NSNull null], @"上传失败"]);
    }
    
  } option:nil];
}

  
@end
