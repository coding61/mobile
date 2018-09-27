'use strict';
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  AsyncStorage,
  Alert,
  Modal,
  FlatList,
  DeviceEventEmitter
} from 'react-native';

const TextVerifyCode = "获取验证码"

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import CountryCode from '../Login/CountryCode.js';
import LoadingView from '../Component/LoadingView.js';

const {width, height} = Dimensions.get('window');

export default class Login extends Component {
  	static navigationOptions = {
    	headerStyle: {
			backgroundColor: 'rgb(251, 110, 169)',
			borderBottomColor:'rgb(251, 110, 169)',
			borderBottomWidth:1
    	},
    	headerTintColor: "#fff"
  	}
	constructor() {
		super();
		this.state = {
			inviteUsername: '',       //账号(邀请码)
			invitePassword:'',        //密码(邀请码)
			verifyUsername:'',        //账号(验证码)
			verifyPassword:'',        //密码(验证码)
			phoneUsername:'',         //账号(密码方式)
			phonePassword:'',         //密码(密码方式)

			textCodeNum:TextVerifyCode,
			loginWay: 'verifyCode',    //登录方式,verifyCode(验证码)，password(密码)，inviteCode(邀请码))
			modalVisible: false,
			cityCode: '+86'
		}
	}

	componentWillUnmount() {
		if (typeof(this.props.navigation.state.params) !== 'undefined') {
			if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
				this.props.navigation.state.params.callback(); 
			}
		}
	}
	// --------------------------------网络请求
	showLoading(){
		this.setState({
			loading:true
		})
	}
	hideLoading(isError, callback){
		var that = this;
		if (isError === true) {
			// 出现异常隐藏
			that.setState({
	    		loading:false
	    	}, ()=>{
	    		if (callback) {
	    			callback();
	    		}
	    	})
		}else{
	  		that.setState({
	    		loading:false
	    	}, ()=>{
	    		if (callback) {
	    			callback();
	    		}
	    	})
	  	}
	}
	// 登录
	fetchLogin(username, password){
		var that = this;
		var loginWay = this.state.loginWay;
		var dic = {};
		var requestUrl = '';
		if(loginWay == "verifyCode"){
			// 验证码登录
			dic = {
				telephone: username,
				verification_code: password,
			};
			requestUrl = Http.loginVerify;
		}else if(loginWay == "password"){
			// 密码登录
			dic = {
				telephone: username,
				password: password,
			};
			requestUrl = Http.loginPassword;
		}else if(loginWay == "inviteCode"){
			// 邀请码登录
			dic = {
				code: username,
				password: password,
			};
			requestUrl = Http.loginInvite;
		}

		var type = "post",
			url = requestUrl,
			token = null,
			data = dic;
		BCFetchRequest.fetchData(type, url, token, data, (response) => {
			if (response === 500) {
				Utils.showMessage("服务器开小差了");
				that.hideLoading(true);
			}else if(response.status === -4){
				Utils.showMessage(response.detail || response.message);
				that.hideLoading(true);
			}else{
				if(response.token){
					Utils.setValue("token", response.token, ()=>{
						// 登录成功
						that.hideLoading();
						DeviceEventEmitter.emit('listenLogin', response.token);
						DeviceEventEmitter.emit('login', 'success');
						that.props.navigation.goBack();
					});
				}else{
					Utils.showMessage("登录失败，请重新登录");
					that.hideLoading(true);
				}
			}
		}, (err) => {
			// Utils.showMessage("网络异常");
			that.hideLoading(true);
		});
	}
	// 验证码登录, 请求验证码
	fetchVerifyCodeForVerifyLogin(username){
		var that = this;
		var type = "get",
	        url = Http.getVerifyForLogin(username),
	        token = null,
	        data = null;
	    BCFetchRequest.fetchData(type, url, token, data, (response) => {
	        console.log(response);
	        if (response === 500) {
				Utils.showMessage("服务器开小差了");
				that.hideLoading(true);
	        }else if(response.status === -4){
				Utils.showMessage(response.message || response.detail);
				that.hideLoading(true);
	        }else{
	        	// 获取验证码成功(验证码登录)
	        	if (response.status == 0) {
					that.hideLoading();
	        		Utils.showMessage('验证码已发');
	        		var time = 60;
	                that.timer = setInterval(function() {
	                    --time;
	                    if (time > 0) {
	                        that.setState({
	                            textCodeNum:time + "s"
	                        })
	                    }else{
	                        that.setState({
	                            textCodeNum:TextVerifyCode
	                        }, ()=>{
	                            clearInterval(that.setTime);
	                        })
	                    }
	                  }, 1000);
	        	}else{
					Utils.showMessage("失败");
					that.hideLoading(true);
	        	}
	        }
	    }, (err) => {
			console.log(2);
			that.hideLoading(true);
	    });
	}
	// 释放键盘
	_cancelkeyboard() {
		Keyboard.dismiss();
	}
	// 登录
	login(){
		var loginWay = this.state.loginWay;
		var username = '',
			password = '';
		var usernameMsg = '',
			passwordMsg = '';
		if(loginWay == "verifyCode"){
			// 验证码登录
			username = this.state.verifyUsername;
			password = this.state.verifyPassword;
			usernameMsg = "请输入手机号";
			passwordMsg = "请输入验证码";
		}else if(loginWay == "password"){
			// 密码登录
			username = this.state.phoneUsername;
			password = this.state.phonePassword;
			usernameMsg = "请输入手机号";
			passwordMsg = "请输入密码";
		}else if(loginWay == "inviteCode"){
			// 邀请码登录
			username = this.state.inviteUsername;
			password = this.state.invitePassword;
			usernameMsg = "请输入邀请码";
			passwordMsg = "请输入密码";
		}
		if(username == ""){
			Utils.showMessage(usernameMsg);
			return
		}
		if(password == ""){
			Utils.showMessage(passwordMsg);
			return
		}
		
		// 手机转义
		if(loginWay == "verifyCode" || loginWay == "password"){
			// 验证码登录  密码登录
			if(this.state.cityCode !== "+86"){
				// 转义
				username = encodeURI(that.state.cityCode + username).replace(/\+/g,'%2B');
			}
		}
		// 调接口进行登录
		this.showLoading();
		this.fetchLogin(username, password);
	}
	// 获取验证码
	getVerifyCode(){
		if(this.state.textCodeNum === TextVerifyCode){
			var username = this.state.verifyUsername;
			if (username === "") {
				Utils.showMessage("请输入手机号");
				return
			}
			// post 请求不用转码, get 请求需要转码  +31(国外代码需要转码)
			if (this.state.cityCode === '+86') { 
			}else{
				// username = encodeURI(this.state.cityCode + this.state.username).replace(/\+/g,'%2B');
				username = encodeURI(this.state.cityCode + username).replace(/\+/g,'%2B');
			}
			this.showLoading();
			this.fetchVerifyCodeForVerifyLogin(username);
		}
	}
	// tab 选项点击事件
	tabClickEvent(i){
		if(i == 0){
			this.setState({
				loginWay:'verifyCode',
				verifyUsername:'',
				verifyPassword:''
			})
		}else if(i == 1){
			this.setState({
				loginWay:'password',
				phoneUsername:'',
				phonePassword:''
			})
		}else if (i == 2) {
			this.setState({
				loginWay:'inviteCode',
				inviteUsername:'',
				invitePassword:''
			})
		}
	}
	// 国家代码方法
	onSelectedCity(code) {
        this.setState({
            cityCode: code,
            modalVisible: false
        })
    }
    hideCountryCode(){
    	this.setState({
    		modalVisible:false
    	})
    }
	render() {
		return (
			<TouchableOpacity onPress={this._cancelkeyboard.bind(this)} activeOpacity={1} style={{flex: 1, backgroundColor:'rgb(251, 110, 169)'}}>
				{/* tab 选项 */}
				<View style={{height:40, flexDirection:"row"}}>
					<TouchableOpacity onPress={this.tabClickEvent.bind(this, 0)} activeOpacity={1} style={LoginStyle.tab}>
						<Text style={[LoginStyle.tabText, this.state.loginWay == 'verifyCode'?LoginStyle.tabSelect:LoginStyle.tabUnselect]}>验证码登录</Text>
						{this.state.loginWay == 'verifyCode'?<View style={{width:30, borderBottomColor:'white', borderBottomWidth:2}}></View>:null}
					</TouchableOpacity>
					<TouchableOpacity onPress={this.tabClickEvent.bind(this, 1)} activeOpacity={1} style={LoginStyle.tab}>
						<Text style={[LoginStyle.tabText, this.state.loginWay == 'password'?LoginStyle.tabSelect:LoginStyle.tabUnselect]}>密码登录</Text>
						{this.state.loginWay == 'password'?<View style={{width:30, borderBottomColor:'white', borderBottomWidth:2}}></View>:null}
					</TouchableOpacity>
					<TouchableOpacity onPress={this.tabClickEvent.bind(this, 2)} activeOpacity={1} style={LoginStyle.tab}>
						<Text style={[LoginStyle.tabText, this.state.loginWay == 'inviteCode'?LoginStyle.tabSelect:LoginStyle.tabUnselect]}>邀请码登录</Text>
						{this.state.loginWay == 'inviteCode'?<View style={{width:30, borderBottomColor:'white', borderBottomWidth:2}}></View>:null}
					</TouchableOpacity>
				</View>

				{/* logo */}
				<View style={{marginTop:20, alignItems:'center', justifyContent:'center'}}>
					<Image style={{width: width / 2 + 2, height: 119 * width / 767}} source={require('../assets/Login/chengxuyuanjihua.png')} />
				</View>

				<View style={{flex:1, flexDirection:"column", alignItems:'center', justifyContent:'space-around'}}>
					{/* 输入框 */}
					{
						this.state.loginWay == "verifyCode"?
							<View>
								<View style={LoginStyle.leftinputViewStyle}>
									<Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'手机号'}</Text>
									<View style={{flexDirection:'row', width: width * 2 / 3, paddingBottom:7, paddingTop:10, marginLeft: 5, borderBottomWidth: 1,borderBottomColor: 'white'}}>
										<TouchableOpacity onPress={()=> this.setState({modalVisible: true})} style={{paddingHorizontal:8, height: 25, backgroundColor: 'white', borderRadius: 2, alignItems: 'center', justifyContent: 'center'}}>
											<Text style={{color: 'rgb(251, 110, 169)', textAlign: 'center'}}>{this.state.cityCode}</Text>
										</TouchableOpacity>
										<TextInput
											style={{flex:1, marginLeft:5, color:'white'}}
											onChangeText={(verifyUsername) => this.setState({verifyUsername:verifyUsername})}
											value={this.state.verifyUsername}
											keyboardType={'numeric'}
										/>
									</View>
								</View>
								<View style={LoginStyle.leftinputViewStyle}>
									<Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'验证码'}</Text>
									<View style={{flexDirection:'row', width: width * 2 / 3, paddingBottom:7, paddingTop:7, marginLeft: 5, borderBottomWidth: 1,borderBottomColor: 'white'}}>
										<TextInput
											style={{flex:1, marginRight:5, color:'white'}}
											onChangeText={(verifyPassword) => this.setState({verifyPassword:verifyPassword})}
											value={this.state.verifyPassword}
											keyboardType={'numeric'}
										/>
										<TouchableOpacity onPress={this.getVerifyCode.bind(this)} activeOpacity={this.state.textCodeNum === TextVerifyCode?0:1} style={{paddingHorizontal:8, paddingVertical:5, borderRadius:13, borderColor:'white', borderWidth:1}}>
											<Text style={{fontSize:13, color:'white'}}>{this.state.textCodeNum}</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						:   this.state.loginWay == "password"?
							<View>
								<View style={LoginStyle.leftinputViewStyle}>
									<Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'手机号'}</Text>
									<View style={{flexDirection:'row', width: width * 2 / 3, paddingBottom:7, paddingTop:10, marginLeft: 5, borderBottomWidth: 1,borderBottomColor: 'white'}}>
										<TouchableOpacity onPress={()=> this.setState({modalVisible: true})} style={{paddingHorizontal:8, height: 25, backgroundColor: 'white', borderRadius: 2, alignItems: 'center', justifyContent: 'center'}}>
											<Text style={{color: 'rgb(251, 110, 169)', textAlign: 'center'}}>{this.state.cityCode}</Text>
										</TouchableOpacity>
										<TextInput
											style={{flex:1, marginLeft:5, color:'white'}}
											onChangeText={(phoneUsername) => this.setState({phoneUsername:phoneUsername})}
											value={this.state.phoneUsername}
											keyboardType={'numeric'}
										/>
									</View>
								</View>
								<View style={LoginStyle.leftinputViewStyle}>
									<Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'密    码'}</Text>
									<View style={{flexDirection:'row', width: width * 2 / 3, paddingBottom:7, paddingTop:7, marginLeft: 5, borderBottomWidth: 1,borderBottomColor: 'white'}}>
										<TextInput
											style={{flex:1, color:'white'}}
											onChangeText={(phonePassword) => this.setState({phonePassword:phonePassword})}
											value={this.state.phonePassword}
											secureTextEntry={true}
										/>
									</View>
								</View>
							</View>
						:
							<View>
								<View style={LoginStyle.inputViewStyle}>
									<Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'邀请码'}</Text>
									<TextInput
										style={LoginStyle.inputStyle}
										onChangeText={(inviteUsername) => this.setState({inviteUsername:inviteUsername})}
										value={this.state.inviteUsername}
										keyboardType={'numeric'}
									/>
								</View>
								<View style={LoginStyle.inputViewStyle}>
									<Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'密    码'}</Text>
									<TextInput
										style={LoginStyle.inputStyle}
										onChangeText={(invitePassword) => this.setState({invitePassword:invitePassword})}
										value={this.state.invitePassword}
										keyboardType={'numeric'}
										secureTextEntry={true}
									/>
								</View>
							</View>
					}
					{/* 登录 */}
					<TouchableOpacity onPress={this.login.bind(this)} style={LoginStyle.loginBtn}>
						<Text style={LoginStyle.loginBtnText}>{'登录'}</Text>
					</TouchableOpacity>

					{/* 底部提示文字 */}
					{
						this.state.loginWay == "verifyCode"?
							<Text style={LoginStyle.promptText}>{'提示：未注册手机号验证码登录后自动注册'}</Text>
						:	this.state.loginWay == "password"?
							<View style={{flexDirection: 'row', width: 2 * width / 3, height: 50, alignItems: 'center', justifyContent: 'space-between'}}>
								<TouchableOpacity onPress={()=> this.props.navigation.navigate('FindWord')}>
									<Text style={{fontSize: 13, color: 'white'}}>{'忘记密码？'}</Text>
								</TouchableOpacity>
								<Text>{''}</Text>
								<TouchableOpacity onPress={()=> this.props.navigation.navigate('Register')}>
									<Text style={{fontSize: 13, color: 'white'}}>{'注册'}</Text>
								</TouchableOpacity>
							</View>
						:
							<Text style={LoginStyle.promptText}>{'邀请码仅限内测时通过微信公众号分发的邀请码，新用户请用手机号登录。'}</Text>
					}
				</View>
				{/* 国家代码 */}
				<CountryCode 
					modalVisible={this.state.modalVisible} 
					onSelectedCity={this.onSelectedCity.bind(this)}
					hideCountryCode={this.hideCountryCode.bind(this)}
				/>
				{
      				this.state.loading?<LoadingView />:null
      			}
			</TouchableOpacity>
		)
	}
}

