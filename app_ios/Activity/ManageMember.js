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
  Image
} from 'react-native';
const {width, height} = Dimensions.get('window');

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
    var arr = [1,2,3,4];
  	this.state = {
      data: arr
  	}
  }
  _keyExtractor = (item, index) => index
  _renderItem = ({item}) => {
    console.log(item)
    return  (
      <View style={{borderBottomWidth: 1, borderBottomColor: 'rgb(242, 243, 244)', width: width, height:60, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white'}}>
        <Image resizeMode={'contain'} style={{marginLeft: 20, width: 40, height: 40}} source={require('../assets/Login/head1.png')}/>
        <Text style={{marginLeft: 20, fontSize: 16}}>{'item'}</Text>
        <TouchableOpacity onPress={()=> console.log(123)}style={{width: 60, height: 60, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, top: 0}}>
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