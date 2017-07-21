define(function(require, exports, module){
	exports.domain = '/server/';
	// exports.api3 = 'http://localhost:8088/api/server/';
	// exports.api3 = 'http://127.0.0.1:8080/api3/server/';
	// exports.api3 = 'http://localhost:/server/';
	// exports.domain = exports.api3;
	exports.showToast = function(text, bot, fx) {
		showToastControler.queue.push(text);
		var bottom = bot ? bot + "px" : "80px";
		if (showToastControler.status) {

			if (!showToastControler.inited) {
				showToastControler.inited = true;
				$("<div class=\"toast\">" + text + "</div>").appendTo("body");
			}
			show();

			function show() {
				showToastControler.status = false;
				$(".toast").html(showToastControler.queue[0]);
				$(".toast").css({
					"left": ($(window).width() - $(".toast").width() - 20) / 2 + "px"
				});

				$(".toast").show().animate({
					"opacity": "1",
					"bottom": bottom
				}, function() {
					setTimeout(function() {
						$(".toast").fadeOut(function() {
							$(this).css({
								"bottom": "-36px"
							});

							showToastControler.status = true;
							showToastControler.queue.shift();
							showToastControler.queueLength = showToastControler.queue.length;
							if (showToastControler.queue.length > 0) {
								show();
							} else {
								if (fx) {
									fx();
								}
							}
						});
					}, 2500)
				});
			}
		}
	}

	var showToastControler = {
		status: true,
		queue: [],
		inited: false,
		queueLength: 0
	};

	exports.getQueryString = function(key) {
		var ls = location.search;
		//var reg = eval("new RegExp('[a-zA-Z0-9]+=[^&]+&|[a-zA-Z0-9]+=[^&]+$','g')");
		var reg = eval("new RegExp('[\?&]+(" + key + ")=[^&]+&|[\?&]+(" + key + ")=[^&]+$')");
		var args = ls.match(reg);
		if (args) {
			return args[0].split("=")[1].replace(/&$/, "");
		} else {
			console.log(key + "不存在");
			return null;
		}
		//var args = ls.match(/[a-zA-Z0-9]+=[^&]+&|[a-zA-Z0-9]+=[^&]+$/g);
	}

	// 公众号授权
	exports.authorize = function(redirectUrl) {
		// redirectUrl 授权之后回调的页面
		if (!redirectUrl) {
			this.dialog('缺少回调页面路径');
			return;
		}
		var appid = 'wx58e15a667d09d70f';
		// 重定向至微信公众号授权页
		var authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirectUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
		location.assign(authorizeUrl);
	}

	exports.dialog = function(text, callback) {
		if (callback) {
			exports.dialogCB = callback;
		} else {
			exports.dialogCB = null;
		}
		if (!$(".ui-dialog").length) {
			$('<div class="ui-dialog" role="alert"><div class="ui-dialog-container"><p>' + text + '</p><a href="#" id="close-dialog">确&nbsp;定</a></div></div>').appendTo("body");
			$('#close-dialog').on('click', function(event) {
				$(".ui-dialog").removeClass('is-visible');
				if (exports.dialogCB) {
					exports.dialogCB();
				}
			});
		} else {
			$(".ui-dialog .ui-dialog-container p").html(text);
		}
		$('.ui-dialog').addClass('is-visible');
	}
	exports.dialogCB = null;

	exports.confirm = function(text, callback) {
		exports.confirmCB = callback;
		if (!$(".ui-confirm").length) {
			$('<div class="ui-confirm" role="alert"><div class="ui-confirm-container"><p>' + text + '</p><a href="#" id="ui-confirm-confirm">确&nbsp;定</a><a href="#" id="ui-confirm-cancel">取&nbsp;消</a></div></div>').appendTo("body");
			$('#ui-confirm-confirm').on('click', function(event) {
				$(".ui-confirm").removeClass('is-visible');
				exports.confirmCB();
			});
			$('#ui-confirm-cancel').on('click', function(event) {
				$(".ui-confirm").removeClass('is-visible');
			});
		} else {
			$(".ui-confirm .ui-confirm-container p").html(text);
		}
		$('.ui-confirm').addClass('is-visible');
	}

	exports.confirmCB = function() {};

	exports.showMask = function(domValue){
		$('#mask').show().unbind().click(function(){
			exports.hideMask(domValue);
		});
		domValue.show();
		$('body').css({
			overflow: 'hidden'
		});
	}

	exports.hideMask = function(domValue){
		$('#mask').hide();
		domValue.hide();
		$('body').css({
			overflow: 'auto'
		});
	}

	exports.platform = function() {
		var u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			//移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	}();

	$('.weixin').hover(function(){
		$('.QRCodes').show();
	},function(){
		$('.QRCodes').hide();
	});


	// 百度统计
	var _hmt = _hmt || [];
	// (function() {
  	var hm = document.createElement("script");
  	hm.src = "https://hm.baidu.com/hm.js?a065df329280aef5cc07837410948a43";
  	var s = document.getElementsByTagName("script")[0]; 
  	s.parentNode.insertBefore(hm, s);
	// })();
});
