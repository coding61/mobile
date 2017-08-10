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
import {StackNavigator} from 'react-navigation';
const {width, height} = Dimensions.get('window');
var seeImgs = [require('../assets/Login/see2.png'), require('../assets/Login/see1.png')];
export default class Register extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '注册',
    headerStyle: {
      backgroundColor: 'rgb(251, 109, 150)'
    },
    headerTitleStyle: {
      color: 'white',
      fontWeight: '400'
    }
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
  attainCode = () => {
    if (this.state.textCodeNum === '获取验证码') {
      var time = 30;
      var _this = this;
      this.setTime = setInterval(function() {
        time --;
        _this.setState({
          textCodeNum: time 
        },()=> {
          if (time < 0) {
            _this.setState({
              textCodeNum: '获取验证码'
            })
            _this.setTime && clearInterval(_this.setTime);
          }
        })
      }, 1000);
      fetch('https://www.cxy61.com/program_girl/userinfo/telephone_signup_request/?telephone=' + this.state.phoneNum, {headers: {'content-type': 'application/json'}})
      .then(response=> {
        console.log(response);
      })
    }
  }
  see = () => {
    this.setState({
      canSee: !this.state.canSee
    })
  }
  goNext = () => {
    this.props.navigation.navigate('SelectHead', {phoneNum: this.state.phoneNum, textCode: this.state.textCode, passWord: this.state.password, gogoback: this.gogoback.bind(this)})
  }
  gogoback() {
    this.props.navigation.goBack();
  }

  componentWillUnmount() {
    this.setTime && clearInterval(this.setTime);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(244,245,246)'}}>
        <View style={{marginTop: 25, width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
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
            onChangeText={(textCode) => this.setState({textCode})}
            value={this.state.textCode}
            maxLength={6}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入验证码'}
            />
          <TouchableOpacity activeOpacity={this.state.textCodeNum === '获取验证码'?0:1}onPress={this.attainCode} style={[{position: 'absolute', top: 10, right: 15, width: 70, height: 25, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 5},this.state.textCodeNum === '获取验证码'?({borderColor: 'rgb(240, 105, 153)'}):({borderColor: 'gray'})]}>
            <Text style={[{fontSize: 11},this.state.textCodeNum === '获取验证码'?({color: 'rgb(240, 105, 153)'}):({color: 'gray'})]}>{this.state.textCodeNum}</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
          <Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'密    码'}</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            maxLength={10}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入密码'}
            secureTextEntry={!this.state.canSee}
            />
          <TouchableOpacity onPress={this.see} style={{position: 'absolute', right: 5, width: 78, height: 52, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={this.state.canSee?(seeImgs[0]):(seeImgs[1])}/>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.goNext} style={{borderRadius: 5, marginTop: 25, marginLeft: 25, width: width - 50, height: 45, backgroundColor: 'rgb(251, 109, 150)', alignItems:'center', justifyContent: 'center'}}>
          <Text style={{color: 'white'}}>{'注册'}</Text>
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