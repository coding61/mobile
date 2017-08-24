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
  Alert
} from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

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
      phoneNum: '',
      textCode: '',
      password: '',
      textCodeNum: '获取验证码',
      canSee: false
    }
  } 
    // 3.找回密码
    _fetchFindPassword(){
        var reg = /^1[0-9]{10}$/;
        if (!reg.test(this.state.phoneNum)) {
            alert('手机号不合法');
            return;
        }
        if (!this.state.testCode) {
            alert('验证码必填');
            return;
        }
        if (!this.state.password) {
            alert('密码必填');
            return;
        }
        var type = "put",
            url = Http.findPassword,
            token = null,
            data = {
                telephone:this.state.phoneNum,
                password:this.state.password,
                verification_code:this.state.testCode
            };
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response);
            if (response.token) {
                //重置密码成功
                alert("请妥善保管好您的密码");
                this.props.navigation.goBack();
            }else{
                alert("密码修改失败");
            }
        }, (err) => {
            console.log(err);
            // alert('网络请求失败');
        });
    }
  attainCode = () => {
    var reg = /^1[0-9]{10}$/;
    if (this.state.textCodeNum === '获取验证码' && reg.test(this.state.phoneNum)) {
        var type = "get",
            url = Http.getPassCode(this.state.phoneNum),
            token = null,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            if (!response) {
                //请求失败
            };
            if (response.status == 0) {
                var time = 60;
                var _this = this;
                this.setTime = setInterval(function() {
                    --time;
                    if (time > 0) {
                        _this.setState({
                            textCodeNum:time
                        })
                    }else{
                        _this.setState({
                            textCodeNum:'获取验证码'
                        }, ()=>{
                            clearInterval(_this.setTime);
                        })
                    }
                  }, 1000);

            }else if (response.detail) {
                alert(response.detail);
            }else if (response.message) {
                alert(response.message);
            }

        }, (err) => {
            // console.log(err);
            // Utils.showMessage('网络请求失败');
        });      
    }else if (!reg.test(this.state.phoneNum)) {
        alert("手机号不合法")
    }
  }
  see = () => {
    this.setState({
      canSee: !this.state.canSee
    })
  }
  goNext = () => {
    this._fetchFindPassword();
  }
  
  componentWillUnmount() {
    this.setTime && clearInterval(this.setTime);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(244,245,246)'}}>
        <View style={{width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
          <Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'手机号'}</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(phoneNum) => this.setState({phoneNum})}
            value={this.state.phoneNum}
            keyboardType={'numeric'}
            maxLength={11}
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
            maxLength={6}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入验证码'}
            />
          <TouchableOpacity activeOpacity={this.state.textCodeNum === '获取验证码'?0:1}onPress={this.attainCode} style={[{position: 'absolute', top: 10, right: 15, width: 70, height: 25, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5},this.state.textCodeNum === '获取验证码'?({borderColor: 'rgb(240, 105, 153)'}):({borderColor: 'gray'})]}>
            <Text style={[{fontSize: 11},this.state.textCodeNum === '获取验证码'?({color: 'rgb(240, 105, 153)'}):({color: 'gray'})]}>{this.state.textCodeNum}</Text>
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