import React, {Component} from 'react'
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    ScrollView,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
    DeviceEventEmitter,
    ListView,
    Alert,
    FlatList,
    RefreshControl,
}from 'react-native';

import Http from '../utils/Http.js';
import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import BCFlatListView from '../Component/BCFlatListView.js';

export default class NewsCenter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // CBRefresh:'norefresh',          //是否要回调刷新，默认不刷新
        };
        
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '消息中心',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{flex:1, textAlign:'center', fontSize:15,},
            headerRight:
                (
                <View style={{marginRight:20,alignItems:'center'}}>
                    <TouchableOpacity onPress={()=>{
                        DeviceEventEmitter.emit('read', 1)
                    }}>
                        <Text style={{color:'#ffffff',fontSize:16,}}>一键已读</Text>
                    </TouchableOpacity>
                </View>
                )
            
        };
    }
    componentWillUnmount(){
        if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
            this.props.navigation.state.params.callback(); 
          }
        }
        this.eventEmss.remove();
    }

    componentDidMount() {
        var self = this;
        self.eventEmss = DeviceEventEmitter.addListener('read', (value)=>{
            this._fetchSetMsgRead();
        })
    }
    // ---------------------------------网络请求
    // 获取消息列表
    _fetchMessageList(pagenum, dataSource, callback){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.forumMessagesList(pagenum),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    this.hideLoading();
                    // console.log(response.results);
                    var tag = null
                    if (response.next == null) {
                        //如果 next 字段为 null, 则数据已加载完毕
                        tag = 0
                    }else{
                        // 还有数据，可以加载
                        tag = 1
                    }
                    var array = [];
                    if (pagenum > 1) {
                        array = dataSource.concat(response.results);
                    }else{
                        array = response.results;
                    }
                    callback(array, tag, false);
        
                }, (err) => {
                    this.hideLoading();
                    callback(null, null, true);
                    console.log(2);
                });
            }
        })
    }
    // 一键已读
    _fetchSetMsgRead(){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "put",
                    url = Http.forumSetMsgRead,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    // 刷新数据
                    this.reloadPage();
                }, (err) => {
                    console.log(2);
                });
            }
        })
    }
    // 消息详情
    _fetchMessageDetail(item){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.forumMessageDetail(item.pk),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if(response.detail){
                        Utils.showMessage("该帖子已被删除！");
                    }else{
                        this.props.navigation.navigate('Forum_Details', { data: item.from_id, name:'news',callback:(msg)=>{
                            // 刷新数据
                            this.reloadPage();
                        }})
                    }
                }, (err) => {
                    console.log(2);
                });
            }
        })
    }
    // -----------------------------------点击事件
    // 隐藏动画，更改刷新状态
    hideLoading(){
        // this.setState({
        //     CBRefresh:'norefresh'
        // })
    }
    // 刷新本页
    reloadPage(){
        var that = this;
        that.refs.bcFlatlist._pullToRefresh();
        // that.setState({
        //     CBRefresh:'refresh'
        // })
    }
    // -----------------------------------UI
    renderNews(rowData){
        var time=Utils.dealTime(rowData.create_time);
        return (
            <TouchableOpacity onPress={this._fetchMessageDetail.bind(this,rowData)}
                    style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,padding:10}}>
                <View>
                    <Text numberOfLines={2} style={{fontSize:14,paddingBottom:10,color:'#201f1f'}}>{rowData.status=='read'?(<Text style={{color:'#cccccc',paddingRight:8,}}>[已读]</Text>):(<Text style={{color:'red',paddingRight:8,}}>[未读]</Text>)}   {rowData.text}</Text>
                    <Text style={{marginLeft:width*0.74,color:'#201f1f'}}>{time}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    render(){
        return (
            <View style={{flex:1}}>
                <BCFlatListView 
                    ref="bcFlatlist"
                    fetchData={this._fetchMessageList.bind(this)} 
                    renderItem={this.renderNews.bind(this)} 
                    // CBRefresh={this.state.CBRefresh}
                />
            </View>
        )
    }
}

var {height, width} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});
