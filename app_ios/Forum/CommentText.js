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
    RefreshControl,
    ActivityIndicator,
    DeviceEventEmitter,
}from 'react-native';
var {height, width} = Dimensions.get('window');
import Http from '../utils/Http.js';
import MedalView from '../Activity/MedalView.js';
var basePath=Http.domain;
var ImagePicker = require('react-native-image-picker');
var qiniu = require('react-native').NativeModules.UpLoad;
var content='';
export default class CommentText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            //content:'',
            pk:this.props.navigation.state.params.data,
            isDisable:false,
            text:'',
            show:false,
            IdCard1:'',//图片
            showRewardType:"hongbao",  //何种类型的奖励
            showMedalView:false,        //是否展示勋章视图
            showMedalMsg:"回复帖子",   //勋章的名字
        }
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '添加评论',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#5daeff',},
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
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result});
            }
        });
    }
    Comment_Main(){
        var data = {};
        data.posts = this.state.pk;
        data.content=this.state.text;
        if (data.content=='') {
            Alert.alert('请填写评论！','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
        }else{
            fetch(basePath+"/forum/replies_create/",
            {
                method:'post',
                headers: {
                    'Authorization': 'Token ' + this.state.token,
                    'Content-Type': 'application/json'},
                body: JSON.stringify(data),  
            })
            .then((response)=>{
                return response.json();
            })
            .then((result)=>{
                this.setState({
                    content:'',
                },()=>{
                    if(result.taken_medal==true){
                        this.setState({
                            showMedalView:true,
                            showMedalMsg:result.medal.name
                        })
                    }else{
                        this.props.navigation.state.params.callback();
                        this.props.navigation.goBack();
                    }
                    
                })
            })
            .catch((error) => {
                console.error(error);
            })
        }
    }
    Comment(){
        var data = {};
        data.replies = this.state.pk;
        data.content=this.state.text;
        if (data.content=='') {
            Alert.alert('请填写评论！','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
        }else{
            fetch(basePath+"/forum/replymore_create/",
            {
                method:'post',
                headers: {
                    'Authorization': 'Token ' + this.state.token,
                    'Content-Type': 'application/json'},
                body: JSON.stringify(data),  
            })
            .then((response)=>{
                return response.json();
            })
            .then((result)=>{
                this.setState({
                    content:'', 
                },()=>{
                    this.props.navigation.state.params.callback();
                    this.props.navigation.goBack();
                })
            })
            .catch((error) => {
                console.error(error);
            })
        }
    }
    postcomment(){
        if(this.props.navigation.state.params.name=='reply'){
            this.Comment()
            this.setState({
                isDisable:true,
            })
        }else{
            this.Comment_Main()
            this.setState({
                isDisable:true,
            })
        }
    }
    // 上传图片方法
    _upload(filename, token, key) {
        qiniu.uploadImage(filename, token, key,(error, callBackEvents)=>{
          if(error) {

          } else {
                if (callBackEvents.url) {
                    var imgArr='';
                    imgArr+='img['+ callBackEvents.url+ '] ';
                    content=this.state.text+imgArr;
                    this.setState({text:content,show: false})
                    //this._renewIcon(callBackEvents.url);
                } else {
                    //this.setState({show: false});
                    AlertIOS.alert('上传失败');
                }
            }
        })
    }
    // 获取图片对应 token， key
    _getQNToken(filename) {
        var url = basePath + "/upload/token/";
        fetch(url, {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + this.state.token,
          },
          body: JSON.stringify({
            filename: filename,
            private: false,
          }),
        })
        .then((response)=> response.json())
        .then((responseJson) => {
            if (responseJson.token) {

                this._upload(filename, responseJson.token, responseJson.key);
            } else {
                this.setState({show: false});
                AlertIOS.alert("获取令牌失败，请重新选择上传");
            }
        })
        .catch((error) => {console.log(error)});
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
            console.log('User cancelled image picker');
          }
          else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          }
          else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          }
          else {
                console.log(response)
              this.setState({show: true});
              let source = { uri: response.uri };
              var filename = response.uri.replace('file://', '');
              this._getQNToken(filename);
          }
        });
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
                />
                 <View style={{width:width,marginTop:10,marginBottom:20,}}>
                    <TouchableOpacity onPress={this._changeIcon.bind(this)}
                        style={{width:width*0.2,height:30,marginLeft:width*0.05,backgroundColor:'#5daeff',alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#ffffff',fontSize:14,}}>添加图片</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.postcomment.bind(this)} disabled={this.state.isDisable} style={{width:width*0.8,marginLeft:width*0.1,height:40,borderRadius:10,alignItems:'center', justifyContent: 'center',backgroundColor: '#5daeff',}}>
                    <Text style={{color:'#ffffff',fontSize:16,}}>提交评论</Text>
                </TouchableOpacity>

                {this.state.show?(
                    <View style={{position:'absolute',top:height / 2 - 100, width: 100, height: 100, borderRadius: 5, alignItems: 'center', alignSelf: 'center',justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <ActivityIndicator 
                            style={{marginTop: 10}}
                            color={'white'}
                            size={'large'}
                            animating={true}
                                />
                        <Text style={{color: 'white'}}>上传中...</Text>
                    </View>
                    ):(null)}
                {
                    this.state.showMedalView?
                        <MedalView 
                            type={"compete"} 
                            msg={this.state.showMedalMsg} 
                            hide={()=>{this.setState({showMedalView:false},()=>{this.props.navigation.state.params.callback();this.props.navigation.goBack()});}}
                        />:null
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },


});
