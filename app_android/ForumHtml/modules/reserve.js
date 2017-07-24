define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');

	var Page = {
		init: function(){
			Cer.mobileLoginTest();
			// getLearnProgress();
			getTimeList();
		}
	}

	Page.init();

	function getTimeList(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'classroom/classschedules/',
			headers: {
				Authorization: 'Token ' + Cer.Token,
				'Content-Type': 'application/json'
			},
			data: {
				day: 1,
			},
			dateType: 'json',
			timeout: 8000,
			success: function(json){
				// 显示选择日期时间
				$('.has-no-teacher').css({'display': 'none'});
				$('.has-teacher').css({'display': 'block'});
				
				var by = function(name){
				    return function(o, p){
				        var a, b;
				        if (typeof o === "object" && typeof p === "object" && o && p) {
				            a = o[name];
				            b = p[name];
				            if (a === b) {
				                return 0;
				            }
				            if (typeof a === typeof b) {
				                return a < b ? -1 : 1;
				            }
				            return typeof a < typeof b ? -1 : 1;
				        }
				        else {
				            throw ("error");
				        }
				    }
				}
				json.results.sort(by('starttime'));
				var nextDate = new Date(new Date().getTime() + 24*60*60*1000);
				var nowDate = nextDate;
				createTable(nextDate, json);

				$('.date-to-right').click(function(){
					nextDate = new Date(nextDate.getTime() + 24*60*60*1000*7);
					createTable(nextDate, json);
				})
				$('.date-to-left').click(function(){
					if (nowDate >= nextDate) {
						Common.dialog('不能选择更早的日期');
						return
					}
					nextDate = new Date(nextDate.getTime() - 24*60*60*1000*7);
					createTable(nextDate, json);
				})
				

				//选择日期
				$('.date-content .date-detail').click(function(){
					var this_ = $(this);
					$('.date-active').find('img').attr({src: '../statics/images/reserve/date-top-gray.png'})
					$('.date-active').removeClass('date-active');
					this_.addClass('date-active');
					this_.find('img').attr({src: '../statics/images/reserve/date-top-orange.png'})
					var dateClass = this_.attr('data-date');
					$('.choose-time .time-list-show').removeClass('time-list-show');
					$('.choose-time .' + dateClass).addClass('time-list-show');
				});
				
				//选择时间
				$('.time-content').on('click', '.time-detail', function(){
					var this_ = $(this);
					$('.on-focus').removeClass('on-focus');
					$('.is-checked-checked').removeClass('is-checked-checked');
					this_.addClass('on-focus');
					$('.submit .submit-btn').text('预约').unbind().click(function(){
						if (parseInt($(this).attr('data-schedule')) <= 0) {
							Common.dialog('对不起，您没有剩余课时，请购买课程或者联系管理员!');
							return;
						}
						if ($('.time-content .on-focus').length > 0) {
							Common.confirm('是否确定预约？', function(){
								submit();
							})
						} else {
							Common.showToast('请选择一个上课时间段');
						}	
					});
				});

				//取消选择
				$('.time-content').on('click', '.is-checked', function(){
					var this_ = $(this);
					$('.on-focus').removeClass('on-focus');
					$('.is-checked-checked').removeClass('is-checked-checked');
					this_.addClass('is-checked-checked');
					$('.submit .submit-btn').text('取消预约').unbind().click(function(){
						Common.confirm('是否取消预约？', function(){
							cancel();
						})
					});
				})
				
				//提交发起约课
				$('.submit .submit-btn').unbind().click(function(){
					// if (parseInt($(this).attr('data-schedule')) <= 0) {
					// 	Common.dialog('对不起，您没有剩余课时，请购买课程或者联系管理员!');
					// 	return;
					// }
					if ($('.time-content .on-focus').length > 0) {
						Common.confirm('是否确定预约？', function(){
							submit();
						})
					} else {
						Common.showToast('请选择一个上课时间段');
					}
				});
			},
			error: function(xhr, textStatus){
				if (textStatus == "timeout") {
                    Common.dialog("请求超时");
                    return;
                }
                if (xhr.status == 400 || xhr.status == 403) {
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    return;
                } else {
                    Common.dialog('服务器繁忙');
                    return;
                }
                console.log(textStatus);	
			}
		});
	}

	function submit(){
		$.ajax({
			type: 'post',
			url: Common.domain + 'classroom/classschedule/choice/' + $('.time-content .on-focus').attr('data-pk') + '/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			timeout: 8000,
			dataType: 'json',
			success: function(json){
				if (json.status == 0) {
					Common.dialog('预约成功，管理员会尽快与您联系确认', function(){
						location.reload();
					});
				}
			},
			error: function(xhr, textStatus){
				if (textStatus == "timeout") {
                    Common.dialog("请求超时");
                    return;
                }
                if (xhr.status == 400 || xhr.status == 403) {
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    return;
                } else {
                    Common.dialog('服务器繁忙');
                    return;
                }
                console.log(textStatus);	
			}
		});
	}

	function cancel(){
		$.ajax({
			type: 'DELETE',
			url: Common.domain + 'classroom/classschedule/cancel/' + $('.time-content .is-checked-checked').attr('data-pk') + '/',
			headers: {
				Authorization: 'Token ' + Cer.Token,
				'Content-Type': 'application/json'
			},
			timeout: 8000,
			dataType: 'json',
			success: function(json){
				Common.dialog('取消预约成功', function(){
					location.reload();
				});
			},
			error: function(xhr, textStatus){
				if (textStatus == "timeout") {
                    Common.dialog("请求超时");
                    return;
                }
                if (xhr.status == 400 || xhr.status == 403) {
                    Common.dialog(JSON.parse(xhr.responseText).message||JSON.parse(xhr.responseText).detail);
                    return;
                } else {
                    Common.dialog('服务器繁忙');
                    return;
                }
                console.log(textStatus);	
			}
		});
	}

	function createTable(nextDate, json){
		$('.date-content .date-detail-num, .date-content .date-detail-str').empty();
		$('.choose-time .time-content-l, .choose-time .time-content-m, .choose-time .time-content-r').empty();

		//循环。按天渲染数据。
		for (var i = 1; i < 8; i++) {
			$('.date-content .date-list-' + i).find('.date-detail-num').html((nextDate.getMonth() + 1) + '-' + nextDate.getDate());
			$('.date-content .date-list-' + i).find('.date-detail-str').html(returnWeekday(nextDate));

			if (json.count > 0) {
				var index = 1;
				for (var j = 0; j < json.results.length; j++) {
					if (nextDate.getDate() == json.results[j].starttime.split('T')[0].split('-')[2]) {
						if (json.results[j].status === 0) {//待选
							var html = '<div class="time-detail" data-pk="' + json.results[j].pk + '">' +
											'<span>' + delSecond(json.results[j].starttime) + '</span>—<span>' + delSecond(json.results[j].endtime) + '</span>'	+
										'</div>';
						}  else if (json.results[j].status === 2) {//已选
							var html = '<div class="time-detail is-checked" data-pk="' + json.results[j].pk + '">' +
											'<span>' + delSecond(json.results[j].starttime) + '</span>—<span>' + delSecond(json.results[j].endtime) + '</span>'	+
										'</div>';
						}
						if (index == 1) {
							$('.choose-time .time-list-' + i + ' .time-content-l').append(html);
							index = 2;
						} else if (index == 2) {
							$('.choose-time .time-list-' + i + ' .time-content-m').append(html);
							index = 3;
						} else if (index == 3) {
							$('.choose-time .time-list-' + i + ' .time-content-r').append(html);
							index = 1;
						} else {
							$('.choose-time .time-list-' + i + ' .time-content-l').append(html);
							index = 2;
						}
					}
				}
			}

			//此日期无教师上课
			if (!$('.choose-time .time-list-' + i).find('.time-detail').length) {
				$('.choose-time .time-list-' + i + ' .time-content-l').text('此日期没有教师可开课');
			}

			//日期加一
			nextDate = new Date(nextDate.getTime() + 24*60*60*1000);
		}
	}

	function getNowDate(){
		var date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
		return date;
	}

	function delSecond(value){
		return value.split('T')[1].split(':')[0] + ':' + value.split('T')[1].split(':')[1];
	}

	function returnWeekday(value){
		var weekday = value.getDay();
		switch(weekday){
			case 0: return '周日'; break;
			case 1: return '周一'; break;
			case 2: return '周二'; break;
			case 3: return '周三'; break;
			case 4: return '周四'; break;
			case 5: return '周五'; break;
			case 6: return '周六'; break;
			default: return '周一';
		}
	}

	//获取是否有剩余课时，并绑定在确认按钮上
	function getLearnProgress(){
		$.ajax({
			type: 'get',
			url: Common.domain + 'userinfo/learning_progress/',
			headers: {
				Authorization: 'Token ' + Cer.Token
			},
			dataType: 'json',
			success: function(json){
				$('.submit .submit-btn').attr({
					'data-schedule': (parseInt(json.paid_classroom) + parseInt(json.free_classroom))
				});
			},
			error: function(){}
		});
	}
});
