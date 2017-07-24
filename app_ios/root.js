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
import {StackNavigator} from 'react-navigation';

import MessagePage from './pages/MessagePage.js';
import MessagePage1 from './pages/MessagePage1.js';

class rootApp extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
        return (
            <View style={styles.container}>
                <Button 
                    title="消息1"
                    onPress={()=>{this.props.navigation.navigate('MessagePage1')}}
                />
                <Button 
                    title="消息"
                    onPress={()=>{this.props.navigation.navigate('MessagePage')}}
                />
          </View>
        )
    }
}

const styles = StyleSheet.create({
  
});

const app = StackNavigator({
    Root:{screen: rootApp},
    MessagePage:{screen: MessagePage},
    MessagePage1:{screen:MessagePage1},
});

export default app;
