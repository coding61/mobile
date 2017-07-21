define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var class_pk
	var jiangxuejin //奖学金总额
	var youhui //所减优惠
	var jianx //所用奖金
	var jiangao //限制
	var Pname=1

	var Page = {
		init: function(){
			if (Cer.Token) {
				userclass()
			}else{
				userclassed()
			}

			//点击购买
			$(document).on("click",".riub",function(event){
				class_pk=$(this).attr('pk')
				ofont=$(this).siblings('span').attr('fon')
				var need_ship=$(this).attr('need_ship')
				location.href="../html/shopping.html?pk="+class_pk+"&need_ship="+need_ship
				event.stopPropagation();
			})

			//转跳事件
			$(document).on("click",".classImg",function(event){
				var pk=$(this).children('.class_right').children('.list_buttom').children('a').attr('pk')
				location.href="../html/class-index.html?pk="+pk
			})

			$(document).on("click",".chon",function(event){
				return false;
				event.stopPropagation();
			})

			//切换课程类型
			$('.nav_list p').click(function(){
				$('.nav_list p').removeClass('down_li')
				$(this).toggleClass('down_li')
				display($(this),"onetoone")
				display($(this),"video")
				display($(this),"product")
				function display(that,type){
					if(that.hasClass(type)){
						$('#onetoone').css('display','none')
						$('#video').css('display','none')
						$('#product').css('display','none')
						$('#'+type).css('display','block')
					}
				}
			})

		}
	}
	Page.init();
	function userclass(){
		$.ajax({
			type:"get",
			url:Common.domain +"course/courses/",
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success:function(json){
				for(var i=0;i<json.count;i++){
					if (json.results[i].isend) {
						continue;
					}
					
					var title="<p class='list_title'>"+json.results[i].name+"</p>"
					//判断字数
					if(json.results[i].content.length>30){
						var cont=json.results[i].content.substring(0,22)
						var centent="<p class='list_centent'>"+cont+"...</p>"
					}else{
						var centent="<p class='list_centent'>"+json.results[i].content+"</p>"
					}
					//判断是否可购买已购买
					if(json.results[i].isbuy==false){
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' class='chon'>不可购买</a>"
					}else if(json.results[i].inventory==0){
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' class='chon'>不可购买</a>"
					}else if(json.results[i].bought==false){
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"'  need_ship='"+json.results[i].need_ship+"'  class='riub'>点击购买</a>"
					}else{
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' class='chon'>已购买</a>"
					}
				
					var buttom="<p class='list_buttom'><span fon="+json.results[i].offer_price+" >优惠价￥"+json.results[i].offer_price+"<a href='javascript:void(0)' id='offset'>原价￥"+json.results[i].price+"</a></span>"+right+"</div>"
					var right="<div class='class_right'>"+title+centent+buttom+"</div>"
					var img="<img src='"+json.results[i].banner+"' class='class_img' alt='抱歉，该课程暂无图片'/>"

					if(json.results[i].teach_types=="online"){
						$('#onetoone').prepend(
							'<div class="class"><div class="classImg">'+img+right+'</div></div>'
						)
					}else if(json.results[i].teach_types=="video"){
						$('#video').prepend(
							'<div class="class"><div class="classImg">'+img+right+'</div></div>'
						)
					}else if(json.results[i].teach_types=="product"){
						$('#product').prepend(
							'<div class="class"><div class="classImg">'+img+right+'</div></div>'
						)
					}

					// $('#class_Room').prepend(
					// 	'<div class="class"><div class="classImg">'+img+right+'</div></div>'
					// )
				}

				console.log(json)
			},
			error: function(json){
				console.log('失败')
				console.log(json);
			}
		});
	}
	function userclassed(){
		$.ajax({
			type:"get",
			url:Common.domain +"course/courses/",
			dataType: 'json',
			success:function(json){
				for(var i=0;i<json.count;i++){
					if (json.results[i].isend) {
						continue;
					}

					var title="<p class='list_title'>"+json.results[i].name+"</p>"
					//判断字数
					if(json.results[i].content.length>30){
						var cont=json.results[i].content.substring(0,22)
						var centent="<p class='list_centent'>"+cont+"...</p>"
					}else{
						var centent="<p class='list_centent'>"+json.results[i].content+"</p>"
					}
					//判断是否可购买已购买
					if(json.results[i].isbuy==false){
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' class='chon'>不可购买</a>"
					}else if(json.results[i].inventory==0){
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' class='chon'>不可购买</a>"
					}else if(json.results[i].bought==false){
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' need_ship='"+json.results[i].need_ship+"' class='riub'>点击购买</a>"
					}else{
						var right="<a href='javascript:void(0)' pk='"+json.results[i].pk+"' class='chon'>已购买</a>"
					}
				
					var buttom="<p class='list_buttom'><span fon="+json.results[i].offer_price+" >优惠价￥"+json.results[i].offer_price+"<a href='javascript:void(0)' id='offset'>原价￥"+json.results[i].price+"</a></span>"+right+"</div>"
					var right="<div class='class_right'>"+title+centent+buttom+"</div>"
					var img="<img src='"+json.results[i].banner+"' class='class_img' alt='抱歉，该课程暂无图片'/>"
					if(json.results[i].teach_types=="online"){
						$('#onetoone').prepend(
							'<div class="class"><div class="classImg">'+img+right+'</div></div>'
						)
					}else if(json.results[i].teach_types=="video"){
						$('#video').prepend(
							'<div class="class"><div class="classImg">'+img+right+'</div></div>'
						)
					}else if(json.results[i].teach_types=="product"){
						$('#product').prepend(
							'<div class="class"><div class="classImg">'+img+right+'</div></div>'
						)
					}

					// $('#class_Room').prepend(
					// 	'<div class="class"><div class="classImg">'+img+right+'</div></div>'
					// )
				}

				console.log(json)
			},
			error: function(json){
				console.log('失败')
				console.log(json);
			}
		});
	}

	function isWeiXin(selectId){
	    var ua = window.navigator.userAgent.toLowerCase();
	    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	    	// 微信浏览器
			pay_way = "wx_pub_qr";	//wx
			payOrder(selectId,pay_way);
			Common.showToast("正在调起微信支付控件，请稍后...");	
	    }else{
    		pay_way = "alipay_wap";//alipay_pc_direct
    		payOrder(selectId,pay_way);
    		Common.showToast("正在调起支付宝支付控件，请稍后...");	
	    }
	}

	function payOrder (selectId, pay_way) {
		$.ajax({
            type: "put",
            url: Common.domain + "market/order/payment/" + selectId + "/",
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

})