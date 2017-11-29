'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  NativeModules,
  ActivityIndicator
} from 'react-native';

import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';

var RNBridgeModule = NativeModules.RNBridgeModule;

const {width, height} = Dimensions.get('window');

class PersonalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
           userinfo: this.props.navigation.state.params.data,
           diamond: this.props.navigation.state.params.data.diamond,
           token: null,
           myself: true
        }
    }
    static navigationOptions  = ({ navigation, screenProps }) => ({
        header: null,
        headerTintColor:"#fff"
    })

    componentWillMount() {
        var _this = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result != null){
                _this.setState({token: result},() => {
                    _this._whoami();
                });
            }
        });
    }
    componentDidMount() {}
    componentWillUnmount() {}

    _goBack() {
        this.props.navigation.goBack();
    }

    _whoami() {
        fetch(Http.whoami, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            },
        })
        .then((response)=>{
            if (response.ok) {
                return response.json();
            } else {
                return null;
            }
        })
        .then((responseJson)=>{
            if (responseJson) {
                if (responseJson.owner != this.state.userinfo.owner) {
                    this.setState({myself: false})
                }
            } else {
                Alert.alert('获取个人信息失败');
            }
        })
        .catch((err) => {
            Alert.alert('失败，请重试...');
		});
    }

    _refreshDiamond() {
        var type = "GET",
            url = Http.userinfo(this.state.userinfo.owner),
            token = this.state.token,
            data = null
        BCFetchRequest.fetchData(type, url, token, data,(response) => {
            if (!response) {
                Alert.alert('失败，请重试');
            };
            if (response.status == -4 || response.message) {
                Alert.alert(response.message?response.message:response.detail);
                return;
            } else {
                this.setState({diamond: response.diamond});
                return;
            }
        }, (err) => {
            console.log(err);
            Alert.alert('网络请求失败');
        });
    }

    onPress(num) {
  	     switch (num) {
            case 0: {
                this.props.navigation.navigate('MyForum', {owner: this.state.userinfo.owner,flag:'她的帖子'});
                break;
            }
            case 1: {
                var username = this.state.userinfo.owner,
                    name = this.state.userinfo.name,
                    avatar = this.state.userinfo.avatar,
                    tag = "single";
                RNBridgeModule.RNEnterChatView(username, name, tag);
                break;
            }
            case 2: {
                this.props.navigation.navigate('PersonalReward', {
                    owner: this.state.userinfo.owner,
                    callback: (msg)=>{
                        this._refreshDiamond();
                    }
                });
                break;
            }
            case 3: {
                this.props.navigation.navigate('PersonalMedal', {owner: this.state.userinfo.owner, myself: this.state.myself});
                break;
            }
  	        default:
                break
        }
    }

    render() {
        return (
            <View style={{flex: 1, backgroundColor: 'rgb(243, 243, 243)'}}>
                <View style={{position:'absolute', top:0, width:width, height:width * 485 / 750, left:0}}>
                    <Image
                        style={{width:width, height:width * 485 / 750}}
                        source={require('../images/forum_icon/bg.png')}
                        resizeMode={"cover"}
                    />
                </View>
          		<View style={{backgroundColor: 'rgba(255, 255, 255, 0)', width: width, height: width * 485 / 750, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity style={{position: 'absolute', top: 20, width: 60, height: 40, alignSelf: 'flex-start', alignItems: 'center', justifyContent: 'center'}} onPress={this._goBack.bind(this)}>
                        <Image resizeMode={'cover'} style={{width: 12, height: 20, alignSelf: 'flex-start', marginLeft: 10}} source={require('../images/forum_icon/back.png')}/>
                    </TouchableOpacity>
                    <View style={{width: width * 170 / 750, height: width * 170 / 750, marginTop: 50}}>
                        <Image resizeMode={'cover'} style={{width: width * 170 / 750, height: width * 170 / 750, borderRadius: width * 170 / 750 / 2, borderWidth: 5, borderColor: '#fff'}} source={{uri: this.state.userinfo.avatar}}/>
                    </View>
                    <Text style={{width: width - 30, color: 'white', fontSize: 18, marginTop: 20, textAlign: 'center'}} numberOfLines={1}>{this.state.userinfo.name}</Text>
                    <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 18, width: width / 2 - 30, textAlign: 'right'}}>{'段位:' + this.state.userinfo.grade.current_name}</Text>
                        <Text style={{color: 'white', fontSize: 18, marginBottom: 3, paddingLeft: 10, paddingRight: 10}}>{'  |  '}</Text>
                        <Text style={{color: 'white', fontSize: 18, width: width / 2 - 30}} numberOfLines={1}>{'钻石:' + this.state.diamond}</Text>
                    </View>
          		</View>
      			<View style={{marginTop: 20}}>
          			<TouchableOpacity onPress={this.onPress.bind(this, 0)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
          				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../images/forum_icon/forum.png')}/>
          				<Text style={{marginLeft: 15, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{!this.state.myself ? '她的帖子' : '我的帖子'}</Text>
          				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
          			</TouchableOpacity>

                    {!this.state.myself ? (
                        <TouchableOpacity onPress={this.onPress.bind(this, 1)} style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
              				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../images/forum_icon/message.png')}/>
              				<Text style={{marginLeft: 15, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'私信她'}</Text>
              				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
              			</TouchableOpacity>
                    ) : ( null )}

                    {!this.state.myself ? (
              			<TouchableOpacity onPress={this.onPress.bind(this, 2)} style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
              				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../images/forum_icon/reward.png')}/>
              				<Text style={{marginLeft: 15, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'给她打赏'}</Text>
                            <Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
              			</TouchableOpacity>
                    ) : ( null )}

          			<TouchableOpacity onPress={this.onPress.bind(this, 3)} style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
          				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../images/forum_icon/medal.png')}/>
          				<Text style={{marginLeft: 15, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{!this.state.myself ? '她的勋章' : '我的勋章'}</Text>
                        <Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
          			</TouchableOpacity>
      			</View>
            </View>
        );
    }
}




export default PersonalPage;
