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
const {width, height} = Dimensions.get('window');
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import Prompt from 'react-native-prompt';
var RNBridgeModule = NativeModules.RNBridgeModule;
var qiniu = NativeModules.UpLoad;
var ImagePicker = require('react-native-image-picker');
var basePath=Http.domain;
class MyPage extends Component {
	static navigationOptions  = ({ navigation, screenProps }) => ({
    header: null
  })
  constructor() {
  	super();
  	this.state = {
  		isLogin: false,
  		name: null,
  		headImg: null,
      promptVisible: false,
      show: false
  	}
  }
  componentWillMount() {
    var _this = this;
    AsyncStorage.getItem('token', (errs, results) => {
      if (results) {
        fetch(Http.domain + '/userinfo/whoami/',{headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}})
          .then(response => {
            if (response.ok === true) {
              return response.json();
            } else {
              return '失败'; 
            }
          })
          .then(responseJSON => {
            if (responseJSON !== '失败') {
              fetch(Http.domain + '/im/user_get_token/',{headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}})
                .then(response => {
                  if (response.ok === true) {
                    return response.json();
                  } else {
                    return '失败'
                  }
                })
                .then(res => {
                  if (res !== '失败') {
                    RNBridgeModule.RNConnectRongIM(res.token, results);
                  }
                })
              _this.setState({
                isLogin: true,
                name: responseJSON.name,
                headImg: responseJSON.avatar
              })
            } else {
              Utils.showMessage('获取用户信息失败，请重新登录');
            }

          })
      }
    })
  }
  componentDidMount() {
    var _this = this;
    this.listenLogin = DeviceEventEmitter.addListener('listenLogin', (token) => {
      fetch(Http.domain + '/userinfo/whoami/',{headers: {'Authorization': 'Token ' + token, 'content-type': 'application/json'}})
        .then(response => {
          if (response.ok === true) {
            return response.json();
          } else {
            return '失败'; 
          }
        })
        .then(responseJSON => {
          if (responseJSON !== '失败') {
            fetch(Http.domain + '/im/user_get_token/',{headers: {'Authorization': 'Token ' + token, 'content-type': 'application/json'}})
              .then(response => {
                if (response.ok === true) {
                  return response.json();
                } else {
                  return '失败'
                }
              })
              .then(res => {
                if (res !== '失败') {
                  RNBridgeModule.RNConnectRongIM(res.token, results);
                }
              })
              _this.setState({
                isLogin: true,
                name: responseJSON.name,
                headImg: responseJSON.avatar
              })
          } else {
            Utils.showMessage('获取用户信息失败，请重新登录');
          }
        })
    })
    this.listenlogout = DeviceEventEmitter.addListener('logout', () => {
      _this.setState({
        isLogin: false,
        name: null,
        headImg: null
      })
    })
  }
  componentWillUnmount() {
  	this.listenLogin.remove();
  }
  Logout() {
  	AsyncStorage.removeItem('token', () => {})
    RNBridgeModule.disconnect();
  	DeviceEventEmitter.emit('logout', 'success');
  }
  onPress(num) {
  	switch (num) {
  		case 0:
  			{
          this.setState({promptVisible: true})
  				break;
  			}
  		case 1:
  			{
  				//我的对话
          RNBridgeModule.RNEnterChatListView();
  				break;
  			}
  		case 2:
  			{
  				//我的活动
          this.props.navigation.navigate("MyActivity");
  				break;
  			}
  		case 3:
  			{
  				//已完成课程
          this.props.navigation.navigate('CatalogCourse', {switch: '已完成课程'})
  				break;
  			}
  		case 4:
  			{
  				//学习中课程
          this.props.navigation.navigate('CatalogCourse', {switch: '学习中课程'})
  				break;
  			}
  		case 5:
  			{
  				Alert.alert('','确认退出登录？',
	        [{text: '取消', onPress: () => {}, style: 'cancel'},
	        {text: '确认', onPress: () => this.Logout()}
	        ],{ cancelable: false })
  				break;
  			}
  		case 6:
  			{
  				//登陆
  				this.props.navigation.navigate('Login');
  				break;
  			}
  		default: 
  			{
  				break;
  			}
  	}
  }
  _upload(filename, token, key) {
    var _this = this;
    qiniu.uploadImage(filename, token, key,(error, callBackEvents)=>{
      if(error) {

      } else {
            if (callBackEvents.url) {
              var _this = this;
              AsyncStorage.getItem('token', (errs, results) => {
                fetch(Http.domain + '/userinfo/userinfo_update/',{method: 'put', headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}, body: JSON.stringify({"avatar": callBackEvents.url})})
                  .then(response => {
                    if (response.ok === true) {
                      Utils.showMessage('修改成功');
                      _this.setState({
                        headImg: callBackEvents.url,
                        show: false
                      })
                    } else {
                      _this.setState({
                        headImg: callBackEvents.url,
                        show: false
                      })
                      Utils.showMessage('修改失败');
                    }
                  })
              })
            } else {
                this.setState({show: false});
                Utils.showMessage('上传失败,请重试');
            }
        }
    })
  }
  _getQNToken(filename) {
    var _this = this;
    var url = basePath + "/upload/token/";
    AsyncStorage.getItem('token', (errs, results) => {
      fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + results,
        },
        body: JSON.stringify({
          filename: filename,
          private: false,
        }),
      })
      .then((response)=> response.json())
      .then((responseJson) => {
          if (responseJson.token) {
            _this._upload(filename, responseJson.token, responseJson.key);
          } else {
            _this.setState({show: false});
            Utils.showMessage("获取令牌失败，请重新选择上传");
          }
      })
      .catch((error) => {console.log(error)})
    })
  }
  updateavatar() {
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
        var source = { uri: response.uri };
        var filename = response.uri.replace('file://', '');
        this._getQNToken(filename);
        this.setState({show: true});
      }
    });
  }
  updatename(name) {
    var _this = this;
    this.setState({
      promptVisible: false,
      message: ''
    })
    AsyncStorage.getItem('token', (errs, results) => {
      fetch(Http.domain + '/userinfo/userinfo_update/',{method: 'put', headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}, body: JSON.stringify({"name": name})})
        .then(response => {
          if (response.ok === true) {
            Utils.showMessage('修改成功');
            _this.setState({
              name: name
            })
          } else {
            Utils.showMessage('修改失败');
          }
        })
      })
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(243, 243, 243)'}}>
      	<ScrollView>
      		{this.state.isLogin === true?(
      			<View style={{backgroundColor: 'rgb(250, 80, 131)', width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity onPress={this.updateavatar.bind(this)} style={{width: height / 9, height: height / 9}}>
	      			  <Image resizeMode={'contain'} style={{width: height / 9, height: height / 9}} source={{uri: this.state.headImg}}/>
              </TouchableOpacity>
	      				<Text style={{color: 'white', fontSize: 18, marginTop: 20}}>{this.state.name}</Text>
      			</View>
      			):(
      			<View style={{backgroundColor: 'rgb(253, 109, 149)', width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
	      			<Image resizeMode={'contain'} style={{width: height / 9, height: height / 9}} source={require('../assets/Login/head1.png')}/>
	      			<TouchableOpacity onPress={this.onPress.bind(this, 6)}>
	      				<Text style={{color: 'white', fontSize: 18, marginTop: 20}}>{'未登录/去登录'}</Text>
	      			</TouchableOpacity>
      			</View>
      			)}
      		{this.state.isLogin === true?(
      			<View style={{marginTop: 20}}>
	      			<TouchableOpacity onPress={this.onPress.bind(this, 0)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/alter.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'修改昵称'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>
	      			<TouchableOpacity onPress={this.onPress.bind(this, 1)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/message.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'我的对话'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>
	      			<TouchableOpacity onPress={this.onPress.bind(this, 2)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/exercise.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'我的活动'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>

	      			<TouchableOpacity onPress={this.onPress.bind(this, 3)} style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/hadStudy.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'已完成课程'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>
	      			<TouchableOpacity onPress={this.onPress.bind(this, 4)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/finishStudy.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'学习中课程'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>

	      			<TouchableOpacity onPress={this.onPress.bind(this, 5)} style={{marginTop: 20, flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/logout.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'退出登录'}</Text>
	      			</TouchableOpacity>
      			</View>
      			):(null)}
      	</ScrollView>
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
        <Prompt
          title="修改昵称"
          placeholder={'昵称'}
          defaultValue={this.state.name}
          visible={ this.state.promptVisible }
          onCancel={ () => this.setState({
            promptVisible: false,
            message: 'You cancelled'
          }) }
          onSubmit={ (value) => {if (value === '') {
            Utils.showMessage('昵称不能为空！');
          } else {
            this.updatename(value);
          }} }/>
      </View>
    );
  }
}




export default MyPage;