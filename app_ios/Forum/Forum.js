import React, {Component} from 'react'
import {
  AppRegistry, 
  StyleSheet, 
  Image, 
  Text,
  View, 
  ScrollView,
  Dimensions, 
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  FlatList,
  RefreshControl,
  DeviceEventEmitter,
}from 'react-native';
import ForumList from './ForumList';
var {height, width} = Dimensions.get('window');
import NewsCenter from './NewsCenter';
export default class Forum extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: '',
            tag: 0,
            nextPage: null,
            isLoading: false,
            url: 'https://www.cxy61.com/program_girl/forum/sections/',
            loadText: '正在加载...',
            isRefreshing: false,
            token:'',
            moreshow:false,
        }
    }

    static navigationOptions = {
        headerTitle: '论坛',
        headerTintColor: "#fff",   
        headerStyle: { backgroundColor: '#ff6b94',},
        headerTitleStyle:{alignSelf:'auto',},
        headerRight:
                (
                <View style={{marginRight:30,alignItems:'center'}}>
                    <TouchableOpacity style={{marginBottom:15,width:40,height:40,}} onPress={()=>{
                        DeviceEventEmitter.emit('newsmore', "1")
                    }}>
                        <Text style={{color:'#ffffff',fontSize:30,}}>...</Text>
                    </TouchableOpacity>
                </View>
                )
    };

    componentWillUnmount() {
        this.props.navigation.state.params.callback();
        this.eventEm.remove();
    }
    componentDidMount() {
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    self._loadData();
                });
            }
        });
        self.eventEm = DeviceEventEmitter.addListener('newsmore', (value)=>{
            self.setState({
                moreshow:!this.state.moreshow,
            })
        })
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
                        dataSource: resultArr,
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
    dealWithTime(Time){
        var timeArray = Time.split('.')[0].split('T');
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
            return time = "刚刚";
        }else if (s1 / (60 * 1000) < 60){
            return time = parseInt(s1 / (60 * 1000)) + "分钟前";
        }else if(s1 / (60 * 1000) < 24 * 60){
            return time = parseInt(s1 / (60 * 60 * 1000)) + "小时前";
        }else if(s1 / (60 * 1000) < 24 * 60 * 2){
            return time = "昨天 " + Time.slice(11, 16);
        }else{
            return time = Time.slice(0, 10).replace('T', ' ');
        }
    }
    _renderRow(item) {
        var rowData=item.item;
        if(!rowData.newposts){
            return (
                <TouchableOpacity onPress={this._clickForumList.bind(this,rowData)}
                        style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <Image style={{width:50,height:50,marginTop:20,}} source={{uri:rowData.icon}}/>
                        <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.6,}}>
                            <Text style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.name}</Text>
                            <Text style={{paddingBottom:10}}>暂无帖子</Text>
                        </View>
                        <Text style={{paddingLeft:10,flex:1,paddingTop:20,}}>帖数:{rowData.total}</Text>
                    </View>
                </TouchableOpacity>
            )
        }else{
            var time_last=this.dealWithTime(rowData.newposts.last_replied)
            return (
                <TouchableOpacity onPress={this._clickForumList.bind(this,rowData)}
                    style={{width: width,flex:1, backgroundColor: 'white',alignItems:'center',marginTop:8,marginBottom:8,paddingLeft:10,paddingRight:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <Image style={{width:60,height:60,marginTop:20,}} source={{uri:rowData.icon}}/>
                        <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.6,}}>
                            <Text style={{fontSize:15,color:'#3B3B3B',paddingBottom:10}}>{rowData.name}</Text>
                            <Text numberOfLines={1} style={{fontSize:13,paddingBottom:10,color:'#858585'}}>{rowData.newposts.title}</Text>
                            <Text style={{fontSize:11,paddingBottom:10,color:'#aaaaaa'}}>{rowData.newposts.author}     {time_last}</Text>
                        </View>
                        <Text style={{paddingLeft:10,flex:1,paddingTop:20,fontSize:11,color:'#aaaaaa'}}>帖数:{rowData.total}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
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
                            dataSource: resultArr,
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
    _newscenter(){
        this.props.navigation.navigate('NewsCenter',);
        this.setState({
            moreshow:false
        })
    }
    ranklist(){
        this.props.navigation.navigate('RankingList', { token:this.state.token });
        this.setState({
            moreshow:false
        })
    }
    MyCollect(){
        this.props.navigation.navigate('MyCollect', );
        this.setState({
            moreshow:false
        })
    }
    MyForum(){
        this.props.navigation.navigate('MyForum', );
        this.setState({
            moreshow:false
        })
    }
    _keyExtractor = (item, index) => index;
    render() {
        if(!this.state.dataSource){
            return(<View></View>)
        }else{
             return(
                <View style={{flex: 1, backgroundColor: '#edeef0'}}>
                    
                    <FlatList
                        data={this.state.dataSource}  
                        renderItem={this._renderRow.bind(this)}
                        onEndReached={this._renderNext.bind(this)}
                        onEndReachedThreshold={10}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        keyExtractor={this._keyExtractor}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor='#cccccc'
                                title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                                titleColor='#cccccc' />
                        }
                    />
                    {this.state.moreshow?(
                        <View style={{position:'absolute',backgroundColor:'#ffffff',top: 0,borderRadius:5,alignItems:'center',right: 10,borderWidth:0.5,borderColor:'#aaaaaa',paddingRight:5,paddingLeft:8,}}>
                            <View style={{borderBottomWidth:1,borderBottomColor:'#aaaaaa'}}><Text onPress={this._newscenter.bind(this)} style={{padding:15,}}>消息中心</Text></View>
                            <View style={{borderBottomWidth:1,borderBottomColor:'#aaaaaa'}}><Text onPress={this.MyCollect.bind(this)} style={{padding:15,}}>我的收藏</Text></View>
                            <View style={{borderBottomWidth:1,borderBottomColor:'#aaaaaa'}}><Text onPress={this.MyForum.bind(this)} style={{padding:15,}}>我的帖子</Text></View>
                            <View><Text onPress={this.ranklist.bind(this)} style={{padding:15,}}>排行榜</Text></View>
                        </View>
                        ):(null)}
                </View>
            )
        }
    }
}
