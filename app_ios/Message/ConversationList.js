/**
 * @author: chenwei
 * @description: 会话列表
 * @time: 2017-07-18
 */
'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  requireNativeComponent,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

var RCTMyView = requireNativeComponent('RongYunView', null);
//导入iOS原生模块
var LocalModuleiOS = NativeModules.RNBridgeModule;
//iOS事件监听
const localModuleEmitter = new NativeEventEmitter(LocalModuleiOS);

class ConversationList extends Component {
	constructor(props) {
	   super(props);
	
	    this.state = {
			showView:false
	    };
	}
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;
		return {
			title:'会话列表',
			headerTintColor: "#fff",   
            headerStyle: { backgroundColor: pinkColor}
		}
	};
	componentWillMount() {
        //监听iOS的QQLoginOut事件
        localModuleEmitter.addListener('connectRongSuccess',(result)=>{
            this.setState({
            	showView:true
            })
        })
	}
	componentWillUnmount() {
	   
	}
  	render() {
	    return (
	        <View style={{flex: 1}}>
				{
					this.state.showView?<RCTMyView style={{width: width, height: height - headerH}}/>:null
				}
		    </View>
	    );
  	}
}

const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const pinkColor = Utils.btnBgColor;
const styles = StyleSheet.create({

});


export default ConversationList;