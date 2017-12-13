'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

import LoadingView from '../Component/LoadingView.js';
import EmptyView from '../Component/EmptyView.js';

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中

class Exchange extends Component {
	constructor(props) {
	    super(props);

	    this.state = {
			dataSource:[],
			loading:true,                //是否显示数据加载等待视图
			footerLoadTag:LoadMore,      //默认是点击加载更多, FlatList，列表底部
            isRefresh:false,             //FlatList，头部是否处于下拉刷新
            pagenum:1,                   //活动列表第几页。默认1
            info:null,                   //记录我的钻石数
            loadingText:"加载中..."       //数据加载等待视图的文字
	    };
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
            headerStyle: {backgroundColor:themeColor},
            title:"兑换",
            headerTintColor: "#fff",
            headerTitleStyle:{alignSelf:'auto',},
            headerRight:(
                <TouchableOpacity onPress={()=>{DeviceEventEmitter.emit('record', 1)}}>
                    <View style={styles.headerRightView}>
                        <Text style={styles.headerRightText}>{"兑换记录"}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    };
    componentWillMount() {
      	this._fetchCommodityList(1);
    }
    componentDidMount() {
        //兑换记录
        this.listenRecord = DeviceEventEmitter.addListener('record', ()=>{
            this._goExchangeRecord();
        })
    }
    componentWillUnmount() {
        if (typeof(this.props.navigation.state.params) !== 'undefined') {
          if (typeof(this.props.navigation.state.params.callback) !== 'undefined') {
                this.props.navigation.state.params.callback(); 
          }
        }
        
        this.timer && clearTimeout(this.timer);
        
        //移除监听
        this.listenRecord.remove();
    }
    // ------------------------------------------网络请求
    // 获取兑换商品列表
    _fetchCommodityList(pagenum){
        /*
		var dic = {
              "pk": 4,
              "name": "北京大学现场讲座",
              "password": "123456",
              "introduction": "通告，北京大学现场讲座，通告，北京大学现场讲座通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座。",
              "member_number": 1,
              "leader": {},
              "create_time": "2017-10-18T10:06:21.129728",
              "image":"https://static1.bcjiaoyu.com/binshu.jpg",
              diamond:200,
              bought:20
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
            // if (token) {
                var type = "get",
                    url = Http.getExchangeProductList(pagenum),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    this._hideLoadingView();
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
                        dataSource:array,
                    });

                }, (err) => {
                    this._hideLoadingView();
                    console.log(2);
                    Utils.showMessage('请求异常');
                });
            // }
        })
    }
    // 购买兑换商品
    _fetchPurchaseCommodity(pk){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.buyExchangeProduct(pk),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    this._hideLoadingView();

                    if (response == 401) {
                        //去登录
                        // this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                        return;
                    };
                    if (response.status == -4) {
                        Utils.showMessage(response.message?response.message:response.detail);
                        return;
                    }
                    //调整数据源
                    Utils.showMessage("兑换成功， 请在兑换记录里查看");
                    this._adjustData(pk);   //更改页面某些数据

                    //发送钻石更改的通知
                    DeviceEventEmitter.emit('listenZuan', true);

                }, (err) => {
                    this._hideLoadingView();
                    console.log(2);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
    }

    // ------------------------------------------帮助方法
    // 调整数据源
    _adjustData(pk){
        var array = this.state.dataSource,
            info = this.state.info;
        for (var i = 0; i < array.length; i++) {
            if (array[i].pk == pk) {
                info["diamond"] = parseFloat(info["diamond"])- parseFloat(array[i].diamond);
                array[i].bought = parseInt(array[i].bought) + 1;
                break;
            }
        }
        this.setState({
            info:info,
            dataSource:array
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
                this._fetchCommodityList(this.state.pagenum);
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
                this._fetchCommodityList(this.state.pagenum);
            })
        }, 500);
    }
    // 兑换记录
    _goExchangeRecord = ()=>{
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate("ExchangeRecord")
            }else{
                this.props.navigation.navigate("Login");
            }
        })
    }
    // 立即兑换
    _goPurchase(item){
        Utils.isLogin((token)=>{
            if (token) {
                Utils.showAlert("商品兑换", "您是否确认兑换"+item.name+"?", ()=>{
                    // 确定
                    this.setState({
                        loading:true,
                        loadingText:"兑换中..."
                    })
                    this._fetchPurchaseCommodity(item.pk);
                }, ()=>{
                    // 取消
                }, "是", "否");
            }else{
                this.props.navigation.navigate("Login");
            }
        })
    }
    // 取消等待视图
    _hideLoadingView(){
        this.setState({
            loading:false
        })
    }
    // ------------------------------------------兑换商品列表
    _renderItemCommodity(item, index){
        return (
        	<View style={styles.item1}>

        		<Image
        		  style={styles.avatar}
        		  source={{uri:item.image}}
        		  resizeMode={'contain'}
        		/>
              	<View style={styles.itemRightView}>
					<Text style={[{color:fontBColor, fontSize:font2}, styles.itemTitleText]}>{item.name}</Text>
					<View style={{flexDirection:'row'}}>
						<Text style={[{color:fontBColor, fontSize:font3}, styles.itemTitleText]}>{"所需钻石:"}</Text>
						<Text style={[{color:blueColor, fontSize:font3}, styles.itemTitleText]}>{item.diamond}</Text>
					</View>
					<Text style={[{color:fontBColor, fontSize:font3}, styles.itemZuanText]}>{"已兑换:"}{item.bought}{"件"}</Text>
                    <TouchableOpacity style={styles.exchange} onPress={this._goPurchase.bind(this, item)}>
						<Text style={{color:'white', fontSize:font3}}>{"立即兑换"}</Text>
                    </TouchableOpacity>
            	</View>
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
    			{
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
      		<View style={{flex:1, backgroundColor:'white'}}>
      			{this._renderFlatList()}
      			{
      				this.state.loading?<LoadingView msg={this.state.loadingText}/>:null
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
const blueColor = Utils.blueColor;
const fontBColor = Utils.fontBColor;
const fontSColor = Utils.fontSColor;
const lineColor = Utils.underLineColor;
const bgColor = Utils.bgColor;
const bgSecondColor = Utils.bgSecondColor;

const font1 = Utils.fontSBSize;
const font2 = Utils.fontBSize;
const font3 = Utils.fontSSize;
const font4 = Utils.fontMSSize;

const styles = StyleSheet.create({
	// -----------导航栏右部分
    headerRightView:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginRight:10,
    },
    headerRightText:{
        color:'white',
        fontSize:font2
    },
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
    	// borderRadius:5,
    	// borderColor:themeColor,
    	// borderWidth:1.5,
    	// // height:200,
    	// shadowColor: themeColor,
	    // shadowOffset: { width: 0, height: 0 },
	    // shadowOpacity: 0.5,
	    // shadowRadius: 6,

	    flexDirection:'row',
	    alignItems:'center',
	    paddingHorizontal:10,
	    paddingVertical:5,
	    marginHorizontal:10,
    	// marginVertical:10,
    },
    item1:{
    	borderRadius:5,
    	borderColor:themeColor,
    	borderWidth:1.5,
    	// // height:200,
    	shadowColor: themeColor,
	    shadowOffset: { width: 0, height: 0 },
	    shadowOpacity: 0.15,
	    shadowRadius: 15,

	    margin:15,
	    padding:10,
	    flexDirection:'row',
	    alignItems:'center',
    },
    avatar:{
    	width:width/4,
    	height:150,
    	marginRight:5
    },
    itemRightView:{
    	flex:1,
    	alignItems:'center'
    },
    itemTitleText:{
    	height:30,
    	lineHeight:30,
    	overflow:'hidden'
    },
    itemZuanText:{
    	height:20,
    	lineHeight:20,
    	overflow:'hidden'
    },
    exchange:{
    	flexDirection:'row',
    	height:30,
    	justifyContent:'center',
    	alignItems:'center',
    	width:100,
    	backgroundColor:orangeColor,
    	borderRadius:2,
    	marginTop:20
    }

});


export default Exchange;
