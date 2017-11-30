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

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中
const ActivityTab = 1;    //加入活动的选项
const CompeteTab = 0;  //发布活动的选项
class CompeteView extends Component {
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
        return {
            headerStyle:styles.headerStyle,
            title:"竞赛",
            headerTintColor: "#fff",
            headerTitleStyle:{alignSelf:'auto',},
        }
    };
    componentWillMount() {
        this._fetchCompeteList(1);
    }
    componentDidMount() {

    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);

        if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
            this.props.navigation.state.params.callback(); 
          }
        }
    }
    // ------------------------------------------网络请求
    //获取竞赛列表
    _fetchCompeteList(pagenum){
        
        Utils.isLogin((token)=>{
            // if (token) {
                var type = "get",
                    url = Http.competeList(pagenum),
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
    //获取竞赛详情
    _fetchCompeteDetail(pk){   
        Utils.isLogin((token)=>{
            // if (token) {
                var type = "get",
                    url = Http.competeDetail(pk),
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
                            array[i].member_count = response.member_count;
                            array[i] = response;
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
            // }
        })
    }
    // ------------------------------------------帮助方法
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
                this._fetchCompeteList(this.state.pagenum);
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
                this._fetchCompeteList(this.state.pagenum);
            }) 
        }, 500);
    }
    // 竞赛回答
    _pushCompeteAnswer(item){
        this.props.navigation.navigate("CompeteAnswer", {item:item, callback:(isAnswer)=>{
            if (isAnswer) {
                this._fetchCompeteDetail(item.pk);
            }
        }});
    }
	// ------------------------------------------活动列表
    _renderItemCompete(item, index){
        // if (item.status == "continue") {
        //     var bg1 = require("../assets/Activity/bg2.png"),
        //         bg2 = require('../assets/Activity/p2.png'),
        //         icon = require('../assets/Activity/icon1.png');
        // }else{
        //     var bg1 = require("../assets/Activity/bg3.png"),
        //         bg2 = require('../assets/Activity/p1.png'),
        //         icon = require('../assets/Activity/icon2.png');
        // }
        var bg1 = item.finish == false?require("../assets/Activity/bg2.png"):require("../assets/Activity/bg3.png"),
            bg2 = item.finish == false?require('../assets/Activity/p2.png'):require('../assets/Activity/p1.png'),
            icon = item.finish == false?require('../assets/Activity/icon1.png'):require('../assets/Activity/icon2.png'),
            itemBodyTextStyle = item.finish == false?styles.itemBodyTextIng:styles.itemBodyTextEnd,
            itemBodyTitleTextStyle = item.finish == false?styles.itemBodyTitleTextIng:styles.itemBodyTitleTextEnd,
            itemTitleStyle = item.finish == false?styles.itemTitleIng:styles.itemTitleEnd;


        return (
            <TouchableOpacity onPress={this._pushCompeteAnswer.bind(this, item)}>
            <View style={styles.item}>
                <Image
                  style={styles.itemBg}
                  source={bg1}
                  resizeMode={'cover'}
                />

                <Image
                  style={styles.itemTitleBg}
                  source={bg2}
                  resizeMode={'contain'}
                />
                <Text style={itemTitleStyle}>{"题目"}</Text>
                
                <View style={styles.itemBody}>
                    <Text style={[itemBodyTitleTextStyle]}>{item.title}</Text>
                    <Text style={itemBodyTextStyle}>{"悬赏金额: "}{item.reward_amount}{"元"}</Text>
                    <Text style={itemBodyTextStyle}>{"已参加: "}{item.member_count}{"人"}</Text>
                    <Text style={itemBodyTextStyle}>{"奖学金随机发放，若领完将发放钻石"}</Text>
                    <Image
                      style={styles.itemBodyImg}
                      source={icon}
                      resizeMode={'contain'}
                    />
                    
                </View>
                
            </View>
            </TouchableOpacity>
        )
    }
   
    _renderItem = ({item, index}) => (
        this._renderItemCompete(item, index)
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

    // ------------------------------------------竞赛列表
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
        marginHorizontal:10, 
        marginBottom:20, 
        marginTop:20, 
        borderRadius:5,
        backgroundColor:'white', height:180, justifyContent:'center', alignItems:'center'
    },
    itemBg:{
        position:'absolute', 
        width:width-20, 
        height:180, 
        top:0, 
        left:0,
        borderRadius:5,
    },
    itemTitleBg:{
        position:'absolute', 
        height:40, 
        top:-10
    },
    itemTitleIng:{
        position:'absolute', 
        top:0, 
        color:'white', 
        backgroundColor:'transparent'
    },
    itemTitleEnd:{
        position:'absolute', 
        top:0, 
        color:fontBColor, 
        backgroundColor:'transparent'
    },
    itemBody:{
        justifyContent:'center', 
        flex:1, 
        width:width-20, 
        paddingHorizontal:10,
    },
    itemBodyTitleTextIng:{
        fontWeight:'bold', 
        marginBottom:10,
        color:'white', 
        fontSize:18, 
        height:30, 
        lineHeight:30, 
        backgroundColor:'transparent',
    },
    itemBodyTitleTextEnd:{
        fontWeight:'bold', 
        marginBottom:10,
        color:fontBColor, 
        fontSize:18, 
        height:30, 
        lineHeight:30, 
        backgroundColor:'transparent',
    },
    itemBodyTextIng:{
        color:'white', 
        fontSize:14, 
        height:30, 
        lineHeight:30, 
        backgroundColor:'transparent', 
    },
    itemBodyTextEnd:{
        color:fontBColor, 
        fontSize:14, 
        height:30, 
        lineHeight:30, 
        backgroundColor:'transparent', 
    },
    itemBodyImg:{
        position:'absolute', 
        width:100, 
        right:10, 
        bottom:20
    }

    


});


export default CompeteView;
