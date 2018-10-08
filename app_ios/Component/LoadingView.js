/**
 * @author: chenwei
 * @description: 加载数据等待视图
 * @time: 2017-07-18
 */
 /**
  *  unfull,          不会盖住导航/tabbar
  *  full  ,          会覆盖导航/tabbar
  *  containerStyle,  unfull 模式下，容纳等待视图的样式, (选填)
  *  msg,             等待视图中显示的文字(选填)       
  */
 'use strict';

 import React, { Component } from 'react';
 import PropTypes from 'prop-types';
 
 import {
   StyleSheet,
   View,
   Modal,
   Text,
   ActivityIndicator,
   Image,
   Dimensions
 } from 'react-native';
 
 const height = Dimensions.get('window').height
 const width = Dimensions.get('window').width
 
 class LoadingView extends Component {
	constructor(props) {
	   super(props);
	 
	   this.state = {};
	}
	static defaultProps = {
		type: "unfull",
		msg:"加载中..."
	};
	static propTypes = {
		type: PropTypes.oneOf(['full', 'unfull']).isRequired, //类型
		msg: PropTypes.string,
	}
	_renderFullView(){
		return (
			<Modal visible={true} transparent={true} onRequestClose={()=>{}}>
				<View style={styles.fullParent}>
					<View style={styles.loadView}>
						<ActivityIndicator 
						   style={{marginTop: 10}}
						   color={'white'}
						   size={'large'}
						   animating={true}
						/>
 
						<Text style={{color:'white'}}>{this.props.msg}</Text>
					</View>
				</View>
			</Modal>
		)
	}
	_renderUnfullView(){
		return (
			<View style={styles.loadView}>
				<ActivityIndicator 
				   style={{marginTop: 10}}
				   color={'white'}
				   size={'large'}
				   animating={true}
				/>
				<Text style={{color:'white'}}>{this.props.msg}</Text>
			</View>
		)
	}
	render() {
		return (
			<View style={[this.props.type == "unfull"?styles.unfullParent:null, this.props.type == "unfull" && this.props.containerStyle?this.props.containerStyle:null]}>
			 	{
				 	this.props.type == "unfull"?this._renderUnfullView():this._renderFullView()
			 	}
			</View>
		);
	}
 }
 const styles = StyleSheet.create({
	unfullParent:{
		position:'absolute', 
		width:width, 
		height:height,  
		alignItems:'center', 
		justifyContent:'center',
	},
	fullParent:{
		flex:1, 
		alignItems:'center', 
		justifyContent:'center'
	},
	loadView:{
		width:100, 
		height:100, 
		borderRadius:5, 
		alignItems:'center', 
		alignSelf:'center', 
		justifyContent:'space-around', 
		backgroundColor:'rgba(0,0,0,0.6)'
	},
 
 });
 
 
 export default LoadingView;