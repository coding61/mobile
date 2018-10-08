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

import AlertView from '../Component/AlertView.js';
import LoadingView from '../Component/LoadingView.js';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

var RnTest = NativeModules.RongYunRN;
var allAndroid = NativeModules.RongYunRN;

class MyPage extends Component {
	static navigationOptions  = ({ navigation, screenProps }) => ({
		header: null
	})
	constructor() {
		super();
		this.state = {
			isLogin: false,
			name: null,                     //昵称
			headImg: null,                  //头像
			owner: null,
			balance: null,

			nickname:"",                                       //修改昵称输入框的值
			showAlertView:false,                               //是否打开修改昵称弹框

			loading:false,                                     //加载动画
			loadingText:"加载中",                               //加载动画上的文字
		}
	}
	componentWillMount() {
		this.fetchWhoamI();
	}
	componentDidMount() {
		this._progressUpload();

		this.listenphoto = DeviceEventEmitter.addListener("forumadd",(photo)=>{
			if(photo=='photo'){
			  	this.listenerProgressaa.remove();
		  		this.listenerProgressbb.remove();
		  		this.listenerProgresscc.remove();
			}
		})

		this.listenLogin = DeviceEventEmitter.addListener('listenLogin', (token) => {
			this.fetchWhoamI();
		})

		this.listenlogout = DeviceEventEmitter.addListener('logout', () => {
			this.setState({
				isLogin: false,
				name: null,
				headImg: null,
				owner: null
			})
		})
	}
	componentWillUnmount() {
		this.listenLogin.remove();
		this.listenlogout.remove();

		this.listenphoto.remove();
		this.listenerProgressaa.remove();
		this.listenerProgressbb.remove();
		this.listenerProgresscc.remove();
	}
	hideLoading(){
		this.setState({
			loading:false
		})
	}
	// --------————-------------------------网络请求
  	// 获取个人信息
	fetchWhoamI(){
		var that = this;
		Utils.isLogin((token)=>{
			if (token) {
				var type = "get",
					url = Http.whoami,
					token = token,
					data = null;
				BCFetchRequest.fetchData(type, url, token, data, (response) => {
					console.log(response);
					that.setState({
						balance: response.balance,
						isLogin: true,
						name: response.name,
						headImg: response.avatar,
						owner: response.owner
					})
				}, (err) => {
					console.log(2);
				});
			}
		})
	}
	// 修改个人信息
    _fetchUpdateInfo(type, nickname, avatar){
		var that = this;
        var dic = {};
        if (type == "nickname") {
            dic["name"] = nickname
        }else if (type == "avatar") {
            dic["avatar"] = avatar
        }
        Utils.isLogin((token)=>{
            if (token) {
                var type = "put",
                    url = Http.updateUserInfo,
                    token = token,
                    data = dic;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
					console.log(response);
					if(response){
						if(type == "nickname"){
							that.setState({
								isLogin:true,
								name: response.name,
							})
						}else{
							that.setState({
								isLogin:true,
								headImg: response.avatar,
							})
						}
						that.hideLoading();
						Utils.showMessage("修改成功");
						// 刷新融云用户信息
						var userInfo = response;
						if (userInfo.owner) {
							var userId = userInfo.owner,
								name = userInfo.name?userInfo.name:"匿名用户",
								avatar = userInfo.avatar?userInfo.avatar:"https://static1.bcjiaoyu.com/avatar1.png";
							RnTest.reIMFreshUserInfo(userId, name, avatar);
						}
					}
                }, (err) => {
                    that.hideLoading();
                    Utils.showMessage("网络异常");
                    console.log(2);
                });
            }
        })
	}
	// 获取七牛上传 token
    _fetchQiniuToken(filename){
		var that = this;
        Utils.isLogin((token)=>{
            if (token) {
                var type = "post",
                    url = Http.getQiniuToken,
                    token = token,
                    data = {
                        filename:filename,
                        private:false
                    };
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response.token) {
                        // 开始上传图片到七牛
                        that._uploadAvatarToQiniu(filename, response.token, response.key);
                    }else{
                        // 有动画，在此失败时关闭
                        that.hideLoading();
                        Utils.showMessage("获取令牌失败，请重新选择上传");
                    }
                }, (err) => {
                    that.hideLoading();
                    Utils.showMessage("网络异常");
                    console.log(2);
                });
            }
        })
    }
	Logout() {
		RnTest.rnIMDisconnect();
		DeviceEventEmitter.emit('logout', 'success');
		Utils.removeValue("token");
  	}
	onPress(num) {
		switch (num) {
			case 0:
			{
				// 修改昵称
				this.setState({showAlertView: true});
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
				//退出登录
				Utils.showAlert("退出登录", "是否确定要退出登录？", ()=>{
					// 确定
					this.Logout();
				}, ()=>{
					// 取消
				}, "是", "否");
				break;
			}
			case 6:
			{
				//登陆
				this.props.navigation.navigate('Login');
				break;
			}
			case 7:
			{
				//勋章
				this.props.navigation.navigate('PersonalMedal', {owner: this.state.owner, myself: true});
				break;
			}
			case 8:
			{
				this.props.navigation.navigate('ScholarshipRecord', {balance: this.state.balance});
				break;
			}
			case 9:
			{
				//道具商城
				this.props.navigation.navigate('Exchange');
				break;
			}
			case 10:
			{
				//我的道具
				this.props.navigation.navigate('ExchangeUsingRecord');
				break;
			}
			case 11:
			{
				this.props.navigation.navigate('RewardRecord', {});
				break;
			}
			default:
			{
				break;
			}
		}
	}
	//图片上传监听方法
    _progressUpload(){
        var this_=this;
        //进度
        this.listenerProgressaa = DeviceEventEmitter.addListener("uploadProgress_listener", function(params) {
        })
        //完成
        this.listenerProgressbb = DeviceEventEmitter.addListener("uploadSuccess_listener", function(params) {
            this_._fetchUpdateInfo("avatar", "", params.imageurl);
        });
        //开始
        this.listenerProgresscc = DeviceEventEmitter.addListener("uploadStrat_listener", function(params) {
            this_.setState({
                loading:true,
                loadingText:"上传中..."
            });
        })
	}
	// 隐藏弹框
    _hideAlertView(){
        this.setState({
            showAlertView:false
        })
    }
    // 修改昵称
    _OkPressEvent(){
        if (this.state.nickname == "") {
            Utils.showMessage("昵称不能为空");
            return;
        }
        this.setState({
            showAlertView:false,
            loadingText:"修改中...",
            loading:true
        })
        this._fetchUpdateInfo("nickname", this.state.nickname, "");
    }
    // 修改头像点击
    _updateAvatar(){
        Utils.isLogin((token)=>{
            RnTest.rnQiniu(token,false,"gallery");
        })
    }
	
	render() {
    	return (
      		<View style={{flex: 1, backgroundColor: 'rgb(243, 243, 243)'}}>
      			<ScrollView>
      				{
						this.state.isLogin === true?(
      						<View style={{width: width, height: height / 3, alignItems: 'center', justifyContent: 'center'}}>
              					<Image source={require('../assets/My/group.png')} style={{width: width, height: height / 3, position: 'absolute', left: 0, top: 0}}/>
								<TouchableOpacity onPress={this._updateAvatar.bind(this)} style={{width: height / 9, height: height / 9}}>
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
						)
					}
					{
						this.state.isLogin === true?(
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

								<TouchableOpacity onPress={this.onPress.bind(this, 7)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
									<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../images/forum_icon/medal.png')}/>
									<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'我的勋章'}</Text>
									<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
								</TouchableOpacity>

								<TouchableOpacity onPress={this.onPress.bind(this, 8)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
									<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/reward.png')}/>
									<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'奖学金记录'}</Text>
									<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
								</TouchableOpacity>
								<TouchableOpacity onPress={this.onPress.bind(this, 11)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
									<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/prize.png')}/>
									<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'打赏记录'}</Text>
									<Image resizeMode={'contain'} style={{width: 13, height: 13, position: 'absolute', right: 10, top: 18}} source={require('../assets/My/right.png')}/>
								</TouchableOpacity>

								<TouchableOpacity onPress={this.onPress.bind(this, 10)} style={{flexDirection: 'row', alignItems: 'center', borderColor: 'rgb(238, 238, 239)', borderBottomWidth: 1, borderTopWidth: 1, width: width, height: 50, backgroundColor: 'white'}}>
									<Image resizeMode={'contain'} style={{marginLeft: 10, width: 20, height: 20}} source={require('../assets/My/reward.png')}/>
									<Text style={{marginLeft: 10, fontSize: 15, color: 'rgb(59, 60, 61)'}}>{'我的道具'}</Text>
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
						):(
							null
						)
					}
				</ScrollView>

				<AlertView 
                    type="input"
                    showAlertView={this.state.showAlertView}
                    hideAlertView={this._hideAlertView.bind(this)}
                    okBtnText={"确定"}
                    cancelBtnText={"取消"}
                    inputPlaceHolderText={"修改昵称"}                    
                    valueText={this.state.nickname}
                    setValueText={(text)=>{this.setState({nickname:text})}}
                    OkPressEvent={this._OkPressEvent.bind(this)}
                />
                {
                    this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
                }
			</View>
		);
	}
}

export default MyPage;
