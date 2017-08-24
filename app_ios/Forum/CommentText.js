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
}from 'react-native';
var {height, width} = Dimensions.get('window');
var basePath='https://www.cxy61.com/';
export default class CommentText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            content:'',
            pk:this.props.navigation.state.params.data,
            token:'',
            isDisable:false,
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
        data.content=this.state.content;
        fetch(basePath+"program_girl/forum/replies_create/",
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
    Comment(){
        var data = {};
        data.replies = this.state.pk;
        data.content=this.state.content;
        fetch(basePath+"program_girl/forum/replymore_create/",
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
    render() {
        return (
            <View style={{flex: 1,backgroundColor: '#ffffff',}}>
               <TextInput
                    style={{width:width*0.9,height: 150, borderColor: '#f1f1f1',paddingTop:10,fontSize:14, borderWidth: 1,paddingLeft:20,marginTop:20,marginBottom:20,marginLeft:width*0.05,}}
                    onChangeText={(content) => this.setState({content})}
                    value={this.state.content}
                    placeholder='输入评论内容'
                    multiline={true}
                    autoCapitalize='none'
                    enablesReturnKeyAutomatically={true}
                    textAlignVertical='top'
                    keyboardType='default'
                    placeholderTextColor='#aaaaaa'
                />
                <TouchableOpacity onPress={this.postcomment.bind(this)} disabled={this.state.isDisable} style={{width:width*0.8,marginLeft:width*0.1,height:40,borderRadius:10,alignItems:'center', justifyContent: 'center',backgroundColor: '#ff6b94',}}>
                    <Text style={{color:'#ffffff',fontSize:16,}}>提交评论</Text>
                </TouchableOpacity>
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
