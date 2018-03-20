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
import {StackNavigator} from 'react-navigation';
import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';
import City from '../country.json';

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
      canSee: false,
      modalVisible: false,
      cityCode: '+86'
    }
  } 
  attainCode = () => {
    var number;
    if (this.state.cityCode === '+86') {
      number = this.state.phoneNum;
    } else {
      number = encodeURI(this.state.cityCode + this.state.phoneNum).replace(/\+/g,'%2B');
    }
    if (this.state.textCodeNum === '获取验证码') {
        var type = "get",
            url = Http.getRegCode(number),
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
                // alert(response.detail);
                Utils.showMessage(response.detail);
            }else if (response.message) {
                // alert(response.message);
                Utils.showMessage(response.message);
            }

        }, (err) => {
            // console.log(err);
            // Utils.showMessage('网络请求失败');
        });      
    }
  }
  see = () => {
    this.setState({
      canSee: !this.state.canSee
    })
  }
  goNext = () => {
    if (this.state.phoneNum !== '' && this.state.textCode !== '' && this.state.password != '' ) {
      this.props.navigation.navigate('SelectHead', {cityCode: this.state.cityCode, phoneNum: this.state.phoneNum, textCode: this.state.textCode, passWord: this.state.password, gogoback: this.gogoback.bind(this)})  
    } else {
      // alert("不要忘记填写信息呀！")
      Utils.showMessage("不要忘记填写信息呀！");
    }
    
  }
  gogoback() {
    this.props.navigation.goBack();
  }

  componentWillUnmount() {
    this.setTime && clearInterval(this.setTime);
  }
  onSelectedCity(code) {
    this.setState({
      cityCode: code,
      modalVisible: false
    })
  }
  _keyExtractor = (item, index) => index
  _renderItem = ({item}) => {
    return  (<TouchableOpacity onPress={this.onSelectedCity.bind(this, item.code)} style={{width: width - 20, marginLeft: 30, height: 30, marginTop: 15, justifyContent: 'center'}}><Text style={{color: 'white', fontSize: 17}}>{item.country}</Text></TouchableOpacity>)
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(244,245,246)'}}>
        <View style={{marginTop: 25, width: width, height: 45, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderBottomColor: 'rgb(235, 236, 237)', borderBottomWidth: 1}}>
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
            onChangeText={(textCode) => this.setState({textCode})}
            value={this.state.textCode}

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
        <Modal 
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}>
          <View style={{width: width, height: height, backgroundColor: 'rgb(251, 110, 169)'}}>
            <Text style={{color: 'white', fontSize: 18, marginTop: 40, marginLeft: 30}}>{'国家和地区'}</Text>
            <FlatList 
              style={{width: width, height: height - 90, marginTop: 30}}
              extraData={this.state}
              data={City}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
            <TouchableOpacity onPress={()=> this.setState({modalVisible: false})} style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 30, top: 20}}>
              <Image source={require('../assets/Login/close.png')}/>
            </TouchableOpacity>
          </View>
        </Modal>
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