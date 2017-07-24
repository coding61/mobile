define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var questionJson = {
		'question': [{
			'title': '小学时我的外号叫什么？',
			'answer': '你管呢',
			'tips': '三个字'
		},{
			'title': '小学隔壁班最漂亮的女孩是谁？',
			'answer': '韩梅梅',
			'tips': '性别女'
		},{
			'title': '上小学时流行玩什么玩具？',
			'answer': '没有玩具',
			'tips': '看不到，摸不着'
		}]
	}

	var Page = {
		init: function(){
			getQA();
			//刷新预设问题
			$('.refresh').click(function(){
				refreshQA(questionJson.question);
			})
			//提交按钮点击事件
			$('#submit').click(function(){
				offerHB();
			})
			//input输入框focus事件
			$('.question-content div input').focus(function(){
				$(this).val('')
			})
		}
	}

	Page.init();

	//获取预设问题
	function getQA(){
		refreshQA(questionJson.question);
	}

	//随机问题
	function refreshQA(arr){
		var randomNum = parseInt(Math.random() * 3 + 1);
		var question = arr[randomNum - 1];
		$('#question-title').val(question.title);
		$('#question-answer').val(question.answer);
		$('#question-tips').val(question.tips);
	}

	//支付红包
	function offerHB(){
		var howMuch = isNaN($('#hb-money').val()) ? null : $('#hb-money').val();
		var question_content = $.trim($('#question-title').val()).length > 0 ? $.trim($('#question-title').val()) : null;
		var question_answer = $.trim($('#question-answer').val()).length > 0 ? $.trim($('#question-answer').val()) : null;
		var question_prompt = $.trim($('#question-tips').val()).length > 0 ? $.trim($('#question-tips').val()) : null;
		//红包数量
		var quantity = /^-?[1-9]\d*$/.test($('#hb-number').val()) ? $('#hb-number').val() : null;

		if (howMuch && /^-?[1-9]\d*$/.test(howMuch) && howMuch >= 1 && howMuch <= 100) {
			//验证表单
			if (!question_content) {
				Common.dialog('请输入问题');
				return;
			}
			if (!question_answer) {
				Common.dialog('请输入答案');
				return;
			}
			if (!question_prompt) {
				Common.dialog('请输入答案提示,没有请输入“无”');
				return;
			}
			if (!quantity) {
				Common.dialog('红包数量请输入整数');
				return;
			}
			sendHBInfo(howMuch, quantity);
		} else {
			Common.dialog('仅只持整数红包');
		}
	}

	//发送红包信息到服务器
	function sendHBInfo(howMuch, quantity){
		var data = {
			'name': $.cookie('name'),
			'avatar': $.cookie('avatar'),
			'question_content': $('#question-title').val(),
			'question_answer': $('#question-answer').val(),
			'question_prompt': $('#question-tips').val(),
			'quantity': $('#hb-number').val(),
			'amount': $('#hb-money').val(),
			'cxy_openid': $.cookie('cxy_openid_new'),
			'hrn_openid': $.cookie('hrn_openid_new')
		}
		$('.waiting').show(function(){$(document.body).css({'overflow':'hidden'})});
		$.ajax({
			type: 'post',
			url: '/server/redenvelope/red_envelope_question_create/',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(data),
			dataType: 'json',
			success: function(json){
				question_pk = json.pk;
				//发起微信支付
				payOrder(howMuch, quantity, json.pk);
			},	
			error: function(json){
				$('.waiting').hide(function(){$(document.body).css({'overflow':'auto'})});
				if (json.status == '400' && json.responseJSON.message == 'list index out of range') {
					Common.dialog('list index out of range');
				} else {
					Common.dialog('红包生成失败，请联系客服' + json)
				}
			}
		})
	}

	//调起微信支付
	function payOrder(howMuch, quantity, question_pk){
		$.ajax({
			type: 'post',
			url: '/server/redenvelope/redenvelope_payment/',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({
				'question_pk': question_pk,
				'amount': howMuch * quantity,
				'hrn_openid': $.cookie('hrn_openid_new')
			}),
			dataType: 'json',
			success: function(json){
				function onBridgeReady(json){
				   	WeixinJSBridge.invoke(
				       'getBrandWCPayRequest', {
				           "appId": "wx5bb2ed5654adbdb1",
				           "timeStamp": '' + json.timeStamp,
				           "nonceStr": '' + json.nonceStr,
				           "package": '' + json.package,     
				           "signType": "MD5",
				           "paySign": json.paySign
				       	},
				       	function(res){     
				           	if(res.err_msg == "get_brand_wcpay_request:ok" ) {// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
				           		sendMessage(question_pk);
				           	} else {
								$('.waiting').hide(function(){$(document.body).css({'overflow':'auto'})});
				           		if (res.err_msg == "get_brand_wcpay_request:cancel") {
				           			alert('支付已取消')
				           		} else {
				           			alert('支付失败')
				           		}
				           	}
				       	}
				   	); 
				}
				if (typeof WeixinJSBridge == "undefined"){
				   	if( document.addEventListener ){
				       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
				   	}else if (document.attachEvent){
				       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
				       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
				   	}
				}else{
				   	onBridgeReady(json);
				}
			},
			error: function(json){
				alert(JSON.stringify(json))
			}
		})
	}

	//发送红包
	function sendMessage(question_pk){
		$.ajax({
			type: 'get',
			url: '/server/redenvelope/send_redenvelope_question/?question_pk=' + question_pk,
			success: function(json){
				$('.waiting').hide(function(){$(document.body).css({'overflow':'auto'})});
				if (json.message == "发送成功") {
					Common.dialog('红包包好咯！请返回公众号查看');
				} else {
					Common.dialog(JSON.stringify(json));
				}
			},
			error: function(json){
				$('.waiting').hide(function(){$(document.body).css({'overflow':'auto'})});
				Common.dialog(JSON.stringify(json));
			}
		})
	}

});
