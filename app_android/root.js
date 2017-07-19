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

import Forum from './Forum/Forum';
class rootApp extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
        return (
            <View style={styles.container}>
                <Button 
                    title="论坛"
                    onPress={()=>{this.props.navigation.navigate('Forum')}}
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
});

export default app;
