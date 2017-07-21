define(function(require, exports, module){
	var Common = require('common');
	var Cer = require('common/user-certificate.js');
	var UserInfo = require('common/user-info.js');
	
	var question_pk = $.cookie('question_pk');
	var hrn_openid = $.cookie('hrn_openid_new');
	var number = 5;
	var answer_page = 1;
	var allowScroll = true;
	var noOthersShowToast = false;
	var Page = {
		init: function(){
			getQA();
			submitAction();
			scroll();
			$('.answer-wrang .go-on').click(function(){//回答错误，继续答题
				$('.answer-wrang, .answer-mask').hide();
				window.location.reload();
			})
			$('.answer-right-btn').click(function(){//回答正确，领取红包
				$('.answer-right, .answer-mask').hide();
				forbiddenInput()
			})
			$('.no-chance .wait-times').click(function(){//没有答题次数
				$('.no-chance, .answer-mask').hide();
				forbiddenInput()
			})
		}
	}
	Page.init();

	//获取问题信息
	function getQA(){
		$.ajax({
			type: 'get',
			url: '/server/redenvelope/red_envelope_question_detail/' + question_pk + '/?hrn_openid=' + hrn_openid,
			success: function(json){
				$('#question-title').text(json.question_content);
				$('#question-tips').text(json.question_prompt);
				$('.chance-num').text(json.last_frequency);
				if (json.last_frequency <= 0) {//没有答题次数
					forbiddenInput()
					$('.no-chance, .answer-mask').show();
				}
				number = json.last_frequency;

				getOtherAnswer(answer_page)

				if (json.message == "该红包已抢完") {
					$('.answer-num-tips').text('抱歉，此红包已抢完').css({'color': '#ff7764'})
					forbiddenInput();
					Common.dialog('抱歉，此红包已抢完');
				} else if (json.message == "已抢到过此红包") {
					$('.answer-num-tips').text('您已抢到此红包').css({'color': '#ff7764'})
					forbiddenInput();
					Common.dialog('您已抢到此红包');
				} else if (json.message == "已错误5次") {
					forbiddenInput()
					$('.no-chance, .answer-mask').show();
					number = 0;
					$('.chance-num').text(number);
				}
			},
			error: function(json){
				console.log(json);
				// Common.dialog('error:' + JSON.stringify(json));
			}
		})
	}

	//提交答案
	function submit(){
		if (number == 0) {//没有答题次数
			$('.no-chance, .answer-mask').show();
			forbiddenInput();
			submitAction();
			return;
		}
		if (!$.trim($('#answer-input').val())) {//表单验证
			Common.dialog('请填写答案');
			submitAction();
			return;
		}
		if (!$.cookie('hrn_openid_new')) {
			Common.dialog('微信授权已失效，请刷新页面重新授权')
			return;
		}
		$.ajax({//提交答案
			type: 'post',
			url: '/server/redenvelope/red_envelope_answer_create/',
			headers: {'Content-Type': 'application/json'},
			data: JSON.stringify({
				'name': $.cookie('name'),
				'avatar': $.cookie('avatar'),
				'answer_content': $.trim($('#answer-input').val()),
				'question_pk': question_pk,
				'hrn_openid': $.cookie('hrn_openid_new')
			}),
			dataType: 'json',
			success: function(json){
				if (json.message == "回答正确，红包已发送") {
					forbiddenInput();
					$('.answer-right, .answer-mask').show();
					$('.answer-num-tips').text('您已抢到此红包').css({'color': '#ff7764'});
					$('.others-answer ul').html('');
					answer_page = 1;
					allowScroll = true;
					noOthersShowToast = false;
					getOtherAnswer(answer_page);
				} else if (json.message == "回答错误") {
					$('.answer-wrang, .answer-mask').show();
					number--;
					$('.chance-num').text(number);
					if (number <= 0) {
						forbiddenInput()
					}
				} else {
					Common.dialog(json.message)
				}
			},
			error: function(json){
				submitAction();
				if (JSON.parse(json.responseText).message == "err_code：SENDNUM_LIMIT,  err_code_des：该用户今日操作次数超过限制，如有需要请登录微信支付商户平台更改API安全配置") {
					Common.dialog('请明天再来吧，您的红包领取次数已用完。')
				} else {
					Common.dialog('submit answer:' + JSON.stringify(json))
				}
			}
		})
	}

	//获取其他人答案
	function getOtherAnswer(page){
		$.ajax({
			type: 'get',
			url: '/server/redenvelope/red_envelope_answer_list/?page=' + page + '&question_pk=' + question_pk,
			success: function(json){
				if (json.results.length > 0) {
					for (var i = 0; i < json.results.length; i++) {
						if (!json.results[i].result) {
							var html = '<li>' +
								'<div class="others-avatar">' +
									'<img src="' + json.results[i].avatar + '" alt="">' +
								'</div>' + 
								'<div class="others-name">' +
									'<p>' + json.results[i].name + '</p>' + 
									'<p>' + json.results[i].answer_content + '（错误）</p>' + 
								'</div>' + 
							'</li>';
						} else {
							var str = '';
							for (var j = 0; j < json.results[i].answer_content.length; j++) {
								str+='*';
							}
							var html = '<li>' +
								'<div class="others-avatar">' +
									'<img src="' + json.results[i].avatar + '" alt="头像无法显示">' +
								'</div>' + 
								'<div class="others-name">' +
									'<p>' + json.results[i].name + '</p>' + 
									'<p>' + str + '（正确）</p>' + 
								'</div>' + 
								'<div class="get-HB">' +
									'<p>获得红包</p>' +
								'</div>' +
							'</li>';
						}
						$('.others-answer ul').append(html);
					}
					$('.others-answer').css({'display':'block'})
				} else {
					noOthersShowToast = false;
				}
				if (json.next) {
					answer_page++;
					allowScroll = true
				} else {
					noOthersShowToast = true;
				}
			},
			error: function(json){
				console.log(json);
			}
		})
	}

	//页面滚动事件
	function scroll(){
		var scroll, win_scroll;
		$(document).scroll(function(){
			if (allowScroll && !noOthersShowToast) {
				allowScroll = false;
				scroll = $(document).scrollTop();
				win_scroll = $(document).height() - $(window).height();
				if (parseInt(win_scroll) - parseInt(scroll) < 30) {
					getOtherAnswer(answer_page);
				} else {
					allowScroll = true;
				}
			}
			if (noOthersShowToast && parseInt($(document).height() - $(window).height()) - parseInt($(document).scrollTop()) < 30) {
				Common.showToast('已显示所有其他人答案');
				noOthersShowToast = false;
				$(document).unbind();
			}
		})
	}

	//禁止输入和提交
	function forbiddenInput(){
		$('#answer-input').attr({
			'disabled': 'disabled'
		});
		$('.submit-btn').css({'background-color': '#ccc', 'color': '#fff'}).unbind();
	}

	function submitAction(){
		$('.submit-btn').click(function(){//提交答案
			$(this).unbind();
			submit();
		})
	}
})