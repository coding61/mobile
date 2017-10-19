/**
 * @author: chenwei
 * @description: 空数据视图
 * @time: 2017-07-18
 */
'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Image,
  Text
} from 'react-native';

class EmptyView extends Component {
  render() {
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image
              style={{width:100, height:100}}
              source={require('../images/default.png')}
              resizeMode={'contain'}
            /> 
            <Text style={{color:"#848484"}}>{this.props.failTxt?this.props.failTxt:"暂无数据"}</Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({

});


export default EmptyView;