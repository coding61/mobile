define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	require('libs/jquery.cookie.js');
	require('libs/bootstrap.min.js');
	require('libs/jquery.slides.min.js');
	var posterType = Common.getQueryString('posterType');

	var Page = {
		init: function(){
			if (posterType == 'sell') {
				getUserposter('userinfo/create_sell_poster/');
			} else {
				getUserposter('userinfo/create_credit_poster/');
			}
		}
	}

	Page.init();

	function getUserposter(url_api){
		$.ajax({
			type: 'get',
			url: Common.domain + url_api,
			headers:{
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				$('.poster_img').attr({
					src: json.poster,
				});
				
			},
			error: function(json){
				Common.showToast('遇到一点小问题，请稍后再试');
				console.log(json);
			}
		})
	}
		
});
