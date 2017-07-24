define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var Page = {
		init: function(){
			getScholarship();	
		}
	}

	Page.init();

	function getScholarship(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/creditrecords/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				
				var html="";
				if(json.count==0){
					html+='<div style="width:100%;height:300px;margin:20px auto;background:#F4F4F4;">'+
						'<img style="width:70%;padding-top:20%;margin-left:13%;" src="../statics/images/no_scrod.png">'+
						'<p style="text-align:center;font-size:30px;color:#BDBDBD;margin-top:10px;">暂无奖学金！<p>'+
					'</div>';
				}else{
					$('.money').html(json.results[0].last_points)
					for(var i=0;i<json.count;i++){
						
						var years = json.results[i].create_time.slice(0, 10).replace("T", " ");
						html+='<div class="content">'+
									'<div class="class_name" >'+
										'<p style="padding-bottom:10px;font-size:16px;">'+json.results[i].record_type_display+'</p>'+
										'<p style="font-size:14px;">'+years+'</p>'+
									'</div>'+
									'<div class="class_total">'+json.results[i].points+'</div>'+	
								'</div>';
					}
				}
				
				$('.jiang_cont').html(html);	
			},
			error: function(json){
				Common.showToast('暂无数据');
			}
		});
	}
});
