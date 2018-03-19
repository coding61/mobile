'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView
} from 'react-native';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

import LoadingView from '../Component/LoadingView.js';
import EmptyView from '../Component/EmptyView.js';

class JobDetail extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {
	  };
	}
    // -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        return {
            headerStyle: {backgroundColor:themeColor},
            title:"招聘详情",
            headerTintColor: "#fff",
            headerTitleStyle:{alignSelf:'auto',},
        }
    };
    componentWillMount() {
      
    }
    loadData(){
    	
    }
    _renderHeadView(){
    	return (
			<View style={styles.headView}>
				<View style={styles.headJob}>
					<Text style={{fontSize:18, color:'rgb(62,62,62)', marginBottom:10}}>前端工程师实习生</Text>
					<Text style={{fontSize:16, color:'rgb(255, 107, 149)', marginBottom:10}}>京东商城</Text>
				</View>
				<View style={styles.iconsView}>
					<View style={styles.iconView}>
                        <Text style={styles.iconText}>￥180-240/天</Text>
					</View>
					<View style={styles.iconView}>
						<Image style={styles.icon} source={require("../assets/Recruitment/place.png")} resizeMode={'contain'}/> 
                        <Text style={styles.iconText}>北京</Text>
					</View>
					<View style={styles.iconView}>
						<Image style={styles.icon} source={require("../assets/Recruitment/grade.png")} resizeMode={'contain'}/> 
                        <Text style={styles.iconText}>本科</Text>
					</View>
					<View style={styles.iconView}>
						<Image style={styles.icon} source={require("../assets/Recruitment/time.png")} resizeMode={'contain'}/> 
                        <Text style={styles.iconText}>3个月</Text>
					</View>
					<View style={styles.iconView}>
						<Image style={styles.icon} source={require("../assets/Recruitment/date.png")} resizeMode={'contain'}/> 
                        <Text style={styles.iconText}>3天/周</Text>
					</View>
					<View style={styles.iconView}>
						<Image style={styles.icon} source={require("../assets/Recruitment/warn.png")} resizeMode={'contain'}/> 
                        <Text style={styles.iconText}>面议</Text>
					</View>
				</View>
				<View style={styles.info}>
					<View style={{flex:1, flexDirection:'column'}}>
						<Text style={{fontSize:16, color:'rgb(62,62,62)', marginBottom:10}}>京东商城</Text>
						<View style={{flexDirection:'row'}}>
							<Text style={{fontSize:14, color:'rgb(161,161,161)', marginRight:20}}>电商</Text>
							<Text style={{fontSize:14, color:'rgb(161,161,161)'}}>1000人以上</Text>
						</View>
					</View>
					<Image
					  style={styles.avatar}
					  source={{uri: Utils.defaultAvatar}}
					/>
				</View>
			</View>
    	)
    }
    _renderBottomView(){
    	return (
    		<View style={styles.bottomView}>
				<Text style={{fontSize:16, color:'rgb(62,62,62)', marginBottom:10}}>职位描述</Text>
				<Text style={{fontSize:14, color:'rgb(161,161,161)', lineHeight:25, marginBottom:10}}>分解大富科技 发动机撒富家大室金风科技房价多萨克雷荆防颗粒神盾局房间大书法家当升科技富家大室看林俊杰考虑到撒酒疯肯定是金风科技第三方库垃圾筐放假啊是放进看的撒娇开发垃圾啊</Text>

    			<View style={styles.textView}>
	    			<Text style={styles.text}>简历要求:中文</Text>
				</View>
	    		<View style={styles.textView}>
	    			<Text style={styles.text}>地点:北京市朝阳区东大街128号</Text>
				</View>
	    		<View style={styles.textView}>
	    			<Text style={styles.text}>截止时间：2018-03-29</Text>
	    		</View>
    		</View>
    	)
    }
    _renderMainView(){
    	return (
    		<ScrollView style={{flex:1, backgroundColor:'rgb(242,242,242)'}}>
	    		{this._renderHeadView()}
	      		{this._renderBottomView()}
	      		<View style={styles.btn}><Text style={{color:'white'}}>申请职位</Text></View>
    		</ScrollView>
    	)
    }
	render() {
	    return (
	      	<View style={{flex:1, backgroundColor:'rgb(242,242,242)'}}>
	      		{this._renderMainView()}
	      	</View>
	    );
	}
}
const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const themeColor = Utils.themeColor;

const styles = StyleSheet.create({
	// 头部
	headView:{
		backgroundColor:'white', 
		marginBottom:15, 
		paddingVertical:15,
	},
	headJob:{
		borderBottomColor:'rgb(224, 224, 224)', 
		borderBottomWidth:1, 
		paddingHorizontal:15
	},
	iconsView:{
		borderBottomColor:'rgb(224, 224, 224)', 
		borderBottomWidth:1, 
		paddingHorizontal:15,
		paddingVertical:10,
		flexDirection:'row', 
		flexWrap:'wrap',
	},
	iconView:{
		width:(width-30)/3,
		height:40,
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

    info:{
        flexDirection:'row', 
        alignItems:'center', 
        paddingHorizontal:15, 
        marginTop:15,
    },
    avatar:{
        width:60, 
        height:60, 
        borderColor:'rgb(220,220,220)', 
        borderWidth:1
    },
	
	// 中间职位描述
	bottomView:{
		backgroundColor:'white', 
		paddingHorizontal:15, 
		paddingTop:15
	},
	textView:{
		borderTopWidth:1,
        borderTopColor:'rgb(224,224,224)',
	},
    text:{
        fontSize:14, 
        color:'rgb(161,161,161)',
        marginVertical:15
    },
    // 按钮，申请职位
    btn:{
    	width:width*0.8,
    	marginLeft:width*0.1,
    	backgroundColor:Utils.themeColor,
    	height:45,
  		justifyContent:'center',
  		alignItems:'center',
  		marginVertical:15,
  		borderRadius:5
    }
});


export default JobDetail;