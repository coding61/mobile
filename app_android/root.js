import React, {Component} from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  PropTypes,
  Alert,
  AsyncStorage,
  NativeAppEventEmitter,
  BackAndroid,
  NavigatorIOS,
  Navigator,
  Button
}from 'react-native';
import Forum from './Forum/Forum.js';
import ForumList from './Forum/ForumList.js';
import ForumDetail from './Forum/ForumDetail.js';
import WebHtml from './Forum/WebHtml.js';
import AddForum from './Forum/AddForum.js';
import {StackNavigator} from 'react-navigation';
class RootApp extends Component{
    constructor(props) {
      super(props);
      this.state = {};
    }
    render(){
        const { navigate } = this.props.navigation;
        return (
            <View style={{}}>
                <Button 
                    title="论坛"
                    onPress={() =>
                            navigate('Forum', { name: 'Forum' })
                        }
                />
          </View>
        )
    }
}

const styles = StyleSheet.create({
  
});

const app = StackNavigator({
    RootApp:{screen: RootApp},
    Forum:{screen: Forum},
    ForumList:{screen:ForumList},
    ForumDetail:{screen:ForumDetail},
    WebHtml:{screen:WebHtml},
    AddForum:{screen:AddForum},
});

export default app;
