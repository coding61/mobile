/**
 * @author: chenwei
 * @description: 警告视图
 * @time: 2017-07-18
 */

 /*
    type:弹框类型，input, alert, 默认 input, (可选)
    okBtnText:确定按妞上文字，默认是 确定(可选)
    cancelBtnText:取消按钮文字, 有此属性，底部两个按钮，无此属性，底部一个确定按钮(可选)
    title:弹框上的标题(可选)
    OkPressEvent:确定按钮事件(可选)
    cacelPressEvent:取消按钮事件(可选)
    showAlertView:打开弹框的属性，(必填)
    hideAlertView:隐藏弹框, (必填)
    inputPlaceHolderText:input 类型,输入框的 placeholder 文字(必填)
    valueText:input 类型， 输入框的值(必填)
    setValueText:input 类型，输入框值，获取(必填)
    messageText:alert 类型下,消息内容(必填)

 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

import Utils from '../utils/Utils.js';

class AlertView extends Component {
	constructor(props) {
	  super(props);
	   this.state={
        payWay:this.props.payWay?this.props.payWay:"alipay"
       }
	}
    static defaultProps = {
        type: 'input',
        okBtnText:"确定",
    };
    static propTypes = {
        type: PropTypes.oneOf(['input', 'alert', 'pay']).isRequired, //类型
    }
	// ----------------------帮助方法
	_submitPressEvent(){
		this.props.OkPressEvent?this.props.OkPressEvent(this.state.payWay):this.props.hideAlertView();
	}
    _cancelPressEvent(){
        this.props.cacelPressEvent?this.props.cacelPressEvent():this.props.hideAlertView();
    }
    renderCommonView(){
        return(
            <View style={styles.alertView}>
                {
                    this.props.title?
                    /***顶部弹框标题***/
                        <View style={styles.topView}>
                            <Text style={styles.textColor}>{this.props.title}</Text>
                        </View>
                    :   null
                }
                
                {/***中间内容**/}
                <View style={styles.middleView}>
                    {
                        this.props.type === "input"?
                            <TextInput
                                style={styles.input}
                                onChangeText={(text)=>this.props.setValueText(text)}
                                value={this.props.valueText}
                                placeholder={this.props.inputPlaceHolderText}
                                underlineColorAndroid={'transparent'}
                              />
                        :
                            <Text style={styles.msgText}>{this.props.messageText}</Text>
                    }
                </View>
                {/****底部按妞*****/}
                <View style={styles.bottomView}>
                    {
                        this.props.cancelBtnText?
                            <TouchableOpacity style={styles.cancelBtn} onPress={this._cancelPressEvent.bind(this)}>
                                <Text style={styles.textCancelColor}>{this.props.cancelBtnText}</Text>
                            </TouchableOpacity>
                        :   null
                    }
                    
                    <TouchableOpacity style={styles.okBtn} onPress={this._submitPressEvent.bind(this)}>
                        <Text style={styles.textOkColor}>{this.props.okBtnText}</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        )
    }
    renderPayView(){
        var pointerSelectStyle = {width:15,height:15, borderRadius:7.5, backgroundColor:'#FFC200', position:'absolute', right:20}
        var pointerUnSelectStyle = {width:15,height:15, borderRadius:7.5, borderColor:'#D7D7D7', borderWidth:1,  position:'absolute', right:20}
        return(
            <View style={{borderRadius:10, marginTop:height/3, height:height/3, width:0.9*width, backgroundColor:'#ffffff', flexDirection:'column'}}>
                <View style={{flex:1, flexDirection:'column'}}>
                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({payWay:"wx"})}} style={{flex:1, borderBottomColor:'#DDDDDD', borderBottomWidth:1, flexDirection:'row', alignItems:'center', paddingHorizontal:20}}>
                        <Image
                          style={{width:30, height:30, marginRight:10}}
                          source={require("../assets/images/wx.png")}
                          resizeMode={'contain'}
                        />
                        <Text style={{color:'#3E3E3E'}}>微信支付</Text>

                        <View style={this.state.payWay === "wx"?pointerSelectStyle:pointerUnSelectStyle}></View>
                        
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.setState({payWay:"alipay"})}} style={{flex:1, flexDirection:'row', alignItems:'center', paddingHorizontal:20}}>
                        <Image
                          style={{width:30, height:30, marginRight:10}}
                          source={require("../assets/images/alipay.png")}
                          resizeMode={'contain'}
                        />
                        <Text style={{color:'#3E3E3E'}}>支付宝支付</Text>
                        <View style={this.state.payWay === "alipay"?pointerSelectStyle:pointerUnSelectStyle}></View>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row', marginVertical:10, marginHorizontal:10}}>
                    <TouchableOpacity activeOpacity={1} onPress={this._cancelPressEvent.bind(this)} style={{height:40, flex:1, marginRight:10, flexDirection:'row', justifyContent:'center', alignItems:'center', borderRadius:4, backgroundColor:'#CACACA'}}><Text style={{color:'white'}}>取消</Text></TouchableOpacity>
                    <TouchableOpacity activeOpacity={1} onPress={this._submitPressEvent.bind(this)} style={{height:40, flex:1, marginLeft:10, flexDirection:'row', justifyContent:'center', alignItems:'center', borderRadius:4, backgroundColor:'#FFC200'}}><Text style={{color:'white'}}>去支付</Text></TouchableOpacity>
                </View>
            </View>
        )
    }
	render(){
		return (
			<View>
				<Modal visible={this.props.showAlertView} transparent={true} onRequestClose={()=>{}}>
		            <TouchableOpacity style={this.props.type==="pay"?styles.alertTopView1:styles.alertTopView} onPress={this.props.hideAlertView}>
		                {this.props.type==="pay"?this.renderPayView():this.renderCommonView()}
		            </TouchableOpacity>
		        </Modal>
	        </View>
		)
	}
}
const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const pinkColor = Utils.btnBgColor;
const whiteColor = Utils.btnBgColorS;
const fontBColor = Utils.fontBColor;
const fontSColor = Utils.fontSColor;
const lineColor = Utils.underLineColor;
const bgColor = Utils.bgColor;
const bgSecondColor = Utils.bgSecondColor;
const btnCancelColor = Utils.btnCancelColor;
const alertViewBgColor = Utils.alertViewBgColor;
const alertLineColor = Utils.alertLineColor;

