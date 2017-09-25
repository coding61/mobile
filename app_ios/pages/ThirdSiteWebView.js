/**
 * @author: chenwei
 * @description: 三方网站的承接
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
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

var DEFAULT_URL = 'https://free.bcjiaoyu.com';
class ThirdSiteWebView extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		url: this.props.navigation.state.params.url?this.props.navigation.state.params.url:DEFAULT_URL
	  	};
	}
	// tabbar／navigationbar相关设置
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;
		return {
			title:'程序媛',
			headerTintColor: "#fff",   
            headerStyle: { backgroundColor: pinkColor}
		}
	};	
	
	componentWillMount() {
		// const {state} = this.props.navigation;
		// this.setState({
		// 	url:state.params.url
		// })
	}
	componentDidMount() {
	}
	onShouldStartLoadWithRequest = (event) => {
	    // Implement any custom loading logic here, don't forget to return!
	  //   var url = event.url;
	  //   console.log(event.url);
	  //   console.log(this.state.url);
	  //   if (event.url == this.state.url) {
	  //   	//不做处理
	  //   	console.log('不做处理');
	  //   }else{
	  //   	console.log('处理');
	  //   	this.setState({
			// 	url:event.url
			// }, ()=>{
		 //    	console.log(this.state.url);
		 //    	const {navigate} = this.props.navigation;
			//     navigate('StudentWebview', {url:this.state.url});
			//     return false
			// })
	  //   }
	    
	    return true;
	}

  	onNavigationStateChange = (navState) => {
		// console.log(navState);

	 //    this.setState({
	 //      backButtonEnabled: navState.canGoBack,
	 //      forwardButtonEnabled: navState.canGoForward,
	 //      url: navState.url,
	 //      status: navState.title,
	 //      loading: navState.loading,
	 //      scalesPageToFit: true
	 //    });
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
					// onNavigationStateChange={this.onNavigationStateChange}
					onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
					startInLoadingState={true}
		          	scalesPageToFit={true}
				/>
			</View>
	    )  
	}
}
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
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

export default ThirdSiteWebView;