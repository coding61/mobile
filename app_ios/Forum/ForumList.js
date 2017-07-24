import React, {Component} from 'react'
import {
    View,
    StyleSheet, 
    Text,
    TouchableOpacity,
    Button,

}from 'react-native'

export default class ForumList extends Component{
    constructor(props) {
      super(props);
      this.state = {
        
      };
    }
    componentDidMount(){

    }
    _loadData(){

    }
    render(){
        return (
            <View style={styles.container}>
                
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

});

