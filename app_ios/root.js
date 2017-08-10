/**
 * @author: chenwei
 * @description: app入口，进行身份的选择
 * @time: 2017-03-15
 */
'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet, 
    Text,
    TouchableOpacity,
    Button
}from 'react-native'
import {StackNavigator} from 'react-navigation';

import MessagePage from './pages/MessagePage.js';
import MessagePage1 from './pages/MessagePage1.js';
import CodeEditWebView from './pages/CodeEditWebView.js';
import CodeEditWebView1 from './pages/CodeEditWebView1.js';
import ThirdSiteWebView from './pages/ThirdSiteWebView.js';

import Login from './Login/Login.js';
import CourseList from './CourseList/CourseList.js';
import Register from './Login/Register.js';
import FindWord from './Login/FindWord.js';
import SelectHead from './Login/SelectHead.js';

class rootApp extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
        return (
            <View style={styles.container}>
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
    Root:{screen: rootApp},
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
});

export default app;
