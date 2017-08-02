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
}from 'react-native';
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';
import ForumList from './ForumList';
var {height, width} = Dimensions.get('window');

export default class Forum extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            tag: 0,
            nextPage: null,
            isLoading: false,
            url: 'https://www.cxy61.com/program_girl/forum/sections/',
            //url: 'https://app.bcjiaoyu.com/program_girl/forum/sections/',
            loadText: '正在加载...',
            isRefreshing: false,
            token:'',
            //token:'f0b3897f26417c66c27d6e782724317010694cdc'
            //token:'e8755971e912d26aa0b365fdee98354945c346de',
        }
        
    }
    static navigationOptions = {
      title: '论坛',
    }
    componentDidMount() {
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    self._loadData();
                });
            }else{
                Alert.alert('请先登录帐号！')
            }
        });
    }
    _loadData() {
        this.setState({
            isLoading: true
        },()=> {
            fetch(this.state.url)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return '加载失败';
                }
            })
            .then(responseJson=> {
                if (responseJson === '加载失败') {
                    Alert.alert(
                      '加载失败,请重试',
                      '',
                      [
                        {text: '确定', onPress: ()=> {this.setState({isLoading: false, isRefreshing: false})}, style: 'destructive'},
                      ]
                    )
                } else {
                    var resultArr = new Array();
                    responseJson.results.map(result=> {
                        resultArr.push(result);
                    })
                    this.setState({
                        nextPage: responseJson.next,
                        dataArr: resultArr,
                        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(resultArr),
                        isLoading: false,
                        loadText: responseJson.next?('正在加载...'):('没有更多了...'),
                        isRefreshing: false
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                Alert.alert(
                      '加载失败,请重试',
                      '',
                      [
                        {text: '确定', onPress: ()=> {}, style: 'destructive'},
                      ]
                    )
                this.setState({
                    isLoading: false,
                    isRefreshing: false
                })
            })
        })  
    }
    _clickForumList(data){
        this.props.navigation.navigate('ForumList', { data: data,token:this.state.token })
    }
    _renderRow(rowData, SectionID, rowID, highlightRow) {
        var timeArray = rowData.newposts.create_time.split('.')[0].split('T');
        var year = timeArray[0].split('-')[0];
        var month = timeArray[0].split('-')[1];
        var day = timeArray[0].split('-')[2];
        var hour = timeArray[1].split(':')[0];
        var minute = timeArray[1].split(':')[1];
        var second = timeArray[1].split(':')[2];
        var create = new Date(year, month-1, day, hour, minute, second);
        var current = new Date();
        var s1 = current.getTime() - create.getTime(); //相差的毫秒
        var time = null;
        if (s1 / (60 * 1000) < 1) {
            time = "刚刚";
        }else if (s1 / (60 * 1000) < 60){
            time = parseInt(s1 / (60 * 1000)) + "分钟前";
        }else if(s1 / (60 * 1000) < 24 * 60){
            time = parseInt(s1 / (60 * 60 * 1000)) + "小时前";
        }else if(s1 / (60 * 1000) < 24 * 60 * 2){
            time = "昨天 " + rowData.newposts.create_time.slice(11, 16);
        }else{
            time = rowData.newposts.create_time.slice(0, 10).replace('T', ' ');
        }
        return (
            <TouchableOpacity onPress={this._clickForumList.bind(this,rowData)}
                style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                <View style={{flexDirection:'row',}}>
                    <Image style={{width:50,height:50,marginTop:20,}} source={{uri:rowData.icon}}/>
                    <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.6,}}>
                        <Text style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.name}</Text>
                        <Text style={{paddingBottom:10}}>{rowData.newposts.title}</Text>
                        <Text style={{paddingBottom:10}}>{rowData.newposts.author}  {time}</Text>
                    </View>
                    <Text style={{paddingLeft:10,flex:1,paddingTop:20,}}>帖数:{rowData.total}</Text>
                </View>
            </TouchableOpacity>

        )
    }
    _renderNext() {
        if (this.state.nextPage && this.state.isLoading === false) {
                this.setState({
                    isLoading: true
            },()=> {
                fetch(this.state.nextPage, {
                    headers: {
                        Authorization: 'Token '+ this.state.token
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return '加载失败';
                    }
                })
                .then(responseJson=> {
                    if (responseJson === '加载失败') {
                        Alert.alert(
                          '加载失败,请重试',
                          '',
                          [
                            {text: '确定', onPress: ()=> {this.setState({isLoading: false})}, style: 'destructive'},
                          ]
                        )
                    } else {
                        var resultArr;
                        resultArr = this.state.dataArr.concat();
                        responseJson.results.map(result=> {
                            resultArr.push(result);
                        })
                        this.setState({
                            nextPage: responseJson.next,
                            dataArr: resultArr,
                            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(resultArr),
                            isLoading: false,
                            loadText: responseJson.next?('正在加载...'):('没有更多了...')
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                    Alert.alert(
                          '加载失败,请重试',
                          '',
                          [
                            {text: '确定', onPress: ()=> {}, style: 'destructive'},
                          ]
                        )
                    this.setState({
                        isLoading: false,
                        isRefreshing: false
                    })
                })
            })
        }
    }
    _renderFooter(){
        return <View style={{alignItems:'center', justifyContent: 'center', width: width, height: 30}}><Text style={{fontSize: 12, color: '#cccccc'}}>{this.state.loadText}</Text></View>
    }
    _onRefresh() {
        this.setState({
            isRefreshing: true
        },()=> {
            this._loadData();
        })
    }
    _goBack(){
        if (this.props.navigation) {
            this.props.navigation.pop()
        }   
    }

    render() {
        if(!this.state.dataSource){
            return(<View></View>)
        }else{
             return(
            <View style={{flex: 1, backgroundColor: 'rgb(242,243,244)'}}>
                <ListView
                    dataSource={this.state.dataSource}  
                    renderRow={this._renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReached={this._renderNext.bind(this)}
                    onEndReachedThreshold={200}
                    renderFooter={this._renderFooter.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor='#cccccc'
                            title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                            titleColor='#cccccc' />
                    }
                />
            </View>
        )
        }
    }
}
