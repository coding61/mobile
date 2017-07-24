define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var Page = {
		init: function(){
			Cer.mobileLoginTest();
			usefont();
			//点击事件
			//点击后展开列表
			$('.add_1').unbind().click(function(){
				$('.sure').show();
				$('.add_1').hide();
				$('.add_address').show();
				$('.add_2').show();
			});
			//点击后收回列表
			$('.add_2').unbind().click(function(){
				$('.sure').hide();
				$('.add_1').show();
				$('.add_address').hide();
				$('.add_2').hide();
			});
		}
	}

	Page.init();

	function usefont(){
		$.ajax({
			type:"get",
			url:Common.domain + 'userinfo/addresses/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				if(json){
					var html="";
					for(i=0;i<json.count;i++){
						html+='<li><p>'+json.results[i].shipping_address+'</p><img class="shangc" data-pk="'+json.results[i].pk+'" src="../statics/images/address/delete.png"></li>'
					}
					$('.address_body ul').html(html);
					if(json.count==0){
						$('.address_body ul').html('<p style="width:100%;text-align:center;margin-top:10px;">暂无收货地址</p>');
					}
				}
				//删除
				$(".shangc").unbind().click(function(){		
					var pk=$(this).attr('data-pk');
					$.ajax({
						type: 'delete',
						url: Common.domain + 'userinfo/addresses/'+pk+'/',
						headers: {
							Authorization: 'Token ' + Cer.Token
						},
						dataType: 'json',
						success: function(json){
							console.log("删除成功")
							usefont();
						},
					})
				});
				//
				$('.sure').unbind().click(function(){
					var prov=$('.prov').val();
					var city=$('.city').val();
					var dist=$('.dist').val();
					var lian=$('.detail').val();
					
					var addres=prov+'-'+city+'-'+dist+'-'+lian;
					var addressd=addres.replace("null",""); 
					
					var linkman=$('.name').val();
					var telephone=$('.tell').val();
					
					var cd=city+dist;
					
					if(cd=='城市县区'||linkman==""||telephone==""||lian==""){
						Common.showToast('请填写信息完整');
					}else{
						$.ajax({
							type:"post",
							url: Common.domain + 'userinfo/address_create/',
							headers: {
								Authorization: 'Token ' + Cer.Token
							},
							data:{
								shipping_address:addressd,
								linkman:linkman,
								telephone:telephone,
							},
							dataType: 'json',
							success: function(json){
								console.log("添加成功");
								var prov=$('.prov').val();
								$('.city').val('');
								$('.dist').val('');
								$('.detail').val('');
								$('.name').val('');
								$('.tell').val('');
								$('.sure').hide();
								$('.add_2').hide();
								$('.add_address').hide();
								$('.add_1').show();
								usefont();
							},
						});
					}
				})
			},
			error: function(json){
				Common.showToast('登录失败，请刷新页面重新操作');
				//console.log(json);
			}
		});
	}
});
