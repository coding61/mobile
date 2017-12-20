'use strict';

import {
    Dimensions,
    AsyncStorage,
    Alert,
    Platform,
    Linking
} from 'react-native'

const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width

const basePx = 375

// iPhoneX  
const X_WIDTH = 375;  
const X_HEIGHT = 812;  
const isIphoneX = Platform.OS === 'ios' &&   ((deviceH === X_HEIGHT && deviceW === X_WIDTH) || (deviceH === X_WIDTH && deviceW === X_HEIGHT))

const isIOS = Platform.OS == "ios"
const TopStatusBarIOS = 20
const TopStatusBarAndroid = 25
const TopNavBarHeight = 48
const BottomStatusBarAndroid = 48
const HeaderH = isIOS ? isIphoneX?88:64 : TopNavBarHeight+TopStatusBarAndroid
const BottomH = isIOS ? isIphoneX?83:49 : BottomStatusBarAndroid
const iosSafeHeight = isIOS?isIphoneX?34:0:0
const statusBarHeight = isIOS?isIphoneX?44:20:25

import Sound from 'react-native-sound';
var playSouns = {
    status:true,
    queue:[],
}
function playMsgSound(url){
    url = decodeURIComponent(url);
    playSouns.queue.push(url);

    function play(url){
        console.log(playSouns.queue.length, url);
        if (playSouns.status) {
            playSouns.status=false;
            const callback = (error, sound) => {
                if (error) {
                  console.log(error)
                  return;
                }
                // Run optional pre-play callback
                sound.play(() => {
                    console.log('play successful!');
                    sound.release();
                    playSouns.status = true;
                    playSouns.queue.shift();
                    if (playSouns.queue.length >= 1) {
                        play(playSouns.queue[0]);
                    }
                });
            };
            const sound = new Sound(url, null, error => callback(error, sound));
        }
    }
    if (playSouns.queue.length >= 1) {
        play(playSouns.queue[0]);
    }
}

var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
var chnUnitSection = ["","万","亿","万亿","亿亿"];
var chnUnitChar = ["","十","百","千"];

