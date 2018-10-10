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

var {height, width} = Dimensions.get('window');

import Http from '../utils/Http.js';
import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import LoadingView from '../Component/LoadingView.js';
import BCFlatListView from '../Component/BCFlatListView.js';

var basePath=Http.domain;

export default class ForumList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            moreshow:false,
            fourmbackcolor:['#f1f2ff','#fff0f4','#fff9ea','#f6ffec'],
            // CBRefresh:'norefresh',          //是否要回调刷新，默认不刷新
        };
    }

    static navigationOptions = ({ navigation }) => {
        var newscount = navigation.getParam("newscount", 0);
        return {
            title: '',
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14},
            headerBackTitle:null,
            headerLeft:(
                <View>
                    <TouchableOpacity  onPress={()=>{
                        DeviceEventEmitter.emit('addforum',2)
                    }} style={{width:70,height:30,marginLeft:10,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <Text style={{color:'#ffffff',fontSize:16}}>发布新帖</Text>
                    </TouchableOpacity>
                </View>
                ),
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:20,}}>
                    <TouchableOpacity  onPress={()=>{
                        DeviceEventEmitter.emit('search',2)
                    }} style={{alignItems:'center',justifyContent:'center',marginRight:20,}}>
                       <Image style={{width:20,height:20,}} source={require('../assets/Forum/sousuo-b.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:30,height:30,}} onPress={()=>{
                            DeviceEventEmitter.emit('newsmore', "1")
                    }}>
                        {newscount==0?(<Image style={{width:21,height:30,}} resizeMode="contain" source={require('../assets/Forum/news.png')}/>):(<Image style={{width:29,height:14,}} source={require('../assets/Forum/hasnews.png')}/>)}
                    </TouchableOpacity>
                </View>
                )
        };
    };
    componentWillMount(){
        this._fetchUnreadMessages();     //加载未读消息
    }
    componentDidMount(){

        // 监听点击更多
        this.eventEm = DeviceEventEmitter.addListener('newsmore', (value)=>{
            this.setState({
                moreshow:!this.state.moreshow,
            })
        })
        // 监听发布新帖按钮
        this.eventEmtt = DeviceEventEmitter.addListener('addforum', (value)=>{
            Utils.isLogin((token)=>{
                if(token){
                    this.props.navigation.navigate('ForumAdd',{data:value, token:token, callback:(msg)=>{
                        // 刷新本页(帖子列表)
                        this.reloadPage("forumList");
                    }})
                }else{
                    this.goLogin();
                }
            })
        })
        // 监听搜索按钮
        this.eventEmttsea = DeviceEventEmitter.addListener('search', (value)=>{
            this.props.navigation.navigate('Search',{keyword:'', callback:(msg)=>{
                // 刷新本页(帖子列表)
                this.reloadPage("forumList");
            }})
        })
        // 监听登录成功
        this.listenLogin = DeviceEventEmitter.addListener('listenLogin', () => {
            // 刷新本页(红点)
            this.reloadPage("unread");
        })
        //退出登录
        this.listenlogout = DeviceEventEmitter.addListener('logout', () => {
            // 刷新本页(红点)
            this.props.navigation.setParams({newscount:0});
        })
    }
    componentWillUnmount(){
        this.eventEmtt && this.eventEmtt.remove();
        this.eventEmttsea && this.eventEmttsea.remove();
        this.eventEm && this.eventEm.remove();
        this.listenLogin && this.listenLogin.remove();
        this.listenlogout && this.listenlogout.remove();
    }
    showLoading(){
        var that = this;
        that.setState({
            loading:true
        })
    }
    hideLoading(isError){
		var that = this;
		if (isError === true) {
			// 出现异常隐藏
			that.setState({
                loading:false,
                // CBRefresh:'norefresh',
	    	})
		}else{
	  		that.setState({
                loading:false,
                // CBRefresh:'norefresh',
	    	})
	  	}
	}
    // -----------------------------------网络请求
    // 获取帖子列表
    _fetchForumList(pagenum, dataSource, callback){
        var that = this;
        Utils.isLogin((token)=>{
            var type = "get",
                url = Http.forumList(pagenum),
                token = token,
                data = null;
            BCFetchRequest.fetchData(type, url, token, data, (response) => {
                that.hideLoading();
                console.log("帖子列表",response.results);
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
                that.hideLoading(true);
                callback(null, null, true);
                console.log(2);
            });
        })
    }
    // 获取未读的消息
    _fetchUnreadMessages(){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.forumUnreadMsg,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    this.props.navigation.setParams({newscount:response.count})    
                }, (err) => {
                    console.log(2);
                });
            }
        })
    }
    // ----------------------------------点击事件
    // 刷新页面
    reloadPage(tag){
        var that = this;
        if(tag = "unread"){
            // 刷新本页(红点)
            that._fetchUnreadMessages();
        }else if(tag == "forumList"){
            // 刷新本页(帖子列表)
            that.refs.bcFlatlist._pullToRefresh();
            // that.setState({
            //     CBRefresh:'refresh'
            // })
        }else{
            // 刷新本页(红点、帖子列表)
            that._fetchUnreadMessages();
            that.refs.bcFlatlist._pullToRefresh();
        }
    }
    // 去登录
    goLogin(){
        this.props.navigation.navigate("Login", {callback:()=>{
            // 刷新页面, 此处不做处理，放到登录成功的监听方法中处理
            // this.reloadPage("unread");
        }})
    }
    // 消息中心
    _newscenterClickEvent(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('NewsCenter',{callback:()=>{
                    // 刷新本页(红点)
                    this.reloadPage("unread");
                }});
                this.setState({
                    moreshow:false
                })
            }else{
                this.goLogin();
            }
        })
    }
    // 我的收藏
    _myCollectionClickEvent(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('MyCollect');
                this.setState({
                    moreshow:false
                })
            }else{
                this.goLogin();
            }
        })
    }
    // 我的帖子
    _myForumClickEvent(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('MyForum', {flag:'我的帖子'});
                this.setState({
                    moreshow:false
                })
            }else{
                this.goLogin();
            }
        })
    }
    // 排行榜
    _rankListClickEvent(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('RankingList');
                this.setState({
                    moreshow:false
                })
            }else{
                this.goLogin();
            }
        })
    }
    // 论坛详情页
    _forumDetailPage(data){
        this.props.navigation.navigate('Forum_Details', { data: data.pk, iscollect:data.collect,isFace2faceForum:data.isFace2faceForum,name:'list',callback:(msg)=>{
            // 刷新本页(帖子列表)
            this.reloadPage("forumList");
        }})
    }
    // 个人介绍页
    _personalPage(userinfo){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('PersonalPage', { data: userinfo });
            }else{
                this.goLogin();
            }
        })
    }
    
    // ----------------------------------UI
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
        var rowData=item;
        var time_last=Utils.dealTime(rowData.last_replied?rowData.last_replied:rowData.create_time);
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
            <TouchableOpacity onPress={this._forumDetailPage.bind(this,rowData)}
                style={{width: width,flex:1, backgroundColor: forumbackcolor,borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:'center',paddingTop:10,}}>
                        <TouchableOpacity style={{width:70,height:70,}} onPress={this._personalPage.bind(this, rowData.userinfo)}>
                            {!rowData.userinfo.avatar?(
                                <Image style={{width:50,height:50,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>
                            ):(
                                <View style={{alignItems:'center',justifyContent:'center'}}>
                                    <Image style={{width:50,height:50,borderRadius:25,marginRight:7,marginTop:6,}} source={{uri:rowData.userinfo.avatar}}/>
                                    {headimg?(<Image style={{width:60,height:60,borderRadius:30,position:'absolute',left:0,top:0,}} source={{uri:headimg}}/>):(null)}
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{paddingTop:3,fontSize:12,color:'#6E7B8B'}}>{rowData.userinfo.grade.current_name}</Text>
                        {this.rendertop(rowData.userinfo.top_rank)}
                    </View>
                    <View style={{paddingLeft:16,paddingRight:20,paddingTop:10,width:width*0.83,}}>
                        <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10,fontWeight: '400',}}>{rowData.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.status_display}]</Text>)}  {rowData.title}</Text>
                        <Text style={{fontSize:14,paddingBottom:10,color:'#aaaaaa',}}>所属专区：{rowData.section.name}</Text>
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
                    type={'scroll'} 
                    fetchData={this._fetchForumList.bind(this)} 
                    renderItem={this.renderForumRow.bind(this)} 
                    // CBRefresh={this.state.CBRefresh} 
                    hasEmptyRefresh={true}/>
                {
                    this.state.moreshow?
                        <View style={{position:'absolute',backgroundColor:'#ffffff',top: 0,borderRadius:5,alignItems:'center',right: 10,borderWidth:0.5,borderColor:'#aaaaaa',paddingRight:5,paddingLeft:8,}}>
                            <View style={{borderBottomWidth:1,borderBottomColor:'#aaaaaa'}}>
                                <Text onPress={this._newscenterClickEvent.bind(this)} style={{padding:15,}}>消息中心</Text>
                                {this.props.navigation.state.params && this.props.navigation.state.params.newscount!=0?(<View style={{position:'absolute',top:12,right:10,width:8,height:8,borderRadius:4,backgroundColor:'red'}}></View>):(null)}
                            </View>
                            <View style={{borderBottomWidth:1,borderBottomColor:'#aaaaaa'}}><Text onPress={this._myCollectionClickEvent.bind(this)} style={{padding:15,}}>我的收藏</Text></View>
                            <View style={{borderBottomWidth:1,borderBottomColor:'#aaaaaa'}}><Text onPress={this._myForumClickEvent.bind(this)} style={{padding:15,}}>我的帖子</Text></View>
                            <View><Text onPress={this._rankListClickEvent.bind(this)} style={{padding:15,}}>排行榜</Text></View>
                        </View>
                    :   null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
