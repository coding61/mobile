define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var Page = {
		init: function(){
			$('.reg-form .reg-birthday .birthday-input').change(function(){
				$('.reg-form .reg-birthday span').text($(this).val());
			});

			$('.reg-submit .reg-submit-btn').click(function(){
				reg();
			});	

			$('.reg-msg button').click(function(){
				$('.reg-msg button').text('发送中...');
				sendMsg();
			});
		}
	}

	Page.init();

	function reg(){
		var regData = {
			username: $.trim($('.reg-username .reg-username-input').val()),
			password: $.trim($('.reg-password .reg-password-input').val()),
			verification_code: $.trim($('.reg-msg .msg-input').val()),
		}

		if (!regData.username || regData.username == '') {
			Common.showToast('请输入正确格式手机号');
			return false;
		}
		if (!regData.verification_code || regData.verification_code == '') {
			Common.showToast('请输入短信验证码');
			return false;
		}
		if (!regData.password || regData.password == '') {
			Common.showToast('请输入密码');
			return false;
		}

		$.ajax({
			type: 'put',
			url: Common.domain + 'userinfo/reset_password/',
			// url: 'http://localhost:8088/api3/server/userinfo/reset_password/',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(regData),
			dataType: 'json',
			success: function(json){
				$.cookie('Token', json.token, {path: '/'}, {expires: (1000*60*60*24*365)});
				$.cookie('username', $.trim($('.tel-number .tel-num-input').val()), {path: '/'});
				$.cookie('nickname', $.trim($('.tel-number .tel-num-input').val()), {path: '/'});
				location.href = 'me.html';
			},
			error: function(json){
				if (json.status == 400) {
					Common.showToast('验证码错误');
				} else {
					Common.showToast('密码重置失败，请刷新页面重新操作或联系客服');
				}
			}
		});
	}

	function sendMsg(){
		var num = $.trim($('.reg-username .reg-username-input').val());

		if (!(/^1[3|4|5|7|8]\d{9}$/.test(num))) {
			Common.showToast('手机格式错误，请重新输入');
			return false;
		}

		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/app_reset_password_request/',
			// url: 'http://localhost:8088/api3/server/userinfo/app_reset_password_request/',
			data: {
				username: num
			},
			dataType: 'json',
			success: function(json){
				$('.reg-msg button').unbind();
				var second = 60;
				var setOop = setInterval(function(){
					if (second <= 0) {
						clearInterval(setOop);
						$('.reg-msg button').text('发送验证码');
						$('.reg-msg button').click(function(){
							$('.reg-msg button').text('发送中...');
							sendMsg();
						});
					} else {
						second--;
						$('.reg-msg button').text(second + '秒后重新发送');
					}
				}, 1000);
			},
			error: function(json){
				Common.showToast('发送失败,请确认该手机号正确');
				$('.reg-msg button').text('发送验证码');
				console.log(json);
			}
		});
	}

});
