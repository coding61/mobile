define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var jiangxuejin //奖学金总额
	var youhui //所减优惠
	var jianx //所用奖金
	var jiangao //限制
	var Pname=1
	var code
	var url = location.search
		if (url.indexOf("?") != -1) {
    		var str = url.substr(1);
    		var str_id=str.split("&");
    		var str_ide=str_id[0];
    		var strs_ok = str_ide.split("=");
    		var pk=strs_ok[1];
   		}

   //	Cer.mobileLoginTest();
	var Page = {
		init: function(){
			if (Cer.Token) {

				userclass(function(){
					//点击购买
					$(".rentBtn").click(function(event){
						location.href="../html/createRent.html?pk="+pk
					})
				});
			}else{
				userclassed(function(){
					//点击购买
					$(".rentBtn").click(function(event){
						location.href="../html/createRent.html?pk="+pk
					})
				});	
			}
			href()
			//点击购买
			$(document).on('click','.ocPlayBack',function(){
				if(Cer.Token){
					var data_pk=pk
					var need_ship=$(this).attr('need_ship')
					isWeiXin(data_pk,need_ship)
				}else{
					Common.showToast('未登陆')
				}
			})

		}
	}
	Page.init();

	function isWeiXin(data_pk,need_ship){
		var ua = window.navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i) == 'micromessenger'){
		 	// 微信浏览器
		 	// code 授权公众号的返回值 url 授权之后回调的⻚⾯
			if (!code) {
			 	var url = window.location.href
			 	//var url='https://www.bcjiaoyu.com/mobile/html/index.html'
			 	console.log(url)
			 	Common.authorize(url);
			 	return;
			}else{
				location.href="shopping.html?data-pk="+data_pk+"&need_ship="+need_ship+"&code="+code
			}
			Common.showToast("正在获取权鉴信息，请稍后...");
		}else{
			//购买
	 		location.href="shopping.html?data-pk="+data_pk+"&need_ship="+need_ship
		}
	}

	function href(){
		var url = location.search
		console.log(url)
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
	function userclass(callback){
		$.ajax({
			type:"get",
			url:Common.domain +"course/courses/"+pk+"/",
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success:function(json){
				var img='<img class="bannar" src="'+json.banner+'" alt="抱歉。该课程暂无图片"/>'
				
				//判断是否公益免费购买	
					if(json.iswelfare==true){
						var h3='<p class="h3">'+json.name+'<span class="gon">公益</span></p>'
					}else if(json.price=='0.00'){
						var h3='<p class="h3">'+json.name+'<span class="mian">免费</span></p>'
					}else{
						var h3='<p class="h3">'+json.name+'<span class="shou">收费</span></p>'
					}
				var ocInfo='<p class="ocInfo">共'+json.lesson_total+'，单节时长'+json.lesson_duration+'</p>'
				var ocTeacher='<p class="ocTeacher">授课老师：'+json.teacher+'</p>'
				var ocDesct='<p class="ocDesct">课程简介</p>'
				var eb='<pre class="eb">'+json.content+'</pre>'
				
				//判断课节信息是否存在
				if(json.lesson_total!==""&&json.teacher!==""){
					var ace='<div class="ace">'+h3+ocInfo+ocTeacher+ocDesct+eb+'</div>'
				}else if(json.teacher!==""){
					var ace='<div class="ace">'+h3+ocTeacher+ocDesct+eb+'</div>'
				}else if(json.lesson_total!==""){
					var ace='<div class="ace">'+h3+ocInfo+ocDesct+eb+'</div>'
				}else{
					var ace='<div class="ace">'+h3+ocDesct+eb+'</div>'
				}
				
				//判断是否可购买已购买
					if(json.isbuy==false){
						var right='<span class="chonw">不可购买</span>'
					}else if(json.inventory==0){
						var right='<span class="chonw">不可购买</span>'
					}else if(json.bought==false){
						if (json.isrent) {
							var right='<span class="ocPlayBack" fon='+json.offer_price+' need_ship='+json.need_ship+' >购买</span>' + 
								'<span class="rentBtn">租赁</span>'
						} else {
							var right='<span class="ocPlayBack" fon='+json.offer_price+' need_ship='+json.need_ship+' >购买</span>'
						}
					}else{
						var right='<span class="chonw">已购买</span>'
					}
				
				var fonf='<a href="#" class="fonf">优惠价:'+json.offer_price.split('.')[0]+'</a>'
				var yuanjia='<a href="#" class="yuanjia">原价:'+json.price.split('.')[0]+'</a>'
				var daey='<span>'+fonf+yuanjia+'</span>'
				var ocHandle='<p class="ocHandle">'+daey+right+'</p>'
				$('.class-index').append(img).append(ace).append(ocHandle)
				
				callback();
			},
			error: function(json){
				console.log('失败')
				console.log(json);
			}
		});
	}
	function userclassed(callback){
		$.ajax({
			type:"get",
			url:Common.domain +"course/courses/"+pk+"/",
			dataType: 'json',
			success:function(json){
				var img='<img class="bannar" src="'+json.banner+'" alt="抱歉。该课程暂无图片"/>'
				//判断是否公益免费购买
					if(json.iswelfare==true){
						var h3='<p class="h3">'+json.name+'<span class="gon">公益</span></p>'
					}else if(json.price=='0.00'){
						var h3='<p class="h3">'+json.name+'<span class="mian">免费</span></p>'
					}else{
						var h3='<p class="h3">'+json.name+'<span class="shou">收费</span></p>'
					}
				var ocInfo='<p class="ocInfo">共'+json.lesson_total+'，单节时长'+json.lesson_duration+'</p>'
				var ocTeacher='<p class="ocTeacher">授课老师：'+json.teacher+'</p>'
				var ocDesct='<p class="ocDesct">课程简介</p>'
				var eb='<pre class="eb">'+json.content+'</pre>'
				
				//判断课节信息是否存在
				if(json.lesson_total!==""&&json.teacher!==""){
					var ace='<div class="ace">'+h3+ocInfo+ocTeacher+ocDesct+eb+'</div>'
				}else if(json.teacher!==""){
					var ace='<div class="ace">'+h3+ocTeacher+ocDesct+eb+'</div>'
				}else if(json.lesson_total!==""){
					var ace='<div class="ace">'+h3+ocInfo+ocDesct+eb+'</div>'
				}else{
					var ace='<div class="ace">'+h3+ocDesct+eb+'</div>'
				}
				
				//判断是否可购买已购买
					if(json.isbuy==false){
						var right='<span class="chonw">不可购买</span>'
					}else if(json.inventory==0){
						var right='<span class="chonw">不可购买</span>'
					}else if(json.bought==false){
						if (json.isrent) {
							var right='<span class="ocPlayBack" fon='+json.offer_price+' need_ship='+json.need_ship+' >购买</span>' + 
								'<span class="rentBtn">租赁</span>'
						} else {
							var right='<span class="ocPlayBack" fon='+json.offer_price+' need_ship='+json.need_ship+' >购买</span>'
						}
					}else{
						var right='<span class="chonw">已购买</span>'
					}
				
				var fonf='<a href="#" class="fonf">优惠价:'+json.offer_price.split('.')[0]+'</a>'
				var yuanjia='<a href="#" class="yuanjia">原价:'+json.price.split('.')[0]+'</a>'
				var daey='<span>'+fonf+yuanjia+'</span>'
				var ocHandle='<p class="ocHandle">'+daey+right+'</p>'
				$('.class-index').append(img).append(ace).append(ocHandle)

				callback();
			},
			error: function(json){
				console.log('失败')
				console.log(json);
			}
		});
	}

})