define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	require('libs/jquery.cookie.js');
	require('libs/bootstrap.min.js');
	require('libs/jquery.slides.min.js');

	var Page = {
		init: function(){

			getShowVideo();
	
		}
	}

	Page.init();

	function getShowVideo(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'show/showvideos/',
			headers: { 
			    "Accept": "application/json; charset=utf-8",
			    "Content-Type": "application/json; charset=utf-8"
			},
			dataType: 'json',
			success: function(json){
				
				var html="";
				for (var i =0; i <=json.results.length-1; i++) {
						
						var banner='';
											
						if(json.results[i].banner==''||json.results[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=json.results[i].banner;
						}
					html+='<div class="video_2">'+
								'<video class="video_1st"  poster="'+banner+'" src="'+json.results[i].video+'">'+'</video>'+
								'<div style="padding:10px 10px 20px 10px;line-height: 20px;font-size: 14px;">'+
									'<span>'+json.results[i].title+'</span>'+
									'<span class="video_time">时长：'+json.results[i].duration+'分钟</span>'+
								'</div>'+
							'</div>';
				}
				$('.video_list_show').html(html);
				$('.video_2 .video_1st').click(function(event) {
					
					$('.video_cont #play_video').attr({src: this.src});
				});
			},
			error: function(json){
				Common.showToast('请稍后再试');
				
			}
		})
	}

});
