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
import {StackNavigator} from 'react-navigation';

import Login from './Login/Login.js';
import CourseList from './CourseList/CourseList.js';

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
                    title="消息1"
                    onPress={()=>{this.props.navigation.navigate('MessagePage1')}}
                />
                <Button 
                    title="消息"
                    onPress={()=>{this.props.navigation.navigate('MessagePage', {userinfo:''})}}
                />
                <Button 
                    title="消息2"
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
    
    MessagePage:{screen: MessagePage},
    MessagePage1:{screen:MessagePage1},
    CodeEditWebView:{screen:CodeEditWebView},
    CodeEditWebView1:{screen:CodeEditWebView1},
    ThirdSiteWebView:{screen:ThirdSiteWebView},

    Login:{screen: Login},
    CourseList:{screen: CourseList}
});

export default app;
