//列表
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
import BCFlatListView from '../Component/BCFlatListView.js'

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中

class JobList extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSource:[1,2,3,4,5,6,7,8],               //数据源
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
            headerStyle: {backgroundColor:themeColor},
            title:"招聘",
            headerTintColor: "#fff",
            headerTitleStyle:{alignSelf:'auto',},
        }
    };
    componentWillMount() {
        // this._fetchJobList(1);
    }
    // -----------------------------------网络请求
    _fetchJobList1(pagenum, dataSource, callback){
        var type = "get",
            url = Http.jobList(pagenum),
            token = null,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response.msg);
            var tag = null
            if (response.msg.length == 0) {
                //如果 next 字段为 null, 则数据已加载完毕
                tag = 0
            }else{
                // 还有数据，可以加载
                tag = 1
            }
            var array = [];
            if (pagenum > 1) {
                array = dataSource.concat(response.msg);
            }else{
                array = response.msg;
            }
            callback(array, tag, false);

        }, (err) => {
            callback(null, null, true);
            console.log(2);
            Utils.showMessage('请求异常');
        });
    }
    _fetchJobList(pagenum){
        var type = "get",
            url = Http.jobList(pagenum),
            token = null,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response);
            if (response.msg.length == 0) {
                //如果 next 字段为 null, 则数据已加载完毕
                this.setState({footerLoadTag:LoadNoMore});
            }else{
                // 还有数据，可以加载
                this.setState({footerLoadTag:LoadMore});
            }
            var array = [];
            if (pagenum > 1) {
                array = this.state.dataSource.concat(response.msg);
            }else{
                array = response.msg;
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
    // -----------------------------------点击事件
	_clickLoadMore(){
    	// 上拉加载更多
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
                this._fetchJobList(this.state.pagenum);
            }) 
        }, 500);
    }
    _pullToRefresh(){
    	// 下拉刷新
        this.setState({isRefresh:true});
        this.timer = setTimeout(() => {
            this.setState({
                pagenum:1
            }, ()=>{
                this._fetchJobList(this.state.pagenum);
            }) 
        }, 500);
    }
    _clickItem(item){
		//  进入教师详情
        // this.props.navigation.navigate("JobDetail");
        var url = "https://wap.shixiseng.com/intern/"
        url = url + item.uuid
        Utils.openURL(url);
    }
    // ------------------------------------------兑换记录列表
    _renderItemJob(item, index){
        return (
            <TouchableOpacity onPress={this._clickItem.bind(this, item)} style={styles.item}>
            
				<Image
				  style={styles.avatar}
				  source={{uri: item.logo_url}}
				/>
				
            	<View style={{flex:1}}>
            		<Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                    <Text numberOfLines={1} style={styles.desc}>{item.company_name}</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <View style={[{marginRight:20}, styles.bottomView]}> 
                            <Image style={styles.icon} source={require("../assets/Recruitment/place.png")} resizeMode={'contain'}/> 
                            <Text style={styles.iconText}>{item.city}</Text>
                        </View>
                        <View style={styles.bottomView}>
                            <Image style={styles.icon} source={require("../assets/Recruitment/date.png")} resizeMode={'contain'}/> 
                            <Text style={styles.iconText}>{item.dayperweek}天/周</Text>
                        </View>
                    </View>
                    <Text style={styles.date}>{item.refresh_time.substring(5,10)}</Text>
            	</View>
            </TouchableOpacity>
        )
    }
    _renderItem = ({item, index}) => (
        this._renderItemJob(item, index)
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
      		<View style={{flex:1}}>
                {/*this._renderFlatList()*/}
                <BCFlatListView fetchData={this._fetchJobList1.bind(this)} renderItem={this._renderItemJob.bind(this)} />
            </View>
    	);
  	}
}
const themeColor = Utils.themeColor;

const styles = StyleSheet.create({
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
        flex:1, 
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:20, 
        height:120, 
        borderBottomWidth:1, 
        borderBottomColor:'rgb(220,220,220)', 
        backgroundColor:'white'
    },
    avatar:{
        width:80, 
        height:80, 
        marginRight:10, 
        borderColor:'rgb(220,220,220)', 
        borderWidth:1
    },
    title:{
        fontSize:18, 
        color:'rgb(62,62,62)', 
        marginBottom:10,
        marginRight:30
    },
    desc:{
        fontSize:16, 
        color:'rgb(161,161,161)', 
        marginBottom:10
    },
    bottomView:{
        flexDirection:'row', 
        alignItems:'center'
    },
    icon:{
        width:15, 
        height:15, 
        marginRight:5
    },
    iconText:{
        fontSize:14, 
        color:'rgb(161,161,161)'
    },
    date:{
        position:'absolute', 
        right:0, 
        top:0, 
        color:'rgb(161,161,161)', 
        fontSize:14
    }

});


export default JobList;