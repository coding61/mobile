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
  Text,
  TouchableOpacity
} from 'react-native';

import Utils from '../utils/Utils.js';

class EmptyView extends Component {

  render() {
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Image
              style={{width:width/2, height:width/2}}
              source={require('../images/default.png')}
              // source={{uri:"https://static1.bcjiaoyu.com/noDataImg.png"}}
              resizeMode={'contain'}
            /> 
            {
              this.props.type=="login"?
                <TouchableOpacity onPress={this.props.goLogin}>
                  <Text style={{fontSize:15,color:"#5daeff", textDecorationLine:'underline', fontStyle:'italic'}}>{this.props.failTxt?this.props.failTxt:"点击，去登录"}</Text>
                </TouchableOpacity>
              :this.props.type=="reload"?
                <TouchableOpacity onPress={this.props.reloadEvent}>
                  <Text style={{fontSize:15,color:"#5daeff", textDecorationLine:'underline', fontStyle:'italic'}}>{this.props.failTxt?this.props.failTxt:"数据走丢，点击重试"}</Text>
                </TouchableOpacity>
              :
                <Text style={{color:"#848484"}}>{this.props.failTxt?this.props.failTxt:"暂无数据"}</Text>
            }
        </View>
    )
  }
}

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高
const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const styles = StyleSheet.create({

});


export default EmptyView;