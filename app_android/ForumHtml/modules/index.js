var code
define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	require('libs/jquery.cookie.js');
	require('libs/bootstrap.min.js');
	require('libs/jquery.slides.min.js');
	var Page = {
		init: function(){
			$('.teacher-li').click(function(event) {
				location.href = '../html/teacher.html';
			});

			$('.concept-li').click(function(event) {
				location.href = '../html/help.html';
			});

			$('.team-li').click(function(event) {
				location.href = '../html/team.html';
			});

			$('.logo-video').click(function(){
				$('.play').css({display: 'block',});
				$('.play video').attr({src: 'http://oe3six40u.bkt.clouddn.com/output_3.mp4'});
			});

			$('.get-free-ok .free-top i').click(function(){
				$('.get-free-ok').hide(function(){
					$('.free-mask').hide()
				});
				$('body').css({
					overflow: 'auto'
				})
			});

			$('.submit-get-free').click(function(){
				var telNum = $('.free-tel-number').val();
				if (/^1\d{10}$/.test(telNum)) {
					getFreeCourse(telNum);
				} else {
					Common.showToast('手机号格式不正确')
				}
			});

			$('#vi').click(function(){
				location.href = '../html/index-video.html';

			});
			$('#one_to').click(function(){

				$('html body').animate({scrollTop:$('#one_to_one').offset().top},1000)
				$('.tabtle_list span a').removeClass('clitrue').css('color','#999')
				$('#one_to_one').addClass('clitrue').css({'color':'#f5521f','text-decoration':'none',})
				var n=$('#one_to_one').attr('vname')
				$(".courses-list, .courses-list_video, .courses-list_product").hide()
				$("."+n).show()
			});

			$('#one_too').click(function(){

				$('html body').animate({scrollTop:$('#two_two').offset().top},1000)

				$('.tabtle_list span a').removeClass('clitrue').css('color','#999')
				$('#two_two').addClass('clitrue').css({'color':'#f5521f','text-decoration':'none',})
				var n=$('#two_two').attr('vname')
				$(".courses-list, .courses-list_video, .courses-list_product").hide()
				$("."+n).show()
			});

			$('.tabtle_list span a').click(function(){
				$('.tabtle_list span a').removeClass('clitrue').css('color','#999')
				$(this).addClass('clitrue').css({'color':'#f5521f','text-decoration':'none',})
				var n=$(this).attr('vname')
				$(".courses-list, .courses-list_video, .courses-list_product").hide()
				$("."+n).show()
			})


			$(document).on('click','.goumai',function(){
				if(Cer.Token){
					var data_pk=$(this).attr("data-pk")
					var need_ship=$(this).attr('need_ship')
					if($(this).hasClass('zulin-zu')){
						var rent=true
					}else{
						var rent=false
					}
					isWeiXin(data_pk,need_ship,rent)
				}else{
					Common.showToast('未登陆')
					location.href = '../html/login-reg.html?type=index';
				}
			})
			url()
			getShowStudent();
			mediaWidth();
			if(!Cer.Token){
				getClassInfo();
				$('#youhui').css('display','none');

			}else{
				getUserPromo();
				getHavedClassInfo();
			}

		}
	}

	Page.init();
	function mediaWidth(){
		var a_length=$('.media_scroll').find('a').length;
		$('.media_scroll').width(250*a_length);
	}
	function getUserPromo(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/my_promo/',
			headers:{
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				if (json.sell_promo_code) {
					$('.ma span').html(json.sell_promo_code);
					$('.create_poster').unbind().click(function(event) {
						location.href = '../html/posters.html?posterType=sell';
					});
				} else {
					$('.ma span').html(json.credit_promo_code);
					$('.create_poster').unbind().click(function(event) {
						location.href = '../html/posters.html?posterType=credit';
					});
				}
			},
			error: function(json){
				Common.showToast('遇到一点小问题，请稍后再试');
				console.log(json);
			}
		})
	}

	function isWeiXin(data_pk,need_ship,rent){
		// var ua = window.navigator.userAgent.toLowerCase();
		// if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		 	// 微信浏览器
		 	// code 授权公众号的返回值 url 授权之后回调的⻚⾯
			// if (!code) {
			 	// var url = window.location.href
				// 	var url='https://www.cxy61.com/mobile/html/index.html'
			 	// Common.authorize(url);
			 	// return;
			// }else{
			location.href="shopping.html?data-pk="+data_pk+"&need_ship="+need_ship
			// }
			// Common.showToast("正在获取权鉴信息，请稍后...");
		// }else{
			if(rent){
			//租
				return
			}else{
			//购买
	 			location.href="shopping.html?data-pk="+data_pk+"&need_ship="+need_ship
			}
		// }
	}
	function url(){
		var url = location.search
		if (url.indexOf("?") != -1) {
    		var str = url.substr(1);
    		var str_id=str.split("&");
    		for(var i=0;i<str_id.length;i++){
    			if(str_id[i].indexOf("code")!=-1){
    				code=str_id[i].split('=')[1]
    			}
    		}
   		}
	}

	function getFreeCourse(telNum){
		$.ajax({
			type: 'post',
			url: Common.domain + 'userinfo/listenrecord_create/',
			data: {
				contact: telNum
			},
			dataType: 'json',
			success: function(json){
					$('.get-free-ok').show(function(){
						$('.free-mask').show();
				});
			},
			error: function(json){
				$('.get-free-ok').show(function(){
						$('.send').html('此号码已预约过！')
						$('.free-mask').show();
				});
				console.log(json);
			}
		})
	}

	function getShowStudent(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'show/showstudents/',
			headers: {
			    "Accept": "application/json; charset=utf-8",
			    "Content-Type": "application/json; charset=utf-8"
			},
			dataType: 'json',
			success: function(json){

				var html="";
				for (var i =0; i <=json.results.length-1; i++) {

						var thumb='';

						if(json.results[i].thumb==''||json.results[i].thumb=='http://www.banner.com'){
							thumb="../statics/images/index/cour1.jpeg";
						}else{
							thumb=json.results[i].thumb;
						}
					html+='<div class="students_list1">'+
							'<div class="student_head">'+
								'<img src="'+thumb+'">'+
								'<div class="student_name">'+
									'<span style="font-size: 14px;color: #3e3e3e;margin-right: 10px;">'+json.results[i].name+'</span>'+
									'<span style="color: #999999;font-size: 14px;">'+json.results[i].age+'岁 | '+json.results[i].city+'</span>'+
								'</div>'+
							'</div>'+
							'<div class="student_cont">'+
								'<p style="font-size: 14px;color:#3a3a3a;padding: 10px 10px 0 10px;line-height:26px">'+json.results[i].content+'</p>'+
							'</div>'+
						'</div>';
				}
				var time=json.results.length;
				$('.comment_scroll').width(230*time);

				$('.comment_list .comment_scroll').html(html);
			},
			error: function(json){
				Common.showToast('请稍后再试');

			}
		})
	}

	//没有登录时显示首页课程
	function getClassInfo(){
		$.ajax({
			type: 'get',
			url:Common.domain+'course/courses/',
			headers: {
			    "Accept": "application/json; charset=utf-8",
			    "Content-Type": "application/json; charset=utf-8"
			},
			dataType: 'json',
			success: function(json){

				var html="";
				var htmlvideo="";
				var htmlproduct="";
				var htmlother="";
				var jsonOnline=[];
				var jsonVideo=[];
				var jsonProduct=[];
				var jsonOther=[];
					//课程分类
					for(var i=0;i<json.count;i++){
						if (json.results[i].isend) {
							continue;
						}
						if (json.results[i].teach_types=='online') {
							jsonOnline.push(json.results[i]);
						}
						if(json.results[i].teach_types=='video'){
							jsonVideo.push(json.results[i]);
						}
						if(json.results[i].teach_types=='product'){
							jsonProduct.push(json.results[i]);
						}
					}
					//在线课程
					for (var i = jsonOnline.length - 1; i >= 0; i--) {
							var banner='';
							var price='';

						if (jsonOnline[i].offer_price=='') {
							price=jsonOnline[i].price;
						}else{
							price=jsonOnline[i].offer_price;
						}

						if(jsonOnline[i].banner==''||jsonOnline[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=jsonOnline[i].banner;
						}

						html+='<a href="class-index.html?data-pk='+jsonOnline[i].pk+'"><div class="courses-list2">'+
							'<img src="'+banner+'">'+
							'<div class="course-cont">'+
								'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonOnline[i].name+'</p>'+
								'<p class="maimai">'+
									'<span>￥'+price+'</span>'+'<a class="goumai" data-pk='+jsonOnline[i].pk+' need_ship='+jsonOnline[i].need_ship+'>购买</a>'+
								'</p>'+
							'</div>'+
						'</div></a>';
						}
						$('#good-courses .courses-list').html(html);

					//视频课程

					for (var i = jsonVideo.length - 1; i >= 0; i--) {
						var banner='';
						var price='';

						if (jsonVideo[i].offer_price=='') {
							price=jsonVideo[i].price;
						}else{
							price=jsonVideo[i].offer_price;
						}

						if(jsonVideo[i].banner==''||jsonVideo[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=jsonVideo[i].banner;
						}

						htmlvideo+='<a href="class-index.html?data-pk='+jsonVideo[i].pk+'"><div class="courses-list2">'+
							'<img src="'+banner+'">'+
							'<div class="course-cont">'+
								'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonVideo[i].name+'</p>'+
								'<p class="maimai">'+
									'<span>￥'+price+'</span>'+'<a class="goumai" data-pk='+jsonVideo[i].pk+' need_ship='+jsonVideo[i].need_ship+' >购买</a>'+
								'</p>'+
							'</div>'+
						'</div></a>';
					}
						$('.courses-list_video').html(htmlvideo);

					//教学周边
					for (var i = jsonProduct.length - 1; i >= 0; i--) {
						var banner='';
						var price='';

						if (jsonProduct[i].offer_price=='') {
							price=jsonProduct[i].price;
						}else{
							price=jsonProduct[i].offer_price;
						}

						if(jsonProduct[i].banner==''||jsonProduct[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=jsonProduct[i].banner;
						}
						if (jsonProduct[i].inventory <= 0) {
							htmlproduct+='<a href="class-index.html?data-pk='+jsonProduct[i].pk+'">'+
							'<div class="courses-list2">'+
								'<img src="'+banner+'">'+
								'<div class="course-cont">'+
									'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonProduct[i].name+'</p>'+
									'<p class="maimai">'+
										'<span>￥'+price+'</span>'+
										'<a class="goumai meikucun">已售空</a>'+
									'</p>'+
								'</div>'+
							'</div>'+
							'</a>';
						} else {
							if (jsonProduct[i].isrent || jsonProduct[i].isrent == 'true') {
								htmlproduct+='<a href="class-index.html?data-pk='+jsonProduct[i].pk+'">'+
								'<div class="courses-list2">'+
									'<img src="'+banner+'">'+
									'<div class="course-cont">'+
										'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonProduct[i].name+'</p>'+
										'<p class="maimai">'+
											'<span>￥'+price+'</span>'+
											'<a class="goumai goumai-zu" data-pk="'+jsonProduct[i].pk+'" href="shopping.html?data-pk='+jsonProduct[i].pk+'&need_ship='+jsonProduct[i].need_ship+'">购买</a>'+
											'<a class="goumai zulin-zu" href="createRent.html?data-pk='+jsonProduct[i].pk+'">租赁</a>'+
										'</p>'+
									'</div>'+
								'</div>'+
								'</a>';
							} else {
								htmlproduct+='<a href="class-index.html?data-pk='+jsonProduct[i].pk+'">'+
								'<div class="courses-list2">'+
									'<img src="'+banner+'">'+
									'<div class="course-cont">'+
										'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonProduct[i].name+'</p>'+
										'<p class="maimai">'+
											'<span>￥'+price+'</span>'+
											'<a class="goumai" href="shopping.html?data-pk='+jsonProduct[i].pk+'&need_ship='+jsonProduct[i].need_ship+'">购买</a>'+
										'</p>'+
									'</div>'+
								'</div>'+
								'</a>';
							}
						}
					}
						$('.courses-list_product').html(htmlproduct);

			},
			error: function(json){
				if(json){

				}
			}
		});
	}

	//登录时显示首页课程
	function getHavedClassInfo(){
		$.ajax({
			type: 'get',
			url:Common.domain+'course/courses/',
			headers: {
			    "Accept": "application/json; charset=utf-8",
			    "Content-Type": "application/json; charset=utf-8",
			    Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){

				var html="";
				var htmlvideo="";
				var htmlproduct="";
				var htmlother="";
				var jsonOnline=[];
				var jsonVideo=[];
				var jsonProduct=[];

				//课程分类
					for(var i=0;i<json.count;i++){
						if (json.results[i].isend) {
							continue;
						}
						if (json.results[i].teach_types=='online') {
							jsonOnline.push(json.results[i]);
						}
						if(json.results[i].teach_types=='video'){
							jsonVideo.push(json.results[i]);
						}
						if(json.results[i].teach_types=='product'){
							jsonProduct.push(json.results[i]);
						}
					}
					//在线课程

					for (var i = jsonOnline.length - 1; i >= 0; i--) {
							var banner='';
							var price='';

						if (jsonOnline[i].offer_price=='') {
							price=jsonOnline[i].price;
						}else{
							price=jsonOnline[i].offer_price;
						}

						if(jsonOnline[i].banner==''||jsonOnline[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=jsonOnline[i].banner;
						}

						if(jsonOnline[i].isbuy==false){

							var right="<a class='no_goumai' href='javascript:;'>不可购买</a>"
						}else if(jsonOnline[i].bought==true){

							var right="<a class='no_goumai' href='javascript:;'>已购买</a>"
						}else if(jsonOnline[i].inventory==0){

							var right="<a class='no_goumai' href='javascript:;'>不可购买</a>"
						}else{

							var right="<a class='goumai' data-pk="+jsonOnline[i].pk+" need_ship="+jsonOnline[i].need_ship+">购买</a>"
						}

						html+='<a href="class-index.html?data-pk='+jsonOnline[i].pk+'"><div class="courses-list2">'+
							'<img src="'+banner+'">'+
							'<div class="course-cont">'+
								'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonOnline[i].name+'</p>'+
								'<p class="maimai">'+
									'<span>￥'+price+'</span>'+right+
								'</p>'+
							'</div>'+
						'</div></a>';
						}
						$('#good-courses .courses-list').html(html);


					//视频课程
					for (var i = jsonVideo.length - 1; i >= 0; i--) {
						var banner='';
						var price='';

						if (jsonVideo[i].offer_price=='') {
							price=jsonVideo[i].price;
						}else{
							price=jsonVideo[i].offer_price;
						}

						if(jsonVideo[i].banner==''||jsonVideo[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=jsonVideo[i].banner;
						}

						if(jsonVideo[i].isbuy==false){
							var right="<a class='no_goumai' href='javascript:;'>不可购买</a>"
						}else if(jsonVideo[i].bought==true){
							var right="<a class='no_goumai' href='javascript:;'>已购买</a>"
						}else if(jsonVideo[i].inventory==0){
							var right="<a class='no_goumai' href='javascript:;'>不可购买</a>"
						}else{
							var right="<a class='goumai' data-pk="+jsonVideo[i].pk+" need_ship="+jsonVideo[i].need_ship+" >购买</a>"
						}

						htmlvideo+='<a href="class-index.html?data-pk='+jsonVideo[i].pk+'"><div class="courses-list2">'+
							'<img src="'+banner+'">'+
							'<div class="course-cont">'+
								'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonVideo[i].name+'</p>'+
								'<p class="maimai">'+
									'<span>￥'+price+'</span>'+right+
								'</p>'+
							'</div>'+
						'</div></a>';
					}
						$('.courses-list_video').html(htmlvideo);

					//教学周边
					for (var i = jsonProduct.length - 1; i >= 0; i--) {
						var banner='';
						var price='';

						if (jsonProduct[i].offer_price=='') {
							price=jsonProduct[i].price;
						}else{
							price=jsonProduct[i].offer_price;
						}

						if(jsonProduct[i].banner==''||jsonProduct[i].banner=='http://www.banner.com'){
							banner="../statics/images/index/cour1.jpeg";
						}else{
							banner=jsonProduct[i].banner;
						}
						if (jsonProduct[i].inventory <= 0) {
							var right="<a class='goumai meikucun'>已售空</a>"
						} else {
							if (jsonProduct[i].isrent) {
								var right = '<a class="goumai goumai-zu" data-pk="'+jsonProduct[i].pk+'" need_ship="'+jsonProduct[i].need_ship+'">购买</a>'+
								'<a class="goumai zulin-zu" href="createRent.html?data-pk='+jsonProduct[i].pk+'">租赁</a>'
							} else {
								var right="<a class='goumai' data-pk="+jsonProduct[i].pk+" need_ship="+jsonProduct[i].need_ship+" >购买</a>"
							}
						}

						htmlproduct+='<a href="class-index.html?data-pk='+jsonProduct[i].pk+'">'+
						'<div class="courses-list2">'+
							'<img src="'+banner+'">'+
							'<div class="course-cont">'+
								'<p style="display:block;white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">'+jsonProduct[i].name+'</p>'+
								'<p class="maimai">'+
									'<span>￥'+price+'</span>'+
									right+
								'</p>'+
							'</div>'+
						'</div>'+
						'</a>';
					}
						$('.courses-list_product').html(htmlproduct);
			},
			error: function(json){
				if(json){

				}
			}
		});
	}


});
