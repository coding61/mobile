/**
 * @author: chenwei
 * @description: 答题，答对，答错视图
 * @time: 2017-07-18
 */
 /**
  *  type,            图片的类型，hongbao、zuan
  *  msg  ,           图片下文本消息
  *  hide,            隐藏视图
  *  submitText,      按钮的文字(可选)
  *  submitPressEvent, 按钮触发事件(可选)
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

class PunchCardAlert extends Component {
	constructor(props) {
	  super(props);

	  this.state = {};
	}
	_leftEvent(){
        this.props.leftEvent?this.props.leftEvent():this.props.hide();
    }
    _rightEvent(){
        this.props.rightEvent?this.props.rightEvent():this.props.hide();
    }
    _renderFullView(){
    	var img = require('../assets/Activity/alert.png'),
    		msg = this.props.msg,
    		leftText=this.props.leftText?this.props.leftText:"确定",
            rightText=this.props.rightText?this.props.rightText:"不再提示";
    	return (
    		<Modal visible={true} transparent={true} onRequestClose={()=>{}}>
    			<View style={styles.fullParent}>
    				<View style={styles.loadView}>
    					<View style={styles.imgView}>
                            <Image
                              style={styles.img}
                              source={img}
                              resizeMode={'contain'}
                            />
						</View>
						<View style={styles.msgView}>
							<Text style={styles.msg}>{msg}</Text>
						</View>
                        <View style={styles.btnView}>
    		                <TouchableOpacity style={styles.btn1} onPress={this._leftEvent.bind(this)}>
    		                	<Text style={{color:'white', fontSize:15}}>{leftText}</Text>
    		                </TouchableOpacity>
                            <TouchableOpacity style={styles.btn2} onPress={this._rightEvent.bind(this)}>
    		                	<Text style={{color:'white', fontSize:15}}>{rightText}</Text>
    		                </TouchableOpacity>
                        </View>
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
		// height:height/2,
		borderRadius:5,
		alignItems:'center',
		// alignSelf:'center',
		justifyContent:'center',
		backgroundColor:'white',
		paddingHorizontal:20,
	},
	imgView:{
		width:w1-20,
		height:120,
		marginTop:15,
		alignItems:'center',
		justifyContent:'center',
	},
	img:{
		width:w1-20,
		height:120,
	},
	msgView:{
		width:w1-20,
		paddingHorizontal:20,
		marginVertical:15,
		alignItems:'center',
		justifyContent:'center',
		height:40,
	},
	msg:{
		color:'#373737',
		// backgroundColor:'blue',
		lineHeight:20,
		fontSize:15,
		textAlign:'center'
	},
    btnView: {
        flexDirection: 'row',
        width:w1-60,
    },
	btn1:{
        width:(w1-60 - 20) / 2,
		height:45,
		backgroundColor:'#ff7373',
		marginBottom:20,
		borderRadius:5,
		alignItems:'center',
		justifyContent:'center',
		// marginHorizontal:10
	},
    btn2:{
        width:(w1-60 - 20) / 2,
		height:45,
		backgroundColor:'#ff7373',
		marginBottom:20,
		borderRadius:5,
		alignItems:'center',
		justifyContent:'center',
        marginLeft: 20
		// marginHorizontal:10
	}
});


export default PunchCardAlert;
