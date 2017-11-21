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
  Image,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import EmptyView from '../Component/EmptyView.js';

var RnTest = NativeModules.RongYunRN;

class ConversationList extends Component {
	constructor(props) {
	   super(props);
	
	    this.state = {
			showView:false,
	    };
	}
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;
		return {
			title:'会话列表',
			headerTintColor: "#fff",   
            headerStyle: { backgroundColor: pinkColor},
            tabBarLabel:'对话',
            tabBarIcon:({focused}) => (
                focused?
                	state.params&&state.params.hasUnreadMsg?
                	<Image source={require('../images/tabs/5-select-1.png')}
                    style={[{width:30,height:30},]} resizeMode={'contain'}/>
                    :
                    <Image source={require('../images/tabs/5-select.png')}
                    style={[{width:30,height:30},]} resizeMode={'contain'}/>
                :
                	state.params&&state.params.hasUnreadMsg?
                	<Image source={require('../images/tabs/5-unselect-1.png')}
                    style={[{width:30,height:30},]} resizeMode={'contain'}/>
                    :
                    <Image source={require('../images/tabs/5-unselect.png')}
                    style={[{width:30,height:30},]} resizeMode={'contain'}/>
            ),
            tabBarOnPress:(({ route, index },jumpToIndex)=>{
                // console.log(route);        
                // alert(index);
                // 只有调用jumpToIndex方法之后才会真正的跳转页面。
                // jumpToIndex(index);
                RnTest.rnIMStart();
            }),
		}
	};
	componentWillMount() {
		this.props.navigation.setParams({
            hasUnreadMsg: false
        });
		this.listenerRCUnreadMsg = DeviceEventEmitter.addListener('unreadmessagecount_listener', (unread_message_count) => {
  			console.log(unread_message_count);
			if (unread_message_count <= 0) {
				//无未读
				this.props.navigation.setParams({
		            hasUnreadMsg: false,
		        });
			}else{
				//有未读
				this.props.navigation.setParams({
		            hasUnreadMsg: true,
		        });
			}
	  	})
	}
	componentWillUnmount() {
		this.listener&&this.listener.remove();
		this.listenerRCUnreadMsg && this.listenerRCUnreadMsg.remove();
	}
  	render() {
	    return (
	        <View style={{flex: 1, backgroundColor:bgColor}}>
				{/*
					this.state.showView?<RCTMyView style={{width: width, height: height - headerH-bottomH}}/>:<EmptyView failTxt="暂无对话"/>
				*/}
		    </View>
	    );
  	}
}

const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const pinkColor = Utils.btnBgColor;
const bgColor = Utils.bgColor;

const styles = StyleSheet.create({

});


export default ConversationList;