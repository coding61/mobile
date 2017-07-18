/**
 * @author: chenwei
 * @description: app入口，进行身份的选择
 * @time: 2017-03-15
 */
'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet, 
    Text,
    TouchableOpacity,
    Button
}from 'react-native'

class rootApp extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                  Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                  To get started, edit index.ios.js
                </Text>
                <Text style={styles.instructions}>
                  Press Cmd+R to reload,{'\n'}
                  Cmd+D or shake for dev menu
                </Text>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default rootApp;
