import React, {Component} from 'react'
import {
  StyleSheet, 
  Image, 
  Text, 
  TextInput, 
  View, 
  ScrollView,
  Dimensions, 
  TouchableOpacity,
  ListView,
  Alert,
  RefreshControl,
  WebView,
}from 'react-native';

import ForumDeatilCont from './ForumDeatilCont';
var {height, width} = Dimensions.get('window');
var basePath='https://www.cxy61.com/';
//var basePath='https://app.bcjiaoyu.com/'
export default class Forum_Details extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            tag: 0,
            nextPage: null,
            isLoading: false,
            url: 'https://www.cxy61.com/program_girl/forum/replies/?posts='+this.props.navigation.state.params.data.pk+'&page=1',
            loadText: '正在加载...',
            isRefreshing: false,
            token:this.props.navigation.state.params.token,
            data:this.props.navigation.state.params.data,

        }
        
    }
    static navigationOptions = {
      title: '论坛详情',
    }

    componentDidMount() {
       this._loadData()
       this._loadUserinfo()
    }
    _loadUserinfo(){
        info_url=basePath+'program_girl/userinfo/whoami/';
        fetch(info_url,{
            headers: {Authorization: 'Token ' + this.state.token}
        })
        .then(response=>{
            if (response.status === 200) {
                return response.json();
            } else {
                return '加载失败';
            }
        })
        .then(responseJson=>{
            this.setState({
                UserInfo:responseJson,
                UserPk:responseJson.pk,
            })
        })
        .catch((error) => {
            console.error(error);  
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
                        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(resultArr),
                        isLoading: false,
                        loadText: responseJson.next?('正在加载...'):('没有更多了...'),
                        isRefreshing: false
                    })
                }
            })
            .catch((error) => {
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
    _renderNext() {
        if (this.state.nextPage && this.state.isLoading === false) {
            this.setState({
                isLoading: true
            },()=> {
                fetch(this.state.nextPage)
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
                            loadText: responseJson.next?('正在加载...'):('没有更多了')
                        })
                    }
                })
                .catch((error) => {
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
    renderForumRow(rowData){
        return (
            <View style={{width: width,flex:1, backgroundColor: '#f2f2f2',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingRight:10,}}>
                <View style={{flexDirection:'row',paddingTop:10,backgroundColor:'#f2f2f2',width:width,paddingLeft:15}}>
                    <View style={{alignItems:'center'}}>
                        <Image style={{width:30,height:30,borderRadius:15,}} source={{uri:rowData.userinfo.avatar}}/>
                        <Text style={{paddingTop:5,fontSize:12,}}>{rowData.userinfo.grade.current_name}</Text>
                    </View>
                    <View style={{paddingLeft:10,paddingRight:10,width:width*0.7,}}>
                        <Text style={{paddingBottom:10,color:'#4f99cf'}}>{rowData.userinfo.name}</Text>
                        <Text style={{paddingBottom:10}}>{rowData.create_time.slice(0, 16).replace("T", " ")}</Text>
                    </View>
                    <Text style={{fontSize:14,paddingTop:10,}}>回复</Text>
                </View>
                <ForumDeatilCont data={rowData.content}></ForumDeatilCont>
                
                {rowData.replymore.map((result,index)=> {
                    return(
                        <View key={index} style={{backgroundColor:'#ffffff',width:width*0.94,marginLeft:width*0.03,borderBottomWidth:1,borderBottomColor:'#cccccc'}}>
                            <View  style={{flexDirection:'row',justifyContent:'flex-start',paddingTop:10,paddingBottom:10,paddingLeft:20,}}>
                                <View style={{alignItems:'center'}}>
                                    <Image style={{width:30,height:30,borderRadius:15,}} source={{uri:result.userinfo.avatar}}/>
                                    <Text style={{paddingTop:10,fontSize:12,}}>{result.userinfo.grade.current_name}</Text>
                                </View>
                                <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.7,}}>
                                    <Text style={{paddingBottom:10,color:'#4f99cf'}}>{result.userinfo.name}</Text>
                                    <Text style={{paddingBottom:10}}>{result.create_time.slice(0, 16).replace("T", " ")}</Text>
                                </View> 
                            </View>
                            <ForumDeatilCont data={result.content}></ForumDeatilCont>
                        </View>
                    )
                })}
            </View>
        )
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
        var data=this.state.data;
        return(
            <View style={{flex:1,backgroundColor:'#ffffff'}}>
                <ScrollView>
                <Text style={{paddingTop:20,paddingBottom:10,paddingLeft:10,paddingRight:10,fontSize:16,color:'#292929'}}>{data.title}</Text>
                <View style={{flexDirection:'row',padding:10,width:width,alignItems:'center',backgroundColor:'#F2F2F2'}}>
                    <View style={{alignItems:'center',}}>
                        <Image style={{width:50,height:50,borderRadius:25,}} source={{uri:data.userinfo.avatar}}/>
                        <Text style={{paddingTop:10,color:'#FF69B4',}}>{data.userinfo.grade.current_name}</Text>
                    </View>
                    <View style={{paddingLeft:10,paddingRight:10,width:width*0.62,}}>
                        <Text style={{paddingBottom:10,color:'#4f99cf'}}>{data.userinfo.name}</Text>
                        <Text style={{paddingBottom:10}}>{data.create_time.slice(0, 16).replace("T", " ")}</Text>
                        <TouchableOpacity>
                            <Text>{data.status_display}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingLeft:10,alignItems:'center'}}>
                        <TouchableOpacity style={{paddingBottom:8,}}>
                            <Image style={{width:14,height:13,marginTop:5,}} source={require('../assets/Forum/unCollect.png')}/>
                        </TouchableOpacity> 
                        <TouchableOpacity style={{paddingBottom:8,}}>
                            <Text>回复主贴</Text>
                        </TouchableOpacity>
                        {data.pk==this.state.UserPk?(
                            <TouchableOpacity style={{paddingBottom:8,}}>
                                <Text>删除此贴</Text>
                            </TouchableOpacity>
                            ):(null)}
                    </View>
                </View> 
                <View style={{marginBottom:10,}}>
                    <ForumDeatilCont data={this.state.data.content}></ForumDeatilCont>
                    <Text style={{backgroundColor:'#f2f2f2',color:'#292929',paddingTop:8,paddingLeft:20,paddingBottom:8,}}>回帖数量({data.reply_count})</Text>
                </View>
                <ListView
                        horizontal={false}
                        contentContainerStyle={{width:width,justifyContent:'flex-start',alignItems:'center' }}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderForumRow.bind(this)}
                        automaticallyAdjustContentInsets={false}
                        enableEmptySections={true}
                        onEndReached={this._renderNext.bind(this)}
                        onEndReachedThreshold={3}
                        renderFooter={this._renderFooter.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor='#cccccc'
                                title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                                titleColor='#cccccc' />
                        }
                    >
                </ListView>
                </ScrollView>
            </View>
        )
    }
}
