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
  
}from 'react-native';
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
            headerTitleStyle:{alignSelf:'auto',fontSize:14,paddingLeft:width*0.23},
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:30,}}>
                    <TouchableOpacity style={{marginRight:10,}} onPress={()=>{
                        DeviceEventEmitter.emit('publish', "1")
                    }}>
                        <Text style={{color:'#CFCFCF'}}>发布</Text>
                    </TouchableOpacity>
                </View>
                )
        };
    }

    componentWillUnmount(){
        //this.eventEm.remove();
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
                this.props.navigation.state.params.callback();
                this.props.navigation.goBack();
            })
            .catch((error) => {
                console.error(error);
            })
        })
    }

    render() {
        return(
            <View style={{flex:1,backgroundColor:'#ffffff'}}>
                <TextInput
                    style={{height: 40, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,}}
                    onChangeText={(title) => this.setState({title})}
                    value={this.state.title}
                    multiline={true}
                    underlineColorAndroid="transparent"
                    placeholder='标题'
                    placeholderTextColor='#aaaaaa'
                />
                <TextInput
                    style={{height: 100, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,paddingTop:10,paddingRight:10,}}
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                    multiline={true}
                    textAlignVertical='top'
                    underlineColorAndroid="transparent"
                    placeholder='尽情提问吧'
                    placeholderTextColor='#aaaaaa'
                />
                
            </View>
        )
    }
}
