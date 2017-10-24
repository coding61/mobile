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
}from 'react-native';
import face from './Content_Rex';
import Http from '../utils/Http.js';
var basePath=Http.domain;
var {height, width} = Dimensions.get('window');
var ImagePicker = require('react-native-image-picker');
var qiniu = require('react-native').NativeModules.UpLoad;
var content='';
export default class ForumAdd extends Component{
    constructor(props) {
        super(props);
        this.state = {
            sectionpk:'',
            token:this.props.navigation.state.params.token,
            text:'',
            title:'',
            show:false,
            IdCard1:'',//图片
            sectionname:'',
        }
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '发布帖子',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14,},
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:18,}}>
                    <TouchableOpacity style={{marginRight:10,}} onPress={()=>{
                        DeviceEventEmitter.emit('publish', "1")
                    }}>
                        <Text style={{color:'#ffffff',fontSize:18,}}>发布</Text>
                    </TouchableOpacity>
                </View>
                )
        };
    }

    componentWillUnmount(){
        this.eventEm.remove();
    }
    componentWillMount(){
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    
                });
            }
            
        });
    }
    componentDidMount() {
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    
                });
            }
            
        });
        this.eventEm = DeviceEventEmitter.addListener('publish', (value)=>{
            var data = {};
            data.section = this.state.sectionpk;
            data.title=this.state.title;
            data.types =2;
            data.content=this.state.text;

            if (data.content=='') {
                Alert.alert('请输入帖子内容！','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
            }else if(data.section==''){
                Alert.alert('请选择发布帖子专区！','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
            }else if(this.state.token==''||this.state.token==null){
                Alert.alert('请登录后再发帖！','',[{text:'确定',onPress: () => {
                    this.props.navigation.navigate("Login", {callback:()=>{
                        this._reloadPage();
                    }})
                }, style: 'destructive'}])
            }
            else{
                fetch(basePath+"/forum/posts_create/",
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
                    if(result.detail=="当前未解决的帖子数量过多，请先标记它们为已解决或已完成"){
                        Alert.alert(
                            '您存在未解决的帖子过多，请先标记为已解决或已完成后再发布帖子',
                            '',
                            [
                                {text: '确定', onPress: ()=> {}, style: 'destructive'},
                                {text: '取消', onPress: () => {}, style: 'destructive'},
                             ]
                        )
                    }else{
                        this.props.navigation.state.params.callback();
                        this.props.navigation.goBack();
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
            }
        })
    }
    _reloadPage(){
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    
                });
            }
        });
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
                    
                } else {
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
                this.setState({show: true});
                let source = { uri: response.uri };
                var filename = response.uri.replace('file://', '');
                this._getQNToken(filename);
            }
        });
    }
    goclass(){
        this.props.navigation.navigate('ForumClass',{callback:(data)=>{
            this.setState({
                sectionpk:data.pk,
                sectionname:data.name
            })
        }});
    }
    _keyExtractor = (item, index) => index;
    render() {
        return(
            <View style={{flex:1,backgroundColor:'#ffffff'}}>
                <TextInput
                    style={{height: 80, borderColor: '#f1f1f1', borderWidth: 1,paddingLeft:20,paddingTop:5,fontSize:14,}}
                    onChangeText={(title) => this.setState({title})}
                    value={this.state.title}
                    multiline={true}
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
                    style={{height: 200, borderColor: '#f1f1f1', borderWidth: 1,paddingLeft:20,paddingTop:10,fontSize:14,paddingRight:10,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    multiline={true}
                    autoCapitalize='none'
                    textAlignVertical='top'
                    placeholder='尽情提问吧'
                    enablesReturnKeyAutomatically={true}
                    placeholderTextColor='#aaaaaa'
                />
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
            </View>
        )
    }
}


