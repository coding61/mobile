'use strict';

import {
    Dimensions,
    AsyncStorage,
    Alert,
} from 'react-native'

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
	navBarBgColor:'rgb(253,202,24)',
	tabBarBgColor:'rgb(255,255,255)',
	bodyBgColor:'rgb(245,245,245)',
	tabBarIconUnSColor:'rgb(124,124,124)',
	tabbarIconSColor:'rgb(253,202,24)',
    themeColor:'rgb(253,202,24)',
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
    showMessage:(message)=>{
        Alert.alert('提示', message);
    },
    showAlert:(title, message, cancelEvent, okEvent)=>{
        Alert.alert(title, message, [
            {text:'Cancel', onPress:()=>cancelEvent()},
            {text:'Ok', onPress:()=>okEvent()}
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
    }

}
export default Utils;
