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
  Image,
  DeviceEventEmitter
} from 'react-native';

import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

import EmptyView from '../Component/EmptyView.js';
import LoadingView from '../Component/LoadingView.js';
import CompeteView from '../Activity/CompeteView.js';

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中
const ActivityTab = 1;    //加入活动的选项
const CompeteTab = 0;  //发布活动的选项
class Activity extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		loading:true,
            dataSource:[],               //页面加载的所有数据源
            footerLoadTag:LoadMore,      //默认是点击加载更多, FlatList，列表底部
            isRefresh:false,             //FlatList，头部是否处于下拉刷新
            pagenum:1,                   //活动列表第几页。默认1
	  	};
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
        	headerTitle:state.params && state.params.tab == CompeteTab?
                    <View style={styles.headerTitleTabs}>
                        <TouchableOpacity style={[styles.headerTitleTab, {flex:1}]} onPress={()=>{DeviceEventEmitter.emit('navigateTabPress', ActivityTab)}}><Text style={[styles.headerTitleTabText,]}>{"活动"}</Text></TouchableOpacity>
                        <View style={[styles.headerTitleTab, {flex:1}]}><View style={[styles.headerTitleTab, styles.headerTitleTabSelect]}><Text style={[styles.headerTitleTabText, styles.headerTitleTabTextSelect]}>{"竞赛"}</Text></View></View>
                    </View>
                :
                    <View style={styles.headerTitleTabs}>
                        <View style={[styles.headerTitleTab, {flex:1}]}><View style={[styles.headerTitleTab, styles.headerTitleTabSelect]}><Text style={[styles.headerTitleTabText, styles.headerTitleTabTextSelect]}>{"活动"}</Text></View></View>
                        <TouchableOpacity style={[styles.headerTitleTab, {flex:1}]} onPress={()=>{DeviceEventEmitter.emit('navigateTabPress', CompeteTab)}}><Text style={styles.headerTitleTabText}>{"竞赛"}</Text></TouchableOpacity>
                    </View>
            ,
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
            headerRight:state.params && state.params.tab == CompeteTab?
                    null
                :
                	<TouchableOpacity onPress={state.params?state.params.addActivityEvent:null}>
                        <View style={styles.headerRightView}>
                            <Image
                              style={styles.headerRightImg}
                              source={require('../images/add.png')}
                              resizeMode={'contain'}
                            />
                        </View>
                    </TouchableOpacity>
        }
    };
    componentWillMount() {
        this._fetchActivityList(1);
    }
    componentDidMount() {
        this.props.navigation.setParams({
            addActivityEvent:this._clickAddActivity,
            tab:ActivityTab
        })

        // 注册删除活动的监听
        this.listenDeleteActivity = DeviceEventEmitter.addListener('listenDeleteActivity', (pk)=>{
            this._deleteDataPage(pk);
        })
        this.listenTabPress = DeviceEventEmitter.addListener('navigateTabPress', (tab)=>{
            this.props.navigation.setParams({
                tab:tab
            })
        })
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);

        // 移除监听
        this.listenDeleteActivity.remove();
        this.listenTabPress.remove();
    }
    // ------------------------------------------网络请求
    //获取活动列表
    _fetchActivityList(pagenum){
        Utils.isLogin((token)=>{
            // if (token) {
                var type = "get",
                    url = Http.activityList(pagenum),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        // this._goLogin();
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
                        loading:false,
                        dataSource:array,
                    });

                }, (err) => {
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            // }
        })
    }
    //获取活动详情
    _fetchActivityDetail(pk){
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
    // 添加活动点击
    _clickAddActivity = () => {
        Utils.isLogin((token)=>{
            // Utils.showMessage("点击了加号");
            if (token) {
                this.props.navigation.navigate("AddActivity", {callback:(isCreate)=>{
                    if (isCreate) {
                        // 回来，请求新的数据
                        this._pullToRefresh();
                    }
                }});
            }else{
                this._goLogin();
            }
        })
        
    }
    // 去登录
    _goLogin(){
        this.props.navigation.navigate('Login', {callback:()=>{
            
        }})
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
                this._fetchActivityList(this.state.pagenum);
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
                this._fetchActivityList(this.state.pagenum);
            }) 
        }, 500);
    }
    // 活动详情
    _pushActivityDetail(pk){
        this.props.navigation.navigate("ActivityDetail", {pk:pk, fromPage:"list", callback:(isChange, isDelete)=>{
            if (isChange) {
                // 更新某条数据
                this._reloadPage(pk);
            }
            if (isDelete) {
                // 删除数据
                this._deleteDataPage(pk);
            }
        }})
    }
    // 刷新页面
    _reloadPage(pk){
        // this._fetchActivityList(1);
        this._fetchActivityDetail(pk)
    }
    // 删除页面数据
    _deleteDataPage(pk){
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

	// ------------------------------------------活动列表
    _renderItemActivityNew(item, index){
        var arr = [
            require('../assets/Activity/g1.png'), 
            require('../assets/Activity/g2.png'),
            require('../assets/Activity/g3.png'),
            require('../assets/Activity/g4.png'),
            require('../assets/Activity/g5.png')];
        
        var icon = arr[index%5];
        return (
            <TouchableOpacity onPress={this._pushActivityDetail.bind(this, item.pk)}>
            <View style={[styles.item, {overflow:'hidden', borderColor:'#c9c9c9', borderWidth:1, position:'relative'}]}>
                <View style={{height:160, width:width-20}}>
                    {
                        item.banner?
                        <Image
                          style={{flex:1, width:width-22, borderTopLeftRadius:5, borderTopRightRadius:5}}
                          source={{uri:item.banner}}
                          resizeMode={'cover'}
                        />
                        :
                        <Image
                          style={{flex:1, width:width-22, borderTopLeftRadius:5, borderTopRightRadius:5}}
                          source={icon}
                          resizeMode={'cover'}
                        />
                    }
                    
                    
                    <Text style={{color:'white', fontSize:20, fontWeight:'bold', position:'absolute', left:10, right:10, bottom:10, backgroundColor:'transparent'}}>
                      {item.name.slice(0,30)}
                    </Text>
                </View>

                <View style={styles.itemBottom}>
                    <View style={styles.itemBottomView}>
                        <Text style={styles.itemBottomText}>
                          {"发起人: "}{item.leader.name?item.leader.name.slice(0, 8):"管理员"}
                        </Text>
                    </View>
                    <Text style={styles.itemBottomText}>
                      {"已报名: "}:{item.member_number}人
                    </Text>
                </View>
            </View>
            </TouchableOpacity>
        )
    }
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
            		  {item.name.slice(0, 15)}
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
        // this._renderItemActivity(item, index)
        this._renderItemActivityNew(item, index)
        // this._renderItemCompete(item, index)
        // this.props.navigation.state.params && this.props.navigation.state.params.tab == CompeteTab?this._renderItemCompete(item, index):this._renderItemActivityNew(item, index)
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
            {
                this.props.navigation.state.params && this.props.navigation.state.params.tab == CompeteTab?
                    <CompeteView navigation={this.props.navigation}/> 
                :
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
                        !this.state.loading?<EmptyView />:null
            }
                
            </View>
        )
    }
  	render() {
    	return (
        	<View style={styles.container}>
        		{this._renderTableView()}
                {
                    this.state.loading?<LoadingView />:null
                }
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
    // -----------导航栏中间部分
    headerTitleTabs:{
        flexDirection:'row', 
        justifyContent:'space-around', 
        alignItems:'center', 
        backgroundColor:'transparent', 
        width:width/2, 
        height:40,
    },
    headerTitleTab:{
        height:35, 
        alignItems:'center',
        justifyContent:'center', 
        marginVertical:2, 
    },
    headerTitleTabSelect:{
        borderBottomColor:'white', 
        borderBottomWidth:2, 
    },
    headerTitleTabText:{
        color:'white', 
        fontSize:18,
    },
    headerTitleTabTextSelect:{
        fontWeight: 'bold'
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


export default Activity;