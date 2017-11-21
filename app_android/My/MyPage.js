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
var RnTest = NativeModules.RongYunRN;
var allAndroid = NativeModules.RongYunRN;
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
      show: false,
      balance: null
  	}
  }

  componentWillMount() {
    this.progress();
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
              _this.setState({
                balance: responseJSON.balance
              })
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
                    // RnTest.rnIMConnect(res.token, results, function() {
                    // });
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
    this.listenphoto = DeviceEventEmitter.addListener("forumadd",(photo)=>{
      if(photo=='photo'){
        this.listenerProgressaa.remove();
    this.listenerProgressbb.remove();
    this.listenerProgresscc.remove();
       /* DeviceEventEmitter.removeListener('uploadProgress_listener')
        DeviceEventEmitter.removeListener('uploadSuccess_listener')
        DeviceEventEmitter.removeListener('uploadStrat_listener')*/
      }
    })
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
            _this.setState({
              balance: responseJSON.balance
            })
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
                  // RnTest.rnIMConnect(res.token, token, function() {

                  // });
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
     this.listenphoto.remove();
    this.listenerProgressaa.remove();
    this.listenerProgressbb.remove();
    this.listenerProgresscc.remove();
  }
  Logout() {
  	AsyncStorage.removeItem('token', () => {})
    RnTest.rnIMDisconnect();
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
          RnTest.rnIMStart();
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
      case 8:
      {
        this.props.navigation.navigate('ExchangeRecord', {balance: this.state.balance});
        break;
      }
  		default: 
  			{
  				break;
  			}
  	}
  }
  progress(){
    var this_=this;
    //进度


    this.listenerProgressaa = DeviceEventEmitter.addListener("uploadProgress_listener", function(params) {
        
    })
    //完成
    this.listenerProgressbb = DeviceEventEmitter.addListener("uploadSuccess_listener", function(params) {
      AsyncStorage.getItem('token', (errs, results) => {
        fetch(Http.domain + '/userinfo/userinfo_update/',{method: 'put', headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}, body: JSON.stringify({"avatar": params.imageurl})})
          .then(response => {
            if (response.ok === true) {
              Utils.showMessage('修改成功');
              this_.setState({
                headImg: params.imageurl,
                show: false
              })
            } else {
              this_.setState({
                headImg: params.imageurl,
                show: false
              })
              Utils.showMessage('修改失败');
            }
          })
      })
      this_.setState({
        show:false,
      })
    });
    //开始
    this.listenerProgresscc = DeviceEventEmitter.addListener("uploadStrat_listener", function(params) {
      this_.setState({
        show:true,
      })
    })
  }
  qiniu(){
    AsyncStorage.getItem('token', (errs, results) => {
      allAndroid.rnQiniu(results,false,"gallery"); 

    })
    
  }
  updateavatar() {
    this.qiniu();
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
      			<View style={{width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={require('../assets/My/group.png')} style={{width: width, height: height / 3, position: 'absolute', left: 0, top: 0}}/>
              <TouchableOpacity onPress={this.updateavatar.bind(this)} style={{width: height / 9, height: height / 9}}>
	      			  <Image resizeMode={'cover'} style={{width: height / 9, height: height / 9, borderRadius:height/18}} source={{uri: this.state.headImg}}/>
              </TouchableOpacity>
	      				<Text style={{color: 'white', fontSize: 18, marginTop: 20}}>{this.state.name}</Text>
      			</View>
      			):(
      			<View style={{width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require('../assets/My/group.png')} style={{width: width, height: height / 3, position: 'absolute', left: 0, top: 0}}/>
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
              {/*
	      			<TouchableOpacity onPress={this.onPress.bind(this, 1)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/message.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'我的对话'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>
              */}
	      			<TouchableOpacity onPress={this.onPress.bind(this, 2)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
	      				<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/exercise.png')}/>
	      				<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'我的活动'}</Text>
	      				<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
	      			</TouchableOpacity>
              <TouchableOpacity onPress={this.onPress.bind(this, 8)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
                <Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/reward.png')}/>
                <Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'奖学金记录'}</Text>
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