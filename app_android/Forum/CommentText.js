import React, {Component} from 'react'
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    ScrollView,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
    ListView,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    ActivityIndicator,
    DeviceEventEmitter,
}from 'react-native';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';
import MedalView from '../Activity/MedalView.js';
import LoadingView from '../Component/LoadingView.js';

const isAndroid = Platform.OS === 'android';
var allAndroid = require('react-native').NativeModules.RongYunRN;
var content='';

export default class CommentText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //content:'',
            pk:this.props.navigation.state.params.data,
            text:'',
            IdCard1:'',//图片
            showRewardType:"hongbao",  //何种类型的奖励
            showMedalView:false,        //是否展示勋章视图
            showMedalMsg:"回复帖子",   //勋章的名字
            loading:false,                                     //加载动画
            loadingText:"加载中",                               //加载动画上的文字
        }
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '添加评论',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:15,},
        };
    }
    componentWillUnmount(){
        //this.eventEm.remove();

        this.listenerProgressa.remove();
        this.listenerProgressb.remove();
        this.listenerProgressc.remove();
    }
    componentWillMount(){
        if(this.props.navigation.state.params.name=='reply'){
            this.setState({
                text:'@'+this.props.navigation.state.params.userinfo+' ',
            })
        }else{
            this.setState({
                text:''
            })
        }
    }
    componentDidMount() {
        this.progress();
    }
    // ----------------------------网络请求
    // 发布评论
    _fetchSubmitComment(pk, tag, content){
        console.log("评论", pk, tag);
        var curl = '',
            dic = {};
        if (tag === "reply") {
            //回帖
            dic = {"posts":pk, "content":content}
            curl = Http.forumReply
        }else{
            //回帖的回复
            dic = {"replies":pk, "content":content}
            curl = Http.forumReplyAgain
        }
        Utils.isLogin((token)=>{
            if (token) {
                var type = "post",
                    url = curl,
                    token = token,
                    data = dic;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    this.setState({
                        text:''
                    })
                    if (tag === "reply") {
                        if(response.taken_medal==true){
                            this.setState({
                                showMedalView:true,
                                showMedalMsg:response.medal.name
                            })
                        }else{
                            this.props.navigation.state.params.callback(); 
                            this.props.navigation.goBack();
                        }
                    }else{
                        this.props.navigation.state.params.callback(); 
                        this.props.navigation.goBack();
                    }
                }, (err) => {
                    console.log(2);
                });
            }
        })
    }
    
    // 提交评论
    postcomment(){
        var pk = this.state.pk,
            content = this.state.text;
        if (content == "") {
            Utils.showMessage("请填写评论！");
            return
        }
        console.log("评论", this.props.navigation.state.params.name);
        if(this.props.navigation.state.params.name=='reply'){
            // 回帖的回复
            this.setState({
                loading:true
            })
            this._fetchSubmitComment(pk, "replyAgain", content);
        }else{
            // 主贴
            this.setState({
                loading:true
            })
            this._fetchSubmitComment(pk, "reply", content);
        }
    }
    // 上传图片的监听方法
    progress(){
        var this_=this;
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
                loading:false,
                text:content,
            })
        });
        //开始
        this.listenerProgressc = DeviceEventEmitter.addListener("uploadStrat_listener", function(params) {
            this_.setState({
                loading:true,
                loadingText:"上传中..."
            })
        })
    }
    qiniu(){
        Utils.isLogin((token)=>{
            allAndroid.rnQiniu(token,false,"gallery");
        })
        DeviceEventEmitter.emit('forumadd', "photo");
    }
    render() {
        return (
            <View style={{flex: 1,backgroundColor: '#ffffff',}}>
               <TextInput
                    style={{width:width*0.9,height: 150, borderColor: '#f1f1f1', borderWidth: 1,paddingLeft:20,marginTop:20,marginLeft:width*0.05,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    placeholder='输入评论内容'
                    multiline={true}
                    textAlignVertical='top'
                    keyboardType='default'
                    placeholderTextColor='#aaaaaa'
                    underlineColorAndroid="transparent"
                />
                 <View style={{width:width,marginTop:10,marginBottom:20,}}>
                    <TouchableOpacity onPress={this.qiniu.bind(this)}
                        style={{width:width*0.2,height:30,marginLeft:width*0.05,backgroundColor:'#ff6b94',alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#ffffff',fontSize:14,}}>添加图片</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.postcomment.bind(this)} style={{width:width*0.8,marginLeft:width*0.1,height:40,borderRadius:10,alignItems:'center', justifyContent: 'center',backgroundColor: '#ff6b94',}}>
                    <Text style={{color:'#ffffff',fontSize:16,}}>提交评论</Text>
                </TouchableOpacity>
                {
                    this.state.showMedalView?
                        <MedalView 
                            type={"compete"} 
                            msg={this.state.showMedalMsg} 
                            hide={()=>{this.setState({showMedalView:false},()=>{this.props.navigation.state.params.callback();this.props.navigation.goBack()});}}
                        />:null
                }
                {
                    this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
                }
            </View>
        )
    }
}
var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },


});
