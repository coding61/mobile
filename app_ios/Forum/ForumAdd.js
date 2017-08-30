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
  ActivityIndicator,
}from 'react-native';
import face from './Content_Rex';
var basePath='https://www.cxy61.com/';
var {height, width} = Dimensions.get('window');
var ImagePicker = require('react-native-image-picker');
var qiniu = require('react-native').NativeModules.UpLoad;
var content='';
export default class ForumAdd extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pk:this.props.navigation.state.params.data.pk,
            token:this.props.navigation.state.params.token,
            text:'',
            title:null,
            show:false,
            IdCard1:'',//图片
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
    componentDidMount() {
        this.eventEm = DeviceEventEmitter.addListener('publish', (value)=>{
            var data = {};
            data.section = this.state.pk;
            data.title=this.state.title;
            data.types =2;
            data.content=this.state.text;
            fetch(basePath+"program_girl/forum/posts_create/",
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
        })
    }
    componentWillUpdate(){

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
        var url = basePath + "program_girl/upload/token/";
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
            allowsEditing:true,
            noData:false,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        //console.log(ImagePicker.showImagePicker)
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
                <TextInput
                    style={{height: 170, borderColor: '#f1f1f1', borderWidth: 1,paddingLeft:20,paddingTop:10,fontSize:14,paddingRight:10,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    multiline={true}
                    autoCapitalize='none'
                    textAlignVertical='top'
                    placeholder='尽情提问吧'
                    enablesReturnKeyAutomatically={true}
                    placeholderTextColor='#aaaaaa'
                />
                <View style={{flexDirection:'row',alignItems:'center',width:width,height:40,position:'absolute',bottom:30,left:width*0.8,}}>
                    <TouchableOpacity onPress={this._changeIcon.bind(this)}
                        style={{width:60,height:36,backgroundColor:'#ff6b94',alignItems:'center',justifyContent:'center',borderRadius:5,}}>
                        <Text style={{color:'#ffffff',fontSize:14,}}>图片</Text>
                    </TouchableOpacity>
                </View>

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
