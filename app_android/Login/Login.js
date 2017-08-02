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

const {width, height} = Dimensions.get('window');
export default class Login extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: 'rgb(251, 110, 169)'
    },
  }
  constructor() {
    super();
    this.state = {
      inviteCode: '',
      passWord: ''
    }
  }
  componentWillUnmount() {
    this.props.navigation.state.params.callback();
  }
  _cancelkeyboard() {
    Keyboard.dismiss();
  }
  goLogin() {
    var _this = this;
    fetch('https://www.cxy61.com/program_girl/userinfo/invitation_code_login/',{
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
        <TouchableOpacity onPress={() => this._cancelkeyboard()} activeOpacity={1} style={LoginStyle.container}>
          <Image style={LoginStyle.titleStyle} source={require('../assets/Login/chengxuyuanjihua.png')} />
          <View>
            <View style={LoginStyle.inputViewStyle}>
              <Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'邀请码'}</Text>
              <TextInput
                style={LoginStyle.inputStyle}
                onChangeText={(inviteCode) => this.setState({inviteCode})}
                value={this.state.inviteCode}
                keyboardType={'numeric'}
                maxLength={8}
                underlineColorAndroid={'transparent'}
              />
            </View>
            <View style={LoginStyle.inputViewStyle}>
              <Text style={{lineHeight: 40, color: 'white', fontWeight: 'bold', fontSize: 15}}>{'密码    '}</Text>
              <TextInput
                style={LoginStyle.inputStyle}
                onChangeText={(passWord) => this.setState({passWord})}
                value={this.state.passWord}
                keyboardType={'numeric'}
                maxLength={4}
                secureTextEntry={true}
                underlineColorAndroid={'transparent'}
              />
            </View>
          </View>
          <Text style={{fontSize: 13, lineHeight: 25, width: 2 * width / 3, color:'white'}}>{'提示:邀请码请到微信公众号cxy-61或者下方二维码获取'}</Text>
          <Image style={{width: width / 3, height: width / 3}} source={require('../assets/Login/erweima.png')}/>
          <TouchableOpacity onPress={this.goLogin.bind(this)} style={LoginStyle.loginBtn}>
            <Text style={LoginStyle.loginBtnText}>{'登录'}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    )
  }
}

const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(251, 110, 169)',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleStyle: {
    width: width / 2 + 2,
    height: 119 * width / 767,
    marginTop: height / 10
  },
  loginBtn: {
    width: 2 * width / 3,
    height: width / 9,
    backgroundColor: 'white',
    borderRadius: 3,
    marginBottom: height / 20,
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
