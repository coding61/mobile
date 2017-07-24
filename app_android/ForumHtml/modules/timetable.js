define(function(require, exports, module){
    // require('../../libs/jQuery-Mobile/jquery.mobile-1.4.5.js');
    var Common = require('../../modules/common/common.js');
    var Cer = require('common/user-certificate.js');

    // 测试用 token
    // Cer.Token = 'db59adc557506774b95931ae0ca581b1480e1f9c';

    var cerDay;    // 当前日期
    var cerMon;    // 当前周一
    var dayArr=[]; // 本周有预约课程的日期

    var Page = {
        init: function(){

            if (Cer.Token) {
                timetableMain();
            } else {
                location.href = 'login-reg.html';
            }

        }
    }
    Page.init();

    function timetableMain(){
        // 拼成接口需要格式 xxxx-xx-xx
        var myDate = new Date();

        var y = myDate.getFullYear();
        var m = myDate.getMonth();
        var d = myDate.getDate();
        var w = myDate.getDay();

        var yearStr = String(y);
        var monthStr = String(m + 1 < 10 ? "0" + String(m + 1) : String(m + 1));
        var dayStr = String(d < 10 ? "0" + String(d) : String(d));
        cerDay = yearStr + "-" + monthStr + "-" + dayStr;
        cerMon = getMonDate();

        getTimeTable(cerDay);
        getWeekView(cerMon);

        // 右滑，上一周
        $('.last').click(function(){

            $(".body").slideUp();
            var mon = cerMon.getDate();
            cerMon.setDate(mon-7)
            mon_y = cerMon.getFullYear();
            mon_m = cerMon.getMonth();
            mon_d = cerMon.getDate();
            cerDay = String(mon_y) + "-" + String(mon_m + 1 < 10 ? "0" + String(mon_m + 1) : String(mon_m + 1)) + "-" + String(mon_d < 10 ? "0" + String(mon_d) : String(mon_d));
            getWeekView(cerMon);
            getTimeTable(cerDay,cerMon);
            $(".body").slideDown();
        })
        // 左滑，下一周
        $('.next').click(function(){

            $(".body").slideUp();
            var mon = cerMon.getDate();
            cerMon.setDate(mon+7)
            mon_y = cerMon.getFullYear();
            mon_m = cerMon.getMonth();
            mon_d = cerMon.getDate();
            cerDay = String(mon_y) + "-" + String(mon_m + 1 < 10 ? "0" + String(mon_m + 1) : String(mon_m + 1)) + "-" + String(mon_d < 10 ? "0" + String(mon_d) : String(mon_d));
            getWeekView(cerMon);
            getTimeTable(cerDay,cerMon);
            $(".body").slideDown();
        })
    }

    function getTimeTable (cerDay) {
        $.ajax({
            type: 'get',
            url: Common.domain + 'classroom/student_schedule/?date=' + cerDay,
            headers: {
                Authorization: 'Token ' + Cer.Token
            },
            dateType: 'json',
            success: function(json){
                dayArr=[];
                // 当日课程 json
                var cer_lesson = [];
                for (var i = 0; i < json.results.length;i++) {
                    var busy_day = json.results[i].classschedule.starttime.split("T")[0];
                    dayArr.push(busy_day);
                    var year = json.results[i].classschedule.starttime.split("T")[0];
                    if (year == cerDay) {
                        // 要显示的时间
                        var sta = json.results[i].classschedule.starttime.split("T")[1].split(":")[0] + ":" + json.results[i].classschedule.starttime.split("T")[1].split(":")[1];
                        json.results[i].classschedule.starttime = sta;
                        var end = json.results[i].classschedule.endtime.split("T")[1].split(":")[0] + ":" + json.results[i].classschedule.endtime.split("T")[1].split(":")[1];
                        json.results[i].classschedule.endtime = end;

                        json.results[i].time_id = i;
                        cer_lesson.push(json.results[i]);
                    } else {}
                };
                // 当天课表显示
                if (cer_lesson.length != 0) {
                    $('.no-orders').hide();
                } else {
                    $('.no-orders').show();
                }

                var html = template('list-template', cer_lesson);
                $('.list').html(html);

                // 课程颜色，蓝-绿-蓝-绿
                $(".list li").each(function(){
                  var a = $(this).attr('data-id');
                  if (a%2 !=0) {
                    $(this).css('background-color','#39DB93');
                  } else {
                    $(this).css('background-color','#0BB6F5');
                  }
                });
                // 在刷新一次星期视图，上面黄点
                getWeekView(cerMon);
            }
        })

    }

    function getWeekView (cerMon) {

        var d = cerMon
        var arr = [];
        for (var i = 0; i < 7; i++) {
            var yearStr = String(d.getFullYear());
            var monthStr = String(d.getMonth()+1 < 10 ? "0" + String(d.getMonth()+1) : String(d.getMonth()+1));
            var dayStr = String(d.getDate() < 10 ? "0" + String(d.getDate()) : String(d.getDate()));
            arr.push(yearStr + "-" + monthStr + "-" + dayStr + "?" + getDayName(d.getDay()));
            d.setDate(d.getDate()+1);
        };
        d.setDate(d.getDate()-7);

        var weekJson = [];
        for (var i = 0; i < 7; i++) {
            var a = arr[i].split("?")[0].split("-")[2];
            var b = arr[i].split("?")[1];
            var c = arr[i].split("?")[0];
            var weekArr = {day:a,week:b,date:c};
            weekJson.push(weekArr);
        };

        var html = template('top-part', weekJson);
        $('.top-part-day').html(html);

        if (dayArr.length != 0) {
            // 控制当日 spot,week,day 颜色
            $(".top-part-day li").each(function(){
                // 点击切换日期
                $(this).click(function(){
                    Common.showToast("拼命读取数据中...");
                    $('.list').html(null);
                    $('.no-orders').hide();
                    cerDay = $(this).attr('data-id') ;
                    getWeekView(cerMon);
                    getTimeTable(cerDay,cerMon);
                })
               var show_day = $(this).attr('data-id');
               // 判断除当日外，其他有课日期 spot 颜色
               for (var i = 0; i < dayArr.length; i++) {
                    if (show_day == cerDay) {
                        $(this).find('.spot').show();
                        $(this).find('.week').css('color','#FD6700');
                        $(this).find('.weekday').css('color','#FD6700');
                    } else if (show_day == dayArr[i] && show_day != cerDay) {
                        $(this).find('.spot').css('color','#aaa');
                        $(this).find('.spot').show();
                    } else {
                        $(this).find('.week').css('color','#aaa');
                        $(this).find('.weekday').css('color','#000');
                    }
               };
            });
        } else {
            $(".top-part-day li").each(function(){
                // 点击切换日期
                $(this).click(function(){
                    Common.showToast("拼命读取数据中...");
                    $('.list').html(null);
                    $('.no-orders').hide();
                    cerDay = $(this).attr('data-id') ;
                    getWeekView(cerMon);
                    getTimeTable(cerDay,cerMon);
                })
               var show_day = $(this).attr('data-id');
               // 判断除当日外，其他有课日期 spot 颜色
                if (show_day == cerDay) {
                    $(this).find('.spot').show();
                    $(this).find('.week').css('color','#FD6700');
                    $(this).find('.weekday').css('color','#FD6700');
                } else {
                    $(this).find('.week').css('color','#aaa');
                    $(this).find('.weekday').css('color','#000');
                }
            });
        }
    }

    function getMonDate(){
        var d = new Date();
        day = d.getDay();
        date = d.getDate();
        if (day == 1) {
            return d;
        };
        if (day == 0) {
            d.setDate(date-6);
            return d;
        } else {
            d.setDate(date-day+1);
            return d;
        }
    }

    function getDayName(day) {
        var day = parseInt(day);
        if (isNaN(day) || day < 0 || day > 6) {
            return false;
        } else {
            var weekday = ["Sun","Mon","Tues","Wed","Thur","F r i","Sat"];
            return weekday[day];
        }
    }

});
