'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

import LoadingView from '../Component/LoadingView.js';
import EmptyView from '../Component/EmptyView.js';
import ExchangeUnuseRecord from '../Exchange/ExchangeUnuseRecord.js';

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中

const ExchangeRecordTab = 1;    //道具使用中的选项
const RewardRecordTab = 0;      //道具未使用的选项

class ExchangeUsingRecord extends Component {
	constructor(props) {
	    super(props);
	
	    this.state = {
			dataSource:[],
			loading:true,                //是否显示数据加载等待视图
			footerLoadTag:LoadMore,      //默认是点击加载更多, FlatList，列表底部
            isRefresh:false,             //FlatList，头部是否处于下拉刷新
            pagenum:1,                   //活动列表第几页。默认1
            tab:ExchangeRecordTab,       //当前看到的是参加的活动选项内容
	    };
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
            headerStyle: {backgroundColor:themeColor},
            title:"我的道具",
            headerTintColor: "#fff",
            headerTitleStyle:{alignSelf:'auto',},
        }
    };
    componentWillMount() {
      	this._fetchCommodityRecordList(1);
    }
    componentDidMount() {
      
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    // ------------------------------------------网络请求
    _fetchCommodityRecordList(pagenum){
        /*
		var dic = {
              "pk": 4,
              "name": "北京大学现场讲座",
              "password": "123456",
              "introduction": "通告，北京大学现场讲座，通告，北京大学现场讲座通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座。",
              "member_number": 1,
              "exchange_product": {name:"达奇机器人"},
              "create_time": "2017-12-01T19:02:05"
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
        	isRefresh:false,
            loading:false,
            dataSource:array,
        });
        */
        
        
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.myProducts(pagenum, 1),
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
                    this.setState({
                        loading:false
                    })
                    console.log(2);
                    Utils.showMessage('请求异常');
                });
            }
        })
    }
    _fetchUnUseProduct(pk){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "put",
                    url = Http.unUseProduct(pk),
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

                    var array = this.state.dataSource
                    for (var i = 0; i < array.length; i++) {
                        if(array[i].pk === pk){
                            // 删除数据
                            array.splice(i, 1);
                            break;
                        }
                    }
                    this.setState({
                        dataSource:array
                    })

                }, (err) => {
                    this.setState({
                        loading:false
                    })
                    console.log(2);
                    Utils.showMessage('请求异常');
                });
            }
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
                this._fetchCommodityRecordList(this.state.pagenum);
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
                this._fetchCommodityRecordList(this.state.pagenum);
            }) 
        }, 500);
    }
    //不使用
    _unUseProduct(item){
        this._fetchUnUseProduct(item.pk);
    }
    _clickTab(){
        this.setState({tab:ExchangeRecordTab})
        this.setState({
            pagenum:1
        }, ()=>{
            this._fetchCommodityRecordList(this.state.pagenum);
        }) 
    }
    // ------------------------------------------兑换记录列表
    _renderItemCommodity(item, index){
        return (
            <View style={styles.item}>
                <View>
                	<Text style={{color:fontSColor, fontSize:font4, height:30, lineHeight:30}}>{item.create_time.slice(0,19).replace('T', " ")}</Text>
                    <Text style={{color:fontBColor, fontSize:font3, height:30, lineHeight:30}}>{item.exchange_product.name}</Text>
                </View>
                <TouchableOpacity onPress={this._unUseProduct.bind(this, item)} style={{borderColor:lineColor, borderWidth:1, borderRadius:15, paddingHorizontal:20, backgroundColor:'white'}}>
                    <Text style={{fontSize:font3, color:'gray', height:25, lineHeight:23}}>{"不使用"}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    _renderItem = ({item, index}) => (
        this._renderItemCommodity(item, index)
    )
    _renderFooter = ()=>{
        return  (
        	<TouchableOpacity onPress={this._clickLoadMore.bind(this)}>
                <Text style={styles.footerLoadMore}>{
                    this.state.footerLoadTag==LoadMore?"点击加载更多":this.state.footerLoadTag==LoadNoMore?"已经到尾了":"加载中..."}
                </Text>
            </TouchableOpacity>
        )
    }
    _keyExtractor = (item, index) => index;
    _renderFlatList(){
    	return (
    		<View style={{flex:1}}>
                {/*******选项切换*******/}
                <View style={styles.tabs}>
                    <TouchableOpacity onPress={this._clickTab.bind(this)} style={[styles.tab, this.state.tab===ExchangeRecordTab?styles.tabSelectView:styles.tab]}>
                    <View><Text style={this.state.tab===ExchangeRecordTab?styles.tabSelectText:styles.tabText}>{"使用中"}</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{this.setState({tab:RewardRecordTab})}} style={[styles.tab, this.state.tab===RewardRecordTab?styles.tabSelectView:styles.tab]}>
                    <View><Text style={this.state.tab===RewardRecordTab?styles.tabSelectText:styles.tabText}>{"未使用"}</Text></View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.tab == RewardRecordTab?
                    <ExchangeUnuseRecord navigation={this.props.navigation}/> 
                :
    			
    				this.state.dataSource.length?
			    		<FlatList 
				            ref={(flatlist)=>this._flatList=flatlist}
				            style={{flex:1,}}
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
      		<View style={{flex:1, backgroundColor:bgColor}}>
      			{this._renderFlatList()}
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

const themeColor = Utils.themeColor;
const orangeColor = Utils.orangeColor;
const fontBColor = Utils.fontBColor;
const fontSColor = Utils.fontSColor;
const lineColor = Utils.lineColor;
const bgColor = Utils.bgThirdColor;
const bgSecondColor = Utils.bgSecondColor;

const font1 = Utils.fontSBSize;
const font2 = Utils.fontBSize;
const font3 = Utils.fontSSize;
const font4 = Utils.fontMSSize;

const styles = StyleSheet.create({
    // ---------------------------头部
    topView:{
		height:50, 
		backgroundColor:bgSecondColor, 
		flexDirection:'row', 
		alignItems:'center', 
		paddingHorizontal:10, 
		justifyContent:'space-between'
    },
    topView1:{
    	flexDirection:'row', 
    	alignItems:'center',
    	height:50
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
        borderBottomColor:themeColor, 
        borderBottomWidth:1.5, 
    },
    tabText:{
        color:fontBColor
    },
    tabSelectText:{
        color:themeColor
    },

    // ---------------------------FlatList
    // --------------FlatList 的尾部
    footerLoadMore:{
        height:30, 
        lineHeight:30, 
        color:'gray', 
        textAlign:'center',
        marginBottom:10
    },
    // -------------FlatList 的主体部分(item)
    item:{
        // backgroundColor:'white',
        borderColor:lineColor,
        borderBottomWidth:1,
        padding:10,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row'
    },
    

});


export default ExchangeUsingRecord;
