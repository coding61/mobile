define(function(require, exports, module){
	var Common = require('../../modules/common/common.js');
	var selectId = Common.getQueryString('out_trade_no');
	var Cer = require('common/user-certificate.js');
	// require('libs/jquery.cookie.js');
	// var addressPk = window.localStorage.addressPk;
	// var coursePk = window.localStorage.coursePk;
	// var addressPk = document.cookie.split('addressPk=').length > 1 ? document.cookie.split('addressPk=')[1].split(';')[0] : null;
	// var coursePk = document.cookie.split('coursePk=').length > 1 ? document.cookie.split('coursePk=')[1].split(';')[0] : null;

	var Page = {
		init: function(){

			var t = 6;
			var a = setInterval(time,1000);
			function time(){
			    t--;
			    console.log(t);
			    $('.no-orders span').html(t);
			    if(t == 0){
			        clearInterval(a);
			        location.href = "me.html";
			    }
			}
			// time();		

			$.ajax({
                type: "get",
                url: Common.domain + "market/order/"+selectId+"/",
                headers: {
                    Authorization: "Token " + Cer.Token
                },
                success: function(json) {
                	if (json.order_type_display && json.order_type_display == '押金') {
						submitDeposit(json.rent_address_id, json.rent_course_id);
                	} else{
	                	if(json.bought_course_set[0].course.teach_types=='video'){
	                		location.href='class-video.html';
	                	} else {

	                	}
                	}
                }
            });

		}
	}

	Page.init();

	function submitDeposit(addressPk, coursePk){
		var data = {
	        address: addressPk,
	        quantity: 1,
	        isrent: 'true'
      	}
		$.ajax({
			type: 'post',
			url: Common.domain + 'market/course/purchase/' + coursePk + '/',
			data: JSON.stringify(data),
	      	headers: {
	      		Authorization: "Token " + Cer.Token,
	      		'Content-type': 'application/json'
	      	},
	      	success: function(json){
				location.href = 'rentList.html';
	      	},
	      	error: function(json){
				Common.showToast('租赁失败');
	      	}
		})
	}

});

