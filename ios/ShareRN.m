//
//  ShareRN.m
//  ProgramGirl
//
//  Created by JackieQu on 2017/11/2.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ShareRN.h"

@implementation ShareRN

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(goShare:(NSString *)shareTitle andContent:(NSString *)shareContent andUrl:(NSString *)shareUrl andShareLogo:(NSString *)shareLogo andCallback:(RCTResponseSenderBlock)callback){
	
		dispatch_sync(dispatch_get_main_queue(), ^{
				[UMSocialUIManager showShareMenuViewInWindowWithPlatformSelectionBlock:^(UMSocialPlatformType platformType, NSDictionary *userInfo) {
						NSLog(@"%ld",(long)platformType);
					
						NSURL * logoUrl = [NSURL URLWithString:shareLogo];
						UMSocialMessageObject *messageObject = [UMSocialMessageObject messageObject];
						UMShareWebpageObject *shareObject = [UMShareWebpageObject shareObjectWithTitle: shareTitle descr:shareContent thumImage:[UIImage imageWithData:[NSData dataWithContentsOfURL:logoUrl]]];
						shareObject.webpageUrl = shareUrl;
						messageObject.shareObject = shareObject;
						[[UMSocialManager defaultManager] shareToPlatform:platformType messageObject:messageObject currentViewController:nil completion:^(id result, NSError *error) {
								if (error) {
									NSLog(@"************Share fail with error %@*********",error);
									callback(@[[NSNull null], @"fail"]);
								} else {
									NSLog(@"result:=========%@",result);
									callback(@[[NSNull null], @"success"]);
								}
						}];
				}];
		});
	
}

@end
