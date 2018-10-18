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
  FlatList,
  Alert,
  RefreshControl,
  WebView,
  DeviceEventEmitter,
  Button,
  AsyncStorage,
  NativeModules
}from 'react-native';

import Http from '../utils/Http.js';
import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import LoadingView from '../Component/LoadingView.js';
import BCFlatListView from '../Component/BCFlatListView.js';
import ForumDeatilCont from './ForumDeatilCont';

var UMeng = require('react-native').NativeModules.RongYunRN;

export default class Forum_Details extends Component{
    constructor(props) {
        super(props);
        this.state = {
            pk:this.props.navigation.state.params.data,      //帖子的pk
            data:'',                                         //帖子详情数据
            UserInfo:null,                                   //用户信息数据
            UserPk:null,                                     //用户的pk
            // CBRefresh:'norefresh',                           //回调刷新(帖子的回复)
            loading:true                                     //等待视图
        }
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14},
            headerRight:
                (
                    <View style={{flexDirection:'row', marginRight: 5}}>
                        <TouchableOpacity style={{width: 25, height: 40, marginRight:20, justifyContent: 'center', alignItems: 'center'}} onPress={()=>{
                            DeviceEventEmitter.emit('collec', state.params.data)
                        }}>
                            {state.params.iscollect==true?(<Image style={{width:22,height:20,}} source={require('../assets/Forum/xin.png')} resizeMode={'contain'}/>):(<Image style={{width:22,height:20,}} source={require('../assets/Forum/xinfull.png')} resizeMode={'contain'}/>)}
                        </TouchableOpacity>
                        <TouchableOpacity style={{width: 25, height: 40, marginTop:3, justifyContent: 'center', alignItems: 'center'}} onPress={navigation.getParam("commentBtnForNavigationBar", null)}>
                            <Image style={{width:22,height:20,}} source={require('../assets/Forum/message.png')} resizeMode={'contain'}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navRightBtn} onPress={navigation.state.params ? navigation.state.params.navRightBtnClick : null}>
                            <Text style={styles.navRightTxt}>分享</Text>
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
        this.eventEm.remove();
    }
    componentWillMount(){
        this._fetchForumDetail();
        this._fetchWhoamI();
    }
    componentDidMount() {
        // 分享按钮点击
        this.props.navigation.setParams({
            navRightBtnClick: this._shareWeChat.bind(this),
            commentBtnForNavigationBar:this.commentBtnForNavigationBar.bind(this, this.state.pk),
        })
        
        // 收藏按钮点击
        this.eventEmss = DeviceEventEmitter.addListener('collec', (value)=>{
            this._fetchCollectForum(value);
        })
        
        // 评论帖子按钮点击
        this.eventEm = DeviceEventEmitter.addListener('message', (value)=>{
            this.commentBtnForNavigationBar(value);
        })
    }
    
    // ------------------------------网络请求
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
		}else if (that.state.data) {
	  		that.setState({
                loading:false,
                // CBRefresh:'norefresh',
	    	})
	  	}
	}
    // 帖子详情
    _fetchForumDetail(){
        var that = this;
        Utils.isLogin((token)=>{
            let HttpUrl,Token;
            HttpUrl = Http.forumDetail(this.state.pk);
            Token = token;

            var type = "get",
                data = null;
            BCFetchRequest.fetchData(type, HttpUrl, Token, data, (response) => {
                // console.log("帖子详情",response);
                that.setState({
                    data:response,
                })
                const {setParams,state} = that.props.navigation;
                setParams({
                    iscollect:response.collect
                })
                // that.hideLoading();
            }, (err) => {
                console.log(2);
                that.hideLoading(true);
            });
        })
    }
    // 获取个人信息
    _fetchWhoamI(){
        var that = this;
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.whoami,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    // console.log("个人信息", response);
                    that.setState({
                        UserInfo:response,
                        UserPk:response.pk,
                    })
                }, (err) => {
                    console.log(2);
                    that.hideLoading(true);
                });
            }
        })
    }
    // 获取帖子的回复列表
    _fetchReplysList(pagenum, dataSource, callback){
        var that = this;
        Utils.isLogin((token)=>{
            let HttpUrl,Token;
            HttpUrl = Http.forumReplyList(this.state.pk,pagenum);
            Token = token;

            var type = "get",
                data = null;
            BCFetchRequest.fetchData(type, HttpUrl, Token, data, (response) => {
                that.hideLoading();
                // console.log("回帖列表",response);
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
    // 收藏帖子
    _fetchCollectForum(value){
        var dic = {"types":"posts", "pk":value};
        Utils.isLogin((token)=>{
            if (token) {
                var type = "put",
                    url = Http.collectForum,
                    token = token,
                    data = dic;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    const {setParams,state} = this.props.navigation;
                    if (response.message == '取消收藏') {
                        Utils.showMessage("取消收藏");
                        setParams({
                            iscollect:false
                        })
                    } else if (response.message == '收藏成功') {
                        Utils.showMessage("收藏成功");
                        setParams({
                            iscollect:true
                        })
                    }
                }, (err) => {
                    console.log(2);
                });
            }else{
                this.goLogin();
            }
        })
    }
    // 删除帖子, 回帖，回复
    _fetchDeleteForumOrReply(pk, tag){
        console.log(pk, tag);
        if (tag === "reply") {
            // 删除回帖
            var curl = Http.deleteForumReply(pk);
            var msg = "确定删除回帖吗？";
        }else if (tag === "replyAgain") {
            // 删除回帖的回复
            var curl = Http.deleteForumReplyAgain(pk);
            var msg = "确定删除回复吗？";
        }else{
            // 删除帖子
            var curl = Http.deleteForum(pk);
            var msg = "确定删除帖子吗？";
        }
        var that = this;
        Utils.showAlert("提示", msg, ()=>{
            Utils.isLogin((token)=>{
                if (token) {
                    var type = "delete",
                        url = curl,
                        token = token,
                        data = null;
                    BCFetchRequest.fetchData(type, url, token, data, (response) => {
                        console.log("删除帖子",response);
                        if (response === 204) {
                            if (tag === "post") {
                                // 返回上一页
                                that.props.navigation.goBack();
                            }else{
                                // 刷新本页(回帖)
                                that.reloadPage("reply");
                            }
                        }
                    }, (err) => {
                        console.log(2);
                    });
                }
            })
        },()=>{}, "确定", "取消");
    }
    // 标记已解决(0)，未解决(2)，关闭问题(1)
    _fetchForumTag(tag){
        if (tag == 0) {
            var statetag = "solved";
        }else if (tag == 1) {
            var statetag = "finish"
        }else{
            var statetag = "unsolved"
        }
        var dic = {}
        dic = {"status":statetag}

        Utils.isLogin((token)=>{
            if (token) {
                var type = "patch",
                    url = Http.forumDetail(this.state.pk),
                    token = token,
                    data = dic;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    // 刷新本页(帖子)
                    this.reloadPage("post");
                }, (err) => {
                    console.log(2);
                });
            }
        })
    }
    // 帖子，加精(1)，取消加精(0)，置顶(3)，取消置顶(2)
    _fetchForumManager(index){
        if (index === 0) {
            var curl = Http.cancelForumEssence(this.state.pk)
        }else if (index === 1) {
            var curl = Http.forumEssence(this.state.pk)
        }else if (index === 2) {
            var curl = Http.cancelForumTop(this.state.pk)
        }else if (index === 3) {
            var curl = Http.forumTop(this.state.pk)
        }
        Utils.isLogin((token)=>{
            if (token) {
                var type = "put",
                    url = curl,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    // 刷新本页(帖子)
                    this.reloadPage("post");
                }, (err) => {
                    console.log(2);
                });
            }
        })
    }

    // --------------------------------点击事件
    // 去登录
    goLogin(){
        var that = this;
        that.props.navigation.navigate("Login", {callback:()=>{
            // 登录成功刷新页面，主要是跟自己相关的组件变化
            // 刷新本页(回帖/帖子)
            that.reloadPage();
        }});
    }
    // 刷新本页
    reloadPage(tag){
        var that = this;
        if(tag == "post"){
            // 刷新帖子
            that._fetchForumDetail();
        }else if(tag == "reply"){
            // 刷新帖子的回复
            that.refs.bcFlatlist._pullToRefresh();
            // that.setState({
            //     CBRefresh:'refresh'
            // })
            // this._fetchReplysList();
        }else{
            // 刷新帖子、回帖
            that._fetchForumDetail();
            that.refs.bcFlatlist._pullToRefresh();
        }
    }
    // 导航评论点击事件
    commentBtnForNavigationBar = (value)=> {
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('CommentText', {data: value, name:'main', userinfo:'',callback:(msg)=>{
                    // 刷新本页(回帖)
                    this.reloadPage("reply");
                }})
            }else{
                this.goLogin();
            }
        })
    }
    // 分享事件
    _shareWeChat = () => {
        if (!this.state.data.title) {
            Alert.alert('正在获取帖子详情，请稍后...');
            return;
        }
        var title = this.state.data.title;
        var content = this.state.data.content;
        var shareUrl = Http.shareForumUrl(this.state.pk);
        var imgUrl = Http.shareLogoUrl;    // 默认图标
        UMeng.rnShare(title, content, shareUrl, imgUrl, (callBackEvents)=>{
            if (callBackEvents == '分享成功') {

            } else if (callBackEvents == '分享失败') {
                Alert.alert('分享失败');
            } else if (callBackEvents == '已取消分享') {
                Alert.alert('已取消分享');
            }
        })
    }
    // 回复评论点击
    Show_Comment(pk,userinfo){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('CommentText', {data: pk,userinfo:userinfo,name:'reply',callback:(msg)=>{
                    // 刷新本页(回帖)
                    this.reloadPage("reply");
                }})
            }else{
                this.goLogin();
            }
        })
    }
    // 他人信息页
    goPersonalPage(userinfo) {
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('PersonalPage', { data: userinfo });
            }else{
                this.goLogin();
            }
        })
    }
    // 回帖的打赏
    givereplyprize(owner,pk){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('PersonalReward', { owner: owner,replypk:pk,flag:'reply',callback: (msg)=>{
                    // 刷新本页(回帖)
                    this.reloadPage("reply");
                }});
            }else{
                this.goLogin();
            }
        })
    }
    // 帖子打赏
    giveprize(owner,pk){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('PersonalReward', { owner: owner,replypk:pk,flag:'post',callback: (msg)=>{
                    // 刷新本页(帖子)
                    this.reloadPage("post");
                } });
            }else{
                this.goLogin();
            }
        })
    }

    // --------------------------------UI
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
        var reward='';
        if(rowData.play_reward.play_reward_number>0&&rowData.play_reward.play_reward_number<4){
            reward=rowData.play_reward.play_reward_pople.join('、')
        }else if(rowData.play_reward.play_reward_number>4){
            reward=rowData.play_reward.play_reward_pople.slice(0,4).join("、")+'等'
        }
        var headimg='';
        var forumbackcolor='#ffffff';
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
            <View style={{width: width,flex:1, backgroundColor:'#fff',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',paddingTop:10,backgroundColor:forumbackcolor,width:width,paddingRight:10,}}>
                    <View style={{alignItems:'center',paddingBottom:5,paddingLeft:20,}}>
                        <TouchableOpacity style={{width:45,height:45,}} onPress={this.goPersonalPage.bind(this, rowData.userinfo)}>
                            {!rowData.userinfo.avatar ? (
                                <Image style={{width:45,height:45,borderRadius:15,}} source={require('../assets/Forum/defaultHeader.png')}/>
                            ) : (
                                <View style={{alignItems:'center',justifyContent:'center',width:45,height:45,}}>
                                    <Image style={{width:30,height:30,borderRadius:15,}} source={{uri:rowData.userinfo.avatar}}/>
                                    <View style={{position:'absolute',top:0,left:0,width:45,height:45,alignItems:'center',justifyContent:'center'}}>
                                        {headimg?(<Image style={{width:45,height:45,borderRadius:25,}}  source={{uri:headimg}}/>):(null)}
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{marginLeft:5,fontSize:10,color:'#ff6b94',}}>{rowData.userinfo.grade.current_name}</Text>
                        {this.rendertop(rowData.userinfo.top_rank)}
                    </View>
                    <View style={{paddingLeft:20,paddingRight:10,width:width*0.6,}}>
                        <Text style={{paddingBottom:10,color:'#858585'}}>{rowData.userinfo.name}</Text>
                        <Text style={{paddingBottom:10,color:'#858585'}}>{rowData.create_time.slice(0, 16).replace("T", " ")}</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <TouchableOpacity style={{marginTop:3,marginRight:15,marginBottom:4,}} onPress={this.Show_Comment.bind(this,rowData.pk,rowData.userinfo.name)}>
                            <Image style={{width:22,height:20,}} source={require('../assets/Forum/mess.png')} resizeMode={'contain'}/>
                        </TouchableOpacity>
                        {this.state.UserPk==rowData.userinfo.pk?(
                            <TouchableOpacity onPress={this._fetchDeleteForumOrReply.bind(this,rowData.pk, "reply")} style={{marginLeft:3,alignItems:'center',justifyContent:'center'}}>
                                <Text  style={{fontSize:12,paddingRight:5,paddingLeft:5,color:'red',}}>删除</Text>
                            </TouchableOpacity>
                            ):(null)}
                        {this.state.UserPk!=rowData.userinfo.pk?(
                            <Text onPress={this.givereplyprize.bind(this, rowData.userinfo.owner,rowData.pk)} style={{fontSize:14,paddingBottom:10,marginLeft:10,paddingRight:10,marginTop:3,color:'#999',}}>打赏</Text>
                            ):(null)}
                    </View>
                </View>
                {rowData.content?(<ForumDeatilCont data={rowData.content} style={{paddingLeft:10,}}></ForumDeatilCont>):(null)}
                {rowData.play_reward.play_reward_number>0?(<Text style={{color:'#999',paddingLeft:20,paddingBottom:10,}}>{reward+" "+rowData.play_reward.play_reward_number+"人打赏"}</Text>):(null)}
                {rowData.replymore.map((result,index)=> {
                    return(
                        <View key={index} style={{backgroundColor:'#f1f1f1',width:width*0.9,marginLeft:width*0.05,marginRight:width*0.05,borderBottomColor:'#D3D3D3',borderBottomWidth:0.5,}}>
                            <View style={{flexDirection:'row',paddingTop:10,paddingLeft:20,}}>
                                <Text style={{paddingBottom:10,color:'#4f99cf',marginRight:30, maxWidth:100, }}>{result.userinfo.name}</Text>
                                <Text style={{paddingBottom:10,color:'#858585'}}>{result.create_time.slice(0, 16).replace("T", " ")}</Text>
                                <TouchableOpacity style={{marginLeft:20,}} onPress={this.Show_Comment.bind(this,rowData.pk,result.userinfo.name)}>
                                    <Image style={{width:22,height:20,}} source={require('../assets/Forum/mess.png')} resizeMode={'contain'}/>
                                </TouchableOpacity>

                                {this.state.UserPk==result.userinfo.pk?(
                                    <Text onPress={this._fetchDeleteForumOrReply.bind(this,result.pk, "replyAgain")} style={{fontSize:14,marginTop:3,color:'red',marginLeft:10,}} >删除</Text>
                                ):(null)}
                            </View>
                            {result.content?(<ForumDeatilCont data={result.content}></ForumDeatilCont>):(null)}
                        </View>
                    )
                })}
            </View>
        )
    }
    renderHeadView(){
        var data=this.state.data;
        var reward='';
        // 打赏
        if(data.play_reward.play_reward_number>0&&data.play_reward.play_reward_number<4){
            reward=data.play_reward.play_reward_pople.join('、')
        }else if(data.play_reward.play_reward_number>4){
            reward=data.play_reward.play_reward_pople.slice(0,4).join("、")+'等'
        }
        var headimg='';
        var forumbackcolor='#F2F2F2';
        if(data.userinfo.props.length>0){
            for(var i=0;i<data.userinfo.props.length;i++){
                if(data.userinfo.props[i].status==1){
                    if(data.userinfo.props[i].exchange_product.product_type==1){
                        if(data.userinfo.props[i].exchange_product.category_detail.action=='background'){
                            forumbackcolor=data.userinfo.props[i].exchange_product.category_detail.desc
                        }else if(data.userinfo.props[i].exchange_product.category_detail.action=='avatar'){
                            headimg=data.userinfo.props[i].exchange_product.image
                        }
                    }
                }
            }
        }
        return(
            <View>
                <Text style={{fontSize:16,color:'#292929',padding:15,}} selectable={true}>{data.status_display=='未解决'?(<Text style={{color:'#ff6b94',marginRight:10,}}>[{data.status_display}]</Text>):(<Text style={{color:'#858585',paddingRight:10,}}>[{data.status_display}]</Text>)}   {data.title}</Text>
                <View style={{flexDirection:'row',padding:10,width:width,alignItems:'center',backgroundColor:forumbackcolor}}>
                    <View style={{alignItems:'center',paddingLeft:20,}}>
                        <TouchableOpacity style={{width:70,height:70}} onPress={this.goPersonalPage.bind(this, data.userinfo)}>
                            {!data.userinfo.avatar ? (
                                <Image style={{width:50,height:50,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>
                            ) : (
                                <View style={{alignItems:'center',justifyContent:'center',paddingTop:5,}}>
                                    <Image style={{width:50,height:50,borderRadius:25,}} source={{uri:data.userinfo.avatar}}/>
                                    <View style={{position:'absolute',top:-5,left:0,width:70,height:70,alignItems:'center',justifyContent:'center'}}>
                                        {headimg?(<Image style={{width:60,height:60,borderRadius:25,}}  source={{uri:headimg}}/>):(null)}
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={{paddingTop:10,color:'#FF69B4',}}>{data.userinfo.grade.current_name}</Text>
                        {this.rendertop(data.userinfo.top_rank)}
                    </View>
                    <View style={{paddingLeft:20,paddingRight:10,width:width*0.64,}}>
                        <Text style={{paddingBottom:10,color:'#858585'}}>{data.userinfo.name}</Text>
                        <Text style={{paddingBottom:5,color:'#858585'}}>{data.create_time.slice(0, 16).replace("T", " ")}</Text>
                        <Text style={{color:'#FF6A6A'}}>[{data.types.name}]</Text>
                    </View>
                    {this.state.UserPk!=data.userinfo.pk?(
                        <Text onPress={this.giveprize.bind(this, data.userinfo.owner,data.pk)} style={{fontSize:14,paddingBottom:10,color:'#999',}}>打赏</Text>
                        ):(null)}
                </View>
                <View style={{marginBottom:10,}}>
                        {this.state.data.content?(<ForumDeatilCont data={this.state.data.content} ></ForumDeatilCont>):(null)}
                        <View style={{flexDirection:'row'}}>
                            {data.userinfo.pk==this.state.UserPk?(
                                    <View style={{flexDirection:'row',marginLeft:30,}}>
                                        {data.status=='unsolved'?(
                                            <View style={{flexDirection:'row'}}>
                                                <Text onPress={this._fetchForumTag.bind(this,0)} style={{color:'#ff6b94',marginRight:30,}}>标记为已解决</Text>
                                                <Text onPress={this._fetchForumTag.bind(this,1)} style={{color:'#ff6b94',marginRight:30,}}>关闭问题</Text>
                                            </View>
                                        ):(
                                            <Text onPress={this._fetchForumTag.bind(this,2)} style={{color:'#ff6b94',marginRight:30,}}>标记为未解决</Text>
                                        )}
                                    </View>
                                ):(null)}
                            {(this.state.UserInfo && this.state.UserInfo.is_staff||data.userinfo.pk==this.state.UserPk)?(<Text onPress={this._fetchDeleteForumOrReply.bind(this, this.state.pk, "post")} style={{color:'#ff6b94',marginLeft:30,fontSize:16,}}>删除此贴</Text>):(null)}
                        </View>
                            {this.state.UserInfo && this.state.UserInfo.is_staff?(
                                <View style={{flexDirection:'row',paddingLeft:30,marginTop:10,}}>
                                    {data.isessence?(<Text style={{color:'#FF6A6A',marginRight:20,}} onPress={this._fetchForumManager.bind(this,0)}>取消加精</Text>):(<Text style={{color:'#FF6A6A',marginRight:20,}} onPress={this._fetchForumManager.bind(this,1)}>加精</Text>)}
                                    {data.istop?(<Text style={{color:'#FF6A6A'}} onPress={this._fetchForumManager.bind(this,2)}>取消置顶</Text>):(<Text style={{color:'#FF6A6A'}} onPress={this._fetchForumManager.bind(this,3)}>置顶</Text>)}
                                </View>
                                ):(null)}
                            {data.play_reward.play_reward_number>0?(<Text style={{color:'#999',paddingLeft:20,paddingTop:10, width:width-40}}>{reward+" "+data.play_reward.play_reward_number+"人打赏"}</Text>):(null)}
                            <Text style={{backgroundColor:'#f2f2f2',color:'#292929',paddingTop:8,paddingLeft:20,paddingBottom:8,marginTop:10,}}>回帖数量({data.reply_count})</Text>
                    </View>
            </View>
        )
    }
    renderMainView() {
        return(
            <View style={{flex:1,backgroundColor:'#ffffff', flexDirection:'row'}}>
                <BCFlatListView 
                    ref="bcFlatlist"
                    type={'distance'} 
                    fetchData={this._fetchReplysList.bind(this)} 
                    renderItem={this.renderForumRow.bind(this)} 
                    headerComponent={this.renderHeadView.bind(this)}
                    // CBRefresh={this.state.CBRefresh} 
                    showLoading={false}/>
            </View>
        )
    }
    render(){
        return (
            <View style={{flex:1}}>
            {this.state.data? this.renderMainView() : null}
            {
                this.state.loading?<LoadingView />:null
            }
            </View>
        )
    }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    navRightBtn: {
        width: 60,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    navRightTxt: {
        color: 'white',
        fontSize: 15,
        marginTop: 2
    }
})
