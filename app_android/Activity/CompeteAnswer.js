'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView,
  DeviceEventEmitter,
  NativeModules,
  Alert
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import EmptyView from '../Component/EmptyView.js';
import LoadingView from '../Component/LoadingView.js';
import MedalView from '../Activity/MedalView.js';
import Leaderboards from '../Activity/Leaderboards.js';

const QuestionTab = 1;        //答题选项
const LeaderboardTab = 0;     //排行榜选项

var UMeng = require('react-native').NativeModules.RongYunRN;

class CompeteAnswer extends Component {
	constructor(props) {
	  	super(props);

	  	this.state = {
	  		item:this.props.navigation.state.params.item,
	  		answer:"",
            data:null,
            loading:true,
            loadingText:"加载中...",
            isAnswer:false,
            showMedalView:false,       //是否展示勋章视图
            showMedalMsg:"答题勋章1",   //勋章的名字
	  	};
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
        	headerTitle:"答题",
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
            headerRight:
                <TouchableOpacity style={styles.navRightBtn} onPress={navigation.state.params ? navigation.state.params.navRightBtnClick : null}>
                    <Text style={styles.navRightTxt}>分享</Text>
                </TouchableOpacity>
        }
    };
    componentWillMount() {
        this._fetchQuestionList();
    }
    componentDidMount() {
        this.props.navigation.setParams({
            navRightBtnClick: this._shareWeChat.bind(this)
        })
        this.listenTabPress = DeviceEventEmitter.addListener('navigateTabPress', (tab)=>{
            this.props.navigation.setParams({
                tab:tab
            })
        })
    }
    componentWillUnmount() {
        if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
            this.props.navigation.state.params.callback(this.state.isAnswer);
          }
        }
    }
    _shareWeChat = () => {
        if (!this.state.data.title) {
            Alert.alert('正在获取竞赛详情，请稍后...');
            return;
        }
        var title = this.state.data.title;
        var content = '竞赛';
        var shareUrl = Http.shareCompeteUrl(this.state.item.pk);
        var imgUrl = Http.shareLogoUrl;    // 默认图标
        UMeng.rnShare(title, content, shareUrl, imgUrl, (error, callBackEvents)=>{
            if (callBackEvents == '分享成功') {

            } else if (callBackEvents == '分享失败') {
                Alert.alert('分享失败');
            } else if (callBackEvents == '已取消分享') {
                Alert.alert('已取消分享');
            }
        })
    }
    //获取问题列表
    _fetchQuestionList(){
        Utils.isLogin((token)=>{
            // if (token) {
                var type = "get",
                    url = Http.questionList(this.state.item.pk),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (!response) {
                        //请求失败
                    };
                    if (response.results.length > 0) {
                        this.setState({
                            data:response.results[0]
                        })
                    }
                    this.setState({
                        loading:false
                    })

                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                    this.setState({
                        loading:false
                    })
                });
            // }
        })
    }
    //提交答案
    _fetchSubmitAnswer(){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "post",
                    url = Http.competeAnswer(this.state.item.pk),
                    token = token,
                    data = {answers:[{question:this.state.data.pk, content:this.state.answer}]};
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };

                    this.setState({
                        loading:false,
                        isAnswer:true
                    })
                    if (response.status == -1 || response.status == -2 || response.status == -4) {
                        Utils.showMessage(response.message);
                    }else{
                        if (Utils.containKey(response, "taken_amount")) {
                            Utils.showMessage('恭喜，获取'+response.taken_amount+'元奖金，请到个人账户查看');
                        }
                        if (Utils.containKey(response, "diamond_count")) {
                            Utils.showMessage('恭喜，获取'+response.diamond_count+'个钻石，请到个人账户查看');
                        }

                    }
                    // Utils.showMessage('提交答案成功');
                    this.props.navigation.goBack();

                }, (err) => {
                    console.log(2);
                    Utils.showMessage('请求异常');
                    this.setState({
                        loading:false
                    })
                });
            }
        })
    }
    _cancelkeyboard() {
	    Keyboard.dismiss();
    }
    _submitAnswer(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate("EditAnswer", {compete:this.state.item.pk, question:this.state.data.pk, callback:(isAnswer, response)=>{
                    this.setState({
                        isAnswer:isAnswer
                    }, ()=>{
                        // this.props.navigation.goBack();
                    })
                    if (response && response.taken_medal) {
                        //打开勋章
                        this.setState({
                            showMedalView:true,
                            showMedalMsg:response.medal.name
                        })
                    }

                }});
            }else{
                this.props.navigation.navigate("Login");
            }
        })
        /*
		Utils.isLogin((token)=>{
			if (token) {
				if (this.state.answer == "") {
					Utils.showMessage("请输入您的答案，再提交");
				}else{
                    this.setState({
                        loading:true,
                        loadingText:"正在提交..."
                    })
					this._fetchSubmitAnswer();
				}
			}else{
				this.props.navigation.navigate("Login");
			}
		})
        */
    }
    _hideMedalView(){
        this.setState({showMedalView:false}, ()=>{
        });
    }
    _renderMainView1(){
        return (
            <TouchableOpacity onPress={() => this._cancelkeyboard()} activeOpacity={1} style={{flex:1,backgroundColor:bgColor, paddingHorizontal:10, paddingVertical:10}}>
            <View style={{position:'relative', flex:1}}>
                <Text style={styles.title}>{"题目: "}{this.state.data.title}</Text>
                {/*
                <TextInput
                    style={styles.answer}
                    onChangeText={(text)=>{this.setState({answer:text})}}
                    placeholder={"请输入您的答案"}
                    value={this.state.answer}
                    multiline={true}
                />
                */}
                 <TouchableOpacity style={styles.submit} onPress={this._submitAnswer.bind(this)}>
                    <Text style={{color:'white', fontSize:15}}>{"提交答案"}</Text>
                </TouchableOpacity>
            </View>
            </TouchableOpacity>
        )
    }
    _renderMainView(){
        return (
            <View style={{flex:1}}>
                <View style={{height:height/2, backgroundColor:'white'}}>
                <ScrollView style={{flex:1}} contentContainerStyle={{padding:10}}>
                    <Text style={styles.title}>{"题目: "}{this.state.data.title}</Text>
                </ScrollView>
                </View>
                <View style={{flex:1, marginTop:20, backgroundColor:'white'}}>
                    <View style={{borderBottomColor:'black',borderBottomWidth:2, flexDirection:'row',width:50, marginLeft:10, height:35, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:18, fontWeight:'bold'}}>{"榜单"}</Text>
                    </View>
                    <Leaderboards navigation={this.props.navigation} contest={this.state.item.pk}/>
                </View>
                {/*
                <TouchableOpacity style={styles.submit} onPress={this._submitAnswer.bind(this)}>
                    <Text style={{color:'white', fontSize:15}}>{"提交答案"}</Text>
                </TouchableOpacity>
                */}
                {   this.state.item.finish?
                        <View style={styles.cancel}>
                            <Text style={{color:'white', fontSize:15}}>{"竞赛已结束"}</Text>
                        </View>
                    :
                        this.state.item.has_answer || this.state.isAnswer || this.state.data.has_answer?
                            <View style={styles.cancel}>
                                <Text style={{color:'white', fontSize:15}}>{"你已经回答过这次竞赛了"}</Text>
                            </View>
                        :
                            <TouchableOpacity style={styles.submit} onPress={this._submitAnswer.bind(this)}>
                                <Text style={{color:'white', fontSize:15}}>{"提交答案"}</Text>
                            </TouchableOpacity>
                }

            </View>
        )
    }
  	render() {
	    return (
            <View style={{flex:1, backgroundColor:bgColor}}>
            {
                this.props.navigation.state.params && this.props.navigation.state.params.tab == LeaderboardTab?
                    <Leaderboards navigation={this.props.navigation} contest={this.state.item.pk}/>
                :
                    this.state.data?
                        this._renderMainView()
                    :
                        !this.state.loading?<EmptyView failTxt={"该竞赛下暂无题目"}/>:null
            }
            {
                this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
            }
            {
                this.state.showMedalView?
                    <MedalView
                        type={"compete"}
                        msg={this.state.showMedalMsg}
                        hide={this._hideMedalView.bind(this)}
                    />:null
                }
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
    // -----------导航栏中间部分
    headerTitleTabs:{
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor:'transparent',
        width:width/2,
        height:40,
    },
    headerTitleTab:{
        height:35,
        alignItems:'center',
        justifyContent:'center',
        // marginVertical:2,
    },
    headerTitleTabSelect:{
        borderBottomColor:'white',
        borderBottomWidth:2,
    },
    headerTitleTabText:{
        color:'white',
        fontSize:18,
    },
    headerTitleTabTextSelect:{
        fontWeight: 'bold'
    },
    navRightBtn: {
        width: 60,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navRightTxt: {
        color: 'white',
        fontSize: 15,
        marginTop: 2
    },
    // ---------------------------------------------主体代码
   	title:{
   		fontSize:18,
   		color:fontBColor,
   		fontWeight:'bold',
   		backgroundColor:'transparent',
        lineHeight:20
   	},
   	answer:{
   		backgroundColor:'white',
   		borderColor:"#c9c9c9",
   		borderWidth:1,
   		height:height/3,
   		borderRadius:2,
   		// marginVertical:20,
   		padding:10,
   		lineHeight:20,
   		fontSize:15
   	},
   	submit:{
   		// backgroundColor:pinkColor,
   		// height:45,
   		// alignItems:'center',
   		// justifyContent:'center',
   		// borderRadius:5,
   		// // marginTop:20,
   		// position:'absolute',
   		// bottom:40,
   		// width:width-20

        height:45,
        backgroundColor:pinkColor,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        width:width-20,
        marginHorizontal:10,
        // marginVertical:20
   	},
    cancel:{
        height:45,
        backgroundColor:btnCancelColor,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        width:width-20,
        marginHorizontal:10,
        // marginVertical:20
    }

});


export default CompeteAnswer;
