define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var date_pk=Common.getQueryString("date-pk");
	Cer.mobileLoginTest();
	var Page = {
		init: function(){
			getZhuanti();
			$('.add-forum-list').height($(window).height());
			//发论坛的页面出现
			$('.add-header .return2').click(function(){
				location.href="forum-list.html?date-pk="+date_pk;
			});
			//发布点击
			$('.submit').unbind().click(function(){
				publish();
			});
			//专题点击
			$('.zhuanti p').click(function(){
				
				if($('.zhuanti p img').attr('src')=='../statics/img/zone/slide_up.png'){
					$('.zhuanti p img').attr('src','../statics/img/zone/slide_down.png');
					$('.zhuanti ul').show();
					getZhuanti();
				}else{
					$('.zhuanti p img').attr('src','../statics/img/zone/slide_up.png');
					$('.zhuanti ul').hide();
				}
			});

		}
	}
	function publish(){
		var title=$("#L_title").val();
		var content=$("#L_content").val();
		var type_txt=date_pk;
		var zone_txt=$('.zhuanti p').attr('data-pk');
		if(title==""){
			layer.msg("请输入标题");
			return false;
		}else if(content==""){
			layer.msg("请输入内容");
			return false;
		}else if(zone_txt==undefined){
			layer.msg("请选择专题");
			return false;
		}
		$.ajax({
			type: 'post',
			url: Common.domain +'forum/posts_create/',
			headers: {
				Authorization: 'Token ' +Cer.Token
			},
			data:{
				section:type_txt,
				types:zone_txt,
				title:title,
				content:content
			},
			dataType: 'json',
			success: function(json){
				if (json) {
					location.href="forum-list.html?date-pk="+date_pk;
					$("#L_title").val('');
					$("#L_content").val('');
					
				}

			},
			error: function(){}
		});
	} 
	//获取当前专题
	function getZhuanti(){
		var html="";
		$.ajax({
			type: 'GET',
			url: Common.domain +'forum/types/',
			headers: {
				Authorization: 'Token ' +Cer.Token
			},
			dataType: 'json',
			success: function(json){
				if (json) {
					$.each(json.results, function(k,v) {
						html+='<li data-pk="'+v.pk+'">'+v.name+'</li>'
					});
					$('.zhuanti ul').html(html);
					$('.zhuanti ul li').click(function(){
						$('.zhuanti p').attr('data-pk',$(this).attr('data-pk')).html($(this).html()+'<img src="../statics/img/zone/slide_up.png"/>').css('color','#666');
						$('.zhuanti ul').hide();
					});
				}
			},
			error: function(){}
		});
	}
	Page.init();
});
