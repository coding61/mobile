'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Modal,
  StatusBar,
  FlatList,
  Image
} from 'react-native';

import City from '../country.json';
import Utils from '../utils/Utils.js';

class CountryCode extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {

      };
	}
	onSelectedCity(code) {
		this.props.onSelectedCity(code);
    }
    hideCountryCode(){
        this.props.hideCountryCode();
    }
    _keyExtractor = (item, index) => index
    _renderItem = ({item}) => {
        return  (<TouchableOpacity onPress={this.onSelectedCity.bind(this, item.code)} style={{width: width - 20, marginLeft: 30, height: 30, marginTop: 15, justifyContent: 'center'}}><Text style={{color: 'white', fontSize: 17}}>{item.code}  {item.country}</Text></TouchableOpacity>)
    }
  	render() {
    	return (
			<Modal 
              animationType={"slide"}
              transparent={false}
              visible={this.props.modalVisible}
              onRequestClose={() => {}}>
                <View style={{width: width, height: height, backgroundColor: 'rgb(251, 110, 169)'}}>
                    <StatusBar barStyle="dark-content" backgroundColor={"#fff"}/>
                    <Text style={{color: 'white', fontSize: 18, marginTop: 40, marginLeft: 30}}>{'国家和地区'}</Text>
                    <FlatList 
                      style={{width: width, height: height - 90, marginTop: 30}}
                      extraData={this.state}
                      data={City}
                      renderItem={this._renderItem}
                      keyExtractor={this._keyExtractor}
                    />
                    <TouchableOpacity onPress={this.hideCountryCode.bind(this)} style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 30, top: 20}}>
                        <Image source={require('../assets/Login/close.png')}/>
                    </TouchableOpacity>
                </View>
            </Modal>
    	);
  	}
}

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const styles = StyleSheet.create({

});


export default CountryCode;
