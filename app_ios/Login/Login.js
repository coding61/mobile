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
  ScrollView
} from 'react-native';
import Http from '../utils/Http.js';
const {width, height} = Dimensions.get('window');
export default class Login extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'rgb(251, 110, 169)'
    },
    headerTintColor: "#fff"
  }
  constructor() {
    super();
    this.state = {
      inviteCode: '',
      passWord: '',
      phoneNum: '',
      phoneWord: '',
      loginWay: 'left'
    }
  }
  componentWillUnmount() {
    this.props.navigation.state.params.callback();
  }
  _cancelkeyboard() {
    Keyboard.dismiss();
  }
  phoneLogin() {
    var _this = this;
    fetch(Http.domain + '/userinfo/telephone_login/',{
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                telephone: this.state.phoneNum,
                password: this.state.phoneWord,
              }),
            })
            .then(response=> {
              if (response.status === 200) {
                return response.json();
              } else {
                return 'fail';
              }
            })
            .then(responseJson => {
              if (responseJson !== 'fail') {
                AsyncStorage.setItem('token', responseJson.token, () => {
                  _this.props.navigation.goBack();
                })
              } else {
                alert('登陆失败，请重新登陆');
              }
            })
  }
  goLogin() {
    var _this = this;
    fetch(Http.domain + '/userinfo/invitation_code_login/',{
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                code: this.state.inviteCode,
                password: this.state.passWord,
              }),
            })
            .then(response=> {
              if (response.status === 200) {
                return response.json();
              } else {
                return 'fail';
              }
            })
            .then(responseJson => {
              if (responseJson !== 'fail') {
                AsyncStorage.setItem('token', responseJson.token, () => {
                  _this.props.navigation.goBack();
                })
              } else {
                alert('登陆失败，请重新登陆');
              }
            })

  }
  render() {
    return (
      <View style={{flex: 1}}>
        {this.state.loginWay === 'left'?(
        <TouchableOpacity onPress={() => this._cancelkeyboard()} activeOpacity={1} style={LoginStyle.container}>
          <Image style={LoginStyle.titleStyle} source={require('../assets/Login/chengxuyuanjihua.png')} />
          <View>
            <View style={LoginStyle.inputViewStyle}>
              <Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'手机号'}</Text>
              <TextInput
                style={LoginStyle.inputStyle}
                onChangeText={(phoneNum) => this.setState({phoneNum:phoneNum})}
                value={this.state.phoneNum}
                keyboardType={'numeric'}
                maxLength={11}
              />
            </View>
            <View style={LoginStyle.inputViewStyle}>
              <Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'密    码'}</Text>
              <TextInput
                style={LoginStyle.inputStyle}
                onChangeText={(phoneWord) => this.setState({phoneWord:phoneWord})}
                value={this.state.phoneWord}
                // maxLength={10}
                secureTextEntry={true}
              />
            </View>
          </View>
          <TouchableOpacity onPress={this.phoneLogin.bind(this)} style={LoginStyle.loginBtn}>
            <Text style={LoginStyle.loginBtnText}>{'登录'}</Text>
          </TouchableOpacity>
            <View style={{flexDirection: 'row', width: 2 * width / 3, height: 50, alignItems: 'center', justifyContent: 'space-between'}}>
               <TouchableOpacity onPress={()=> this.props.navigation.navigate('FindWord')}>
                <Text style={{fontSize: 13, color: 'white'}}>{'忘记密码？'}</Text>
              </TouchableOpacity>
              <Text>{''}</Text>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate('Register')}>
                <Text style={{fontSize: 13, color: 'white'}}>{'注册'}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ):(
        <TouchableOpacity onPress={() => this._cancelkeyboard()} activeOpacity={1} style={LoginStyle.container}>
          <Image style={LoginStyle.titleStyle} source={require('../assets/Login/chengxuyuanjihua.png')} />
          <View>
            <View style={LoginStyle.inputViewStyle}>
              <Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'邀请码'}</Text>
              <TextInput
                style={LoginStyle.inputStyle}
                onChangeText={(inviteCode) => this.setState({inviteCode:inviteCode})}
                value={this.state.inviteCode}
                keyboardType={'numeric'}
                maxLength={8}
              />
            </View>
            <View style={LoginStyle.inputViewStyle}>
              <Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'密    码'}</Text>
              <TextInput
                style={LoginStyle.inputStyle}
                onChangeText={(passWord) => this.setState({passWord:passWord})}
                value={this.state.passWord}
                keyboardType={'numeric'}
                maxLength={4}
                secureTextEntry={true}
              />
            </View>
          </View>
          <TouchableOpacity onPress={this.goLogin.bind(this)} style={LoginStyle.loginBtn}>
            <Text style={LoginStyle.loginBtnText}>{'登录'}</Text>
          </TouchableOpacity>
          <Text style={LoginStyle.promptText}>{'邀请码仅限内测时通过微信公众号分发的邀请码，新用户请用手机号登陆。'}</Text>
            {/* <Text style={{width: 2 * width / 3,fontSize: 13, lineHeight: 25, color: 'white'}}>{"提示:建议您登录后在“首页”的右下角点击“问号”帮助按钮进行手机绑定，以方便您后期的学习。"}</Text> */}
          </TouchableOpacity>
        )}
        <View style={{position: 'absolute', left: 0, top: 0, width: width, height: 40, flexDirection: 'row'}}>
          <TouchableOpacity onPress={()=> this.setState({loginWay: 'left', passWord:"", inviteCode:""})} style={[{width: width / 2, height: 40, alignItems: 'center', justifyContent: 'center'},this.state.loginWay === 'left'?({borderBottomColor: 'white', borderBottomWidth: 1}):(null)]}>
            <Text style={{color:'white', backgroundColor: 'rgba(0,0,0,0)'}}>手机号登陆</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> this.setState({loginWay: 'right', phoneNum:"", phoneWord:""})} style={[{width: width / 2, height: 40, alignItems: 'center', justifyContent: 'center'},this.state.loginWay === 'right'?({borderBottomColor: 'white', borderBottomWidth: 1}):(null)]}>
            <Text style={{color:'white', backgroundColor: 'rgba(0,0,0,0)'}}>邀请码登陆</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(251, 110, 169)',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  titleStyle: {
    width: width / 2 + 2,
    height: 119 * width / 767,
    marginTop: height / 10
  },
  promptText: {
    width: 2 * width / 3,
    color: 'white',
    lineHeight: 20
  },
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
