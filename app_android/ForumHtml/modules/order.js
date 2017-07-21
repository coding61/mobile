define(function(require, exports, module){
	var Common = require('../../modules/common/common.js');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var code = Common.getQueryString('code');

	var tab = 0; // 0 left;1 right;
	var page= 1;
	var page_max;
	var pay_way;

	var Page = {
		init: function(){
			if (Cer.Token) {
				orderMain();
			} else {
				location.href = 'login-reg.html';
			}
		}
	}
	Page.init();

	function orderMain(){

			if (tab == 0) {
				getOrder(page);
			} else if (tab == 1) {
				getNeedPaidOrder(page);
			};

			$(window).scroll(function(){
			　　var scrollTop = $(this).scrollTop();
			　　var scrollHeight = $(document).height();
			　　var windowHeight = $(this).height();
			　　if(scrollTop + windowHeight== scrollHeight){
					page++
					if (page > page_max) {
						Common.showToast("已经全部加载！");
					} else {
						if (tab == 0) {
							Common.showToast("加载中...");
							getOrder(page);
						} else if (tab == 1) {
							Common.showToast("加载中...");
							getNeedPaidOrder(page);
						};
					}
			　　}
			});

			$('.tab-right').click(function(){
				$('.tab-right').css('color','#ff6000');
				$('.line-right').css('height','2px');
				$('.line-right').animate({width: '100%'});
				$('.tab-left').css('color','#000');
				$('.line-left').css('height','0');
				$('.line-left').animate({width: '0'});
				tab = 1;
				page = 1;
				Common.showToast("已为您获取最新数据");
				$('.list').html(null);
				getNeedPaidOrder(page);
			});

			$('.tab-left').click(function(){
				$('.tab-left').css('color','#ff6000');
				$('.line-left').css('height','2px');
				$('.line-left').animate({width: '100%'});
				$('.tab-right').css('color','#000');
				$('.line-right').css('height','0');
				$('.line-right').animate({width: '0'});
				tab = 0;
				page = 1;
				Common.showToast("已为您获取最新数据");
				$('.list').html(null);
				getOrder(page);
			});
	}

	function getOrder(page){
		$.ajax({
			type: 'get',
			url: Common.domain + 'market/orders/?page=' + page + '&status=',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dateType: 'json',
			success: function(json){

				page_max = Math.ceil(json.count/10);

				if (json.results.length == 0) {
					$('.no-orders').show();
				} else {
					$('.no-orders').hide();
				}

   				for (var i = 0; i < json.results.length; i++) {
   					if (Array.isArray(json.results[i].bought_course_set)) {
						for (var j = 0; j < json.results[i].bought_course_set.length; j++) {
							if (json.results[i].bought_course_set[j].course) {
								json.results[i].channel = json.results[i].bought_course_set[j].course.name ? json.results[i].bought_course_set[j].course.name : '';
							} else {
								json.results[i].channel = '';
							}
						};
					} else {
						json.results[i].channel = '押金订单';
					}
				};

				var html = template('list-template', json.results);
				$('.list').append(html);

				$('.pay').click(function(){
					var selectId = $(this).closest('li').attr('data-num');
					isWeiXin(selectId);
				});

				$('.cancle').click(function(){
					var deleteItem = $(this).closest('li');
					var selectId = $(this).closest('li').attr('data-num');

					Common.confirm('取消订单无法恢复，确认取消？',function(){
						$.ajax({
							type: 'put',
							url: Common.domain + 'market/order/cancel/' + selectId + '/',
							headers: {
								Authorization: 'Token ' + Cer.Token
							},
							dateType: 'json',
							success: function(json){
								// deleteItem.remove();
								if (json.status == 2) {
									Common.showToast("取消成功");
									$('.list').html(null);
									page = 1;
									getOrder(page);
								} else {
									Common.showToast("取消失败");
								}
							}
						})
					});
				});
			}
		})
	}

	function getNeedPaidOrder(page){
		$.ajax({
			type: 'get',
			url: Common.domain + 'market/orders/?page=' + page + '&status=0',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dateType: 'json',
			success: function(json){

				page_max = Math.ceil(json.count/10);

				if (json.results.length == 0) {
					$('.no-orders').show();
				} else {
					$('.no-orders').hide();
				}
   				for (var i = 0; i < json.results.length; i++) {
   					if (Array.isArray(json.results[i].bought_course_set)) {
						for (var j = 0; j < json.results[i].bought_course_set.length; j++) {
							if (json.results[i].bought_course_set[j].course) {
								json.results[i].channel = json.results[i].bought_course_set[j].course.name ? json.results[i].bought_course_set[j].course.name : '';
							} else {
								json.results[i].channel = '';
							}
						};
					} else {
						json.results[i].channel = '押金订单';
					}
				};

				var html = template('list-template', json.results);
				$('.list').append(html);

				$('.pay').click(function(){
					var selectId = $(this).closest('li').attr('data-num');
					isWeiXin(selectId);
				});

				$('.cancle').click(function(){
					var deleteItem = $(this).closest('li');
					var selectId = $(this).closest('li').attr('data-num');

					Common.confirm('取消订单无法恢复，确认取消？',function(){
						$.ajax({
							type: 'put',
							url: Common.domain + 'market/order/cancel/' + selectId + '/',
							headers: {
								Authorization: 'Token ' + Cer.Token
							},
							dateType: 'json',
							success: function(json){
								// deleteItem.remove();
								if (json.status == 2) {
									Common.showToast("取消成功");
									$('.list').html(null);
									page = 1;
									getNeedPaidOrder(page);
								} else {
									Common.showToast("取消失败");
								}
							}
						})
					});
				});

			}
		})
	}

	function isWeiXin(selectId){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	    	// 微信浏览器
			// code 授权公众号的返回值 url 授权之后回调的页面
			if (!code) {
				// var testUrl = 'http://app.bcjiaoyu.com/mobile/html/order.html';
				// var url = 'https://www.cxy61.com/mobile/html/order.html';
				var url = window.location.href;
				Common.authorize(url);
				return;
			}

			pay_way = "wx_pub";	//wx
			payOrder(selectId, pay_way, code);
			Common.showToast("正在获取权鉴信息，请稍后...");
	    }else{
    		pay_way = "alipay_wap";//alipay_pc_direct
    		payOrder(selectId, pay_way);
	    }
	}

	function payOrder (selectId, pay_way, code) {
		$.ajax({
            type: "put",
            url: Common.domain + "market/order/payment/" + selectId + "/",
            headers: {
                Authorization: "Token " + Cer.Token
            },
            data: {
                channel: pay_way,
				code: code
            },
            success: function(json) {
            	if (json.status != 0) {
					Common.confirm(json.message,function(){
						location.href = 'me.html';
					});
            	} else if (json.charge.amount == 0) {
            		Common.showToast("购买成功");
					location.href = 'pay-back.html';
            	} else {
					Common.showToast("正在调起支付控件，请稍后...");
	            	pingpp.createPayment(json.charge, function(result, err){
					    console.log(result);
					    console.log(err.msg);
					    console.log(err.extra);
					    if (result == "success") {
					        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
							Common.showToast("支付成功");
							location.href = 'pay-back.html';
					    } else if (result == "fail") {
					        // charge 不正确或者微信公众账号支付失败时会在此处返回
							Common.showToast("支付失败,请稍后再试");
							location.href = 'me.html';
					    } else if (result == "cancel") {
					        // 微信公众账号支付取消支付
							Common.showToast("取消付款");
							location.href = 'me.html';
					    }
					});
            	}
            }
        })
	}

});
