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

import TabBar from './TabBar.js';

import MessagePage from './pages/MessagePage.js';
import MessagePage1 from './pages/MessagePage1.js';
import CodeEditWebView from './pages/CodeEditWebView.js';
import CodeEditWebView1 from './pages/CodeEditWebView1.js';
import ThirdSiteWebView from './pages/ThirdSiteWebView.js';
import CodeCompileWebView from './pages/CodeCompileWebView.js';
import HomeScreen from './pages/HomeScreen.js';

import Forum from './Forum/Forum.js';
import ForumList from './Forum/ForumList.js';
import Forum_Details from './Forum/Forum_Details.js';
import NewsCenter from './Forum/NewsCenter.js';
import RankingList from './Forum/RankingList.js';
import ForumAdd from './Forum/ForumAdd.js';
import MyCollect from './Forum/MyCollect.js';
import MyForum from './Forum/MyForum.js';
import CommentText from './Forum/CommentText.js';
import Search from './Forum/Search.js';
import ForumClass from './Forum/ForumClass.js';
import Login from './Login/Login.js';
import CourseList from './CourseList/CourseList.js';
import Register from './Login/Register.js';
import FindWord from './Login/FindWord.js';
import SelectHead from './Login/SelectHead.js';
import PersonalPage from './Forum/PersonalPage.js';
import PersonalReward from './Forum/PersonalReward.js';
import PersonalMedal from './Forum/PersonalMedal.js';
import RewardRecord from './My/RewardRecord.js';

import CompeteView from './Activity/CompeteView.js';
import Activity from './Activity/Activity.js';
import ActivityDetail from './Activity/ActivityDetail.js';
import MyActivity from './Activity/MyActivity.js';
import AddActivity from './Activity/AddActivity.js';
import AlterActivity from './Activity/AlterActivity.js';
import ManageMember from './Activity/ManageMember.js';
import CompeteAnswer from './Activity/CompeteAnswer.js';
import EditAnswer from './Activity/EditAnswer.js';
import Leaderboards from './Activity/Leaderboards.js';

import CatalogCourse from './My/CatalogCourse.js';
import ScholarshipRecord from './My/ScholarshipRecord.js';

import Exchange from './Exchange/Exchange.js';
import ExchangeRecord from './Exchange/ExchangeRecord.js';
import ExchangeUsingRecord from './Exchange/ExchangeUsingRecord.js';
class RootApp extends Component{
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
    RootApp:{screen: RootApp},
    TabBar: {screen: TabBar},

    Forum:{screen: Forum},
    ForumList:{screen:ForumList},
    Forum_Details:{screen:Forum_Details},
    NewsCenter:{screen:NewsCenter},
    RankingList:{screen:RankingList},
    ForumAdd:{screen:ForumAdd},
    MyCollect:{screen:MyCollect},
    MyForum:{screen:MyForum},
    CommentText:{screen:CommentText},
    Search:{screen:Search},
    ForumClass:{screen:ForumClass},
    PersonalPage:{screen:PersonalPage},
    PersonalReward:{screen:PersonalReward},
    PersonalMedal:{screen:PersonalMedal},

    HomeScreen:{screen:HomeScreen},
    MessagePage:{screen: MessagePage},
    MessagePage1:{screen:MessagePage1},
    CodeEditWebView:{screen:CodeEditWebView},
    CodeEditWebView1:{screen:CodeEditWebView1},
    ThirdSiteWebView:{screen:ThirdSiteWebView},
    CodeCompileWebView:{screen:CodeCompileWebView},

    Login:{screen: Login},
    CourseList:{screen: CourseList},
    Register:{screen: Register},
    FindWord: {screen: FindWord},
    SelectHead: {screen: SelectHead},
    RewardRecord:{screen:RewardRecord},

    CompeteView:{screen:CompeteView},
    Activity:{screen:Activity},
    ActivityDetail:{screen:ActivityDetail},
    MyActivity:{screen:MyActivity},
    AddActivity:{screen:AddActivity},
    AlterActivity:{screen:AlterActivity},
    ManageMember:{screen:ManageMember},
    CompeteAnswer:{screen:CompeteAnswer},
    EditAnswer:{screen:EditAnswer},
    CatalogCourse:{screen:CatalogCourse},
    ScholarshipRecord:{screen:ScholarshipRecord},
    Leaderboards:{screen:Leaderboards},
    Exchange:{screen:Exchange},
    ExchangeRecord:{screen:ExchangeRecord},
    ExchangeUsingRecord:{screen:ExchangeUsingRecord},
}, {
    initialRouteName: 'TabBar',             //配置初始路由的名称
    initialRouteParams:{userinfo:''}        //配置初始路由的参数
});


export default app;
