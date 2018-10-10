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

var ImagePicker = require('react-native-image-picker');
var qiniu = require('react-native').NativeModules.UpLoad;
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
    }
    componentWillMount(){

    }
    componentDidMount() {
        var self = this;
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
                        this.hideLoading();
                        Utils.showMessage("获取令牌失败，请重新选择上传");
                    }
                }, (err) => {
                    this.hideLoading();
                    Utils.showMessage("网络异常");
                    console.log(2);
                });
            }
        })
    }
    // ---------------------------------点击事件
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
                    this.setState({text:content});
                    this.hideLoading();
                } else {
                    // 关闭动画
                    this.hideLoading();
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
                this.showLoading("上传中...");
                this._fetchQiniuToken(filename);
            }
        });
    }
    // 选择专区
    goclass(){
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
        data["types"] =  2;
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
                    <TouchableOpacity onPress={this.goclass.bind(this)}
                        style={{width:width*0.2,height:30,marginLeft:width*0.05,backgroundColor:'#ff6b94',alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#ffffff',fontSize:14,}}>选择专区</Text>
                    </TouchableOpacity>
                    <Text style={{fontSize:14,marginLeft:30,}}>{this.state.sectionname}</Text>
                </View>
                <View style={{width:width,marginTop:10,marginBottom:10,}}>
                    <TouchableOpacity onPress={this._changeIcon.bind(this)}
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
