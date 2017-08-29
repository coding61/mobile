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
  Button,
  ActivityIndicator,
}from 'react-native';
var basePath='https://www.cxy61.com/';
var {height, width} = Dimensions.get('window');
var allAndroid = require('react-native').NativeModules.RongYunRN;
//var imgArr='';
var content='';
export default class ForumAdd extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pk:this.props.navigation.state.params.data.pk,
            token:this.props.navigation.state.params.token,
            text:null,
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
            headerTitleStyle:{alignSelf:'auto',fontSize:14,paddingLeft:width*0.23},
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
    componentDidMount() {
        this.progress();
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
                show:false,
                text:content,
                
            })
        });
        //开始
        this.listenerProgressc = DeviceEventEmitter.addListener("uploadStrat_listener", function(params) {
                this_.setState({
                    show:true,
            })
        })
    }
    qiniu(){
        allAndroid.rnQiniu(this.state.token,false,"gallery");
        //allAndroid.rnCancelUp();
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
                    placeholderTextColor='#aaaaaa'
                />
                <TextInput
                    style={{height: 280, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,paddingTop:10,paddingRight:10,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    multiline={true}
                    textAlignVertical='top'
                    underlineColorAndroid="transparent"
                    placeholder='尽情提问吧'
                    placeholderTextColor='#aaaaaa'
                />
                <View style={{flexDirection:'row',alignItems:'center',width:width,height:40,position:'absolute',bottom:30,left:width*0.8,}}>
                    <TouchableOpacity onPress={this.qiniu.bind(this)}
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
