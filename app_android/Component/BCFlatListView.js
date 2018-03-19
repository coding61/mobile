'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

import LoadingView from '../Component/LoadingView.js';
import EmptyView from '../Component/EmptyView.js';

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到尾了
const LoadMoreIng = -1;       //加载中

class BCFlatListView extends Component {
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
	componentWillMount() {
	    this.props.fetchData(1, this.state.dataSource, this.loadData);
	}
	componentDidMount() {
	  
	}
	loadData = (array, footerLoadTag, fail)=>{
		var that = this;
		if (fail) {
			that.setState({
                loading:false
            })
		}else{
			that.setState({
				footerLoadTag:footerLoadTag,
				isRefresh:false,
                loading:false,
                dataSource:array,
			})
		}
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
                this.props.fetchData(this.state.pagenum, this.state.dataSource, this.loadData);
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
                this.props.fetchData(this.state.pagenum, this.state.dataSource, this.loadData);
            }) 
        }, 500);
    }
    // ------------------------------------------兑换记录列表
    _renderItem = ({item, index}) => (
        this.props.renderItem(item, index)
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
      			{this._renderFlatList()}
      			{
      				this.state.loading?<LoadingView/>:null
      			}
      		</View>
    	);
  	}
}

const styles = StyleSheet.create({
	// --------------FlatList 的尾部
    footerLoadMore:{
        height:30, 
        lineHeight:30, 
        color:'gray', 
        textAlign:'center',
        marginBottom:10
    },
});


export default BCFlatListView;