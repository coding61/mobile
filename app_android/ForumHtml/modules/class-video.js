define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var Page = {
		init: function(){
			getUserVideo();	
		}
	}

	Page.init();

	function getUserVideo(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'course/mycourses/',
			
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				
				var html="";
				if(json.count==0){
					html+='<div style="background:#F4F4F4;width:100%;height:667px;margin:0 auto;">'+
							
								'<img style="width:70%;padding-top:20%;margin-left:15%;" src="../statics/images/no_video.png">'+	
						'</div>';
				}else{

					for(var i=0;i<json.count;i++){
						
						html+='<a href="play_video.html?data-pk='+json.results[i].pk+'&name='+json.results[i].name+'" class="content" >'+
							
								'<span class="class_name">'+json.results[i].name+'</span>'+
								
								'<span class="class_total">'+json.results[i].lesson_total+'</span>'+'<span class="more">></span>'+
								
						'</a>';
					}
				}
					

				
				$('.video_list').html(html);	
			},
			error: function(json){}
		});
	}
});
