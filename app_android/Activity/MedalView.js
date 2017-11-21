/**
 * @author: chenwei
 * @description: 勋章视图
 * @time: 2017-07-18
 */
 /**
  *  type,            图片的类型，compete、forum
  *  msg  ,           图片下文本消息
  *  hide,            隐藏视图
  */
'use strict';

import React, { Component,PropTypes } from 'react';

import {
  StyleSheet,
  View,
  Modal,
  Text,
  ActivityIndicator,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

class MedalView extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}  
    _hide(){
    	this.props.hide();
    }
    _renderFullView(){
    	var img = this.props.type == "compete"?require('../assets/Activity/compete.png'):require('../assets/Activity/forum.png'),
    		msg = this.props.msg;
    	return (
    		<Modal visible={true} transparent={true} onRequestClose={()=>{}}>
    			<View style={styles.fullParent}>
    				<View style={styles.loadView}>
    					<Image
    					  style={styles.bg}
    					  source={require('../assets/Activity/medal1.png')}
    					  resizeMode={'contain'}
    					/>	
    					<Image
    					  style={styles.medal}
    					  source={img}
    					  resizeMode={'contain'}
    					/>
    					<Text style={styles.gain}>
    					  {"获得"}
    					</Text>
    					<Text style={styles.msg}>
    					  {msg}
    					</Text>
    					<TouchableOpacity style={styles.close} onPress={this._hide.bind(this)}>
	    					<Image
	    					  style={{width:40, height:40}}
	    					  source={require('../assets/Activity/close.png')}
	    					  resizeMode={'contain'}
	    					/>
    					</TouchableOpacity>
	                </View>
    			</View>
	        </Modal>
    	)
    }
  	render() {
	    return (
	    	<View style={[]}>
	    	{
	   			this._renderFullView()
		    }
	    	</View>
	    );
  	}
}
const w1 = width*3/4
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
		justifyContent:'center',
		backgroundColor:'rgba(0,0,0,0.6)'
	},
	loadView:{
		width:w1, 
		height:height/2, 
		alignItems:'center', 
		justifyContent:'center', 
	},
	bg:{
		position:'absolute', 
		height:height/2, 
		// backgroundColor:'red', 
		alignItems:'center', 
		justifyContent:'center'
	},
	medal:{
		position:'absolute', 
		height:w1/2
	},
	gain:{
		marginTop:w1/2+60, 
		fontSize:20, 
		color:'#00a4de', 
		height:30, 
		lineHeight:30
	},
	msg:{
		fontSize:19, 
		color:'#ff6724', 
		height:30, 
		lineHeight:30, 
		fontWeight:'bold'
	},
	close:{
		position:'absolute', 
		bottom:-60, 
		width:40, 
		height:40, 
		alignItems:'center', 
		justifyContent:'center'
	},

});


export default MedalView;