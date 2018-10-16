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
  FlatList
} from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

const TextVerifyCode = "获取验证码"

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import CountryCode from '../Login/CountryCode.js';
import LoadingView from '../Component/LoadingView.js';

const {width, height} = Dimensions.get('window');
var seeImgs = [require('../assets/Login/see2.png'), require('../assets/Login/see1.png')];

export default class FindWord extends Component {
	static navigationOptions  = ({ navigation, screenProps }) => ({
		title: '找回密码',
		headerStyle: {
			backgroundColor: 'rgb(251, 109, 150)'
		},
		headerTitleStyle: {
			color: 'white',
			fontWeight: '400'
		},
		headerTintColor: "#fff"
	})
	constructor() {
		super()
		this.state = {
			phoneNum: '',       //手机号
			textCode: '',       //验证码
			password: '',       //密码
			canSee: false,      //密码是否可见

			textCodeNum:TextVerifyCode,    //获取验证码
			modalVisible: false,           //国家代码
			cityCode: '+86',               //国家代码
			loading:false
		}
	}
	componentWillUnmount() {
		this.timer && clearInterval(this.timer);
	}
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
	// ---------------------------------网络请求
	// 找回密码, 请求验证码
	fetchVerifyCodeForForgotPassword(username){
		var that = this;
		var type = "get",
	        url = Http.getPassCode(username),
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
	        	// 获取验证码成功(注册)
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
	                            clearInterval(that.timer);
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
	// 找回密码
    _fetchFindPassword(){
		var username = this.state.phoneNum;
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
		if (!this.state.testCode) {
			Utils.showMessage("验证码必填");
			return;
		}
		if (!this.state.password) {
			Utils.showMessage("密码必填");
			return;
		}
		var type = "put",
			url = Http.findPassword,
			token = null,
			data = {
				telephone:username,
				password:this.state.password,
				verification_code:this.state.testCode
			};
		BCFetchRequest.fetchData(type, url, token, data, (response) => {
			console.log(response);
			if (response.token) {
				//重置密码成功
				Utils.showMessage("请妥善保管好您的密码");
				this.props.navigation.goBack();
			}else{
				Utils.showMessage("密码修改失败");
			}
		}, (err) => {
			console.log(err);
		});
	}
	// ---------------------------------点击事件
	// 获取验证码点击事件
	getVerifyCode(){
		if(this.state.textCodeNum === TextVerifyCode){
			var username = this.state.phoneNum;
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
			this.fetchVerifyCodeForForgotPassword(username);
		}
	}
	// 密码是否可见
	see = () => {
		this.setState({
			canSee: !this.state.canSee
		})
	}
	// 修改密码
	goNext = () => {
		this._fetchFindPassword();
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
			<View style={{flex: 1, backgroundColor: 'rgb(244,245,246)'}}>
				<View style={{width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
					<Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'手机号'}</Text>
					<TouchableOpacity onPress={()=> this.setState({modalVisible: true})} style={{marginLeft: 20, width: 50, height: 25, borderColor: 'rgb(251, 110, 169)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 2}}>
						<Text style={{color: 'rgb(251, 110, 169)'}}>{this.state.cityCode}</Text>
					</TouchableOpacity>
					<TextInput
						style={styles.inputStyle}
						onChangeText={(phoneNum) => this.setState({phoneNum})}
						value={this.state.phoneNum}
						keyboardType={'numeric'}

						underlineColorAndroid={'transparent'}
						placeholder={'请输入手机号'}
						/>
				</View>
				<View style={{width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
					<Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'验证码'}</Text>
					<TextInput
						style={styles.inputStyle}
						onChangeText={(testCode) => this.setState({testCode})}
						value={this.state.testCode}

						underlineColorAndroid={'transparent'}
						placeholder={'请输入验证码'}
						/>
					<TouchableOpacity activeOpacity={this.state.textCodeNum === TextVerifyCode?0:1}onPress={this.getVerifyCode.bind(this)} style={[{position: 'absolute', top: 10, right: 15, width: 70, height: 25, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5},this.state.textCodeNum === TextVerifyCode?({borderColor: 'rgb(240, 105, 153)'}):({borderColor: 'gray'})]}>
						<Text style={[{fontSize: 11},this.state.textCodeNum === TextVerifyCode?({color: 'rgb(240, 105, 153)'}):({color: 'gray'})]}>{this.state.textCodeNum}</Text>
					</TouchableOpacity>
				</View>
				<View style={{width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
					<Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'新密码'}</Text>
					<TextInput
						style={styles.inputStyle}
						onChangeText={(password) => this.setState({password})}
						value={this.state.password}
						// maxLength={10}
						underlineColorAndroid={'transparent'}
						placeholder={'请输入新密码'}
						secureTextEntry={!this.state.canSee}
						/>
					<TouchableOpacity onPress={this.see} style={{position: 'absolute', right: 5, width: 78, height: 52, alignItems: 'center', justifyContent: 'center'}}>
						<Image source={this.state.canSee?(seeImgs[1]):(seeImgs[0])}/>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={this.goNext} style={{borderRadius: 5, marginTop: 25, marginLeft: 25, width: width - 50, height: 45, backgroundColor: 'rgb(251, 109, 150)', alignItems:'center', justifyContent: 'center'}}>
					<Text style={{color: 'white'}}>{'确认修改密码'}</Text>
				</TouchableOpacity>
				{/* <View style={{position: 'absolute', width: width, height: height, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
				<Bars size={15} color="rgb(240, 105, 153)" />
				</View> */}

				{/* 国家代码 */}
				<CountryCode 
					modalVisible={this.state.modalVisible} 
					onSelectedCity={this.onSelectedCity.bind(this)}
					hideCountryCode={this.hideCountryCode.bind(this)}
				/>
				{
      				this.state.loading?<LoadingView />:null
      			}
			</View>
		)
	}
}

const styles = StyleSheet.create({
  inputStyle: {
    marginLeft: 20,
    fontSize: 13,
    height:45,
    width: width / 2,
    fontWeight: '100',
    color: '#3e3e3e'
  }
})