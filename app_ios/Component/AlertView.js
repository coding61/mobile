'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';

import Utils from '../utils/Utils.js';

class AlertView extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	activityPsd:""
	  };
	}
	// ----------------------帮助方法
	_submitPressEvent(){
		this.props.OkPressEvent(this.state.activityPsd);
	}
	render(){
		return (
			<View>
				<Modal visible={this.props.showAlertView} transparent={true} onRequestClose={()=>{}}>
		            <TouchableOpacity style={styles.AlertInputAlertParentView} onPress={this.props.hideAlertView}>
		                <View style={styles.AlertInputAlertView}>
		                    <View style={styles.AlertInputView}>
		                        <TextInput
		                            style={styles.AlertInput}
		                            onChangeText={(text) => {this.setState({activityPsd:text})}}
		                            value={this.state.activityPsd}
		                            placeholder={"请输入密码"}
		                          />
		                    </View>
		                    <TouchableOpacity onPress={this._submitPressEvent.bind(this)}>
		                    <View style={styles.AlertBtnView}><Text style={styles.AlertBtnText}>确定</Text></View>
		                    </TouchableOpacity>
		                </View>
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
    AlertInputAlertParentView:{
        backgroundColor:'rgba(0,0,0,0.5)', 
        flex:1, 
        alignItems:'center', 
        justifyContent:'center'
    },
    AlertInputAlertView:{
        backgroundColor:alertViewBgColor, 
        width:width-120, 
        borderRadius:10,
    },
    AlertInputView:{
        minHeight:120, 
        borderBottomColor:alertLineColor, 
        borderBottomWidth:1, 
        alignItems:'center', 
        justifyContent:'center', 
    },
    AlertInput:{
        width:width-170, 
        height:30, 
        fontSize:12, 
        borderColor:alertLineColor, 
        borderWidth:1, 
        backgroundColor:'white', 
        textAlign:'center'
    },
    AlertBtnView:{
        height:40, 
        alignItems:'center', 
        justifyContent:'center'
    },
    AlertBtnText:{
        color:fontBColor
    }
});


export default AlertView;