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

//var default_url='http://192.168.25.174:8080/CXYTeam/cxyteam-html5/cxyteam_forum_moblie/add.html';
var default_url='https://www.cxy61.com/girl/cxyteam_forum_moblie/add.html';
//var default_url='https://app.bcjiaoyu.com/girl/cxyteam_forum_moblie/add.html';
export default class AddForum extends Component{
    constructor(props) {
        super(props);
        this.state = {
            url: default_url,
            scalesPageToFit: true,
            data:{
                token:this.props.navigation.state.params.token,
                pk:this.props.navigation.state.params.data.pk,
            },
        }
    }
    static navigationOptions = {
        title: '发布帖子',
    }

    componentDidMount() {
       
    }

    onShouldStartLoadWithRequest(event){
        return true;
    }

    sendMessage() {
        this.webview.postMessage(JSON.stringify(this.state.data));
    }
    handleMessage (evt)  {
        var message = evt.nativeEvent.data
        if(message==200){
            this.props.navigation.goBack()
        }
    }

    render() {
        return(
            <View style={{flex: 1}}>
            <WebView
                  ref={webview => this.webview = webview}
                  automaticallyAdjustContentInsets={false}
                  style={styles.webView}
                  source={{uri: this.state.url}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  onMessage ={this.handleMessage.bind(this)}
                  decelerationRate="normal"
                  onLoad ={this.sendMessage.bind(this)}
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
  },

});
