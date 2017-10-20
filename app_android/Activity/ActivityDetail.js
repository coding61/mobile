/**
 * @author: chenwei
 * @description: 活动页
 * @time: 2017-07-18
 */
'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  // NativeModules    //RN 调 oc 模块
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import AlertView from '../Component/AlertView.js'

var RNBridgeModule = NativeModules.RNBridgeModule;

class ActivityDetail extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		loading:false,
            data:{},                             //页面加载的所有数据源
            showJoinActivityAlertView:false,     //是否显示输入密码弹框
            activityPsd:"",                      //活动密码
            isChange:false,                      //是否增加成员或者改变成员,修改信息，移除成员
	  	};
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
        	headerTitle:"活动详情",
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
        }
    };
    componentWillMount() {
      	this._fetchActivityDetail(this.props.navigation.state.params.pk);
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
        if (this.props.navigation.state.params.callback) {
           this.props.navigation.state.params.callback(this.state.isChange);
        }
    }
    // ------------------------------------------网络请求
    //获取活动详情
    _fetchActivityDetail(pk){
        /*
        var dic = {
              "pk": 4,
              "name": "北京大学现场讲座",
              "password": "123456",
              "introduction": "通告，北京大学现场讲座，通告，北京大学现场讲座通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座。",
              "member_number": 1,
              "club_member": [],
              "isjoin": false,
              "isLeader":false,
              "create_time": "2017-10-18T10:06:21.129728"
        }
        var dic1 = {
            "pk": 5,
            "owner": {
                "pk": 2,
                "name": "三十三",
                "avatar": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM6n2icNq7G9jdaqwcaeiaianPDPOZVdmDiaxpoOPzicEzDlR6Picqx2lzBlCic3pqYIzJesgLW8fjTE9icxIEybx5YjpTVnEnKHkR2ZKyU/0",
                "experience": 120,
                "diamond": 17,
                "remark": "",
                "olduser": true,
                "grade": {
                    "next_name": "青铜3",
                    "current_name": "青铜4",
                    "current_all_experience": 90,
                    "next_all_experience": 188
                },
                "is_staff": false,
                "isactive": false
            },
            "leader": true
        }
        var dic2 = {
          "pk": 1,
          "owner": null,
          "leader": true
        }
        var array = [];
        for (var i = 0; i < 12; i++) {
            array.push(dic2);
        }
        for (var i = 0; i < array.length; i++) {
            if(array[i].leader == true){
                dic["leaderName"] = array[i].owner?array[i].owner.name:"管理员";
                dic["leaderAvatar"] = array[i].owner?array[i].owner.avatar:"https://static1.bcjiaoyu.com/binshu.jpg";
                break;
            }
        }
        dic["club_member"] = array; 
        
        
        this.setState({
            loading:true,
            data:dic,
        });
        */
        
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.getActivityDetail(pk),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };
                    this._adjustActivityInfo(response);

                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })

    }
    //加入活动
    _fetchJoinActivity(pk, password){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.joinActivity(pk, password),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };
                    if (response.status == -4) {
                        Utils.showMessage(response.message?response.message:response.detail);
                        return;
                    }
                    this.setState({
                        isChange:true
                    })
                    this._adjustActivityInfo(response);
                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            }else{
                this._goLogin();
            }
        })
    }
    //退出活动
    _fetchLeaveActivity(pk){        
        
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.leaveActivity(pk),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };
                    if (response.status == -4) {
                        Utils.showMessage(response.message?response.message:response.detail);
                        return;
                    }
                    this.setState({
                        isChange:true
                    })
                    this._adjustActivityInfo(response);

                    if (this.props.navigation.state.params.fromPage == "my") {
                        // 从我的活动进来的，退出之后直接返回
                        this.props.navigation.goBack();
                    }
                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
        
    }
    // ------------------------------------------帮助方法
    // 去登录
    _goLogin(){
        this.props.navigation.navigate('Login', {callback:()=>{
            // 刷新页面
            this._fetchActivityDetail(this.props.navigation.state.params.pk);
        }})
    }
    // 调整请求到的活动信息内容
    _adjustActivityInfo(response){
        var array = response.club_member;
        for (var i = 0; i < array.length; i++) {
            if(array[i].leader == true){
                response["leaderName"] = array[i].owner?array[i].owner.name:"管理员";
                response["leaderAvatar"] = array[i].owner?array[i].owner.avatar:"https://static1.bcjiaoyu.com/binshu.jpg";
                response["leaderUsername"] = array[i].owner.owner;
                break;
            }
        }
        this.setState({
            loading:true,
            data:response
        });
    }
    // 联系发布者
    _contactTheActivityLeader(){
        Utils.isLogin((token)=>{
            if (token) {
                // TODO:去聊天
                var username = this.state.data.leaderUsername,
                    name = this.state.data.leaderName,
                    avatar = this.state.data.leaderAvatar,
                    tag = "single";

                // RNBridgeModule.RNEnterChatView(username, name, tag);
            }else{
                //去登录
                this._goLogin();
            }
        })

    }
    // 进入群聊
    _enterGroupChat(){
        var username = this.state.data.pk,
            name = this.state.data.name,
            avatar = "",
            tag = "group";

        // RNBridgeModule.RNEnterChatView(username, name, tag);
    }
    // 修改活动信息
    _updateActivityInfo(){
        this.props.navigation.navigate("UpdateActivity", {pk:this.props.navigation.state.params.pk, callback:(isUpdate)=>{
            if (isUpdate) {
                this.setState({
                    isChange:true
                })
                // 更新当前内容
                this._fetchActivityDetail(this.props.navigation.state.params.pk);
            }
        }});
    }
    // 管理成员
    _managerMembers(){
        this.props.navigation.navigate("ManageMember", {pk:this.props.navigation.state.params.pk, callback:(isDelete)=>{
            if (isDelete) {
                this.setState({
                    isChange:true
                })
                // 更新当前内容
                this._fetchActivityDetail(this.props.navigation.state.params.pk); 
            }
        }})
    }
    // 加入活动
    _joinActivity(){
        Utils.isLogin((token)=>{
            if (token) {
                this.setState({
                    showJoinActivityAlertView:true,
                    activityPsd:""
                })
            }else{
                this._goLogin();
            }
        })
    }
    // 确定加入活动
    _submitJoinActivity(){
        this.setState({
            showJoinActivityAlertView:false
        }, ()=>{
            this._fetchJoinActivity(this.props.navigation.state.params.pk, this.state.activityPsd);
        })
    }
    // 关闭加入活动的弹框
    _closeJoinActivityAlertView(){
        this.setState({
            showJoinActivityAlertView:false
        })
    }
    // 退出活动
    _leaveActivity(){
        this._fetchLeaveActivity(this.props.navigation.state.params.pk);
    }
    _OkPressEvent(){
        this._submitJoinActivity();
    }
	// ---------------------------------------活动详情 UI
    // 加入活动弹框
    _renderJoinActivity(){
        return (
            <Modal visible={this.state.showJoinActivityAlertView} transparent={true} onRequestClose={()=>{}}>
                <TouchableOpacity style={styles.AlertInputAlertParentView} onPress={this._closeJoinActivityAlertView.bind(this)}>
                    <View style={styles.AlertInputAlertView}>
                        <View style={styles.AlertInputView}>
                            <TextInput
                                style={styles.AlertInput}
                                onChangeText={(text) => {this.setState({activityPsd:text})}}
                                value={this.state.activityPsd}
                                placeholder={"请输入密码"}
                                underlineColorAndroid={'transparent'}
                              />
                        </View>
                        <TouchableOpacity onPress={this._submitJoinActivity.bind(this)}>
                        <View style={styles.AlertBtnView}><Text style={styles.AlertBtnText}>确定</Text></View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
    // 活动详情
    _renderTableView(){
        return (
            <ScrollView style={{flex:1}}>
            {/******活动详情******/}
                <View style={styles.item}>
                    {/******标题*******/}
                    <View style={styles.itemHeader}>
                        <Image
                          style={{height:20}}
                          source={require('../images/left.png')}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.itemHeaderTitle}>
                          {this.state.data.name}
                        </Text>
                        <Image
                          style={{height:20}}
                          source={require('../images/right.png')}
                          resizeMode={'contain'}
                        />
                    </View>
                    {/******介绍*******/}
                    <View style={styles.itemMiddle}>
                        <Text style={styles.itemMiddleText}>
                          {this.state.data.introduction}
                        </Text>
                    </View>
                    {/******发布者*******/}
                    <View style={styles.item1View}>
                        <Text style={styles.itemBottomText}>
                          发布者:{this.state.data.leaderName}
                        </Text>
                        {
                            this.state.isleader?
                                /******修改活动*******/
                                <TouchableOpacity onPress={this._updateActivityInfo.bind(this)}>
                                <View style={styles.item2View}>
                                    <Text style={styles.itemBottomText}>
                                      修改活动
                                    </Text>
                                    <Image
                                      style={styles.item2Img}
                                      source={require('../images/back1.png')}
                                      resizeMode={'contain'}
                                    />
                                </View>
                                </TouchableOpacity>
                            :
                                /******联系发布者*******/
                                <TouchableOpacity onPress={this._contactTheActivityLeader.bind(this)}>
                                <View style={styles.item2View}>
                                    <Text style={styles.itemBottomText}>
                                      联系发布者
                                    </Text>
                                    <Image
                                      style={styles.item2Img}
                                      source={require('../images/back1.png')}
                                      resizeMode={'contain'}
                                    />
                                </View>
                                </TouchableOpacity>
                        }

                    </View>
                    {/******成员*******/}
                    <View style={styles.item3Parent}>
                        <View style={styles.item3}>
                            <Text style={styles.itemBottomText}>
                               已报名:{this.state.data.member_number}人
                            </Text>
                            {
                                this.state.data.isleader?
                                    <TouchableOpacity onPress={this._managerMembers.bind(this)}>
                                    <View style={styles.item2View}>
                                        <Text style={styles.itemBottomText}>
                                          管理成员
                                        </Text>
                                        <Image
                                          style={styles.item2Img}
                                          source={require('../images/back1.png')}
                                          resizeMode={'contain'}
                                        />
                                    </View>
                                    </TouchableOpacity>
                                :   null
                            }
                        </View>
                        <View style={styles.item3Imgs}>
                            {
                                this.state.data.club_member.map((item, i)=>{
                                    return (
                                        i < 10 ?
                                        <View style={styles.item3ImgView} key={i}>
                                            <Image
                                              style={styles.item3Img}
                                              source={{uri: item.owner?item.owner.avatar:"https://static1.bcjiaoyu.com/binshu.jpg"}}
                                            />
                                            <Text style={[styles.itemBottomText, {maxWidth:40, height:20, lineHeight:20, textAlign:'center'}]}>
                                              {item.owner?item.owner.name:"管理员"}
                                            </Text>
                                        </View>:null
                                    )
                                })
                            }
                        </View>
                    </View>

                    {/*******提示，参加活动,退出活动********/}
                    {
                        !this.state.data.isleader?
                            <View style={styles.bottomView}>
                                <Text style={styles.tips}>提示：如果活动发布者未公布参加密码，您可以联系发布者，向发布者获取参加密码。</Text>
                                {
                                    this.state.data.isjoin?
                                        <View>
                                        <TouchableOpacity onPress={this._enterGroupChat.bind(this)}>
                                        <View style={styles.btnJoin}>
                                            <Text style={styles.btnText}>进入群聊</Text>
                                        </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={this._leaveActivity.bind(this)}>
                                        <View style={styles.btnQuit}>
                                            <Text style={styles.btnText}>退出活动</Text>
                                        </View>
                                        </TouchableOpacity>
                                        </View>
                                    :
                                        <TouchableOpacity onPress={this._joinActivity.bind(this)}>
                                        <View style={styles.btnJoin}>
                                            <Text style={styles.btnText}>参加活动</Text>
                                        </View>
                                        </TouchableOpacity>
                                }
                            </View>
                        :   null
                    }
                    
                </View>
                
            </ScrollView>
        )
    }
    
    // 页面加载中...
    _renderLoadingView(){
        return (
            <View style={styles.loadingView}>
                <Text>
                  Loading ...
                </Text>
            </View>
        )
    }
    _renderRootView(){
        if (!this.state.loading) {
            return this._renderLoadingView()
        }
        return(
            <View style={styles.container}>
                {this._renderTableView()}
            </View>
        )
    }
  	render() {
    	return (
        	<View style={styles.container}>
        		{this._renderRootView()}
                {/*
                    this.state.showJoinActivityAlertView?this._renderJoinActivity():null
                */}
                <AlertView 
                    type="input"
                    showAlertView={this.state.showJoinActivityAlertView}
                    hideAlertView={this._closeJoinActivityAlertView.bind(this)}
                    inputPlaceHolderText={"请输入密码"}
                    valueText={this.state.activityPsd}
                    setValueText={(text)=>{this.setState({activityPsd:text})}}
                    OkPressEvent={this._OkPressEvent.bind(this)}
                />
        	</View>
    	);
  	}
}

