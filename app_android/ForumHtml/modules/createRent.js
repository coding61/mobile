define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	require('libs/jquery.cookie.js');
	var hasDeposit = false;
	var coursePk = Common.getQueryString('data-pk');
	var addressPk = '';
	var amount = ($.cookie('username') == '18511994457' ? 1 : 1000);

	var Page = {
		init: function(){
			if (!Cer.Token) {
				location.href = base + "mobile/html/login-reg.html";
			}

			$('.address-add-btn').click(function(){
				var this_ = $(this);
				if (this_.hasClass('address-add-btn-orange')) {
					this_.removeClass('address-add-btn-orange').addClass('address-add-btn-gray').text('-');
					$('.address-add').show();
				} else {
					this_.removeClass('address-add-btn-gray').addClass('address-add-btn-orange').text('+')
					$('.address-add').hide();
				}
			})

			$('.submit button').click(function(){
				submit();
			})

			$('.can-not-back button').click(function(){
				$('.mask, .can-not-back').hide();
			});

			getDeposit();
			getAddress();
			getDescription();
		}
	}
	Page.init();

	//获取租用说明
	function getDescription(){
		$.ajax({
			type: 'get',
			url: location.origin + '/statics/bc_game.json?v=2.1.0',
			dataType: 'json',
			success: function(json){
				console.log(json);
				var html = '';
				for (var i in json.rentDescription) {
					html += '<li>' + 
								'<p>' + i + '. ' + json.rentDescription[i] + '</p>' + 
							'</li>'
				}
				console.log(html);
				$('.description ul').html(html);
			},
			error: function(json){}
		})
	}
	
	//获取押金详情
	function getDeposit(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'market/deposit_info/',
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			data: {},
			dataType: 'json',
			success: function(json){
				console.log(json);
				if (json.amount && json.amount != '0.00') {
					//have deposit
					hasDeposit = true;
				} else {
					//don't have deposit
					hasDeposit = false;
					$('.submit button').text('支付押金并确认租赁')
				}
			},
			error: function(json){
				if (json.status == 500) {
					hasDeposit = false;
					return;
				}
				Common.showToast('获取押金失败');
			}

		})
	}

	//获取已有地址
	function getAddress(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/addresses/',
			data: {},
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				if (json.count && json.count > 0) {
					var html = '';
					for (var i = 0; i < json.results.length; i++) {
						html += '<li><p class="unchecked" data-pk="' + json.results[i].pk + '">' + json.results[i].shipping_address + '</p></li>';
					}
					$('.address-list').html(html);

					checkAddress();
				}
			},
			error: function(json){
				Common.showToast('收货地址信息获取失败')
			}
		})
	}

	//创建新的地址
	function createAddress(){
		var name = $('.address-add-input .name').val();
		var number = $('.address-add-input .number').val();
		var detail = $('.address-add-input .address-detail').val();

		var prov=$('.prov').val();
		var city=$('.city').val();
		var dist=$('.dist').val();

		var addres=prov + city + dist + detail
		var addressd=addres.replace("null","");

		if (name && number && detail && prov && city) {
			$.ajax({
				type:"post",
				url: Common.domain + 'userinfo/address_create/',
				headers: {
					Authorization: 'Token ' + Cer.Token
				},
				data:{
					shipping_address:addressd,
					linkman:name,
					telephone:number,
				},
				dataType: 'json',
				success: function(json){
					console.log("添加成功")
					submit(json.pk)
				},
				error: function(json){
					Common.showToast('创建地址失败，请刷新页面重新操作');
				}
			});
		} else {
			Common.showToast('请将地址信息填写完整');
			return;
		}
	}

	//选择地址
	function checkAddress(){
		$('.address-list li p').click(function(){
			var this_ = $(this);
			if (this_.hasClass('checked')) {
				this_.removeClass('checked').addClass('unchecked');
			} else {
				($('.address-list .checked').length > 0) ? $('.address-list .checked').addClass('unchecked').removeClass('checked') : null;
				this_.addClass('checked')
			}
		})
	}

	//充值押金
	function rechargeDeposit(address){
		$.ajax({
			type: 'post',
			url: Common.domain + 'market/deposit/',
			data: {
				'amount': amount,
				'address': address,
				'course': coursePk
			},
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				var orderNum = json.order_number;
				isWeiXin(orderNum, address);
			},
			error: function(json){

			}
		})
	}

	function isWeiXin(order_number, address){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	    	// 微信浏览器
			pay_way = "wx_pub_qr";	//wx
			payDeposit(order_number,pay_way, address);
			Common.showToast("正在调起微信支付控件，请稍后...");	
			// $('.danmu').css('display','none')
	    }else{
    		pay_way = "alipay_wap";//alipay_pc_direct
    		payDeposit(order_number,pay_way, address);
    		Common.showToast("正在调起支付宝支付控件，请稍后...");	
	    }
	}

	//支付充值押金订单
	function payDeposit(order_number, pay_way, address){
		// window.localStorage.addressPk = address;
		// window.localStorage.coursePk = coursePk;
		// $.cookie('addressPk', address);
		// $.cookie('coursePk', coursePk);
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

	//提交租赁信息
	function submit(address){
		if (address) {
			if (hasDeposit) {
				//有选择地址且有押金，直接提交租赁
				submitDeposit(address);
			} else {
				rechargeDeposit(address)
			}
		} else {

			if ($('.address-list .checked').length) {
				if (hasDeposit) {
					//有选择地址且有押金，直接提交租赁
					submitDeposit($('.address-list .checked').attr('data-pk'));
				} else {
					rechargeDeposit($('.address-list .checked').attr('data-pk'))
				}
			} else {
				createAddress();
			}
		}
	}

	function submitDeposit(addressPk){
		var data = {
	        'address': addressPk,
	        'quantity': 1,
	        'isrent': 'true'
      	}
		$.ajax({
			type: 'post',
			url: Common.domain + 'market/course/purchase/' + coursePk + '/',
			data: JSON.stringify(data),
	      	headers: {
	      		'Authorization': "Token " + Cer.Token,
	      		'Content-Type': 'application/json'
	      	},
	      	success: function(json){
				location.href = 'rentList.html';
	      	},
	      	error: function(json){
				$('.mask, .can-not-back').show();
	      	}
		})
	}

})