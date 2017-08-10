/**
 * @author: chenwei
 * @description: 在线编辑页面，html/js
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

class CodeCompileWebView extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		language:this.props.navigation.state.params.language
	  	};
	}
	// tabbar／navigationbar相关设置
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;

		return {
			title:'在线编译'
		}
	};	
	static propTypes = {
	  // prop: React.PropTypes.Type
	};
	static defaultProps = {
	  // prop: 'value'
	}
	componentWillMount() {
		// const {state} = this.props.navigation;
		// this.setState({
		// 	url:state.params.url
		// })
	}
	componentDidMount() {
	}
	onShouldStartLoadWithRequest = (event) => {
	    return true;
	}

  	onNavigationStateChange = (navState) => {
	
	}
	onLoadStart = (event)=>{

	}

	onMessage = (event)=>{
        console.log('onMessage->event.nativeEvent.data:');
        console.log(event.nativeEvent.data);
    }
    postMessage = () => {
	    if (this.webview) {
	      this.webview.postMessage('"Hello" from React Native!'+this.state.language);
	    }
	}
	render() {
		const {params} = this.props.navigation.state
	    return (
			<View style={{flex:1, backgroundColor:'rgb(245,245,245)'}}>
				<WebView 
					ref={(webview) => this.webview = webview}
					source={{uri:Http.domainPage+'/app/home/codeCompileRN.html'}}
					automaticallyAdjustContentInsets={true}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					decelerationRate="normal"
					onLoadStart={this.onLoadStart}
					onNavigationStateChange={this.onNavigationStateChange}
					onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
					startInLoadingState={true}
		          	scalesPageToFit={true}
		          	onMessage={this.onMessage.bind(this)}
		          	onLoad={this.postMessage.bind(this)}
				/>
			</View>
	    )  
	}
}
const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width

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

export default CodeCompileWebView;