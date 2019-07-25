/**
 * @author: chenwei
 * @description: 游戏网站的承接(free.cxy61.com)
 * @time: 2017-03-15
 */
'use strict';

import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Button,
  Dimensions,
  TextInput,
  WebView
} from 'react-native';
import Orientation from 'react-native-orientation';   //屏幕转向

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

class GameWebView extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		url: this.props.navigation.state.params.url?this.props.navigation.state.params.url:""
	  	};
	}
	// tabbar／navigationbar相关设置
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;
		return {
			title:'儿童编程',
			headerStyle: {backgroundColor: pinkColor},
		    headerTintColor: "#fff",
		    headerTitleStyle:{alignSelf:'auto',}
		}
	}	
	
	componentWillMount() {
	   //只允许横屏
	   Orientation.lockToLandscapeRight();		
	}
	componentDidMount() {
		//只允许横屏
        Orientation.lockToLandscapeRight();
	}
	componentWillUnmount() {
		//只允许竖屏
		Orientation.lockToPortrait();
	}
	onShouldStartLoadWithRequest = (event) => {
		// console.log(event);
        if (event.url != this.state.url) {
            // 关闭当前游戏窗口，回到上一页
			this.props.navigation.goBack();
            return false
        }
	    return true;
	}
  	onNavigationStateChange = (navState) => {
  		// console.log(navState);
	}
	onLoadStart = (event)=>{

	}
	render() {
		const {params} = this.props.navigation.state
	    return (
			<View style={{flex:1, backgroundColor:'rgb(245,245,245)'}}>
				<WebView 
					ref={(webview) => this.webview = webview}
					source={{uri:this.state.url}}
					automaticallyAdjustContentInsets={true}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate="normal"
					onLoadStart={this.onLoadStart}
					onNavigationStateChange={this.onNavigationStateChange}
					onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
					startInLoadingState={true}
		          	scalesPageToFit={true}
				/>
			</View>
	    )  
	}
}
var WIDTH, HEIGHT;
const initial = Orientation.getInitialOrientation();
if (initial === 'PORTRAIT') {
  // do something
    HEIGHT = Dimensions.get('window').width
    WIDTH = Dimensions.get('window').height
} else {
    HEIGHT = Dimensions.get('window').height
    WIDTH = Dimensions.get('window').width
} 

const pinkColor = Utils.btnBgColor;

const styles = StyleSheet.create({
	// ---------------------预加载视图
	loadingView:{
		flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
	}
});

export default GameWebView;