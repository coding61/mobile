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

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中

class ExchangeRecord extends Component {
	constructor(props) {
	    super(props);
	
	    this.state = {
			dataSource:[],
			loading:true,                //是否显示数据加载等待视图
			footerLoadTag:LoadMore,      //默认是点击加载更多, FlatList，列表底部
            isRefresh:false,             //FlatList，头部是否处于下拉刷新
            pagenum:1,                   //活动列表第几页。默认1
	    };
	}
	// -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
            headerStyle: {
                backgroundColor: 'rgb(250, 80, 131)'
            },
            title:"奖学金记录",
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
        
		// var dic = {
  //             "pk": 4,
  //             "name": "北京大学现场讲座",
  //             "password": "123456",
  //             "introduction": "通告，北京大学现场讲座，通告，北京大学现场讲座通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座，通告，北京大学现场讲座。",
  //             "member_number": 1,
  //             "leader": {},
  //             "create_time": "2017-10-18T10:06:21.129728"
  //       }
  //       var array = [];
        
  //       if (pagenum > 3) {
  //           this.setState({footerLoadTag:LoadNoMore});
  //           var arr = [];
  //           for (var i = 0; i < 5; i++) {
  //               arr.push(dic);
  //           }
  //           array = this.state.dataSource.concat(arr);

  //       }else if(pagenum>1){
  //           this.setState({footerLoadTag:LoadMore});
  //           var arr = [];
  //           for (var i = 0; i < 10; i++) {
  //               arr.push(dic);
  //           }
  //           array = this.state.dataSource.concat(arr);
  //       }else{
  //           this.setState({footerLoadTag:LoadMore});
  //           for (var i = 0; i < 10; i++) {
  //               array.push(dic);
  //           }
  //       }
  //       this.setState({
  //       	isRefresh:false,
  //           loading:false,
  //           dataSource:array,
  //       });
        

        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.getScholarship,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    console.log(response)
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
    // ------------------------------------------兑换记录列表
    _renderItemCommodity(item, index){
        return (
            <View style={styles.item}>
                <View style={{marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={{color:fontBColor, fontSize:font3, height:30, lineHeight:30}}>{item.record_type}</Text>
                  <Text style={{color: 'rgb(247, 99, 146)'}}>{'+' + item.amount}</Text>
                </View>
                <Text style={{marginLeft: 10, color:fontSColor, fontSize:12, height:30, lineHeight:30}}>{item.create_time.slice(0,19).replace('T', " ")}</Text>
            </View>
        )
    }
    _renderItem = ({item, index}) => (
        this._renderItemCommodity(item, index)
    )
    _renderHeader = () => {
      return (<View style={{width: width, height: width * 2 / 3 + 50, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                <Text style={{fontSize: 42, marginBottom: 40}}>{this.props.navigation.state.params.balance}<Text style={{fontSize: 16}}>元</Text></Text>
                <Text style={{width: width * 2 / 3, textAlign: 'center', color: 'gray', lineHeight: 25}}>{'奖学金提现请到微信公众服务号"橙旭园儿童编程"进行提取'}</Text>
                <View style={{position: 'absolute', bottom: 0, left: 0, width: width, height: 40, backgroundColor: 'rgb(236, 237, 238)', justifyContent: 'center'}}>
                  <Text style={{fontSize: 12, marginLeft: 20}}>奖学金明细</Text>
                </View>
              </View>)
    }
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
                    ListHeaderComponent={this._renderHeader}
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
const lineColor = Utils.underLineColor;
const bgColor = Utils.bgColor;
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
        backgroundColor:'white',
        borderColor:lineColor,
        borderBottomWidth:1,
        padding:10
    },
    

});


export default ExchangeRecord;
