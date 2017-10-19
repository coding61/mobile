'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  AsyncStorage
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
class RightBtn extends Component {
	render() {
		return (
			<TouchableOpacity onPress={this.props.press()} style={{alignItems: 'center', justifyContent: 'center'}}>
				<Text style={{fontSize: 16, color: 'white', width: 50, height: 20}}>{'完成'}</Text>
			</TouchableOpacity>
			)
	}
}
class AlterActivity extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '修改活动',
    headerStyle: {
      backgroundColor: 'rgb(251, 109, 150)'
    },
    headerTitleStyle: {
      color: 'white',
      fontWeight: '400'
    },
    headerTintColor: "#fff",
    headerRight: <RightBtn press={() => navigation.state.params.navigatePress} />
  })
  constructor() {
  	super();
  	this.state = {
  		titleText: '',
  		contentText: '',
      password: '',
      isUp: false
  	}
  }
  onPress = () => {
    var _this = this;
    if (this.state.titleText === '') {
      Utils.showMessage('活动标题不能为空！')
    } else if (this.state.contentText === '') {
      Utils.showMessage('活动简介不能为空！')
    }
    
    if (this.state.titleText !== '' || this.state.contentText !== '') {
      var body;
      if (this.state.password === '') {
        body = JSON.stringfy({name:_this.state.titleText,introduction:_this.state.contentText});
      } else {
        body = JSON.stringify({name:_this.state.titleText,password:_this.state.password,introduction:_this.state.contentText});
      }
      AsyncStorage.getItem("token", function(errs, results) {
         fetch(Http.domain + '/club/clubs/' + _this.props.navigation.state.params.pk + '/',{method: 'put', headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'},body: body})
          .then(response => {
            console.log(response.text())
            if (response.ok === true) {
              return '成功';
            } else {
              return response.json()
            }
          })
          .then(res => {
            if (res === '成功') {
              Utils.showMessage('修改成功');
              _this.setState({
                isUp: true
              },() => {
                _this.props.navigation.goBack();
              })
            } else {
              if (res.message) {
                Utils.showMessage(res.message);
              }
            }
          })
      })
    }
  }
  componentWillUnmount() {
    this.props.navigation.state.params.callback(this.state.isUp);
  }
  componentWillMount() {
    this.props.navigation.setParams({
        navigatePress:this.onPress
    })
  }
  render() {
    return (
      <View style={{flex: 1}}>
      	<ScrollView>
	      	<TextInput
		        style={{fontSize: 16, paddingLeft: 10, marginTop: 20, height: 40, borderBottomColor: 'rgb(243, 244, 245)', borderBottomWidth: 1, backgroundColor: 'white', color: 'rgb(72, 73, 74)'}}
		        onChangeText={(titleText) => this.setState({titleText})}
		        placeholder={'标题'}
		        value={this.state.titleText}
	      	/>
          <TextInput
            style={{fontSize: 16, paddingLeft: 10, height: 40, borderBottomColor: 'rgb(243, 244, 245)', borderBottomWidth: 1, backgroundColor: 'white', color: 'rgb(72, 73, 74)'}}
            onChangeText={(password) => this.setState({password})}
            placeholder={'密码'}
            value={this.state.password}
          />
	      	<TextInput
		        style={{fontSize: 14, paddingLeft: 10, height: height / 3, borderBottomColor: 'rgb(243, 244, 245)', borderBottomWidth: 1, backgroundColor: 'white', color: 'rgb(72, 73, 74)'}}
		        onChangeText={(contentText) => this.setState({contentText})}
		        placeholder={'通告内容'}
		        value={this.state.contentText}
		        multiline={true}
	      	/>
	      </ScrollView>
      </View>
    );
  }
}


export default AlterActivity;