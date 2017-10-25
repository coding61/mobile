/**
 * @author: chenwei
 * @description: 活动页
 * @time: 2017-07-18
 */
'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import EmptyView from '../Component/EmptyView.js';

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中
const JoinActivityTab = 1;    //加入活动的选项
const CreateActivityTab = 0;  //发布活动的选项

class MyActivity extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		loading:false,
            dataSource:[],               //页面加载的所有数据源
            footerLoadTag:LoadMore,      //默认是点击加载更多, FlatList，列表底部
            isRefresh:false,             //FlatList，头部是否处于下拉刷新
            pagenum:1,                   //活动列表第几页。默认1
            tab:JoinActivityTab,         //当前看到的是参加的活动选项内容
	  	};
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
        	headerTitle:"我的活动",
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
        }
    };
    componentWillMount() {
        this._fetchMyActivity(1);
    }
    componentDidMount() {
        this.props.navigation.setParams({
            addActivityEvent:this._clickAddActivity
        })
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    // ------------------------------------------网络请求
    //获取活动列表
    _fetchMyActivity(pagenum){
        // 区分是参加的还是发布的活动
        var tab = "join";
        if (this.state.tab == JoinActivityTab) {
            tab = "join"
        }else{
            tab = "create"
        }

        /*
        var dic = {
              "pk": 4,
              "name": "北京大学现场讲座",
              "password": "123456",
              "introduction": "通告，北京大学现场讲座，通告，北京大学现场讲座通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座。",
              "member_number": 1,
              "leader": {},
              "create_time": "2017-10-18T10:06:21.129728"
        }
        var array = [];
        
        if (pagenum > 3) {
            this.setState({footerLoadTag:LoadNoMore});
            var arr = [];
            for (var i = 0; i < 5; i++) {
                arr.push(dic);
            }
            array = this.state.dataSource.concat(arr);

        }else if(pagenum>1){
            this.setState({footerLoadTag:LoadMore});
            var arr = [];
            for (var i = 0; i < 10; i++) {
                arr.push(dic);
            }
            array = this.state.dataSource.concat(arr);
        }else{
            this.setState({footerLoadTag:LoadMore});
            for (var i = 0; i < 10; i++) {
                array.push(dic);
            }
        }
        this.setState({
            loading:true,
            dataSource:array,
        });
        */
        
        
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.myAcitivitys(pagenum, tab),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };
                    
                    if (response.next == null) {
                        //如果 next 字段为 null, 则数据已加载完毕
                        this.setState({footerLoadTag:LoadNoMore});
                    }else{
                        // 还有数据，可以加载
                        this.setState({footerLoadTag:LoadMore});
                    }
                    var array = [];
                    if (pagenum > 1) {
                        array = this.state.dataSource.concat(response.results);
                    }else{
                        array = response.results;
                    }

                    this.setState({
                        isRefresh:false,
                        loading:true,
                        dataSource:array,
                    });

                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
        
    }
    //获取活动详情
    _fetchActivityDetail(pk){
        /*
        var dic = {
              "pk": 4,
              "name": "北京大学现场讲座",
              "password": "123456",
              "introduction": "通告，北京大学现场讲座，通告，北京大学现场讲座通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座。",
              "member_number": 1,
              "club_member": [],
              "isjoin": false,
              "isLeader":true,
              "create_time": "2017-10-18T10:06:21.129728"
        }
        var dic1 = {
            "pk": 5,
            "owner": {
                "pk": 2,
                "name": "三十三",
                "avatar": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM6n2icNq7G9jdaqwcaeiaianPDPOZVdmDiaxpoOPzicEzDlR6Picqx2lzBlCic3pqYIzJesgLW8fjTE9icxIEybx5YjpTVnEnKHkR2ZKyU/0",
                "experience": 120,
                "diamond": 17,
                "remark": "",
                "olduser": true,
                "grade": {
                    "next_name": "青铜3",
                    "current_name": "青铜4",
                    "current_all_experience": 90,
                    "next_all_experience": 188
                },
                "is_staff": false,
                "isactive": false
            },
            "leader": true
        }
        var dic2 = {
          "pk": 1,
          "owner": null,
          "leader": true
        }
        var array = [];
        for (var i = 0; i < 12; i++) {
            array.push(dic2);
        }
        for (var i = 0; i < array.length; i++) {
            if(array[i].leader == true){
                dic["leaderName"] = array[i].owner?array[i].owner.name:"管理员";
                dic["leaderAvatar"] = array[i].owner?array[i].owner.avatar:"https://static1.bcjiaoyu.com/binshu.jpg";
                break;
            }
        }
        dic["club_member"] = array; 
        
        
        this.setState({
            loading:true,
            data:dic,
        });
        */
        
        
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.getActivityDetail(pk),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };
                    var array = this.state.dataSource;
                    for (var i = 0; i < array.length; i++) {
                        if(array[i].pk == response.pk){
                            // 替换数据
                            array[i].name = response.name;
                            array[i].introduction = response.introduction;
                            array[i].password = response.password;
                            array[i].member_number = response.member_number;
                            break;
                        }
                    }
                    this.setState({
                        dataSource:array
                    })

                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    // ------------------------------------------帮助方法
    // 去登录
    _goLogin(){
        this.props.navigation.navigate('Login', {callback:()=>{
            
        }})
    }
    // 参加的活动点击
    _clickJoinTab(){
        this.setState({
            tab:JoinActivityTab,
            pagenum:1,
        }, ()=>{
            this._fetchMyActivity(1);
        })
    }
    // 发布的活动点击
    _clickCreateTab(){
        this.setState({
            tab:CreateActivityTab,
            pagenum:1,
        }, ()=>{
            this._fetchMyActivity(1);
        })
    }
    // 点击加载更多
    _clickLoadMore(){
        if (this.state.footerLoadTag != LoadMore) {
            return;
        }
        
        // 请求下一页数据
        this.setState({
            footerLoadTag:LoadMoreIng    //加载更多->加载中
        });

        this.timer = setTimeout(() => {
            this.setState({
                pagenum:this.state.pagenum+1
            }, ()=>{
                this._fetchMyActivity(this.state.pagenum);
            }) 
        }, 500);
    }
    // 下拉刷新
    _pullToRefresh(){
        this.setState({isRefresh:true});
        this.timer = setTimeout(() => {
            this.setState({
                pagenum:1
            }, ()=>{
                this._fetchMyActivity(this.state.pagenum);
            }) 
        }, 500);
    }
    // 活动详情
    _pushActivityDetail(pk){
        this.props.navigation.navigate("ActivityDetail", {pk:pk, fromPage:"my", callback:(isChange, isDelete)=>{
            if (isChange) {
                if (this.state.tab === JoinActivityTab) {
                    // 删除我加入的这条活动
                    this._reloadDeletePage(pk);
                }else if (this.state.tab === CreateActivityTab) {
                    // 刷新本页
                    this._reloadPage(pk);
                }
            }
            // 解散活动
            if (isDelete) {
                if (this.state.tab == CreateActivityTab) {
                    // 删除我发布的某条活动
                    this._reloadDeletePage(pk);
                }
            }
        }})
    }
    // 删除加入的某条活动
    _reloadDeletePage(pk){
        
        var array = this.state.dataSource;
        for (var i = 0; i < array.length; i++) {
            if(array[i].pk == pk){
                // 删除数据
                array.splice(i, 1);
                break;
            }
        }
        this.setState({
            dataSource:array
        })
    }
    // 刷新页面
    _reloadPage(pk){
        // this._fetchActivityList(1);
        this._fetchActivityDetail(pk)
    }

	// ------------------------------------------活动列表
    //活动 item
    _renderItemActivity(item, index){
        return (
        	<TouchableOpacity onPress={this._pushActivityDetail.bind(this, item.pk)}>
            <View style={styles.item}>
            	<View style={styles.itemHeader}>
            		<Image
            		  style={{height:20}}
            		  source={require('../images/left.png')}
            		  resizeMode={'contain'}
            		/>
            		<Text style={styles.itemHeaderTitle}>
            		  {item.name}
            		</Text>
            		<Image
            		  style={{height:20}}
            		  source={require('../images/right.png')}
            		  resizeMode={'contain'}
            		/>
            	</View>

            	<View style={styles.itemMiddle}>
            		<Text style={styles.itemMiddleText}>
            		  {item.introduction}
            		</Text>
            	</View>

            	<View style={styles.itemBottom}>
            		<View style={styles.itemBottomView}>
	            		<Image
	            		  style={styles.itemBottomAvatar}
	            		  source={{uri:item.leader.avatar?item.leader.avatar:"https://static1.bcjiaoyu.com/binshu.jpg"}}
	            		/>
            			<Text style={styles.itemBottomText}>
            			  {item.leader.name?item.leader.name:"管理员"}
            			</Text>
            		</View>
            		<Text style={styles.itemBottomText}>
            		  已参加:{item.member_number}人
            		</Text>
            	</View>
            </View>
            </TouchableOpacity>
        )
    }
    _renderItem = ({item, index}) => (
        this._renderItemActivity(item, index)
    )
    _renderFooter = ()=>{
        return  <TouchableOpacity onPress={this._clickLoadMore.bind(this)}>
                    <Text style={styles.footerLoadMore}>{
                        this.state.footerLoadTag==LoadMore?"点击加载更多":this.state.footerLoadTag==LoadNoMore?"已经到尾了":"加载中..."}
                    </Text>
                </TouchableOpacity>
    }
    _keyExtractor = (item, index) => index;
    _renderTableView(){
        return (
            <View style={{flex:1}}>
            {/*******选项切换*******/}
                <View style={styles.tabs}>
                    <TouchableOpacity onPress={this._clickJoinTab.bind(this)} style={[styles.tab, this.state.tab===JoinActivityTab?styles.tabSelectView:styles.tab]}>
                    <View><Text style={this.state.tab===JoinActivityTab?styles.tabSelectText:styles.tabText}>参加的活动</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._clickCreateTab.bind(this)} style={[styles.tab, this.state.tab===CreateActivityTab?styles.tabSelectView:styles.tab]}>
                    <View><Text style={this.state.tab===CreateActivityTab?styles.tabSelectText:styles.tabText}>发布的活动</Text></View>
                    </TouchableOpacity>
                </View>
            {
                this.state.dataSource.length?
                    /******会话消息******/
                    <FlatList 
                        ref={(flatlist)=>this._flatList=flatlist}
                        style={{flex:1}}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        extraData={this.state}
                        keyExtractor={this._keyExtractor}
                        ListFooterComponent={this._renderFooter}
                        onRefresh={this._pullToRefresh.bind(this)}
                        refreshing={this.state.isRefresh}
                    />
                :
                    <EmptyView />
            }
            
                
            </View>
        )
    }
    
    // 页面加载中...
    _renderLoadingView(){
        return (
            <View style={styles.loadingView}>
                <Text>
                  Loading ...
                </Text>
            </View>
        )
    }
    _renderRootView(){
        if (!this.state.loading) {
            return this._renderLoadingView()
        }
        return(
            <View style={styles.container}>
                {this._renderTableView()}
            </View>
        )
    }
  	render() {
    	return (
        	<View style={styles.container}>
        		{this._renderRootView()}
        	</View>
    	);
  	}
}

