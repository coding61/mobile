define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	var jiangxuejin //奖学金总额
	var youhui //所减优惠
	var jianx //所用奖金
	var jiangao //限制
	var Pname=1
	var nutrue //优惠码是否有用
	var code = Common.getQueryString('code');
	var Page = {
		init: function(){
			if (!Cer.Token) {
				location.href = base + "mobile/html/login-reg.html";
			}
			url()
			addressd()

			//关闭模态窗
			$('.qixu').click(function(){
				history.back(-1)
			})

			//选择新地址
 			$('.shiok input').change(function(){
 				if($('.shiok input').prop('checked')){
 					$('.after').css('display','none')
 					$('.yiuio').val('').attr("disabled","true")
 				}else{
 					$('.after').css('display','block')
 					$('.yiuio').val('').removeAttr('disabled')
 				}
 			})

			//计算优惠价
			$('.you input').keyup(function(){
				var unum=$('.you input').val()
				var num=$('.zong span').text()
				if(num>=300){
					console.log(Cer.Token)
				$.ajax({
					type: "get",
					url:Common.domain + 'userinfo/promo_check/',
					headers: {
						Authorization: 'Token ' + Cer.Token
					},
					data:{
						promo_code:unum,
						course: pk
					},
					dataType: 'json',
					success: function(json) {
						//$('.youhui-tips').text('');
						console.log(jianx)	
						if (jianx==null||jianx==""){
							numi = (num*100 - json.promo_price*100 )/100
						}else{
							numi = (num*100 - json.promo_price*100 - jianx*100 )/100
						}
						youhui=json.promo_price //优惠价格
						$('.hui span').text('-' + json.promo_price) //减去价格
						$('.jiag span').text(numi)
						nutrue=true
					},
					error: function(json) {
						console.log('验证码错误')
						nutrue=false
						console.log(nutrue)
						if (jianx==null||jianx==""){
							$('.hui span').text("") //减去价格
							$('.jiag span').text("")
						}else{
							$('.hui span').text("") //减去价格
							var nm = (num*100 - jianx*100 )/100
							$('.jiag span').text(nm)
						}
					}
				})
				}else{
					nutrue=false
					$('.wode').text('订单价格不足300')
				}
			})

			//计算奖学金
			$('.jiang input').keyup(function(){
				var ofont=$('.zong span').text()
				var jiang=parseFloat($('.jiang input').val())
				jianx=jiang

				if(isNaN(jiang)){
					$('.jiang input').val("")
				}else{
					$('.jiang input').val(jiang)
				}

				if(jiang>jiangxuejin){
					$('.jiangxue-tips').text('超出可使用奖学金')

					jiangao='超出可使用金额'

				}else{
					if(youhui==""||youhui==null){
						if(isNaN(jiang)){
							$('.jiag span').text("")
						}else{
							var nm=(ofont*100-jiang*100)/100
							$('.jiag span').text(nm)
						}
					}else{
						if(isNaN(jiang)){
							var nm=(ofont*100-youhui*100)/100
							$('.jiag span').text(nm)
						}else{
							var nm=(ofont*100-jiang*100-youhui*100)/100
							$('.jiag span').text(nm)
						}
					}
					jiangao=""
					$('.jiangxue-tips').text('拥有奖学金'+jiangxuejin)
				}
				if(nm<0){
					$('.jiangxue-tips').text('超出可使用奖学金')
					jiangao='超出可使用金额'

				}
			})

			//点击提交
			$('.tijai').click(function(){
				var opk=$('.yiuio').val()
				var prome=$('.you input').val()
				var jiangxue=$('.jiang input').val()
				var jian_zi=$('.jiangxue-tips').text()
				if(Pname==1){
					if(need_ship=="true"){
						Pname++
						if(jian_zi=='超出可使用金额'){
							Pname=1
							Common.showToast('超出可使用金额');
							return
						}else{
							if($('.shiok input').prop('checked')){
								var prov=$('.prov').val()
								var city=$('.city').val()
								var dist=$('.dist').val()
								var lian=$('.lian textarea').val()
					
								var addres=prov+'-'+city+'-'+dist+'-'+lian
								var addressd=addres.replace("null",""); 
					
								var linkman=$('.ren input').val()
								var telephone=$('.dian input').val()
				
								var cd=city+dist
								if(cd=='城市县区'||linkman==""||telephone==""){
									Pname=1
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
										var opk=json.pk
										var myData = my(prome,jiangxue,opk)
										shopping(myData)
									},
									error: function(json){
										Common.showToast('登录失败，请刷新页面重新操作');
									}
				  					});
								}
							}else{
								if($('.yiuio').val()=="请选择"){
									Pname=1
									Common.showToast('请选择收货地址');
								}else{
									var myData = my(prome,jiangxue,opk)
									shopping(myData)
								}	
							}
						}
					}else{
						var myData = my(prome,jiangxue,opk)
						if(jian_zi=='超出可使用金额'){
							Pname=1
							Common.showToast('超出可使用金额');
							return
						}else{
							shopping(myData)
						}
					}
				}
				$('.you input,.jiang input').val('')
				$('.hui span,.jiag span').text("")
				youhui=""
				jianx=""
			})
		}
	}
	Page.init();
	function userclass(){
		$.ajax({
			type: "get",
			url:Common.domain + 'course/courses/'+pk+'/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				$('.danmu').show()
				if(json.teach_types=='product'){
					$('.jiang input').attr('disabled','disabled')
					$('.jiangxue-tips').text('仅供课程使用')
				}else{
					$('.jiang input').removeAttr('disabled')
					userfen()

				}
			},
			error: function(json){
				Common.showToast('登录失败，请刷新页面重新操作');
			}
		})
		$.ajax({
			type:"get",
			url: Common.domain + 'course/courses/'+pk+'/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			success: function(json){
				$('.zong span').text(json.offer_price)
			}
		})

		
	}
	//获取收货地址
	function addressd(){
		$.ajax({
			type: "get",
			url:Common.domain + 'userinfo/addresses/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
			if(json.count<1){
				$('.yiui').css('display','none')
			}else{
				$('.yiuio').html('<option>请选择</option>')
				for(i=0;i<json.count;i++){
					var addr=json.results[i].shipping_address;
					var addrsd=addr.replace(/-/g,"");
					var addre=addrsd.substring(0,14);
					if(addrsd.length<14){
						var opct='<option value="'+json.results[i].pk+'">'+addrsd+'&nbsp;&nbsp;'+json.results[i].linkman+'收&nbsp;&nbsp;'+json.results[i].telephone+'</option>'
					}else{
						var opct='<option value="'+json.results[i].pk+'">'+addrsd+'...&nbsp;&nbsp;'+json.results[i].linkman+'收&nbsp;&nbsp;'+json.results[i].telephone+'</option>'
					}
					$('.yiuio').append(opct)
				}
			}},
			error: function(json){
				Common.showToast('登录失败，请刷新页面重新操作');
			}
		})
	}

	//获取 pk need_ship
	function url(){
		var url = location.search
		if (url.indexOf("?") != -1) {
    		var str = url.substr(1); 
    		var str_id=str.split("&");
    		for(var i=0;i<str_id.length;i++){
    			if(str_id[i].indexOf("pk")!=-1){
    				pk=str_id[i].split('=')[1]
    			}
    			if(str_id[i].indexOf("need_ship")!=-1){
    				need_ship=str_id[i].split('=')[1]
    			}
    		}
    		if(need_ship=="false"){
    			$('.bla h4,.yiui,.shiok,.xinana').hide()
    			$('.tijiao').css('marginTop',"150px")
    		}
   		}
   		userclass()
	}

	//生成 myData 地址opk 奖学金jiangxue 优惠码prome
	function my(prome,jiangxue,opk){
		if(prome==""||nutrue==false){
			if(jiangxue==""){
				if(opk=="",opk=="请选择"){
					var myData={}
				}else{
					var myData={
						address:opk,
					}
				}
			}else{
				if(opk=="",opk=="请选择"){
					jiangxue=parseInt(jiangxue)
					var myData={
						points:jiangxue
					}
				}else{
					jiangxue=parseInt(jiangxue)
					var myData={
						address:opk,
						points:jiangxue,
					}
				}
			}
		}else{
			console.log(nutrue)
			if(jiangxue==""){
				if(opk=="",opk=="请选择"){
					var myData={
						promo_code:prome
					}
				}else{
					var myData={
						address:opk,
						promo_code:prome,
					}
				}
			}else{
				if(opk=="",opk=="请选择"){
					jiangxue=parseInt(jiangxue)
					var myData={
						promo_code:prome,
						points:jiangxue,
					}
				}else{
					jiangxue=parseInt(jiangxue)
					var myData={
						address:opk,
						promo_code:prome,
						points:jiangxue,
					}
				}
			}
		}
		return myData
	}

	//购买商品
	function shopping(myData){

		$.ajax({
			type: "post",
			url:Common.domain + 'market/course/purchase/'+pk+'/',
			headers: {
				Authorization: 'Token ' + Cer.Token,
				"Content-Type":"application/json"
			},
			data:JSON.stringify(myData),
			dataType: 'json',
			success: function(json){
				order_num=json.order_number;
				if(json.amount==0.00){
					Common.showToast("购买成功");
					zif()
					location.href = "pay-back.html";    
				}else{
					isWeiXin(order_num);
				}
				$('.tijiao').css('display','none')
				Pname=1
			},
			error: function(json){
				Common.showToast('登录失败，请刷新页面重新操作');
			}
		})
	}

	//获取奖学金
	function userfen(){
		$.ajax({
			type:"get",
			url: Common.domain + 'userinfo/whoami/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			success: function(json){
				if(json.points==0){
					$('.jiangxue-tips').text('可用奖学金为0')
				}else{
					jiangxuejin=json.points
					$('.jiangxue-tips').text('拥有奖学金'+json.points)
				}
			}
		})
	}


	function isWeiXin(selectId){
	 	var ua = window.navigator.userAgent.toLowerCase();
	 	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			// 微信浏览器
			// code 授权公众号的返回值 url 授权之后回调的⻚⾯
			if (!code) {
				var url = window.location.href
				Common.authorize(encodeURIComponent(url));
				return;
			}

	 		pay_way = "wx_pub";
	 		payOrder(selectId, pay_way, code);
	 		Common.showToast("正在获取权鉴信息，请稍后...");
	 	}else{
	 		pay_way = "alipay_wap";
	 		payOrder(selectId, pay_way);
	 	}
	}

	function payOrder (selectId, pay_way, code) {
		$.ajax({
			type: "put",
			url: Common.domain + "market/order/payment/" + selectId + "/",
				headers: {
				Authorization: "Token " + Cer.Token
			},
			data: {
				channel: pay_way,
				code: code
			},
			success: function(json) {
				console.log(json)
				if (json.status != 0) {
					console.log(json)
					Common.confirm(json.message,function(){
						location.href = 'index.html';
					});
				} else if (json.charge.amount == 0) {
					Common.showToast("购买成功");
					location.href = 'pay-back.html';
				} else {
					Common.showToast("正在调起支付付控件，请稍后...");
					pingpp.createPayment(json.charge, function(result, err){
						console.log(result);
						console.log(err.msg);
						console.log(err.extra);
					if (result == "success") {
				// 		// 只有微信公众账号 wx_pub ⽀付成功的结果会在这⾥返回，其他的⽀付结都会跳转到 extra 中对应的 URL。
						Common.showToast("支付成功");
						location.href = 'pay-back.html';
					} else if (result == "fail") {
				// 		// charge 不正确或者微信公众账号⽀付失败时会在此处返回
						Common.showToast("支付失败,请稍后再试");
						location.href = 'index.html';
					} else if (result == "cancel") {
				// 		// 微信公众账号⽀付取消⽀付
						Common.showToast("取消付款");
						location.href = 'index.html';
					}
					});
				}
			}
		})
	}

	function zif(){
		$.ajax({
            type: "put",
            url: Common.domain + "market/order/payment/" + order_num + "/",
            headers: {
                Authorization: "Token " + Cer.Token
            },
            data: {
                channel:"alipay_pc_direct"
            },
            success: function(json) {
            // console.log(json);
            pingpp.createPayment(json.charge, function(result, err){
				console.log(result);
				console.log(err.msg);
				console.log(err.extra);
				if (result == "success") {
						        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
				} else if (result == "fail") {
						        // charge 不正确或者微信公众账号支付失败时会在此处返回
				} else if (result == "cancel") {
						        // 微信公众账号支付取消支付
				}
			});
			setTimeout(function(){
				window.history.back();
				wlocation.reload();
			},1000)
            }
        });
	}
})