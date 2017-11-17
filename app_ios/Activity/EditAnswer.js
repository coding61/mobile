'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ScrollView
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import EmptyView from '../Component/EmptyView.js';
import LoadingView from '../Component/LoadingView.js';
import RewardView from '../Activity/RewardView.js';

class EditAnswer extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		compete:this.props.navigation.state.params.compete,
            question:this.props.navigation.state.params.question,
	  		answer:"",
            loading:false,
            loadingText:"加载中...",
            isAnswer:false,
            showRewardView:false,      //是否展示奖励视图
            showRewardText:"",         //奖励视图文本信息
            showRewardType:"hongbao",  //何种类型的奖励

	  	};
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
        	headerTitle:"添加答案",
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
        }
    };
    componentWillMount() {
        
    }
    componentWillUnmount() {
        if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
            this.props.navigation.state.params.callback(this.state.isAnswer); 
          }
        }
    }
    //提交答案
    _fetchSubmitAnswer(){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "post",
                    url = Http.competeAnswer(this.state.compete),
                    token = token,
                    data = {answers:[{question:this.state.question, content:this.state.answer}]};
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
                        
                        var msg = "",
                            type = "hongbao";
                        if (Utils.containKey(response, "taken_amount")) {
                            msg = "很厉害哦，恭喜你获取"+response.taken_amount+"元奖学金红包";
                            type = "hongbao";
                            // Utils.showMessage('恭喜，获取'+response.taken_amount+'元奖金，请到个人账户查看');
                        }
                        if (Utils.containKey(response, "diamond_count")) {
                            msg = "很厉害哦，恭喜你获得了"+response.diamond_count+"颗钻石";
                            type = "zuan";
                            // Utils.showMessage('恭喜，获取'+response.diamond_count+'个钻石，请到个人账户查看');
                        }  
                        this.setState({
                            showRewardView:true,
                            showRewardType:type,
                            showRewardText:msg
                        })                      
                    }
                    // Utils.showMessage('提交答案成功');
                    // this.props.navigation.goBack();

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
        this.setState({
            loading:true,
            loadingText:"正在提交..."
        })
        this._fetchSubmitAnswer();
    }
  	render() {
	    return (
            <View style={{flex:1, backgroundColor:bgColor}}>
                <TouchableOpacity style={{flex:1}} onPress={() => this._cancelkeyboard()} activeOpacity={1}>
                <TextInput 
                    style={styles.answerInput}
                    multiline={true}
                    onChangeText={(answer) => this.setState({answer})}
                    value={this.state.answer}
                    placeholder={'请输入您的答案'}
                />
                {
                    this.state.answer ? 
                        <TouchableOpacity style={styles.answerBtn} onPress={this._submitAnswer.bind(this)}>
                            <Text style={styles.answerTxt}>{"提交答案"}</Text>
                        </TouchableOpacity>
                    : 
                        <View style={styles.answerView}>
                            <Text style={styles.answerTxt}>{"提交答案"}</Text>
                        </View>
                }
                </TouchableOpacity>
                {
                    this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
                }
                {
                    this.state.showRewardView?
                        <RewardView 
                            type={this.state.showRewardType} 
                            msg={this.state.showRewardText} 
                            hide={()=>{this.setState({showRewardView:false}); this.props.navigation.goBack()}}
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
    // ---------------------------------------------主体代码
    answerInput: {
        fontSize: 15,
        padding: 10,
        paddingTop: 10,
        backgroundColor:'white', 
        borderColor:"#c9c9c9",
        borderWidth: 1,
        marginLeft: width * 0.05,
        marginTop: 20,
        width: width * 0.9,
        height: width * 300 / 750,
        borderRadius:2, 
    },
    answerBtn: {
        width: width * 0.8,
        height: 40,
        marginLeft: width * 0.1,
        marginTop: 20,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5CADFB',
    },
    answerView: {
        width: width * 0.8,
        height: 40,
        marginLeft: width * 0.1,
        marginTop: 20,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DEDEDE'
    },
    answerTxt: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold'
    }

});


export default EditAnswer;