import React, {Component} from 'react'
import {
  AppRegistry, 
  StyleSheet, 
  Image, 
  Text, 
  TextInput, 
  View, 
  ScrollView,
  Dimensions, 
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  RefreshControl,
  InteractionManager,
  WebView
}from 'react-native';
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';
import WebViewBridge from 'react-native-webview-bridge';
var {height, width} = Dimensions.get('window');
var token='28d2479302bf86369bcec62939099f40b96a62ee';
const injectScript=function(){
                    console.log(2222)
                  };
var HEADER = '#3b5998';
var BGWASH = 'rgba(255,255,255,0.8)';
var DISABLED_WASH = 'rgba(255,255,255,0.25)';

var TEXT_INPUT_REF = 'urlInput';
var WEBVIEW_REF = 'webview';
var DEFAULT_URL = 'https://www.cxy61.com/girl/cxyteam_forum/detail.html?id=3433&pk=4';

export default class WebHtml extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: DEFAULT_URL,
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
        }
    }
    static navigationOptions = {
        title: '论坛详情',
    }

    inputText = '';

    handleTextInputChange(event) {
        var url = event.nativeEvent.text;
        if (!/^[a-zA-Z-_]+:/.test(url)) {
            url = 'http://' + url;
        }
        this.inputText = url;
    }

    componentDidMount() {
       
    }

    onShouldStartLoadWithRequest(event){
    // Implement any custom loading logic here, don't forget to return!
        return true;
    }

    onNavigationStateChange(navState) {
    
    }
    onMessage(e){
        if(this.refs.WEBVIEW_REF){
            this.refs.WEBVIEW_REF.postMessage()
        }else{
            Alert.alert('error')
        }
    }
    render() {
        this.inputText = this.state.url;
        return(
            <View style={{flex: 1}}>
            <WebView
                  ref={WEBVIEW_REF}
                  automaticallyAdjustContentInsets={false}
                  style={styles.webView}
                  source={{uri: this.state.url}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  onMessage ={this.onMessage.bind(this)}
                  decelerationRate="normal"
                  injectedJavaScript="document.addEventListener('message',function(e){eval(e.data);});"
                  onNavigationStateChange={this.onNavigationStateChange}
                  onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                  startInLoadingState={true}
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
    backgroundColor: BGWASH,
    height: 350,
  },

});
