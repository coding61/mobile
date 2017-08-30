'use strict';

import {
    Dimensions,
    AsyncStorage,
    Alert,
    Platform,
    Linking
} from 'react-native'

const isIOS = Platform.OS == "ios"
const TopStatusBarIOS = 20
const TopStatusBarAndroid = 25
const TopNavBarHeight = 48
const BottomStatusBarAndroid = 48
const HeaderH = isIOS ? 64 : TopNavBarHeight+TopStatusBarAndroid
const BottomH = isIOS ? 0 : BottomStatusBarAndroid

const deviceH = Dimensions.get('window').height
const deviceW = Dimensions.get('window').width

const basePx = 375

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

    return chnStr;
}
let Utils = {
	width:Dimensions.get('window').width,
	height:Dimensions.get('window').height,
    headerHeight:HeaderH,
	navBarBgColor:'rgb(250, 80, 131)',
	tabBarBgColor:'rgb(255,255,255)',
    tabBarIconUnSColor:'rgb(124,124,124)',
    tabbarIconSColor:'rgb(253,202,24)',

	bodyBgColor:'rgb(250, 80, 131)',
    btnBgColor:'rgb(250, 80, 131)',      //app 主题颜色粉色
    btnBgColorS:'white',                 //app 第二主题色是白色
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

        var str = url.split(string)[1]; //45x36
        width = str.split('x')[0];  //45
        height = str.split('x')[1];  //36
        
        callback(width, height)
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
    }
    

}
export default Utils;
