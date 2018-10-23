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
  DeviceEventEmitter,
  Modal,
  Alert,
  FlatList,
  SectionList,
  AsyncStorage,
  ActivityIndicator,
  Platform
}from 'react-native';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';
import MedalView from '../Activity/MedalView.js';
import LoadingView from '../Component/LoadingView.js';

const isAndroid = Platform.OS === 'android';
var allAndroid = require('react-native').NativeModules.RongYunRN;
var {height, width} = Dimensions.get('window');
var content='';

export default class ForumAdd extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sectionpk:'',
            sectionname:'',
            text:'',
            title:'',
            loading:false,                                     //加载动画
            loadingText:"加载中",                               //加载动画上的文字
            IdCard1:'',                  //图片
            showRewardType:"hongbao",    //何种类型的奖励
            showMedalView:false,         //是否展示勋章视图
            showMedalMsg:"发布帖子",      //勋章的名字
        }
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '发布帖子',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{flex:1, textAlign:'center', fontSize:14},
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:20,}}>
                    <TouchableOpacity style={{marginRight:10,}} onPress={()=>{
                        DeviceEventEmitter.emit('publish', "1")
                    }}>
                        <Text style={{color:'#ffffff',fontSize:17,}}>发布</Text>
                    </TouchableOpacity>
                </View>
                )
        };
    }

    componentWillUnmount(){
        this.eventEm.remove();

        this.listenerProgressa.remove();
        this.listenerProgressb.remove();
        this.listenerProgressc.remove();
    }
    componentWillMount(){

    }
    componentDidMount() {
        var self = this;

        this.progress();
        this.eventEm = DeviceEventEmitter.addListener('publish', (value)=>{
            this.submitPost();
        })
    }
    showLoading(msg){
        this.setState({
            loading:true,
            loadingText:msg
        })
    }
    hideLoading(){
        this.setState({
            loading:false
        })
    }
    // -----------------------------------网络请求
    _fetchSubmitPostForum(dic){
        Utils.isLogin((token)=>{
            var type = "post",
                url = Http.addForum,
                token = token,
                data = dic;
            BCFetchRequest.fetchData(type, url, token, data, (response) => {
                this.hideLoading();
                console.log(response);
                if(response.detail=="当前未解决的帖子数量过多，请先标记它们为已解决或已完成"){
                    Utils.showMessage("您存在未解决的帖子过多，请先标记为已解决或已完成后再发布帖子");
                }else{
                    this.props.navigation.state.params.callback();
                    this.props.navigation.goBack();
                }
            }, (err) => {
                console.log(err);
                this.hideLoading();
            });
        })
    }
    // ---------------------------------点击事件
    // 上传图片的监听方法
    progress(){
        var  this_=this;
        //进度
        this.listenerProgressa = DeviceEventEmitter.addListener("uploadProgress_listener", function(params) {
        })
        //完成
        this.listenerProgressb = DeviceEventEmitter.addListener("uploadSuccess_listener", function(params) {
            var imgArr='';
            imgArr+='img['+ params.imageurl+ '] ';
            content=this_.state.text+imgArr;
            this_.setState({
                //IdCard1:imgArr,
                text:content,  
            })
            this_.hideLoading();
        });
        //开始
        this.listenerProgressc = DeviceEventEmitter.addListener("uploadStrat_listener", function(params) {
            this_.showLoading("上传中...");
        })
    }
    qiniu(){
        Utils.isLogin((token)=>{
            allAndroid.rnQiniu(token,false,"gallery");
        })
        DeviceEventEmitter.emit('forumadd', "photo");
    }
    // 选择专区
    chooseclass(){
        this.props.navigation.navigate('ForumClass',{callback:(data)=>{
            this.setState({
                sectionpk:data.pk,
                sectionname:data.name
            })
        }});
    }
    // 发布帖子
    submitPost(){
        var data = {};
        data["section"] = this.state.sectionpk;
        data["title"] = this.state.title;
        data["types"] =  2;   //4, 2
        data["content"] = this.state.text;
        if (data.title === '') {
            Utils.showMessage("请输入帖子标题！");
            return
        }
        if (data.content === '') {
            Utils.showMessage("请输入帖子内容！");
            return
        }
        if(data.section === ''){
            Utils.showMessage("请选择发布帖子专区！");
            return;
        }
        this.showLoading("发布中...");
        this._fetchSubmitPostForum(data);
    }
    render() {
        return(
            <View style={{flex:1,backgroundColor:'#ffffff'}}>
                <TextInput
                    style={{height: 80, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,paddingTop:10}}
                    onChangeText={(title) => this.setState({title})}
                    value={this.state.title}
                    multiline={true}
                    textAlignVertical='top'
                    underlineColorAndroid="transparent"
                    placeholder='标题'
                    autoFocus={true}
                    autoCapitalize='none'
                    enablesReturnKeyAutomatically={true}
                    placeholderTextColor='#aaaaaa'
                />
                <View style={{width:width,marginTop:10,marginBottom:10,flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={this.chooseclass.bind(this)}
                        style={{width:width*0.2,height:30,marginLeft:width*0.05,backgroundColor:'#ff6b94',alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#ffffff',fontSize:14,}}>选择专区</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:14,marginLeft:30,}}>{this.state.sectionname}</Text>
                </View>
                <View style={{width:width,marginTop:10,marginBottom:10,}}>
                    <TouchableOpacity onPress={this.qiniu.bind(this)}
                        style={{width:width*0.2,height:30,marginLeft:width*0.05,backgroundColor:'#ff6b94',alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#ffffff',fontSize:14,}}>添加图片</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={{height: 230, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,paddingTop:10,paddingRight:10,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    multiline={true}
                    autoCapitalize='none'
                    textAlignVertical='top'
                    underlineColorAndroid="transparent"
                    placeholder='尽情提问吧'
                    enablesReturnKeyAutomatically={true}
                    placeholderTextColor='#aaaaaa'
                />
                {
                    this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
                }
            </View>
        )
    }
}
