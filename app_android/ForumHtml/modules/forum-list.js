define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var date_pk=Common.getQueryString("date-pk");
	$('.loading_ing').hide();
	var zoneName='';
	console.log(navigator.userAgent);
	//判断是否为华为这个版本
	if(navigator.userAgent==" Mozilla/5.0 (Linux; U; Android 6.0; zh-CN; ALE-UL00 Build/HuaweiALE-UL00) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30 "){
		$('.more_box2').hide();
		$('.right_nav').hide();
	}
	var Page = {
		token:'',
		init: function(){
			//检测是否收费
			$.ajax({
				type: 'GET',
				url: Common.domain +'forum/sections/'+date_pk+'/',
				dataType: 'json',
				success: function(json){
					if (json.needbuy==true) {
						Cer.mobileLoginTest();
						Page.token= 'Token ' +Cer.Token;

						forum_title();
						forum_list.init();
						initTypes();
					}else{
						forum_title();
						forum_list.init();
						initTypes();
					}
				},
				error: function(){}
			});
			//右侧菜单出现
			$('.more_box2').click(function(){
				$('.right_nav').animate({left:"0px"});
			});
			$('.nav_left').click(function(){
				$('.right_nav').animate({left:"100%"});
			});
			//发论坛的页面出现
			$('.add-forum').unbind().click(function(){
				location.href="forum-add.html?date-pk="+date_pk;
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
			//发布点击
			$('.submit').unbind().click(function(){
				publish();
			});
			//搜索
			$('.search img').click(function(){
				forum_list.page=1;
				$('.forum_f').html('');
				$('.right_nav').animate({left:"100%"});
				forum_list.search=$('.search input').val();
				forum_list.init();
			});
			$('.search input').keydown(function(event){
				if(event.which===13){
					forum_list.page=1;
					$('.forum_f').html('');
					$('.right_nav').animate({left:"100%"});
					forum_list.search=$('.search input').val();
					forum_list.init();
				}
			})

		}
	}
	//获取当前社区
	function forum_title(){
		var html="";
		$.ajax({
			type: 'GET',
			url: Common.domain +'forum/sections/'+date_pk+'/',
			dataType: 'json',
			success: function(json){
				if (json) {
					html='<div class="forum_pic"><img src="../statics/'+json.icon+'"></div><div class="forum_main"><h2>'+json.name+'</h2><p><span>帖子: '+json.total+'</span></p></div>'
					$('.forum_header').html(html);
					zoneName=json.pk;
				}
			},
			error: function(){}
		});
	}

	//加载分类
	function initTypes(){
		$.ajax({
			type: 'GET',
			url: Common.domain +'forum/types/',
			dataType: 'json',
			headers: {
				Authorization:Page.token
			},
			success: function(json){
				if (json) {
					$.each(json.results, function(k,v) {
						$(".nav_right ul").append('<li data-pk="'+v.pk+'" data-name="'+v.name+'">'+v.name+'</li>');
					});
					//分类点击
					$(".nav_right ul li").unbind().click(function(){
						forum_list.page=1;
						$('.forum_f').html('');
						$('.loading_ing').hide();
						$('.right_nav').animate({left:"100%"});
						forum_list.load($(this).attr('data-pk'),null);
						$('.forum_classify').html($(this).attr('data-name')).attr('data-pk',$(this).attr('data-pk'));
					});
				}
			},
			error: function(){

			}
		});
	}
	var forum_list={
			page:1,
			loadSwitch: true,
			search:'',
			init:function(){
					forum_list.load(-1,null);
				},
				load:function(typeId,essence){
					if(typeId==-1){
						essence=null;
						typeId=null;
					}else if(typeId==0){
						essence=true;
						typeId=null;
					}else{
						essence=null;
					}
					$.ajax({
						type: "get",
						url: Common.domain + "forum/posts/",
						data:{
							section:date_pk,
							types:typeId,
							isessence:essence,
							page:forum_list.page,
							keyword:forum_list.search
						},
						dataType: "json",
						headers: {
							Authorization:Page.token
						},
						success: function(json) {
							var html="";
							$('.loading_ing').html('加载中...');
							forum_list.loadSwitch = true;
							if (json.count < 10) {
								forum_list.loadSwitch = false;
							}else{
								$('.loading_ing').show();
							}
		                	if(!json.next){
		                		forum_list.loadSwitch = false;
		                		$('.loading_ing').html('已加载完毕');
		                	}
							if(json.results.length>0){
								$.each(json.results,function(i,v){
									var pic='';
									if(v.userinfo.avatar){
										pic=v.userinfo.avatar;
									}else{
										pic='../statics/images/index/teacher.png';
									}
									var date =dealWithTime(v.create_time);
									var content='';
									if(v.content.length>28){
										content=v.content.slice(0,28)+'...';
									}else{
										content=v.content;
									}
									html+='<a href="forum-detail.html?id='+v.section.pk+'&pk='+v.pk+'"><div class="forum_list">'+
											'<div class="forum_left"><img src="'+pic+'"></div>'+
											'<div class="forum_right">'+
												'<p><span class="forum_name">'+v.userinfo.name+'</span><span class="forum_time">'+date+'</span></p>'+
												'<p class="forum_title">'+v.title+'</p>'+
												'<p class="forum_content">'+content+'</p>'+
											'</div><div style="clear:both;"></div>'+
										'</div></a>';
								});
								$(html).appendTo('.forum_f');
								liveTimeAgo();
							}else{
								$('.loading_ing').hide();
								$('.forum_f').html('<p style="text-align:center;line-height:100px;font-size:14px;color:#797979;">该版块暂无帖子</p>');
							}
						},
						error: function(xhr, textStatus) {
							if (textStatus == "timeout") {
								Common.showToast("服务器开小差了");
							}
							if(JSON.parse(xhr.responseText).message=="请先购买课程"||JSON.parse(xhr.responseText).detail=="请先购买课程"){
								layer.msg("请先购买课程");
							}
							$('.loading_ing').html('已加载完毕');
						}
					});	
				}
		}

		function onScroll() {
			// Check if we're within 100 pixels of the bottom edge of the broser window.
			var winHeight = window.innerHeight ? window.innerHeight : $(window).height(), // iphone fix
				closeToBottom = ($(window).scrollTop() + winHeight > $(document).height() - 150);
			if (closeToBottom) {
				if (forum_list.loadSwitch==false) {
					return;
				}else{
					forum_list.page++;
					forum_list.load($('.forum_classify').attr('data-pk'),null);	
				}
			}
		};
		window.onscroll = onScroll;

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
