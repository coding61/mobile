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
    DeviceEventEmitter,
    ActivityIndicator
}from 'react-native';
var {height, width} = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';
var allAndroid = require('react-native').NativeModules.RongYunRN;
import Http from '../utils/Http.js';
var basePath=Http.domain;
var content='';
export default class CommentText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            content:'',
            pk:this.props.navigation.state.params.data,
            token:'',
            text:'',
            isDisable:false,
            show:false,
            IdCard1:'',//图片
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
    componentDidMount() {
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result});
            }
        });
        this.progress();
    }
    componentWillMount(){
        if(this.props.navigation.state.params.name=='reply'){
            this.setState({
                text:'@'+this.props.navigation.state.params.userinfo,
            })
        }else{
            this.setState({
                text:''
            })
        }
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
                    this.props.navigation.state.params.callback();
                    this.props.navigation.goBack();
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
                <TouchableOpacity onPress={this.postcomment.bind(this)} disabled={this.state.isDisable} style={{width:width*0.8,marginLeft:width*0.1,height:40,borderRadius:10,alignItems:'center', justifyContent: 'center',backgroundColor: '#ff6b94',}}>
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
