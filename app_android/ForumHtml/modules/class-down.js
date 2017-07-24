define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	Cer.mobileLoginTest();
	
	var Page = {
		init: function(){
			
			userclass();	
		}
	}
	Page.init();

	function userclass(){
		$.ajax({
			type:"get",
			url: Common.domain + 'classroom/finish_classrooms/',
			dataType: 'json',
			headers: {
				Authorization: 'Token ' +Cer.Token
			},
			success: function(json){
				if(json.count>0){
					for(var i=0;i<json.count;i++){
						$(".yishang-wapper").append('<div class="kecheng-list"></div>')
						$(".yishang-wapper").children(".kecheng-list").eq(i).append('<img src="" class="ocImg"><div class="conten-right"></div>')
						$(".yishang-wapper").find(".conten-right").eq(i).append('<p class="class-name"></p><p class="class-detail"></p><div class="load"><div class="loading"></div></div><p class="class-keshi">本课程共<span class="total"></span>,已完成<span class="done"></span>节课</p>')
						
						var finish=json.results[i].finish_total;
						var total=Number(json.results[i].lesson.course.lesson_total.substring(0,2));
						var load=(finish/total)*100;
						$(".ocImg").attr('src',json.results[i].lesson.course.banner);
						$('.class-name').html(json.results[i].lesson.course.name);
						$('.class-detail').html(json.results[i].lesson.course.content);
						$('.loading').css('width',load);
						$('.total').html(json.results[i].lesson.course.lesson_total);
						$('.done').html(json.results[i].finish_total);
					}
				}
				else{
						$('.no-img').css("display","block")
					}
			}
		});
	}
});
