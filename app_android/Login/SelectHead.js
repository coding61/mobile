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
import Http from '../utils/Http.js';
const {width, height} = Dimensions.get('window');
var headimgs = [require('../assets/Login/head1.png'),require('../assets/Login/head2.png'),require('../assets/Login/head3.png'),require('../assets/Login/head4.png'),require('../assets/Login/head5.png'),require('../assets/Login/head6.png'),require('../assets/Login/head7.png'),require('../assets/Login/head8.png')];
export default class SelectHead extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '选择头像昵称',
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
      name: '',
      head: 0,
      isSelect: false
    }
  } 
  goNext = () => {
    var _this = this;
    if (this.state.name !== '') {
      var number;
      if (this.props.navigation.state.params.cityCode === '+86') {
        number = this.props.navigation.state.params.phoneNum;
      } else {
        number = encodeURI(this.props.navigation.state.params.cityCode + this.props.navigation.state.params.phoneNum).replace(/\+/g,'%2B');
      }
      fetch(Http.domain + '/userinfo/telephone_signup/',{
                method: "POST",
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  telephone:number,
                  password:this.props.navigation.state.params.passWord,
                  verification_code:this.props.navigation.state.params.textCode,
                  name:this.state.name,
                  avatar:"https://static1.bcjiaoyu.com/head" + (this.state.head + 1).toString() + "@3x.png"
                }),
              })
              .then(response=> {
                console.log(response)
                if (response.status === 200) {
                  Alert.alert('','注册成功！',
                  [{text: '确定', onPress: () => this.props.navigation.state.params.gogoback()}
                  ],{ cancelable: false })
                } else {
                  Alert.alert('','注册失败，请检查验证码是否正确！',
                  [{text: '确定', onPress: () => this.props.navigation.goBack()}
                  ],{ cancelable: false })
                }
              })
    } else {
      Alert.alert('','请输入用户名',
      [{text: '确定', onPress: () => {}}
      ],{ cancelable: false })
    }
  }
  select = (index) => {
    this.setState({
      head: index,
      isSelect: false
    })
  } 
  componentWillUnmount() {
    this.setTime && clearInterval(this.setTime);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(244,245,246)'}}>
        <View style={{marginTop: 25, width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1, justifyContent: 'space-between'}}>
          <Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'头   像'}</Text>
          <TouchableOpacity onPress={()=> this.setState({isSelect: true})} style={{marginRight: 35, width: 45, height: 45, alignItems: 'center', justifyContent: 'center'}}>
            <Image style={{width: 40, height: 40, borderRadius: 10}} source={headimgs[this.state.head]}/>
          </TouchableOpacity>
          <Text style={{position: 'absolute', top: 10, right: 25}}>{'>'}</Text>
        </View>
        <View style={{width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1, justifyContent: 'space-between'}}>
          <Text style={{marginLeft: 20, color: '#3e3e3e', fontWeight: '100'}}>{'昵   称'}</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
            maxLength={15}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入你的昵称'}
            />
        </View>
        <TouchableOpacity onPress={this.goNext} style={{borderRadius: 5, marginTop: 25, marginLeft: 25, width: width - 50, height: 45, backgroundColor: 'rgb(251, 109, 150)', alignItems:'center', justifyContent: 'center'}}>
          <Text style={{color: 'white'}}>{'完成'}</Text>
        </TouchableOpacity>
         {this.state.isSelect?(
          <View style={{position: 'absolute', width: width, height: height}}>
            <View style={{position: 'absolute', top: 0, left: 0, width: width, height: height,backgroundColor: 'rgba(0, 0, 0, 0.5)'}}/>
            <View style={{position: 'absolute', bottom: 0, left: 0, width: width, height: width, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap'}}>
              <TouchableOpacity onPress={this.select.bind(null,0)} style={{marginLeft: 8, marginTop: (width / 2 - (width / 4 - 10))/2}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[0]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,1)} style={{marginLeft: 8, marginTop: (width / 2 - (width / 4 - 10))/2}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[1]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,2)} style={{marginLeft: 8, marginTop: (width / 2 - (width / 4 - 10))/2}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[2]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,3)} style={{marginLeft: 8, marginTop: (width / 2 - (width / 4 - 10))/2}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[3]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,4)} style={{marginLeft: 8, marginTop:10}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[4]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,5)} style={{marginLeft: 8, marginTop:10}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[5]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,6)} style={{marginLeft: 8, marginTop:10}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[6]}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.select.bind(null,7)} style={{marginLeft: 8, marginTop:10}}>
                <Image style={{width: width / 4 - 10, height: width / 4 - 10}} source={headimgs[7]}/>
              </TouchableOpacity>
            </View>
          </View>
         ):(null)} 
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputStyle: {
    marginRight: 20, 
    textAlign: 'right',
    fontSize: 13,
    height:45,
    width: width / 2,
    fontWeight: '100',
    color: '#3e3e3e'
  }
})