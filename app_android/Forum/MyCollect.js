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

var basePath=Http.domain;
export default class MyCollect extends Component{
    constructor(props) {
        super(props);
        this.state = {
            // CBRefresh:'norefresh',          //是否要回调刷新，默认不刷新
        };
    }
 
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '我的收藏',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14,marginLeft:width*0.28},
            
        };
    };
    componentWillUnmount(){
    }
    componentDidMount(){
    }
    // -----------------------------------网络请求
    // 获取帖子列表
    _fetchForumList(pagenum, dataSource, callback){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.myCollectForumList(pagenum),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    // console.log(response.results);
                    this.hideLoading();
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
    // 帖子详情
    forumdetail(data){
        this.props.navigation.navigate('Forum_Details', { data: data.pk, iscollect:data.collect,name:'collect',callback:(msg)=>{
            // 刷新数据
            this.reloadPage();
        }})
    }
    // ---------------------------------------UI
    rendertop(top){
        if(top==null){
            return;
        }
        if(top=='Top10'){
            return(<Image style={{width:50,height:20,}} resizeMode={'contain'} source={require('../assets/Forum/10.png')}/>)
        }
        if(top=='Top50'){
            return(<Image style={{width:50,height:20,}} resizeMode={'contain'} source={require('../assets/Forum/50.png')}/>)
        }
        if(top=='Top100'){
            return(<Image style={{width:50,height:20,}} resizeMode={'contain'} source={require('../assets/Forum/100.png')}/>)
        }
    }
    renderForumRow(item){
        var rowData=item.posts;
        var time_last=Utils.dealTime(rowData.last_replied);
        var headimg='';
        var forumbackcolor='#fff';
        if(rowData.userinfo.props.length>0){
            for(var i=0;i<rowData.userinfo.props.length;i++){
                if(rowData.userinfo.props[i].status==1){
                    if(rowData.userinfo.props[i].exchange_product.product_type==1){
                        if(rowData.userinfo.props[i].exchange_product.category_detail.action=='background'){
                            forumbackcolor=rowData.userinfo.props[i].exchange_product.category_detail.desc
                        }else if(rowData.userinfo.props[i].exchange_product.category_detail.action=='avatar'){
                            headimg=rowData.userinfo.props[i].exchange_product.image
                        }
                    }
                }
            }
        }
        return (
            <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                style={{width: width,flex:1, backgroundColor:forumbackcolor,borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:'center',paddingTop:6,}}>
                        {!rowData.userinfo.avatar?(
                            <Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>
                            ):(
                            <View style={{alignItems:'center',justifyContent:'center'}}>
                                <Image style={{width:50,height:50,borderRadius:25,marginLeft:3,marginTop:5,}} source={{uri:rowData.userinfo.avatar}}/>
                                <View style={{position:'absolute',top:-3,left:-3,width:60,height:60,alignItems:'center',justifyContent:'center'}}>
                                    {headimg?(<Image style={{width:60,height:60,borderRadius:35,}}  source={{uri:headimg}}/>):(null)}
                                </View>
                            </View>
                            )}
                        <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.userinfo.grade.current_name}</Text>
                        {this.rendertop(rowData.userinfo.top_rank)}
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
                    fetchData={this._fetchForumList.bind(this)} 
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

