define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var type
	var Page = {
		init: function(){
			
			indexuser()
			$('.tab div').click(function(){
				if (!$(this).hasClass('active')) {
					$('.tab .active').removeClass('active');
					if ($(this).hasClass('tab-login')) {
						$('.tab .tab-login').addClass('active');
						$('.reg-content').hide();
						$('.login-content').show();
					} else {
						$('.tab .tab-reg').addClass('active');
						$('.login-content').hide();
						$('.reg-content').show();
					}
				}
			});

			$('.reg-form .reg-birthday .birthday-input').change(function(){
				$('.reg-form .reg-birthday span').text($(this).val());
			});

			$('.login-submit .login-submit-btn').click(function(){
				login();
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

	function login(){
		if (!(/^1[3|4|5|7|8]\d{9}$/.test($('.login-username .login-username-input').val()))) {
			Common.showToast('请输入正确格式手机号');
			return false;
		}
		if ($.trim($('.login-password .login-password-input').val()).length <= 5 || $.trim($('.login-password .login-password-input').val()).length >= 19) {
			Common.showToast('密码格式错误')
			return false;
		}

		var loginData = {
			username: $.trim($('.login-username .login-username-input').val()),
			password: $.trim($('.login-password .login-password-input').val())
		}
		$.ajax({
			type: 'post',
			url: Common.domain + 'userinfo/login/',
			// url: 'http://localhost:8088/api3/server/userinfo/login/',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify(loginData),
			dataType: 'json',
			success: function(json){
				$.cookie('Token', json.token, {path: '/'}, {expires: (1000*60*60*24*365)});
				$.cookie('username', $.trim($('.login-username .login-username-input').val()), {path: '/'});
				$.cookie('nickname', $.trim(json.name), {path: '/'});
				if (json.position == 'teacher') {
					location.href = '../../html/teacher-home/teacher-home.html';
				}else {
					if(type=="index"){
						location.href='./index.html'
					}else{
						history.go(-1);
					}
				}
			},
			error: function(json){
				Common.showToast('手机号或密码错误，请重新输入');
				console.log(json);
			}
		});
	}

	function indexuser(){
		var url = location.search
		if (url.indexOf("?") != -1) {
    		var str = url.substr(1); 
    		var str_id=str.split("&");
    		for(var i=0;i<str_id.length;i++){
    			if(str_id[i].indexOf("type")!=-1){
    				type=str_id[i].split('=')[1]
    			}
    		}
   		}
	}

	function reg(){
		var regData = {
			username: $.trim($('.reg-username .reg-username-input').val()),
			password: $.trim($('.reg-password .reg-password-input').val()),
			verification_code: $.trim($('.reg-msg .msg-input').val()),
			position: 'student',
			birthday: $.trim($('.reg-birthday .birthday-input').val()),
			userinfo: {
				name: $.trim($('.reg-username .reg-username-input').val())
			}
		}

		if (!regData.username || regData.username == '') {
			Common.showToast('请输入正确格式手机号');
			return false;
		}
		if (!regData.birthday || regData.birthday == '') {
			Common.showToast('请选择孩子生日');
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
			type: 'post',
			url: Common.domain + 'userinfo/signup/',
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
					Common.showToast('注册失败，请刷新页面重新操作');
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
			url: Common.domain + 'userinfo/app_signup_request/',
			// url: 'http://localhost:8088/api3/server/userinfo/app_signup_request/',
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
				Common.showToast('发送失败,请确认该手机号正确且尚未未注册');
				$('.reg-msg button').text('发送验证码');
				console.log(json);
			}
		});
	}

});
