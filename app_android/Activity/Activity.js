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

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中

class Activity extends Component {
	constructor(props) {
	  	super(props);
	
	  	this.state = {
	  		loading:false,
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
        	headerTitle:"活动",
        	headerTintColor: "#fff",
            headerStyle: styles.headerStyle,
            headerRight:(
            	<TouchableOpacity onPress={state.params?state.params.addActivityEvent:null}>
                    <View style={styles.headerRightView}>
                        <Image
                          style={styles.headerRightImg}
                          source={require('../images/add.png')}
                          resizeMode={'contain'}
                        />
                    </View>
                </TouchableOpacity>)
        }
    };
    componentWillMount() {
        this._fetchActivityList(1);
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
    _fetchActivityList(pagenum){
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
                    url = Http.activityList(pagenum),
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

                    var array = this.state.dataSource.concat(response.results);
                    this.setState({
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
    // ------------------------------------------帮助方法
    // 添加活动点击
    _clickAddActivity = () => {
        Utils.isLogin((token)=>{
            Utils.showMessage("点击了加号");
            if (token) {
                // this.props.navigation.navigate("AddActivity");
            }else{
                // this._goLogin();
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
        this.setState({isRefreshing:true});
        this.timer = setTimeout(() => {
            this.setState({
                pagenum:1
            }, ()=>{
                this._fetchActivityList(this.state.pagenum);
            }) 
        }, 500);
    }

	// ------------------------------------------活动列表
    _renderItemActivity(item, index){
        return (
        	<TouchableOpacity onPress={()=>{this.props.navigation.navigate("ActivityDetail", {pk:item.pk})}}>
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
            {/******会话消息******/}
                <FlatList 
                    ref={(flatlist)=>this._flatList=flatlist}
                    style={{flex:1}}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    extraData={this.state.loading}
                    keyExtractor={this._keyExtractor}
                    ListFooterComponent={this._renderFooter}
                    onRefresh={this._pullToRefresh.bind(this)}
                    refreshing={this.state.isRefresh}
                />
                
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
    item:{
        padding:10,
        fontSize:18,
        height:44,
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
		lineHeight:28, 
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