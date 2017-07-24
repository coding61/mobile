define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var date_pk=Common.getQueryString("pk");
	var date_id=Common.getQueryString("id");
	var zoneName='';
	var reply_user_id="";
	var reply_id="";
	var username=getCookie("username");
	$('body').css('minHeight',$(window).height()-60);
	var Page = {
		init: function(){
			forum_detail.init();
			forum_reply.init();
			$('.return').click(function(){
				location.href="forum-list.html?date-pk="+date_id;
			});
			//提交回复
			$(".postReply_btn").click(function() {
				if(!Cer.token){
					Cer.mobileLoginTest();
				}
				var content=$("#L_content").val();
				if(!content) {
					layer.msg("请输入回复内容");
					return false;
				}else {
					postReplyAdd();
					$("#L_content").val('');
				}
				
			});

			//提交回
			$(".postReplyMore_btn").click(function(){
				if(!Cer.token){
					Cer.mobileLoginTest();
				}
				var content=$("#copy_reply_content").val();
				toUserId=$(this).attr("data-user-id");
				replyId=$(this).attr("data-id");
				if(!content) {
					layer.msg("请输入回复内容");
					return false;
				}else {
					postReplyMoreAdd();
				}
				
			});
		}
	}
	//删除帖子
	function delPost(pk){
		layer.open({
			  content: '确定删除该帖子？'
			  ,btn: ['确认', '取消']
			  ,yes: function(index, layero){
			  	$.ajax({
			  		type: "DELETE",
			  		url: Common.domain + "forum/posts/"+pk+'/',
			  		dataType: "json",
			  		headers: {
			  			Authorization: 'Token ' +Cer.Token
			  		},
			  		success: function(json) {
			  			layer.msg("删除成功");
			  			$('.detail_eval').html('');
						setTimeout(function(){
							window.location.href="forum-list.html?date-pk="+date_id;
						},800);
			  		},
			  		error: function(xhr, textStatus) {
			  			
			  		}
			  	});	
			  },btn2: function(index, layero){
			    layer.close();
			  }
			  ,cancel: function(){ 
			    //右上角关闭回调
			  }
			});
	}
	//删除回帖
	function deleteReplyById(replyId){
	layer.open({
		  content: '确定删除该回帖？'
		  ,btn: ['确认', '取消']
		  ,yes: function(index, layero){
		  	  	$.ajax({
		  	  		type: "DELETE",
		  	  		url: Common.domain + "forum/replies/"+replyId+'/',
		  	  		dataType: "json",
		  	  		headers: {
		  	  			Authorization: 'Token ' +Cer.Token
		  	  		},
		  	  		success: function(json) {
		  	  			layer.msg("删除成功");
		  	  			$('.detail_eval').html('');
		  	  			forum_detail.init();
		  	  			forum_reply.init();
		  	  		},
		  	  		error: function(xhr, textStatus) {
		  	  			
		  	  		}
		  	  	});	
		  },btn2: function(index, layero){
		    layer.close();
		  }
		  ,cancel: function(){ 
		    //右上角关闭回调
		  }
		});
	}

	//删除回复
	function deleteReplymoreById(replymoreId){
	layer.open({
		  content: '确定删除该回帖？'
		  ,btn: ['确认', '取消']
		  ,yes: function(index, layero){
		  	  	$.ajax({
		  	  		type: "DELETE",
		  	  		url: Common.domain + "forum/replymores/"+replymoreId+'/',
		  	  		dataType: "json",
		  	  		headers: {
		  	  			Authorization: 'Token ' +Cer.Token
		  	  		},
		  	  		success: function(json) {
		  	  			layer.msg("删除成功");
		  	  			$('.detail_eval').html('');
		  				forum_detail.init();
		  				forum_reply.init();
		  	  		},
		  	  		error: function(xhr, textStatus) {
		  	  			
		  	  		}
		  	  	});
		  },btn2: function(index, layero){
		    layer.close();
		  }
		  ,cancel: function(){ 
		    //右上角关闭回调
		  }
		});
	}
	//回复添加
	function postReplyAdd() {
		$.ajax({
			type: "post",
			url: Common.domain + "forum/replies_create/",
			dataType: "json",
			data:{
				posts:date_pk,
				content:$("#L_content").val()	
			},
			headers: {
				Authorization: 'Token ' +Cer.Token
			},
			success: function(json) {
				layer.msg("回帖成功");
				forum_detail.init();
				forum_reply.init();
			},
			error: function(xhr, textStatus) {
				
			}
		});	
	}
	//添加更多回复
	function postReplyMoreAdd() {
		$.ajax({
			type: "post",
			url: Common.domain + "forum/replymore_create/",
			dataType: "json",
			data:{
				replies:reply_id,
				content:$("#copy_reply_content").val()	
			},
			success: function(json) {
				layer.msg("回帖成功");
				forum_detail.init();
				forum_reply.init();
			},
			error: function(xhr, textStatus) {
				
			}
		});
	}

	//帖子详情
	var forum_detail={
		init:function(){
				forum_detail.load();
			},
			load:function(){
				$.ajax({
					type: "get",
					url: Common.domain + "forum/posts/"+date_pk+"/",
					dataType: "json",
					success: function(json) {
						if(json){
							var html='';
							var delete3='';
							var image='';
							if(json.userinfo.avatar==null){
								image='../statics/images/index/teacher.png';
							}else{
								image=json.userinfo.avatar;
							}
							var date =dealWithTime(json.create_time);
							if(username==json.userinfo.owner){
								delete3='<button class="delete_btn" data-pk="'+json.pk+'" style="margin-right:40px;">删除</button>';
							}
							html='<div style="width:100%;background:#fff;">'+
								'<div class="detail_header">'+
									'<p class="header_pic"><img src="'+image+'"></p>'+
									'<p class="header_name">'+json.userinfo.name+delete3+'</p>'+
									'<p class="header_time">'+date+'</p>'+
								'</div>'+
							'</div>'+
							'<div class="detail_body">'+
								'<h1>'+json.title+'</h1>'+
								'<div class="detail_content">'+fly.content(json.content)+'</div>'+
							'</div>';
							$('.detail_top').html(html);
							//删除点击
							$('.delete_btn').unbind().click(function(){
								if(!Cer.token){
									Cer.mobileLoginTest();
								}
								delPost($(this).attr('data-pk'));
							});
						}
						
					},
					error: function(xhr, textStatus) {
						
					}
				});	
			}
		}
		//帖子回复
		var forum_reply={
			init:function(){
					forum_reply.load();
				},
				load:function(){
					$.ajax({
						type: "get",
						url: Common.domain + "forum/replies/",
						dataType: "json",
						data:{
							posts:date_pk
						},
						success: function(json) {
							if(json.count==0){
								$('.detail_eval').css('paddingLeft','0px');
								$('.detail_eval').html('<p style="width:100%;line-height:35px;text-align:center;">暂无任何评论</p>');
							}else{
								var html="";
								var content="";
								$.each(json.results,function(i,v){
									var date =dealWithTime(v.create_time);
									var html2='';
									var delete3='';
									var delete4='';
									if(username==v.userinfo.owner){
										delete3='<button class="delete_btn2" data-pk="'+v.pk+'">删除</button>';
									}
									if(v.replymore.length>0){
										$.each(v.replymore,function(j,z){
											if(username==v.userinfo.owner){
												delete4='<button class="delete_btn3" data-pk="'+z.pk+'">删除</button>';
											}
											html2+='<div class="more_reply">'+
														'<p><span>'+z.userinfo.name+': </span>'+fly.content(z.content)+delete4+'</p>'+
													'</div>';
										});
									}
									content=html2;
									var image='';
									if(v.userinfo.avatar==null){
										image='../statics/images/index/teacher.png';
									}else{
										image=v.userinfo.avatar;
									}
									html+='<dl>'+
											'<dd><img src="'+image+'"></dd>'+
											'<dt>'+
												'<span class="eval_name">'+v.userinfo.name+'</span>'+
												'<span class="eval_time">'+date+'</span>'+
												'<img src="../statics/img/zone/reply.png" class="reply" data-user-id="'+v.userinfo.pk+'" data-id="'+v.pk+'" data-user-name="'+v.userinfo.name+'"/>'+
												'<p>'+fly.content(v.content)+delete3+'</p>'+
											'</dt>'+content+
										'<p style="clear:both;"></p></dl>';

								});
								$('.detail_eval').html(html);
								//回复点击
								$('.reply').click(function(){
									reply_user_id=$(this).attr('data-user-id');
									reply_id=$(this).attr('data-id');
									var reply_name='';
									reply_name='回复：'+$(this).attr('data-user-name');
									$('.reply_box').animate({'opacity':0},function(){
										$('.more_reply_box').show();
										$('#copy_reply_content').attr('placeholder',reply_name)
									});
									$('.more_reply_box').animate({'opacity':0},function(){
										$('.more_reply_box').animate({'opacity':1},function(){
											$('.more_reply_box').show();
											$('#copy_reply_content').attr('placeholder',reply_name)
										});
									});
								});
								//删除点击
								$('.delete_btn2').click(function(){
									deleteReplyById($(this).attr('data-pk'));
								});
								$('.delete_btn3').click(function(){
									deleteReplymoreById($(this).attr('data-pk'));
								});

							}
							
						},
						error: function(xhr, textStatus) {
							
						}
					});	
				}
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
