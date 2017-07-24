define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var pk='7'
	var nu=1
	var Page = {
		init: function(){
				username()
				$('.yishou_wanc').click(function(){
					$('.setloca').css('display','block')
				})
				$("#onquxiao").click(function(){
					$('.setloca').css('display','none')
				})
				$('#onLoca').click(function(){
					if(nu==1){
						nu++
					var prov=$('.prov').val()
				var city=$('.city').val()
				var dist=$('.dist').val()
				var lian=$('.lian textarea').val()
				
				var addres=prov+'-'+city+'-'+dist+'-'+lian
				var addressd=addres.replace("null",""); 
				
				var linkman=$('.ren input').val()
				var telephone=$('.dianhua input').val()
				
				console.log(linkman+telephone)
				var cd=city+dist
				console.log(linkman)
				
				if(cd=='城市县区'||linkman==""||telephone==""){
					
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
						console.log("添加成功")
						nu=1
						$('.setloca').css("display","none")
						usefont();
					},
				});
				}}
				})
				$(document).on("click",".shangc",function(){		
				var pk=$(this).attr('pk')
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
				})
				$('.pack_wanc').click(function(){
					if($('.pack_wanc').hasClass('pack_wang')){
						$('.dian').css('visibility','hidden')
						$('.pack_wanc').text('修改').removeClass('pack_wang')
						$('.pack_name input').attr('readonly','readonly').css("color","#999")
						
						setsan()

					}else{
						$('.dian').css('visibility','visible')
						$('.pack_wanc').text('完成').addClass('pack_wang')
						$('.pack_name input').removeAttr('readonly').focus().css("color","#000")
					}
					
				})
				$('.children_wanc').click(function(){
					if($('.children_wanc').hasClass('pack_wang')){
						$('.children_wanc').text('修改').removeClass('pack_wang')
						$('.children_name input').attr('readonly','readonly').css("color","#999")
						$('.children_sex span').css('color','#999')
						setchil()
						
					}else{
						$('.children_wanc').text('完成').addClass('pack_wang')
						$('.children_name input').removeAttr('readonly').focus().css("color","#000")
						$('.children_sex span').css('color','#000')
					}
				})
				$('.dian').click(function(){
					$('.imgs').show()
					
					$('.jsone').click(function(){
						$('.imgs').hide()
					})
					$('.imgs a img').click(function(){
						myinm=$(this).attr('src')
						$('.pack_left img').attr('src',myinm)
						$('.imgs').hide()
					})
				})
				$('#children_sexs').change(function(){
					var val=$('#children_sexs').val()
					if(val=="S"){
						$('.children_sex span').text("保密")
					}else if(val=="M"){
						$('.children_sex span').text('男')
					}else{
						$('.children_sex span').text('女')
					}	
				})
				$('.pack_name input').keyup(function(){
					var getByteLen = function (val) { 
					var len = 0; 
					for (var i = 0; i < val.length; i++) { 
						if (val[i].match(/[^x00-xff]/ig) != null){
							len += 2;
						}else{
							len += 1; 
						}
					}; 
					return len; 
					} 
					var sAbc = $('.pack_name input').val(); 
					var ol = getByteLen(sAbc); 
					if(ol>16){
						Common.showToast("昵称过长");
						var as=sAbc.substring(0,sAbc.length-1)
						$('.pack_name input').val(as)
					}
				})
				$('.children_name input').keyup(function(){
					var getByteLen = function (val) { 
					var len = 0; 
					for (var i = 0; i < val.length; i++) { 
						if (val[i].match(/[^x00-xff]/ig) != null){
							len += 2;
						}else{
							len += 1; 
						}
					}; 
					return len; 
					} 
					var sAbc = $('.children_name input').val(); 
					var ol = getByteLen(sAbc); 
					if(ol>16){
						Common.showToast("昵称过长");
						var as=sAbc.substring(0,sAbc.length-1)
						$('.children_name input').val(as)
					}
				})
		}
	}
	Page.init();
	function address(){
		
	}
	function setsan(){
		var name=$('.pack_name input').val()
		$.ajax({
			type:"patch",
			url: Common.domain + 'userinfo/whoami/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			data:{
				name:name,
				avatar:myinm,
			},
			dataType: 'json',
			success: function(json){
				console.log("修改成功")
				username();
			},
			error: function(json){
				console.log(json);
			}
		});
	}
	function setchil(){
		var nick=$('.children_name input').val()
		var sex=$('#children_sexs').val()
		$.ajax({
			type:"patch",
			url: Common.domain + 'student/student/'+usernum+'/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			data:{
				//name:name,
				nickname:nick,
				sex:sex,
				//birthday:time,
			},
			dataType: 'json',
			success: function(json){
				console.log("孩子修改成功")
				$('.setschil').css("display","none")
				username();
			},
		});
	}
	function username(){
		$.ajax({
			type:"get",
			url: Common.domain + 'userinfo/whoami/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success:function(json){
				usernum=json.owner
				myinm=json.avatar
				console.log(json)
				$('.pack_left img').attr('src',json.avatar)
				if(json.name==""){
					$('.pack_name input').val(json.owner)
				}else{
					$('.pack_name input').val(json.name)
				}
				$('.children_name input').val(json.student.nickname)
				$('#children_sexs').val(json.student.sex)
				if(json.student.sex=="S"){
					$('.children_sex span').text("保密")
				}else if(json.student.sex=="M"){
					$('.children_sex span').text('男')
				}else{
					$('.children_sex span').text('女')
				}
				
			},
			error: function(json){
				console.log('失败')
				console.log(json);
			}
		});
		usefont()
	}
	function usefont(){
		$.ajax({
			type:"get",
			url:Common.domain + 'userinfo/addresses/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				var cou='<p class="count_no">暂无地址</p>'
				console.log(json);
				if(json.count<1){
					$('.yishou_right').html('<div class="user_shou"></div>')
					$('.user_shou').append(cou)
				}else{
					$('.yishou_right').html('<p></p>')

					for(i=0;i<json.count;i++){
						var addr=json.results[i].shipping_address
						var addrsd=addr.replace(/-/g,""); 
						
						var shou_ren='<p class="ren">联系人：'+json.results[i].linkman+'<span class="shangc" pk="'+json.results[i].pk+'"></span></p>'
						var shou_add='<p class="dizhi">收货地址：'+addrsd+'</p>'
						var shou_dian='<p class="photo">联系电话：'+json.results[i].telephone+'</p>'
		
						var di_title='<div class="user_shou">'+shou_ren+shou_add+shou_dian+'</div>'
						$('.yishou_right').append(di_title)
					}
				}
			},
			error: function(json){
				Common.showToast('登录失败，请刷新页面重新操作');
				//console.log(json);
			}
		});
		$(document).on('click','.set3',function(){
			//$(".setloca").css("display","block")
		})
	}
})