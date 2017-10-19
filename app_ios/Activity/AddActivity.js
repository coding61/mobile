'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
const {width, height} = Dimensions.get('window');
class RightBtn extends Component {
	render() {
		return (
			<TouchableOpacity style={{alignItems: 'center', justifyContent: 'center'}}>
				<Text style={{fontSize: 16, color: 'white', width: 50, height: 20}}>{'发布'}</Text>
			</TouchableOpacity>
			)
	}
}
class AddActivity extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '添加活动',
    headerStyle: {
      backgroundColor: 'rgb(251, 109, 150)'
    },
    headerTitleStyle: {
      color: 'white',
      fontWeight: '400'
    },
    headerTintColor: "#fff",
    headerRight: <RightBtn />
  })
  constructor() {
  	super();
  	this.state = {
  		titleText: '',
  		contentText: ''
  	}
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

const styles = StyleSheet.create({

});


export default AddActivity;