const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const pinkColor = Utils.btnBgColor;
const whiteColor = Utils.btnBgColorS;
const fontBColor = Utils.fontBColor;
const fontSColor = Utils.fontSColor;
const lineColor = Utils.underLineColor;
const bgColor = Utils.bgColor;

const styles = StyleSheet.create({
	// -------------------------------------------------导航栏
    headerStyle:{
        backgroundColor:pinkColor
    },
    // -----------导航栏右部分
    headerRightView:{
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:'center', 
        marginRight:10
    },
    headerRightImg:{
        height:20
    },
    
    // -----------------------------------------------加载中
    loadingView:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    container:{
        flex:1,
        backgroundColor:bgColor
    },
    // ------------------------------------------tab 选项卡
    tabs:{
        height:40, 
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor:'white'
    },
    tab:{
        flex:1, 
        height:40, 
        alignItems:'center', 
        justifyContent:'center'
    },
    tabSelectView:{
        borderBottomColor:pinkColor, 
        borderBottomWidth:1.5, 
    },
    tabText:{
        color:fontBColor
    },
    tabSelectText:{
        color:pinkColor
    },

    // ------------------------------------------活动列表
    // --------------FlatList 的尾部
    footerLoadMore:{
        height:30, 
        lineHeight:30, 
        color:'gray', 
        textAlign:'center',
        marginBottom:10
    },
    item:{
    	flex:1, 
    	backgroundColor:'white', 
    	marginHorizontal:10, 
    	marginBottom:10, 
    	marginTop:10, 
    	borderRadius:5,
    },
    itemHeader:{
    	flexDirection:'row', 
    	justifyContent:'center', 
    	height:45, 
    	alignItems:'center'
    },
    itemHeaderTitle:{
    	fontSize:16, 
    	color:pinkColor, 
    	paddingHorizontal:5
    },
    itemMiddle:{
    	flexDirection:'row', 
    	borderBottomColor:lineColor, 
    	borderBottomWidth:1, 
    	paddingHorizontal:10, 
    	paddingBottom:10,
    },
    itemMiddleText:{
		fontSize:14, 
		color:fontBColor, 
		lineHeight:20, 
		textAlign:'justify', 
		height:80, 
		overflow:'hidden',
    },
    itemBottom:{
    	flexDirection:'row', 
    	justifyContent:'space-between', 
    	height:35, 
    	alignItems:'center', 
    	paddingHorizontal:10
    },
    itemBottomView:{
		flexDirection:'row', 
		alignItems:'center'
    },
	itemBottomAvatar:{
		
		width:20, 
		height:20, 
		marginRight:5, 
		borderRadius:10
	},
	itemBottomText:{
		color:fontSColor, 
		fontSize:12
	}


});


export default MyActivity;