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

var ImagePicker = require('react-native-image-picker');
var qiniu = require('react-native').NativeModules.UpLoad;
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
    // 获取七牛上传 token
    _fetchQiniuToken(filename){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "post",
                    url = Http.getQiniuToken,
                    token = token,
                    data = {
                        filename:filename,
                        private:false
                    };
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response.token) {
                        // 开始上传图片到七牛
                        this._uploadToQiniu(filename, response.token, response.key);
                    }else{
                        // 有动画，在此失败时关闭
                        this.setState({
                            loading:false
                        })
                        Utils.showMessage("获取令牌失败，请重新选择上传");
                    }
                }, (err) => {
                    this.setState({
                        loading:false
                    })
                    Utils.showMessage("网络异常");
                    console.log(2);
                });
            }
        })
    }

    // 上传图片方法
    _uploadToQiniu(filename, token, key) {
        qiniu.uploadImage(filename, token, key,(error, callBackEvents)=>{
          if(error) {

          } else {
                if (callBackEvents.url) {
                    // 开始上传修改服务器存储的头像
                    var imgArr='';
                    imgArr+='img['+ callBackEvents.url+ '] ';
                    content=this.state.text+imgArr;
                    this.setState({text:content, loading: false})
                    
                } else {
                    // 关闭动画
                    Utils.showMessage("上传失败，请重试");
                }
            }
        })
    }
    // 调相册相机
    _changeIcon() {
        var options = {
            title: '选择照片',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'选择相册',
            quality:0.3,
            allowsEditing:false,
            noData:false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('用户取消了图片选择');
            }else if (response.error) {
                console.log("选择图片出错", response.error);
            }else if (response.customButton) {
                console.log("用户点了自定义按钮", response.customButton);
            }else {
                var source = {uri:response.uri};
                var filename = response.uri.replace("file://", "");
                // 请求上传七牛token,
                // 如果有加载动画，可以在此处打开
                this.setState({
                    loading:true,
                    loadingText:"上传中..."
                })
                this._fetchQiniuToken(filename);
            }
        });
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

    render() {
        return (
            <View style={{flex: 1,backgroundColor: '#ffffff',}}>
               <TextInput
                    style={{width:width*0.9,height: 150, borderColor: '#f1f1f1',paddingTop:10,fontSize:14, borderWidth: 1,paddingLeft:20,marginTop:20,marginLeft:width*0.05,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    placeholder='输入评论内容'
                    multiline={true}
                    autoCapitalize='none'
                    enablesReturnKeyAutomatically={true}
                    textAlignVertical='top'
                    keyboardType='default'
                    placeholderTextColor='#aaaaaa'
                    underlineColorAndroid="transparent"
                />
                 <View style={{width:width,marginTop:10,marginBottom:20,}}>
                    <TouchableOpacity onPress={this._changeIcon.bind(this)}
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
