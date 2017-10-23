/**
 * @author: chenwei
 * @description: 底部 tabbar
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
    Button
} from 'react-native';
import {TabNavigator} from 'react-navigation';

import MessagePage from './pages/MessagePage.js';
import MyPage from './My/MyPage.js';

import ForumList from './Forum/ForumList.js';
import Activity from './Activity/Activity.js';
import ConversationList from './Message/ConversationList.js';

import Utils from './utils/Utils.js';

var tabBarIcon = {width:30, height:30};
const TabBar = TabNavigator({
  	MessagePage: {
        screen: MessagePage, 
        navigationOptions: {  // 也可以写在组件的static navigationOptions内
            tabBarLabel:'学习',
            tabBarIcon:({tintColor, focused}) => (
                focused?
                    <Image source={require('./images/tabs/1-select.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
                :
                    <Image source={require('./images/tabs/1-unselect.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
            ),
        }
    },
    Forum:{
        screen:ForumList,
        navigationOptions: {  // 也可以写在组件的static navigationOptions内
            tabBarLabel:'社区',
            tabBarIcon:({tintColor, focused}) => (
                focused?
                    <Image source={require('./images/tabs/2-select.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
                :
                    <Image source={require('./images/tabs/2-unselect.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
            ),
        }
    },
    ConversationList:{
        screen:ConversationList,
        navigationOptions: {  // 也可以写在组件的static navigationOptions内
            tabBarLabel:'对话',
            tabBarIcon:({tintColor, focused}) => (
                focused?
                    <Image source={require('./images/tabs/5-select.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
                :
                    <Image source={require('./images/tabs/5-unselect.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
            ),
        }
    },
    Activity:{
        screen:Activity,
        navigationOptions: {  // 也可以写在组件的static navigationOptions内
            tabBarLabel:'活动',
            tabBarIcon:({tintColor, focused}) => (
                focused?
                    <Image source={require('./images/tabs/3-select.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
                :
                    <Image source={require('./images/tabs/3-unselect.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
            ),
        }
    },
    MyPage:{
        screen:MyPage,
        navigationOptions: {  // 也可以写在组件的static navigationOptions内
            tabBarLabel:'个人',
            tabBarIcon:({tintColor, focused}) => (
                focused?
                    <Image source={require('./images/tabs/4-select.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
                :
                        <Image source={require('./images/tabs/4-unselect.png')}
                    style={[{width:30,height:30}, {tintColor:tintColor}]} resizeMode={'contain'}/>
            ),
        }
    },
},{
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
	tabBarOptions:{
		activeTintColor:Utils.tabBarSelectColor,
        inactiveTintColor:Utils.tabBarUnselectColor,
        indicatorStyle: {
            height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
        }, 
        showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
        style:{
            backgroundColor:'white',
            height:40
        },
        tabStyle:{
            paddingTop:5,
            // backgroundColor:'red',
        },
        labelStyle: {
            fontSize: 10, // 文字大小
            height:10,
        },
        iconStyle:{
            //android
            width:30,
            height:30,
            // backgroundColor:'blue'
        },
        showLabel:false,

	},
},
{ 
    intialRouteName: 'MessagePage'
});

export default TabBar;