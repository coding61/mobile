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
  requireNativeComponent,
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import EmptyView from '../Component/EmptyView.js';

var RCTMyView = requireNativeComponent('RongYunView', null);
//导入iOS原生模块
var RNBridgeModule = NativeModules.RNBridgeModule;
//iOS事件监听
const localModuleEmitter = new NativeEventEmitter(RNBridgeModule);

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
            )
		}
	};
	componentWillMount() {
		this.props.navigation.setParams({
            hasUnreadMsg: false
        });

        //监听链接融云成功事件
        this.listener=localModuleEmitter.addListener('connectRongSuccess',(result)=>{
			console.log("debug:链接融云成功");
            this.setState({
            	showView:true
            })
        })
        //监听融云未读消息事件
        this.listenerRCUnreadMsg=localModuleEmitter.addListener('RongCloudUnreadMessage', (result)=>{
			console.log(result);
			if (result["hasUnreadMsg"] == "false") {
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
        //退出登录
        this.listenlogout = DeviceEventEmitter.addListener('logout', () => {
            this.setState({
            	showView:false,
            })
            this.props.navigation.setParams({
	            hasUnreadMsg: false
	        });
		})
		
		// 监听登录成功
        this.listenLogin = DeviceEventEmitter.addListener('listenLogin', () => {
            // 链接融云(页面非首次进入，链接融云)
			this.fetchRongToken("listenLogin");
        })

		// 链接融云(页面第一次载入,该方法生命周期执行一次)
		this.fetchRongToken("first");
	}
	componentWillUnmount() {
		this.listener&&this.listener.remove();
		this.listenerRCUnreadMsg && this.listenerRCUnreadMsg.remove();
		this.listenlogout && this.listenlogout.remove();
		this.listenLogin && this.listenLogin.remove();
	}
	// 获取融云 token
    fetchRongToken(tag){
    	var that = this;
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.getRongYunToken,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response.token) {
                        // 链接融云
						console.log("debug:链接融云", tag);
						// alert(tag);
                    	RNBridgeModule.RNConnectRongIM(response.token, token);
                    }
                }, (err) => {
                	console.log(err);
                });
            }else{
            	
            }
        })
    }
  	render() {
	    return (
	        <View style={{flex: 1, backgroundColor:bgColor}}>
				{
					this.state.showView?<RCTMyView style={{width: width, height: height - headerH-bottomH}}/>:<EmptyView failTxt="暂无对话"/>
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
const bgColor = Utils.bgColor;

const styles = StyleSheet.create({

});


export default ConversationList;