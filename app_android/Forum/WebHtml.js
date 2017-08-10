import React, {Component} from 'react'
import {
  AppRegistry, 
  StyleSheet, 
  Image, 
  Text,
  View,
  Dimensions,
  WebView,
}from 'react-native';
var {height, width} = Dimensions.get('window');

//var default_url = 'https://app.bcjiaoyu.com/girl/cxyteam_forum_moblie/detail.html';
var default_url='https://www.cxy61.com/girl/cxyteam_forum_moblie/detail.html';

export default class WebHtml extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: default_url,
            scalesPageToFit: true,
            webViewData:'',
            data:{
                token:this.props.navigation.state.params.token,
                pk:this.props.navigation.state.params.data,
            }, 
        }
    }
    static navigationOptions = {
        title: '论坛详情',
    }
 
    componentDidMount() {

    }

    onShouldStartLoadWithRequest(event){
        return true;
    }

    sendMessage() {
        this.webview.postMessage(JSON.stringify(this.state.data));
    }

    handleMessage(evt) {
        var message = evt.nativeEvent.data
        if (message == 200) {
            this.props.navigation.state.params.callback(message);
            this.props.navigation.goBack()
        }
    }

    render() {
        this.inputText = this.state.url;
        return (
            <View style={{flex: 1}}>
                <WebView
                    ref={webview => this.webview = webview}
                    automaticallyAdjustContentInsets={true}
                    style={styles.webView}
                    domStorageEnabled={true}
                    source={{uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onMessage={this.handleMessage.bind(this)}
                    decelerationRate="normal"
                    onLoad={this.sendMessage.bind(this)}
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    mixedContentMode="always"
                    scalesPageToFit={this.state.scalesPageToFit}
                />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    webView: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        height: 350,
        width: width,
  },

});