function SectionToChinese(section){
    var strIns = '', chnStr = '';
    var unitPos = 0;
    var zero = true;
    while(section > 0){
        var v = section % 10;
        if(v === 0){
            if(!zero){
                zero = true;
                chnStr = chnNumChar[v] + chnStr;
            }
        }else{
            zero = false;
            strIns = chnNumChar[v];
            strIns += chnUnitChar[unitPos];
            chnStr = strIns + chnStr;
        }
        unitPos++;
        section = Math.floor(section / 10);
    }
    return chnStr;
}
// 数字转中文
function NumberToChinese(num){
    var unitPos = 0;
    var strIns = '', chnStr = '';
    var needZero = false;

    if(num === 0){
        return chnNumChar[0];
    }

    while(num > 0){
        var section = num % 10000;
        if(needZero){
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = SectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }

    // 将一十一这种变成十一
    if (chnStr.indexOf("一十") != -1) {
        chnStr = "十"+chnStr.split("一十")[1];
    }

    return chnStr;
}
let Utils = {
	width:Dimensions.get('window').width,
	height:Dimensions.get('window').height,
    headerHeight:HeaderH,
    bottomHeight:BottomH,
    iosSafeHeight:iosSafeHeight,
    statusBarHeight:statusBarHeight,
	navBarBgColor:'rgb(250, 80, 131)',
	tabBarBgColor:'rgb(255,255,255)',
    tabBarIconUnSColor:'rgb(124,124,124)',
    tabbarIconSColor:'rgb(253,202,24)',

	bodyBgColor:'rgb(250, 80, 131)',
    btnBgColor:'rgb(250, 80, 131)',         //app 主题颜色粉色
    btnBgColorS:'white',                    //app 第二主题色是白色
    tabBarSelectColor:'rgb(250, 80, 131)',  //底部 tab 按钮选中颜色
    tabBarUnselectColor:'rgb(109,110,111)', //底部 tab 按钮未选中颜色
    themeColor:'rgb(250, 80, 131)',         //主题颜色,粉色

    fontBColor:'#373737',                   //较大字体颜色
    fontSColor:'#848484',                   //较小字体颜色
    underLineColor:'#ebebeb',               //下划线颜色
    lineColor:'rgb(189,190,192)',           //下划线颜色(深灰)

    bgColor:'#f3f3f3',                      //页面背景色主要
    bgSecondColor:'rgb(239,240,241)',       //页面背景色次之
    bgThirdColor:'rgb(242,244,245)',        //页面背景3
    btnCancelColor:'rgb(154,155,156)',      //取消按钮的背景色
    alertViewBgColor:'rgb(240, 241, 242)',  //弹框视图的背景色
    alertLineColor:'rgb(231,232,233)',      //弹框视图的分割线颜色

    fontSBSize:18,                          //超大字体18
    fontBSize:16,                           //大字体16，标题等
    fontSSize:14,                           //小字体14,内容介绍等
    fontMSSize:12,                          //迷你字体12, 底部时间显示等
    orangeColor:'rgb(250, 107, 14)',        //按钮橙黄色
    blueColor:'#5daeff',                    //主题颜色,蓝色

    isIphoneX:isIphoneX,
    playMsgSound:(url)=>{
        return playMsgSound(url)
    },
    containKey:(dic, key)=>{
        return dic.hasOwnProperty(key)
    },
	px2dp:(px)=>{
		return px * deviceW/basePx
	},
	numberToChinese:(number)=>{
		return NumberToChinese(number)
	},
    setValue:(key, value)=>{
        AsyncStorage.setItem(key,value);
    },
    getValue:(key, callback)=>{
        AsyncStorage.getItem(key, (err, result)=>{
            if (err) {
                callback(err, null);
            }else{
                callback(null, result);
            }
        })
    },
    removeValue:(key)=>{
        AsyncStorage.removeItem(key);
    },
    clearAllValue:()=>{
        AsyncStorage.clear();
    },
    showMessage:(message)=>{
        Alert.alert('提示', message);
    },
    showAlert:(title, message, okEvent, cancelEvent, submitText, cancelText)=>{
        var sText = submitText?submitText:"Ok",
            cText = cancelText?cancelText:"Cancel";
        Alert.alert(title, message, [
            {text:cText, onPress:()=>cancelEvent()},
            {text:sText, onPress:()=>okEvent()}
        ])
    },
    getImgWidthHeight:(url, imgWidth) => {
        var width = null;
        var height = null;
        url = decodeURIComponent(url);

        // 123.jpg-30x30
        var array = ['.jpg-', '.png-', '.jpeg-', '.JPG-', '.PNG-', '.JPEG-', '.webp-', '.gif-', '.GIF-'];
        var string = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i]
            if (url.split(array[i])[1]) {
                string = array[i];
                break;
            }
        }

        if (url.split(string).length == 1) {
            // 图片格式非法，
            return 0;
        }
        var str = url.split(string)[1]; //45x36
        width = str.split('x')[0];  //45
        height = str.split('x')[1];  //36

        return imgWidth * height / width
    },
    getImgWH:(url, callback)=>{
        var width = null;
        var height = null;
        url = decodeURIComponent(url);

        // 123.jpg-30x30
        var array = ['.jpg-', '.png-', '.jpeg-', '.JPG-', '.PNG-', '.JPEG-', '.webp-', '.gif-', '.GIF-'];
        var string = null;
        for (var i = 0; i < array.length; i++) {
            var item = array[i]
            if (url.split(array[i])[1]) {
                string = array[i];
                break;
            }
        }
        if (url.split(string).length == 1) {
            // 图片格式非法，
            callback(0, 0)
        }else{
            var str = url.split(string)[1]; //45x36
            width = str.split('x')[0];  //45
            height = str.split('x')[1];  //36

            callback(width, height)
        }
    },
    isLogin:(callback)=>{
        Utils.getValue('token', (err, result)=>{
            if (err) {
                console.log(err);
                callback(null);
            }else{
                if (!result) {
                    callback(null)
                }else{
                    callback(result)
                }
            }
        })
    },
    getStorageData:(callback)=>{
        Utils.getValue("chatData", (err, result)=>{
            // 1.获取缓存数据
            var chatData = JSON.parse(result);
            // console.log(chatData);
            Utils.getValue("data", (err, result)=>{
                // 2.获取节数据
                var data = JSON.parse(result);
                // console.log(data);
                Utils.getValue("index", (err, result)=>{
                    // 3.获取节下标
                    var index = JSON.parse(result);
                    // console.log(index);
                    Utils.getValue("optionData", (err, result)=>{
                        // 4.获取选项数据
                        var optionData = JSON.parse(result);
                        // console.log(optionData);
                        Utils.getValue("optionIndex", (err, result)=>{
                            // 5.获取选项下标
                            var optionIndex = JSON.parse(result);
                            // console.log(optionIndex);
                            // callback(chatData, data, index, optionData, optionIndex);
                            Utils.getValue("currentCourse", (err, result)=>{
                                var currentCourse = JSON.parse(result);
                                Utils.getValue("currentCourseIndex", (err, result)=>{
                                    var currentCourseIndex = JSON.parse(result);
                                    Utils.getValue("currentCourseTotal", (err, result)=>{
                                        var currentCourseTotal = JSON.parse(result);
                                        callback(chatData, data, index, optionData, optionIndex, currentCourse, currentCourseIndex, currentCourseTotal);
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    openURL:(url)=>{
        Linking.canOpenURL(url)
        .then((supported)=>{
            if (!supported) {
                console.log('无法打开: ' + url);
                Utils.showMessage('无法打开: ' + url);
            }else{
                return Linking.openURL(url);
            }
        })
        .catch((err)=>{
            console.log('一个错误被发现' + err);
            Utils.showMessage('一个错误被发现' + err);
        })
    },
    dealTime:(createTime)=>{
        var timeArray = createTime.split('.')[0].split('T');
        var year = timeArray[0].split('-')[0];
        var month = timeArray[0].split('-')[1];
        var day = timeArray[0].split('-')[2];

        var hour = timeArray[1].split(':')[0];
        var minute = timeArray[1].split(':')[1];
        var second = timeArray[1].split(':')[2];

        var create = new Date(year, month-1, day, hour, minute, second);

        // var create = new Date(Date.parese(created.slice(0, 19).replace('T', ' ')));
        // alert(create);
        var current = new Date();
        var s1 = current.getTime() - create.getTime(); //相差的毫秒
        if (s1 / (60 * 1000) < 1) {
            return "刚刚";
        }else if (s1 / (60 * 1000) < 60){
            return parseInt(s1 / (60 * 1000)) + "分钟前";
        }else if(s1 / (60 * 1000) < 24 * 60){
            return parseInt(s1 / (60 * 60 * 1000)) + "小时前";
        }else if(s1 / (60 * 1000) < 24 * 60 * 2){
            return "昨天 " + createTime.slice(11, 16);
        }else{
            return createTime.slice(0, 10).replace('T', ' ');
        }
    }
}
export default Utils;
