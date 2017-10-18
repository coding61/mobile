'use strict';
//253 109 149
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
  DeviceEventEmitter
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Http from '../utils/Http.js';
class MyPage extends Component {
	static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '',
    header: null
  })
  constructor() {
  	super();
  	this.state = {
  		isLogin: false,
  		name: null,
  		headImg: null
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
  						alert('获取用户信息失败，请重新登录'); 
  					}
  				})
  				.then(responseJSON => {
  					_this.setState({
  						isLogin: true,
  						name: responseJSON.name,
  						headImg: responseJSON.avatar
  					})
  				})
  		}
  	})
  }
  componentDidMount() {
  	var _this =this;
  	this.listenLogin = DeviceEventEmitter.addListener('listenLogin', (token) => {
  		fetch(Http.domain + '/userinfo/whoami/',{headers: {'Authorization': 'Token ' + token, 'content-type': 'application/json'}})
				.then(response => {
					if (response.ok === true) {
						return response.json();
					} else {
						alert('获取用户信息失败，请重新登录'); 
					}
				})
				.then(responseJSON => {
					_this.setState({
						isLogin: true,
						name: responseJSON.name,
						headImg: responseJSON.avatar
					})
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
  	DeviceEventEmitter.emit('logout', 'success');
  }
  onPress(num) {
  	switch (num) {
  		case 0:
  			{
  				//修改昵称
  				break;
  			}
  		case 1:
  			{
  				//我的对话
  				break;
  			}
  		case 2:
  			{
  				//我的活动
  				break;
  			}
  		case 3:
  			{
  				//已完成课程
  				break;
  			}
  		case 4:
  			{
  				//学习中课程
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
  render() {
    return (
      <View style={{flex: 1}}>
      	<ScrollView>
      		{this.state.isLogin === true?(
      			<View style={{backgroundColor: 'rgb(253, 109, 149)', width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
	      			<Image resizeMode={'contain'} style={{width: height / 9, height: height / 9}} source={{uri: this.state.headImg}}/>
	      				<Text style={{color: 'white', fontSize: 18, marginTop: 20}}>{this.state.name}</Text>
      			</View>
      			):(
      			<View style={{backgroundColor: 'rgb(253, 109, 149)', width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
	      			<Image resizeMode={'contain'} style={{width: height / 9, height: height / 9}} source={require('../assets/Login/head1.png')}/>
	      			<TouchableOpacity onPress={this.onPress.bind(this, 6)}>
	      				<Text style={{color: 'white', fontSize: 18, marginTop: 20}}>{'未登录/去登陆'}</Text>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({

});


export default MyPage;