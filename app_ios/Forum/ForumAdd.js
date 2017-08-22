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
}from 'react-native';
import face from './Content_Rex';
var basePath='https://www.cxy61.com/';
var {height, width} = Dimensions.get('window');
export default class ForumAdd extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pk:this.props.navigation.state.params.data.pk,
            token:this.props.navigation.state.params.token,
            text:null,
            title:null,
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
            </View>
        )
    }
}
