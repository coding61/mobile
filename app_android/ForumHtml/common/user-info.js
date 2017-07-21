define(function(require, exports, module) {
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	require('libs/jquery.cookie.js');

	exports.getChildInfo = function() {
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/whoami/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json) {
				if (!json.student.name || json.student.name == '') {
					$('.student-info .student-name').text(json.owner);
				} else {
					$('.student-info .student-name').text(json.student.name);
				}
				if ($('.scholarship-modal .money-num').length > 0) {
					$('.scholarship-modal .money-num').html('￥' + json.points);
				}
			},
			error: function() {}
		});
	}

	exports.getStudentSchedulePk = function(callback) {
		var date = new Date();
		$.ajax({
			type: 'get',
			url: Common.domain + 'classroom/student_schedule/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			data: {
				date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
			},
			dataType: 'json',
			success: function(json) {
				if (parseInt(json.count) >= 1) {
					var classScheduleList = [];

					for (var i = 0; i < json.results.length; i++) {
						if (json.results[i].status == 'unfinish') {
							classScheduleList.push(json.results[i]);
						}
					}

					if (classScheduleList.length <= 0) {
						callback();
					} else if (classScheduleList.length < 2) {
						$.cookie('schedulePk', $.trim(classScheduleList[0].lesson.pk), {
							path: '/'
						}, {
							expires: (1000 * 60 * 60 * 24)
						});
						$.cookie('classRoomPk', $.trim(classScheduleList[0].pk), {
							path: '/'
						}, {
							expires: (1000 * 60 * 60 * 24)
						});
						$.cookie('teacherOwner', $.trim(classScheduleList[0].teacher.owner), {
							path: '/'
						}, {
							expires: (1000 * 60 * 60 * 24)
						});

						//判断教室是一对一还是一对多
						if (classScheduleList[0].types == "onetoone") {
							// location.href = '../../student_client.html';
							$('.student-info .go-study').css({'background-color': '#f60'}).text('上课').click(function(){
								location.href = '../../student_client.html';
							});
						} else {
							$('.student-info .go-study').css({'background-color': '#f60'}).text('上课').click(function(){
								location.href = '../../Multiplayer_student_client.html';
							});
						}
					} else {
						var lastClassRoom = null;
						var date = new Date();
						// var nowTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes() + ':00';
						lastClassRoom = classScheduleList[0];
						for (var i = 1; i < classScheduleList.length; i++) {
							var lastClassRoomStartTime = new Date(lastClassRoom.classschedule.starttime.split('T')[0].split('-')[0], 1 + parseInt(lastClassRoom.classschedule.starttime.split('T')[0].split('-')[1]), lastClassRoom.classschedule.starttime.split('T')[0].split('-')[2], lastClassRoom.classschedule.starttime.split('T')[1].split(':')[0], lastClassRoom.classschedule.starttime.split('T')[1].split(':')[1], 0);
							var thisOne = classScheduleList[i];
							var scheduleTime = new Date(thisOne.classschedule.starttime.split('T')[0].split('-')[0], 1 + parseInt(thisOne.classschedule.starttime.split('T')[0].split('-')[1]), thisOne.classschedule.starttime.split('T')[0].split('-')[2], thisOne.classschedule.starttime.split('T')[1].split(':')[0], thisOne.classschedule.starttime.split('T')[1].split(':')[1], 0);
							if (Math.abs(scheduleTime.getTime() - date.getTime()) < Math.abs(lastClassRoomStartTime.getTime() - date.getTime())) {
								lastClassRoom = classScheduleList[i];
							}
						}
						$.cookie('schedulePk', $.trim(lastClassRoom.lesson.pk), {
							path: '/'
						}, {
							expires: (1000 * 60 * 60 * 24)
						});
						$.cookie('classRoomPk', $.trim(lastClassRoom.pk), {
							path: '/'
						}, {
							expires: (1000 * 60 * 60 * 24)
						});
						$.cookie('teacherOwner', $.trim(lastClassRoom.teacher.owner), {
							path: '/'
						}, {
							expires: (1000 * 60 * 60 * 24)
						});

						//判断教室是一对一还是一对多
						if (lastClassRoom.types == "onetoone") {
							// location.href = '../../student_client.html';
							$('.student-info .go-study').css({'background-color': '#f60'}).text('上课').click(function(){
								location.href = '../../student_client.html';
							});
						} else {
							$('.student-info .go-study').css({'background-color': '#f60'}).text('上课').click(function(){
								location.href = '../../Multiplayer_student_client.html';
							});
						}
					}
					return;
				} else {
					callback();
				}
			},
			error: function() {}
		});
	}

	//获取优惠码
	exports.getCreditCode = function(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/my_promo/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				if (json.sell_promo_code) {
					$('.credit-code-input').val(json.sell_promo_code);
					$('.get-page').click(function(){
						exports.getSellPage();
					})
				} else {
					$('.credit-code-input').val(json.credit_promo_code);
					$('.get-page').click(function(){
						exports.getCreditPage();
					})
				}
			},
			error: function(json){
				Common.showToast(json);
			}
		})
	}

	//获取优惠码海报
	exports.getCreditPage = function(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/create_credit_poster/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				console.log(json);
				$('.poster-img').attr({
					src: json.poster
				})
				$('.poster-page, .poster-mask').show();
				$('.poster-page .close-btn img').unbind().click(function(){
					$('.poster-page, .poster-mask').hide();
				});
			},
			error: function(json){
				Common.showToast('获取海报失败');
			}
		})
	}

	//获取优惠码海报
	exports.getSellPage = function(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/create_sell_poster/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				console.log(json);
				$('.poster-img').attr({
					src: json.poster
				})
				$('.poster-page, .poster-mask').show();
				$('.poster-page .close-btn img').unbind().click(function(){
					$('.poster-page, .poster-mask').hide();
				});
			},
			error: function(json){
				Common.showToast('获取海报失败');
			}
		})
	}
});