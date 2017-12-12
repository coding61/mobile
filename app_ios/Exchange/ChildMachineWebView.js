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

class ChildMachineWebView extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		url: Http.domain3+"/html/game/game_girl.html?token=" + this.props.navigation.state.params.token
	  	};
	}
	// tabbar／navigationbar相关设置
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;
		return {
			title:'夺宝奇兵',
			headerStyle: {backgroundColor: themeColor},
		    headerTintColor: "#fff",
		    headerTitleStyle:{alignSelf:'auto',}
		}
	};	
	
	componentWillMount() {
		
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	    if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
                this.props.navigation.state.params.callback(); 
          }
        }
	}
	onShouldStartLoadWithRequest = (event) => {
	    // Implement any custom loading logic here, don't forget to return!   
	    return true;
	}

  	onNavigationStateChange = (navState) => {

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
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width
const themeColor = Utils.themeColor;
const styles = StyleSheet.create({
	
});

export default ChildMachineWebView;