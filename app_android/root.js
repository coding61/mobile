import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  PropTypes,
  Alert,
  AsyncStorage,
  NativeAppEventEmitter,
  BackAndroid,
  NavigatorIOS,
  Navigator,
  Button
}from 'react-native';

import MessagePage from './pages/MessagePage.js';
import MessagePage1 from './pages/MessagePage1.js';
import CodeEditWebView from './pages/CodeEditWebView.js';
import CodeEditWebView1 from './pages/CodeEditWebView1.js';
import ThirdSiteWebView from './pages/ThirdSiteWebView.js';


import Forum from './Forum/Forum.js';
import ForumList from './Forum/ForumList.js';
import WebHtml from './Forum/WebHtml.js';
import AddForum from './Forum/AddForum.js';
import Forum_Details from './Forum/Forum_Details.js';
import {StackNavigator} from 'react-navigation';

import Login from './Login/Login.js';
import CourseList from './CourseList/CourseList.js';
import Register from './Login/Register.js';
import FindWord from './Login/FindWord.js';
import SelectHead from './Login/SelectHead.js';

class RootApp extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
        const { navigate } = this.props.navigation;
        return (
            <View style={{}}>
                <Button 
                    title="论坛"
                    onPress={() =>
                            navigate('Forum', { name: 'Forum' })
                        }
                />

                <Button 
                    title="消息"
                    onPress={()=>{this.props.navigation.navigate('MessagePage', {userinfo:''})}}
                />

                <Button 
                    title="在线编辑器"
                    onPress={()=>{this.props.navigation.navigate('CodeEditWebView', {userinfo:''})}}
                />
          </View>
        )
    }
}

const styles = StyleSheet.create({
  
});

const app = StackNavigator({
    RootApp:{screen: RootApp},
    
    Forum:{screen: Forum},
    ForumList:{screen:ForumList},
    WebHtml:{screen:WebHtml},
    AddForum:{screen:AddForum},
    Forum_Details:{screen:Forum_Details},
    
    MessagePage:{screen: MessagePage},
    MessagePage1:{screen:MessagePage1},
    CodeEditWebView:{screen:CodeEditWebView},
    CodeEditWebView1:{screen:CodeEditWebView1},
    ThirdSiteWebView:{screen:ThirdSiteWebView},

    Login:{screen: Login},
    CourseList:{screen: CourseList},
    Register:{screen: Register},
    FindWord: {screen: FindWord},
    SelectHead: {screen: SelectHead}
}, {
    //initialRouteName: 'Forum',             //配置初始路由的名称
    initialRouteName: 'MessagePage',             //配置初始路由的名称
    initialRouteParams:{userinfo:''}   //配置初始路由的参数    
});

export default app;
