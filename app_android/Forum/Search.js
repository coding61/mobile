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
  FlatList,
  DeviceEventEmitter
}from 'react-native';

import Http from '../utils/Http.js';
import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import BCFlatListView from '../Component/BCFlatListView.js';

export default class Search extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // CBRefresh:'norefresh',          //是否要回调刷新，默认不刷新
        };
    }
 
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '搜索',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',borderBottomWidth:0.5,borderBottomColor:'#f1f1f1'},
            headerTitleStyle:{alignSelf:'auto',fontSize:14,},
            headerBackTitle:null,
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:20,alignItems:'center',backgroundColor:'transparent',}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginRight:10,backgroundColor:'#edeef0',borderColor: '#f1f1f1', borderRadius:5,borderWidth: 1,}}>
                        <Image style={{width:20,height:20,marginLeft:5,}} source={require('../assets/Forum/sousuo.png')}/>
                        <TextInput
                            style={{height: 30, width:width*0.6,marginRight:10,padding:0,paddingLeft:10,backgroundColor:'#edeef0'}}
                            onChangeText={(text)=>{
                                setParams({keyword:text})
                            }}
                            value={state.params.keyword}
                            placeholder='请输入帖子主题'
                            autoCapitalize='none'
                            underlineColorAndroid="transparent"
                            placeholderTextColor='#aaaaaa'
                            autoFocus={state.params.auto}
                            onSubmitEditing={()=>{
                                DeviceEventEmitter.emit('searchbutton', state.params.data)
                            }}
                            clearButtonMode='always'
                            blurOnSubmit={state.params.auto}
                        />
                    </View>
                    <TouchableOpacity  onPress={()=>{
                        DeviceEventEmitter.emit('searchbutton', state.params.data)
                    }} style={{alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#fff'}}>搜索</Text>
                    </TouchableOpacity>
                </View>
                )
        };
    };
    componentWillUnmount(){
        this.eventEm.remove();
    }
    componentDidMount(){
        this.eventEm = DeviceEventEmitter.addListener('searchbutton', (value)=>{
            const {setParams,state} = this.props.navigation;
            setParams({auto:false})
            // 刷新本页
            this.reloadPage();
        })
    } 
    // -----------------------------------网络请求
    // 搜索贴子列表
    _fetchSearchForumList(pagenum, dataSource, callback){
        var keyword = this.props.navigation.state.params.keyword;
        Utils.isLogin((token)=>{
            // if (token) {
                var type = "get",
                    url = Http.searchForumList(pagenum, keyword),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    this.hideLoading();
                    console.log(response);
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
            // }
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
    // 帖子详情页
    forumdetail(data){
        this.props.navigation.navigate('Forum_Details',{data:data.pk, keyword:'rend', name:'search', iscollect:data.collect,callback:(msg)=>{}})
    }
    // -----------------------------------UI
    renderForumRow(item){
        var rowData=item;
        var time_last=Utils.dealTime(rowData.last_replied?rowData.last_replied:rowData.create_time)
        return (
            <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:'center'}}>
                        {!rowData.userinfo.avatar?(<Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={{uri:rowData.userinfo.avatar}}/>)}
                        <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.userinfo.grade.current_name}</Text>
                    </View>
                    <View style={{paddingLeft:16,paddingRight:20,paddingTop:10,width:width*0.86,}}>
                        <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10,fontWeight: '400',}}>{rowData.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.status_display}]</Text>)}  {rowData.title}</Text>
                        <Text style={{paddingBottom:10,color:'#858585'}} numberOfLines={1}>{rowData.content}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.userinfo.name}</Text>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{time_last}</Text>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.browse_count}浏览</Text>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.reply_count}回答</Text>
                        </View>
                     </View>
                </View>
            </TouchableOpacity>
        )  
    }
    render(){
        return (
            <View style={{flex:1}}>
                <BCFlatListView 
                    ref="bcFlatlist"
                    fetchData={this._fetchSearchForumList.bind(this)} 
                    renderItem={this.renderForumRow.bind(this)} 
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

