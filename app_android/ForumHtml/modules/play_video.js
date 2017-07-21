define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var date_pk=Common.getQueryString("data-pk");
	var title=decodeURIComponent(Common.getQueryString("name"));

	var Page = {
		init: function(){
			$('title').html(title);
			getVideoInfo();
		}
	}

	Page.init();

	function getVideoInfo(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'course/coursevideos/?course='+date_pk,	
			dataType: 'json',
			success: function(json){
				var html="";
					for(var i=0;i<json.count;i++){

						html+='<div class="content" >'+
								'<video class="class_name" controls  poster="'+json.results[i].banner+'" src="'+json.results[i].video+'"></video>'+
								'<div style="padding:10px 20px 20px 20px;line-height: 20px;font-size: 14px;">'+
									'<span style="font-size:16px;">'+json.results[i].title+'</span>'+
									'<span class="video_time">时长：'+json.results[i].duration+'分钟</span>'+
								'</div>'+
							'</div>';
					}

				
				$('.play_list').html(html);

			},
			error: function(json){}
		});
	}
});
