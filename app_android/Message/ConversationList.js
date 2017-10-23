/**
 * @author: chenwei
 * @description: 会话列表
 * @time: 2017-07-18
 */
'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';


class ConversationList extends Component {
	static navigationOptions = ({navigation}) => {
		const {state, setParams, goBack, navigate} = navigation;
		return {
			title:'会话列表',
			headerTintColor: "#fff",   
            headerStyle: { backgroundColor: pinkColor}
		}
	};
	componentWillMount() {
	    // RnTest.rnIMStart();
	}
  	render() {
	    return (
	        <View style={{flex: 1}}>
		    </View>
	    );
  	}
}

const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const pinkColor = Utils.btnBgColor;
const styles = StyleSheet.create({

});


export default ConversationList;