define(function(require, exports, module) {
	var Common = require('common');
	require("libs/jquery.cookie.js");

	//初始化变量
	exports.getToken = function() {
		exports.Token = $.cookie("Token") ? $.cookie("Token") : null;
		exports.username = $.cookie("username") ? $.cookie("username") : null;
		exports.password = $.cookie("password") ? $.cookie("password") : null;
		exports.nickname = $.cookie("nickname") ? $.cookie("nickname") : null;
		exports.identity = $.cookie("identity") ? $.cookie("identity") : null;
		exports.isInviter = $.cookie("isInviter") ? $.cookie("isInviter") : null;
	}
	exports.getToken();

	//退出登录账号
	exports.logout = function(callback) {
		for (var it in $.cookie()) {
			$.removeCookie(it, {
				path: '/'
			})
		}
		$.ajax({
			type: 'post',
			url: Common.domain + 'userinfo/logout/',
			headers: {
				Authorization: 'Token ' + exports.Token,
			},
			dataType: 'json',
			success: function(json) {
				exports.getToken();
				callback();
			},
			error: function(json) {
				console.log(json);
				callback();
			}
		});
	}

	//退出全部
	exports.logoutAll = function(callback) {
		$.ajax({
			type: 'post',
			url: Common.domain + 'userinfo/logout_all/',
			headers: {
				Authorization: 'Token ' + exports.Token,
			},
			dataType: 'json',
			success: function(json) {
				for (var it in $.cookie()) {
					$.removeCookie(it, {
						path: '/'
					})
				}
				exports.getToken();
				callback();
			},
			error: function(json) {}
		});
	}

	exports.loginTest = function() {
		if (exports.Token && exports.Token !== 'null' && exports.Token !== 'undefine') {
			console.log(exports.Token);
			$('.login .login-inner').empty();
			if (exports.identity === 'teacher') {
				$('.login .login-inner').html('<p><a href="../../html/teacher-home/teacher-home.html">Hi, ' + (exports.nickname ? exports.nickname : exports.username) + '</a><button class="btn logoutBtn">退出</button></p>');
			} else {
				$('.login .login-inner').html('<p><a href="../../html/home/home.html">Hi, ' + (exports.nickname ? exports.nickname : exports.username) + '</a><button class="btn logoutBtn">退出</button></p>');
			}

			$('.login .login-inner .logoutBtn').unbind().click(function() {
				exports.logout(function() {
					Common.showToast('已退出');
					$('.login .login-inner').html('<a href="../../html/login-reg/login.html" class="login-btn btn-normal bgc-bright">登录</a><a href="../../html/login-reg/reg.html" class="reg-btn btn-normal bgc-orange">注册</a>');
					location.reload();
					exports.loginTest();
				});
			});
		} else {
			$('.apply-freeaudition > a').css({
				display: 'block'
			});
		}
	}

	exports.mobileLoginTest = function() {
		if (exports.Token && exports.Token !== 'null' && exports.Token !== 'undefine') {
			return true;
		} else {
			location.href = 'login-reg.html';
		}
	}
})