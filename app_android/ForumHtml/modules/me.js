define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var Page = {
		init: function(){
			Cer.mobileLoginTest();
			getUserInfo();
			$('.tui').click(function(){
				Cer.logout(Cer.mobileLoginTest)
				
			})
		}
	}

	Page.init();

	function getUserInfo(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/learning_progress/',
			// url: 'http://localhost:8088/api3/server/userinfo/learning_progress/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				if (json.name && json.name != '') {
					$('.me-schedule .me-user-name').text(json.name);
				} else {
					$('.me-schedule .me-user-name').text('学生');
				}

				if (json.free_classroom && json.free_classroom != '' || json.paid_classroom && json.paid_classroom != '') {
					var scheduleNum = parseInt(json.free_classroom) + parseInt(json.paid_classroom);
					$('.me-schedule .sy-schedule .sy-content').text(scheduleNum + '节');
					var time = (scheduleNum * 25 / 60).toFixed(1);
					$('.me-schedule .sy-time .sy-content').text(time + '小时');
				}
			},
			error: function(json){}
		});
	}
});
