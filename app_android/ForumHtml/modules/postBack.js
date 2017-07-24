define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var order_number = Common.getQueryString('order_number');

	var Page = {
		init: function(){
			if (!Cer.Token) {
				location.href = base + "mobile/html/login-reg.html";
			}

			$('.submit-view button').click(function(){
				var postNum = $.trim($('.post-num').val());
				if (postNum) {
					submit(postNum);
				} else {
					Common.showToast('请填写快递单号');
				}
			})

			getOrderPrice();
		}
	}

	Page.init();

	//获取订单价格
	function getOrderPrice(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'market/rent_orders/' + order_number + '/',
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			data: {},
			dataType: 'json',
			success: function(json){
				console.log(json);
				$('.yunfei').text(parseInt(json.amount) - 25);
				$('.sum').text(json.amount + '元');
			},
			error: function(json){
				console.log(json);
			}
		})
	}

	//提交订单
	function submit(postNum){
		$.ajax({
			type: 'PUT',
			url: Common.domain + 'market/rent_orders/end/' + order_number + '/',
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			data: {
				'back_tracking_number': postNum
			},
			dataType: 'json',
			success: function(json){
				// var payOrderNum = json.order_number;
				isWeiXin(json.order_number);
			},
			error: function(json){
				Common.showToast('支付订单失败')
			}
		})
	}

	function isWeiXin(order_number){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	    	// 微信浏览器
			pay_way = "wx_pub_qr";	//wx
			payDeposit(order_number,pay_way);
			Common.showToast("正在调起微信支付控件，请稍后...");	
			// $('.danmu').css('display','none')
	    }else{
    		pay_way = "alipay_wap";//alipay_pc_direct
    		payDeposit(order_number,pay_way);
    		Common.showToast("正在调起支付宝支付控件，请稍后...");	
	    }
	}

	function payDeposit(order_number, pay_way){
		$.ajax({
            type: "put",
            url: Common.domain + "market/order/payment/" + order_number + "/",
            headers: {
                Authorization: "Token " + Cer.Token
            },
            data: {
                channel: pay_way,
            },
            success: function(json) {
            	if (json.charge.channel == "wx_pub_qr") {
            		$('.black-bg').show();
            		$('.tip').show();
            		var w = $('.tip').width()*0.8;
            		var wx_code=json.charge.credential.wx_pub_qr;
            		var qrcode = new QRCode(document.getElementById("qrcode"), {
						width : w,
						height : w
					});
					function makeCode () {		
						if (!wx_code) {
							return;
						}
						qrcode.makeCode(wx_code);
					}
					makeCode();

					// 微信支付确认
					$('#pay-done').click(function(){
						$.ajax({
			                type: "get",
			                url: Common.domain + "market/order/" + selectId + "/",
			                headers: {
			                    Authorization: "Token " + Cer.Token
			                },
			                success: function(json) {
			                	console.log(json.status);
			                	if (json.status == 1) {
			                		location.href = base + "/html/pay-back/pay-back.html";	    
			                	} else {
			                		Common.confirm('支付尚未完成，请稍后',function(){});
			                	}
			                }
			        	});
					});

            	} else {
	            	pingpp.createPayment(json.charge, function(result, err){
					    console.log(result);
					    console.log(err.msg);
					    console.log(err.extra);
					    if (result == "success") {
					        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
					    } else if (result == "fail") {
					        // charge 不正确或者微信公众账号支付失败时会在此处返回
					    } else if (result == "cancel") {
					        // 微信公众账号支付取消支付
					    }
					});
				}
            }
        })
	}
});