const styles = StyleSheet.create({
	// -------------------------------视图弹框
    alertTopView1:{
        backgroundColor:'rgba(0,0,0,0.5)', 
        flex:1, 
        alignItems:'center'
        // justifyContent:'center',   //键盘会覆盖底部按钮
    },
    alertTopView:{
        backgroundColor:'rgba(0,0,0,0.5)', 
        flex:1, 
        alignItems:'center', 
        paddingTop:height/2-150
        // justifyContent:'center',   //键盘会覆盖底部按钮
    },
    alertView:{
        backgroundColor:alertViewBgColor, 
        width:width-120, 
        borderRadius:10,
        overflow:'hidden'
    },
    topView:{
        height:40, 
        alignItems:'center', 
        justifyContent:'center', 
        borderColor:alertLineColor, 
        borderWidth:1,
    },

    middleView:{
        minHeight:120, 
        maxHeight:150,
        borderBottomColor:alertLineColor, 
        borderBottomWidth:1, 
        alignItems:'center', 
        justifyContent:'center', 
    },
    input:{
        width:width-170, 
        height:30, 
        fontSize:12, 
        borderColor:alertLineColor, 
        borderWidth:1, 
        backgroundColor:'white', 
        textAlign:'center',
        padding:0
    },
    msgText:{
        width:width-170, 
        fontSize:13, 
        textAlign:'center',
        color:fontSColor
    },
    bottomView:{
        height:40, 
        flexDirection:'row',
        alignItems:'center', 
        justifyContent:'center'
    },
    okBtn:{
        flex:1,
        height:40, 
        alignItems:'center', 
        justifyContent:'center',
    },
    cancelBtn:{
        flex:1,
        height:40, 
        alignItems:'center', 
        justifyContent:'center',
        borderRightColor:alertLineColor,
        borderRightWidth:1
    },
    textColor:{
        color:fontBColor
    },
    textOkColor:{
        color:fontBColor
    },
    textCancelColor:{
        color:'red'
    }
});


export default AlertView;