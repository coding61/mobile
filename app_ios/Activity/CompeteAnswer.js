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
	  	};
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
        	headerTitle:"竞赛答题",
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
        }
    };
    componentWillMount() {
        this._fetchQuestionList();
    }
    componentWillUnmount() {
        if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
            this.props.navigation.state.params.callback(this.state.isAnswer); 
          }
        }
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
                this.props.navigation.navigate("EditAnswer", {compete:this.state.item.pk, question:this.state.data.pk, callback:(isAnswer)=>{
                    this.setState({
                        isAnswer:true
                    }, ()=>{
                        // this.props.navigation.goBack();
                    })

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
                <ScrollView style={{flex:1}} contentContainerStyle={{padding:10}}>
                    <Text style={styles.title}>{"题目: "}{this.state.data.title}</Text>
                </ScrollView>

                {
                    this.state.item.has_answer?
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
                this.state.data?
                    this._renderMainView()
                :
                    !this.state.loading?<EmptyView failTxt={"该竞赛下暂无题目"}/>:null
            }
	    	
            {
                this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
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
   		marginVertical:20, 
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
        marginVertical:20
   	},
    cancel:{
        height:45,
        backgroundColor:btnCancelColor,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        width:width-20,
        marginHorizontal:10,
        marginVertical:20
    }

});


export default CompeteAnswer;