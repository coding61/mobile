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
  FlatList,
  Image,
  AsyncStorage,
  Alert
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
class ManageMember extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '管理成员',
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
  	super();
  	this.state = {
      data: null,
      isUp: false
  	}
  }
  componentWillMount() {
    this.setState({
      data: this.props.navigation.state.params.data.club_member
    })
  }
  componentWillUnmount() {
    this.props.navigation.state.params.callback(this.state.isUp);
  }
  delete(pk, index) {
    var _this = this;
    Alert.alert('','确认删除？',
      [{text: '取消', onPress: () => {}, style: 'cancel'},
      {text: '确认', onPress: () => {
        AsyncStorage.getItem('token', (errs, results) => {
          fetch(Http.domain + '/club/delete_clubmember/' + pk + '/',{headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}})
            .then(response => {
              if (response.ok === true) {
                return 'success';
              } else {
                return response.json();
              }
            })
            .then(res => {
              if (res === 'success') {
                var data = this.state.data.concat();
                data.splice(index, 1);
                _this.setState({
                  data: data,
                  isUp: true
                })
                Utils.showMessage('删除成功！');
              } else {
                if (res.message) {
                  Utils.showMessage(res.message);
                } else {
                  Utils.showMessage('删除失败！');
                }
              }
            })
        })
      }}
      ],{ cancelable: false })
  }
  _keyExtractor = (item, index) => index
  _renderItem = ({item, index}) => {
    return  (
      <View style={{borderBottomWidth: 1, borderBottomColor: 'rgb(242, 243, 244)', width: width, height:60, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'}}>
        <Image resizeMode={'contain'} style={{marginLeft: 20, width: 40, height: 40}} source={{uri: item.owner.avatar}}/>
        <Text style={{marginLeft: 20, fontSize: 16}}>{item.owner.name}</Text>
        <TouchableOpacity onPress={this.delete.bind(this, item.pk, index)}style={{width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, top: 0}}>
          <Image resizeMode={'contain'} style={{width: 15, height: 15}} source={require('../assets/My/delete.png')}/>
        </TouchableOpacity>
      </View>
      )
  }
  render() {
    return (
      <View style={{flex: 1}}>
      	<FlatList 
          extraData={this.state}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );
  }
}


export default ManageMember;