const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const pinkColor = Utils.btnBgColor;
const whiteColor = Utils.btnBgColorS;
const fontBColor = Utils.fontBColor;
const fontSColor = Utils.fontSColor;
const lineColor = Utils.underLineColor;
const bgColor = Utils.bgColor;
const bgSecondColor = Utils.bgSecondColor;
const btnCancelColor = Utils.btnCancelColor;
const alertViewBgColor = Utils.alertViewBgColor;
const alertLineColor = Utils.alertLineColor;

const styles = StyleSheet.create({
	// -------------------------------------------------导航栏
    headerStyle:{
        backgroundColor:pinkColor
    },
    // -----------导航栏右部分
    headerRightView:{
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:'center', 
        marginRight:10
    },
    headerRightImg:{
        height:20
    },
    
    // -----------------------------------------------加载中
    loadingView:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    container:{
        flex:1,
        backgroundColor:bgColor
    },
    item:{
        padding:10,
        fontSize:18,
        height:44,
    },

    // ------------------------------------------活动列表
    item:{
    	flex:1, 
    	backgroundColor:'white', 
        paddingTop:10
    },
    itemHeader:{
    	flexDirection:'row', 
    	justifyContent:'center', 
    	height:45, 
    	alignItems:'center'
    },
    itemHeaderTitle:{
    	fontSize:16, 
    	color:pinkColor, 
    	paddingHorizontal:5
    },
    itemMiddle:{
    	flexDirection:'row', 
    	borderBottomColor:lineColor, 
    	borderBottomWidth:1, 
    	paddingHorizontal:10, 
    	paddingBottom:10,
    },
    itemMiddleText:{
		fontSize:14, 
		color:fontBColor, 
		lineHeight:28, 
		textAlign:'justify', 
		overflow:'hidden',
    },
	itemBottomText:{
		color:fontSColor, 
		fontSize:13
	},
    item1View:{
        flexDirection:'row', 
        justifyContent:'space-between', 
        paddingHorizontal:10, 
        borderBottomColor:lineColor, 
        borderBottomWidth:1, 
        height:40, 
        alignItems:'center'
    },
    item2View:{
        flexDirection:'row', 
        alignItems:'center'
    },
    item2Img:{
        width:15, 
        height:15
    },
    item3Parent:{
        paddingHorizontal:10, 
        paddingBottom:20,
    },
    item3:{
        flexDirection:'row', 
        justifyContent:'space-between',
        alignItems:'center', 
        height:40
    },
    item3Imgs:{
        flexDirection:'row',
        flexWrap:'wrap',
    },
    item3ImgView:{
        width:(width-20)/6, 
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
    },
    item3Img:{
        width:40, 
        height:40, 
        borderRadius:20,
        marginBottom:10,
    },
    bottomView:{
        backgroundColor:bgSecondColor,
        paddingVertical:20,
        paddingHorizontal:25
    },
    tips:{
        fontSize:12,
        color:fontSColor,
        marginBottom:30,
    },
    btnJoin:{
        backgroundColor:pinkColor,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    },
    btnText:{
        color:'white'
    },
    btnQuit:{
        backgroundColor:btnCancelColor,
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5
    },

    // -------------------------------视图弹框
    AlertInputAlertParentView:{
        backgroundColor:'rgba(0,0,0,0.5)', 
        flex:1, 
        alignItems:'center', 
        justifyContent:'center'
    },
    AlertInputAlertView:{
        backgroundColor:alertViewBgColor, 
        width:width-120, 
        borderRadius:10,
    },
    AlertInputView:{
        minHeight:120, 
        borderBottomColor:alertLineColor, 
        borderBottomWidth:1, 
        alignItems:'center', 
        justifyContent:'center', 
    },
    AlertInput:{
        width:width-170, 
        height:30, 
        fontSize:12, 
        borderColor:alertLineColor, 
        borderWidth:1, 
        backgroundColor:'white', 
        textAlign:'center',
        padding:0,
        paddingHorizontal:5,
    },
    AlertBtnView:{
        height:40, 
        alignItems:'center', 
        justifyContent:'center'
    },
    AlertBtnText:{
        color:fontBColor
    }

});


export default ActivityDetail;