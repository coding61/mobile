import React, {Component} from 'react'
import {
  AppRegistry, 
  StyleSheet, 
  Image, 
  Text, 
  TextInput, 
  View, 
  ScrollView,
  Dimensions, 
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  RefreshControl,
  InteractionManager,
  WebView,
}from 'react-native';
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';
import Content_Rex from './Content_Rex';
var {height, width} = Dimensions.get('window');

export default class Forum_Details extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            tag: 0,
            nextPage: null,
            isLoading: false,
            url: 'https://www.cxy61.com/program_girl/forum/sections/',
            loadText: '正在加载...',
            isRefreshing: false,
            token:'',
            data:this.props.navigation.state.params.data,
        }
        
    }
    static navigationOptions = {
      title: '论坛详情',
    }

    componentDidMount() {
       
    }

    
    _goBack(){
        if (this.props.navigation) {
            this.props.navigation.pop()
        }   
    }

    render() {
        var Content=Content_Rex.content(this.state.data.content)
        return(
            <View style={{flex: 1, backgroundColor: 'rgb(242,243,244)'}}>   
                <WebView
                    source={{html: Content}}
                    ref={webview => this.webview = webview}
                    //automaticallyAdjustContentInsets={false}
                    javaScriptEnabled={true}
                    decelerationRate="normal"
                    startInLoadingState={true}
                    mixedContentMode="always"
                    scalesPageToFit={false}
                />
            </View>
        )
    }
}