const LoginStyle = StyleSheet.create({
	// tab 选项卡
	tab:{
		flex:1, 
		justifyContent:'center', 
		alignItems:'center'
	},
	tabText:{
		color:'white', 
		marginBottom:10,
		fontSize:16
	},
	tabSelect:{
		opacity:1,
		fontWeight:"bold",
	},
	tabUnselect:{
		opacity:0.7
	},

	// 底部提示文字
	promptText: {
		width: 2 * width / 3,
		color: 'white',
		lineHeight: 20,
		fontSize:14
	},
	// 登录按钮
	loginBtn: {
		width: 2 * width / 3,
		height: width / 9,
		backgroundColor: 'white',
		borderRadius: 3,
		marginTop: 50, 
		alignItems: 'center',
		justifyContent: 'center'
	},
	loginBtnText: {
		color: 'rgb(248, 74, 135)',
		fontSize: 16,
		fontWeight: 'bold'
	},
	// 密码方式输入框
	leftinputViewStyle: {
		width: 2 * width / 3,
		marginTop:15
	},
	leftinput: {
		textAlign: 'center',
		fontSize: 15,
		marginLeft: 5,
		height:40,
		width: width * 2 / 3,
		borderBottomWidth: 1,
		borderBottomColor: 'white',
		color: 'white'
	},
	// 邀请码方式输入框
	inputViewStyle: {
		width: 2 * width / 3,
		height: width / 9,
		flexDirection: 'row',
		alignItems: 'center',
		marginTop:15
	},
	inputStyle: {
		textAlign: 'center',
		fontSize: 15,
		marginLeft: 5,
		height:40,
		width: width / 2,
		borderBottomWidth: 1,
		borderBottomColor: 'white',
		color: 'white'
	}
})
