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
  FlatList
} from 'react-native';
const {width, height} = Dimensions.get('window');
import Http from '../utils/Http.js';

class CatalogCourse extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: navigation.state.params.switch,
    headerStyle: {
      backgroundColor: 'rgb(250, 80, 131)'
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
      switch: null,
      dataSource: null,
      selected: null
    }
  }
  componentWillMount() {
    var _this = this;
    AsyncStorage.getItem('token', function(errs, results) {
      fetch(Http.domain + '/course/courses/', {headers: {Authorization: 'Token ' + results, 'content-type': 'application/json'}})
        .then(response => {
          if (response.ok === true) {
            return response.json();
          }
        })
        .then(responseJSON => {
          var datas = new Array();
          if (_this.props.navigation.state.params.switch === '已完成课程') {
            responseJSON.forEach((item) => {
              if (item.learn_extent.status === 'finish') {
                datas.push(item);
              }
            })
          } else {
            responseJSON.forEach((item) => {
              if (item.learn_extent.status === 'processing') {
                datas.push(item);
              }
            })
          }
          var dataSource = new Array();
          datas.forEach((item, index) => {
            var isHas = false;
            for (let i=0;i<dataSource.length;i++) {
              if (item.profession === dataSource[i].profession) {
                dataSource[i].dataArr.push(item);
                isHas = true;
                break;
              }
            }
            if (!isHas) {
              var dataArray = new Array();
              dataArray.push(item);
              dataSource.push({"profession": item.profession, "dataArr": dataArray})
            } 
          })
          _this.setState({
            switch: _this.props.navigation.state.params.switch,
            dataSource: dataSource,
            selected: 0
          })
        })
    })

  }
  _keyExtractor = (item, index) => index
  _keyExtractor_ = (item, index) => index
  _renderItem = ({item, index}) => {
    return (<TouchableOpacity onPress={()=> this.setState({selected: index})} style={{paddingLeft: 10, paddingRight: 10, alignItems: 'center', height: 50, justifyContent: 'center'}}><Text style={[index === this.state.selected?({color: 'rgb(251, 103, 151)'}):(null),{fontSize: 14}]}>{item.profession}</Text></TouchableOpacity>)
  }
  _renderItemBottom = ({item, index}) => {
    return (<View style={{borderRadius: 3, marginTop: 20, marginLeft: 20, backgroundColor: 'rgb(234, 235, 236)', width: width - 40, height: 80}}>
              <Image style={{width: 60, height: 60, position: 'absolute', left: 10, top: 10}} resizeMode={'contain'} source={{uri: item.images}}/>
              <View style={{marginLeft: 80, justifyContent: 'space-around', height: 80}}>
                <Text>{item.name}</Text>
                <Text style={{color: 'rgb(138, 139, 140)'}}>{this.state.switch === '已完成课程'?('已完成'):('学习中')}</Text>
              </View>
            </View>)
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgb(244, 245, 246)'}}>
        {this.state.dataSource && this.state.dataSource[this.state.selected]?(
          <View style={{width: width, height: 50, borderBottomColor: 'rgb(236, 237, 238)', borderBottomWidth: 1, backgroundColor: 'white'}}>
            <FlatList 
              horizontal={true}
              extraData={this.state}
              data={this.state.dataSource}
              renderItem={this._renderItem}
              keyExtractor={this._keyExtractor}
            />
          </View>):(null)}
        {this.state.dataSource && this.state.dataSource[this.state.selected]?(
          <FlatList 
            extraData={this.state}
            data={this.state.dataSource[this.state.selected].dataArr}
            renderItem={this._renderItemBottom}
            keyExtractor={this._keyExtractor_}
          />):(<View style={{width: width, height: height, alignItems: 'center', justifyContent: 'center'}}><Text style={{fontSize: 16}}>{'暂无课程'}</Text></View>)}
      </View>
    )
  }
}

export default CatalogCourse;