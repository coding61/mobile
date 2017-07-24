define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var hasNoDeposit = true;
	var hasIng = true;
	var order_number = '';

	var Page = {
		init: function(){
			if (!Cer.Token) {
				location.href = base + "mobile/html/login-reg.html";
			}

			$('.top span').click(function(){
				var this_ = $(this);
				if (!this_.hasClass('active')) {
					var status = this_.attr('data-id');
					if (status == 'ing') {
						$('.top span').removeClass('active');
						this_.addClass('active')
						$('.done-block').hide(function(){
							$('.ing-block').show();
						});
					} else {
						$('.top span').removeClass('active');
						this_.addClass('active')
						$('.ing-block').hide(function(){
							$('.done-block').show();
						});
					}
				}
			})

			$('.deposit-back-btn').click(function(){
				if (hasNoDeposit) {
					Common.showToast('您没有可退押金');
				} else {
					if (hasIng) {
						$('.mask, .can-not-back').show();
					} else {
						$('.mask, .back-deposit-view').show();
					}
				}
			});

			$('.back-deposit-view .orange').click(function(){
				var telNum = $.trim($('.zf-username').val());
				var realName = $.trim($('.real-name').val());

				if (telNum && realName) {
					backDeposit(telNum, realName)
				} else {
					Common.showToast('请将信息填写完整')
				}
			})

			$('.can-not-back button').click(function(){
				$('.mask, .can-not-back').hide();
			});

			$('.back-cancel').click(function(){
				$('.mask, .back-deposit-view').hide();
			})

			$('.post-back button').click(function(){
				location.href = 'postBack.html?order_number=' + order_number;
			})

			getRentList();
			getAmounts();
		}
	}

	Page.init();

	//获取租赁信息
	function getRentList(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'market/rent_orders/',
			data: {},
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				console.log('get rent list success', json);
				var ingData = [];
				var doneData = [];
				for (var i = 0; i < json.results.length; i++) {
					if (json.results[i].status_display == "待付款") {
						ingData.push(json.results[i]);
					} else {
						doneData.push(json.results[i]);
					}
				}
				if (ingData.length > 0) {
					hasIng = true;
					order_number = ingData[0].order_number;
					if (ingData[0].tracking_number && ingData[0].tracking_number != '') {
						//已发货
						$('#have-data > .post-num').text('顺丰物流：' + ingData[0].tracking_number);
						$('#have-data .ing-content img').attr({src: ingData[0].bought_course_set[0].course.banner});
						$('#have-data .ing-content > span').text(ingData[0].bought_course_set[0].course.name);
						$('#have-data .ing-content-time .start-data').text(ingData[0].start_time.split('T')[0]);
						$('#have-data .ing-content-time .day-num').text(ingData[0].use_days + '天');
						$('#have-data .ing-content-time .price-num').text(parseInt(ingData[0].amount) - 25 + '元(加25元运费)');

						$('#have-data').css({display: 'block'});
						$('#none-data').css({display: 'none'});
					} else {
						//未发货
						$('#none-ing-data .ing-content img').attr({src: ingData[0].bought_course_set[0].course.banner});
						$('#none-ing-data .ing-content > span').text(ingData[0].bought_course_set[0].course.name);

						$('#none-ing-data').css({display: 'block'});
						$('#none-data').css({display: 'none'});
					}
				} else {
					hasIng = false;
					$('#none-data').css({display: 'block'});
				}
				if (doneData.length > 0) {
					//有租赁过的周边
					var html = '';
					for (var i = 0; i < doneData.length; i++) {
						html += '<div id="done-data" class="ing-view done-view">' +
							'<p class="post-num">顺丰物流：' + doneData[i].back_tracking_number + '</p>' +
							'<div class="ing-content">' +
								'<img src="' + doneData[i].bought_course_set[0].course.banner + '" alt="">' +
								'<span>' + doneData[i].bought_course_set[0].course.name + '</span>' + 
							'</div>' +
							'<div class="ing-content-time">' +
								'<div>' +
									'<p>开始时间</p>' +
									'<p>结束时间</p>' +
									'<p>费用</p>' +
								'</div>' +
								'<div>' +
									'<p class="start-data">' + (doneData[i].start_time ? doneData[i].start_time.split('T')[0] : doneData[i].start_time) + '</p>' +
									'<p class="day-num">' + (doneData[i].end_time ? doneData[i].end_time.split('T')[0] : doneData[i].end_time) + '</p>' +
									'<p class="price-num">' + doneData[i].amount + '元</p>' +
								'</div>' +
							'</div>' +
							'<div class="post-back">' +
								'<button>回寄单号：' + doneData[i].back_tracking_number + '</button>' +
							'</div>' +
						'</div>'
					}
					$('.done-block .scroll').html(html)
					$('.done-block #none-data').css({display: 'none'});
					$('.done-block .scroll').css({display: 'block'});
				} else {
					//没有租赁过周边
					$('.done-block .scroll').css({display: 'none'});
					$('.done-block #none-data').css({display: 'block'});
				}
			},
			error: function(json){
				console.log('get rent list fail',json);
			}
		})
	}

	//获取押金信息
	function getAmounts(){
		$.ajax({
			type: 'get',
			url: Common.domain +  'market/deposit_info/',
			data: {},
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				console.log('get amount success', json);
				if (json.amount) {
					$('.deposit-back .deposit-num').text(json.amount.split('.')[0]);
					if (json.amount > 0) {
						hasNoDeposit = false;
					}
				}
			},
			error: function(json){
				console.log('get amount fail', json);
				if (json.status == 500) {
					hasNoDeposit = true;
					$('.deposit-back .deposit-num').text('0');
				} else {
					Common.showToast('获取租金信息失败')
				}
			}
		})
	}

	//退回押金
	function backDeposit(telNum, realName){
		$.ajax({
			type: 'post',
			url: Common.domain + 'market/deposit/withdraw/',
			data: {
				'amount': '1000',
				'alipay_name': realName,
				'alipay_number': telNum
			},
			headers: {
				'Authorization': 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				hasNoDeposit = true;
				$('.deposit-num').text('0');
				$('.mask, .back-deposit-view').hide();
			},
			error: function(json){
				Common.showToast('退回押金失败')
			}
		})
	}

	//寄回周边
	function postBack(){

	}
});