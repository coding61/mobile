define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	//Cer.mobileLoginTest();
	var Page = {
		init: function(){
			forum_list();
		}
	} 
	function forum_list(){
		var html="";
		$.ajax({
			type: 'GET',
			url: Common.domain +'forum/sections/',
			dataType: 'json',
			success: function(json){
				if (json) {
					$.each(json.results,function(i,v){
						var author='';
						if(v.newposts){
							if(v.newposts.author.length>4){
								author=v.newposts.author.slice(0,4)+'...';
							}else{
								author=v.newposts.author;
							}
						}
						
						html+='<a href="forum-list.html?date-pk='+v.pk+'"><div class="forum_list">'+
							'<div class="forum_left"><img src="../statics/'+v.icon+'"></div>'+
							'<div class="forum_center">'+
								'<h2>'+v.name+'</h2>'
								if(v.newposts){
									var date =dealWithTime(v.newposts.create_time);
									html+='<p style="width:70%;">'+v.newposts.title+'</p>'+
									'<p><span>'+author+'</span><span>'+date.slice(0,10)+'</span></p>'
								}else{
									html+='<p>暂无</p>'
								}
							html+='</div>'+
							'<div class="forum_right"><p>贴数:'+v.total+'</p></div>'+
							'<div style="clear:both;"></div></div></a>'
					});

					$('.forum_body').html(html);
					liveTimeAgo();
					
				}
			},
			error: function(){}
		});
	}
	function dealWithTime(time){
		if(time.indexOf(".")>0){
		time=time.substring(0,time.lastIndexOf("."));
		}
		time=time.replace(/T/g," ");
		return time;
	}
	function liveTimeAgo(){
		$('.liveTime').liveTimeAgo({
			translate : {
				'year' : '%年前',
				'years' : '%年前',
				'month' : '%个月前',
				'months' : '%个月前',
				'day' : '%天前',
				'days' : '%天前',
				'hour' : '%小时前',
				'hours' : '%小时前',
				'minute' : '%分钟前',
				'minutes' : '%分钟前',
				'seconds' : '几秒钟前',
				'error' : '未知的时间',
			}
		});
	}
	Page.init();
});
