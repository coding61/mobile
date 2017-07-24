/**
 * @author: chenwei
 * @description: app入口，进行身份的选择
 * @time: 2017-07-18
 */
'use strict';

import React, {Component} from 'react'
import {
    View,
    StyleSheet, 
    Text,
    TouchableOpacity,
    Button,
    FlatList,
    Image,
    Animated,
    Easing,
    DeviceEventEmitter
}from 'react-native'

import chatdata from '../data1.js';
import Utils from '../utils/Utils.js';

class MessagePage1 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            data:null,
            index:0,
            dataSource:[],
            loadingChat:false,
            showAction:false,
            contentHeight:0,
        };
        this.leftEnterValue = new Animated.Value(0)   //左侧进入动画
    };
    static propTypes = {
      // prop: React.PropTypes.Type
    };
    static defaultProps = {
      // prop: 'value'
    }
    componentWillMount() {
        this._loadMessages();
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState) {
        console.log("contentHeight:" + this.state.contentHeight);
        if (this.state.contentHeight > 503) {
            setTimeout(()=>{
                this._flatList.scrollToEnd();
            }, 500)
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
    _loadMessages(){
        var array = [];
        array = chatdata["1"];
        for (var i = 0; i < array.length; i++) {
            array[i]["loadingChat"] = false;
            array[i]["ani"] = true;
        }
        this.setState({
            loading:true,
            data:array
        }, ()=>{
            this._loadMessage(this.state.data, this.state.index);
            // this.leftEnterValue = new Animated.Value(0)   //左侧进入动画

            // var aniV = "leftEnterValue" + this.state.index;
            // this.aniV = new Animated.Value(0)   //左侧进入动画
            // this._leftAnimate(this.leftEnterValue);
            // this.leftEnterValue.setValue(0);
        })  
    }
    _loadMessage(arr, i){
        var array = this.state.dataSource;
        var item = this.state.data[this.state.index];
        item = arr[i];
        array.push(item);
        
        this.timer = setTimeout(()=>{
            this._leftAnimate(this.leftEnterValue);
            array[array.indexOf(item)]["ani"] = true;

            this.setState({
                dataSource:array
            })
        
            this.timer = setTimeout(()=>{
                array[array.indexOf(item)]["loadingChat"] = true;
                this._leftAnimate(this.leftEnterValue);
                array[array.indexOf(item)]["ani"] = true;

                this.setState({
                    dataSource:array, 
                    index:i
                }, ()=>{
                });

                if (item.action) {
                    // 停止加载, action 显示
                    console.log(111);
                    this.timer = setTimeout(()=>{
                        this.setState({
                            showAction:true
                        })
                    }, 1000)

                }else{
                    // 继续加载
                    this.timer=setTimeout(()=>{
                        this._loadMessage(arr, i+1)
                    }, 1000)
                }
            }, 2000)
            
        },1000);
    }
    _leftAnimate(target){
        this.leftEnterValue.setValue(0);
        Animated.timing(
            this.leftEnterValue,
            {
                toValue:1,
                duration:1000,
                easing:Easing.spring
            }
        ).start(()=>{
            var array = this.state.dataSource;
            var item = this.state.data[this.state.index];
            array[array.indexOf(item)]["ani"] = false;
        })


    }
    // action 按钮 点击事件
    _clickBtnActionEvent(){
        this.setState({
            showAction:false
        })
        this._loadMessage(this.state.data, this.state.index+1);
    }
    // action 按钮
    _renderBtnActions(){
        var item = this.state.data[this.state.index];
        return (
            item.exercises
            ?
                <View style={styles.btns}>
                    <View style={styles.actions}>
                        {
                            item.action.map((a, i)=>{
                                return (
                                    <View style={styles.btnOption} key={i}>
                                        <Text style={{color:'rgb(250, 80, 131)'}}>{a.content}</Text>
                                    </View>
                                )
                            })
                        }
                        <View style={styles.btnSubmit}>
                            <Text style={{color:'white'}}>
                                {"Ok"}
                            </Text>
                        </View>
                    </View>
                </View>
            :
                <View style={styles.btns}>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._clickBtnActionEvent.bind(this)}>
                            <View style={styles.btnSubmit}>
                                <Text style={{color:'white'}}>
                                    {item.action}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>
        )
       
    }
    // 正常数据加载
    _renderItemMessage(item, index){
        return (
            item.loadingChat
            ?
                item.link
                ?
                    <View style={styles.message}>
                        <Image
                          style={styles.avatar}
                          source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                        />
                        <View style={styles.msgView}>  
                            <View style={[styles.messageView, {flex:1}]}>
                                <Text style={styles.messageText}>
                                  {item.message}
                                </Text>
                                <Text style={{color:'rgb(84, 180, 225)'}}>
                                  {item.link}
                                </Text>
                            </View> 
                            <Image
                              style={{width:15, height:15, marginHorizontal:10}}
                              source={require('../images/arrow.png')}
                            />
                        </View>
                    </View>
                :
                    item.img
                    ?
                        <View style={styles.message}>
                            <Image
                              style={styles.avatar}
                              source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                            />
                            <View style={styles.msgView}>
                                <Image
                                  style={{width:(widthMsg-45-45)*0.5, height:Utils.getImgWidthHeight(item.img, (widthMsg-45-45)*0.5)}}
                                  source={{uri: item.img}}
                                />
                            </View>
                        </View>
                    :
                        <View style={[styles.message, ]}>
                            <Image
                              style={styles.avatar}
                              source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                            />
                            <View style={styles.msgView}>
                                <View style={styles.messageView}>
                                    <Text style={styles.messageText}>
                                        {item.message}
                                    </Text>
                                </View>
                            </View>
                        </View>
            :
                <View style={[styles.loadingChat,]}>
                    <Image
                      style={{height:15}}
                      source={require('../images/chat.gif')}
                      resizeMode='contain'
                    />
                </View>
        )
    }
    _renderItemMessageAni(item, index){
        var aniV = "leftEnterValue" + this.state.index;
        const translateX = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[-2000, 0]
        })
        const opacity = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[0, 1]
        })
        var s = null
        if (this.state.index == 0){
            s = {
                color:'red'
            }
        }
        

        return (
            item.loadingChat
            ?
                item.link
                ?
                    <Animated.View style={[styles.message, {transform:[{translateX:translateX}], opacity:opacity}]}>
                        <Image
                          style={styles.avatar}
                          source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                        />
                        <View style={styles.msgView}>  
                            <View style={[styles.messageView, {flex:1}]}>
                                <Text style={styles.messageText}>
                                  {item.message}
                                </Text>
                                <Text style={{color:'rgb(84, 180, 225)'}}>
                                  {item.link}
                                </Text>
                            </View> 
                            <Image
                              style={{width:15, height:15, marginHorizontal:10}}
                              source={require('../images/arrow.png')}
                            />
                        </View>
                    </Animated.View>
                :
                    item.img
                    ?
                        item.ani
                        ?
                            <Animated.View style={[styles.message, {transform:[{translateX:translateX}], opacity:opacity}]}>
                                <Image
                                  style={styles.avatar}
                                  source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                                />
                                <View style={styles.msgView}>
                                    <Image
                                      style={{width:(widthMsg-45-45)*0.5, height:Utils.getImgWidthHeight(item.img, (widthMsg-45-45)*0.5)}}
                                      source={{uri: item.img}}
                                    />
                                </View>
                            </Animated.View>
                        :
                            <View style={[styles.message, ]}>
                                <Image
                                  style={styles.avatar}
                                  source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                                />
                                <View style={styles.msgView}>
                                    <Image
                                      style={{width:(widthMsg-45-45)*0.5, height:Utils.getImgWidthHeight(item.img, (widthMsg-45-45)*0.5)}}
                                      source={{uri: item.img}}
                                    />
                                </View>
                            </View>
                    :
                        item.ani
                        ?
                            <Animated.View style={[styles.message, {transform:[{translateX:translateX}], opacity:opacity}]}>
                                <Image
                                  style={styles.avatar}
                                  source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                                />
                                <View style={styles.msgView}>
                                    <View style={styles.messageView}>
                                        <Text style={[styles.messageText, s]}>
                                            {item.message}
                                        </Text>
                                    </View>
                                </View>
                            </Animated.View>
                        :
                            <View style={[styles.message, ]}>
                                <Image
                                  style={styles.avatar}
                                  source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                                />
                                <View style={styles.msgView}>
                                    <View style={styles.messageView}>
                                        <Text style={styles.messageText}>
                                            {item.message}
                                        </Text>
                                    </View>
                                </View>
                            </View>

            :
                <Animated.View style={[styles.loadingChat, {transform:[{translateX:translateX}], opacity:opacity}]}>
                    <Image
                      style={{height:15}}
                      source={require('../images/chat.gif')}
                      resizeMode='contain'
                    />
                </Animated.View>
        )

    }
    // 缓存数据加载
    _renderItemChatStroage(item, index){
        return (
            item.line == true
            ?
                <View style={styles.sepLine}>
                    <Image
                      style={styles.line}
                      source={require('../images/line.png')}
                    />
                    <Text style={{color: 'rgb(166, 166, 166)', paddingHorizontal:10}}>
                        {item.message}
                    </Text>
                </View>
            :
                item.question == false
                ?
                    <View style={styles.answer}>
                        <View style={styles.answerMsgView}>
                            <View style={styles.answerView}>
                                <Text style={styles.answerText}>
                                    {item.message}
                                </Text>
                            </View>
                        </View>
                        <Image
                          style={styles.answerAvatar}
                          source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                        />
                        
                    </View>
                :
                    this._renderItemMessage(item, index)
        )
    }
    _renderItem = ({item, index}) => (
        // this._renderItemChatStroage(item, index)
        // this._renderItemMessage(item, index)
        this._renderItemMessageAni(item, index)
    )
    _keyExtractor = (item, index) => index;
    _renderTableView(){
        return (
            <View style={{}}>
                <FlatList 
                    ref={(flatlist)=>this._flatList=flatlist}
                    style={{width:width, height:height-100-64}}
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    extraData={this.state.loadingChat}
                    keyExtractor={this._keyExtractor}
                    onLayout={ (e) => {
                       const height = e.nativeEvent.layout.height
                       console.log(e.nativeEvent.layout);
                    }}
                    onContentSizeChange={ (contentWidth, contentHeight) => {
                        console.log(contentHeight);
                        this.setState({
                            contentHeight:contentHeight
                        })
                    }}
                />
                {
                    this.state.showAction? this._renderBtnActions() : null
                }
                
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
            <View style={{flex:1}}>
                {/*tableview布局*/}
                {this._renderTableView()}
            </View> 
        )
    }
    render(){
        return (
            <View style={styles.container}>
                {this._renderRootView()}
            </View>
        )
    }
}
const width = Utils.width;
const height = Utils.height;

// 每条消息的宽度
const marginHorMsg = 5;
const widthMsg = width - 10;
const styles = StyleSheet.create({
    // ------------------------加载中
    loadingView:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

    container:{
        flex:1,
        backgroundColor:'rgb(229, 230, 231)'
    },
    item:{
        padding:10,
        fontSize:18,
        height:44,
    },
    // ---------------------message(机器回复)
    message:{
        width:widthMsg,
        marginVertical:10, 
        marginHorizontal:marginHorMsg, 
        flexDirection:'row'
    },
    avatar:{
        width:40,
        height:40, 
        marginRight:5, 
        borderRadius:20
    },
    msgView:{
        width:widthMsg-45-45, 
        alignItems:'center', 
        justifyContent:'flex-start', 
        flexDirection:'row',
    },
    messageView:{
        borderRadius:5, 
        borderBottomLeftRadius:0, 
        paddingHorizontal:5, 
        paddingVertical:10,  
        backgroundColor:'white'
    },
    messageText:{
        fontSize:15, 
        lineHeight:22.5, 
        color:'rgb(58, 59, 60)',
        textAlign:'justify'
    },
    // -----------------------人工回复
    answer:{
        width:widthMsg,
        marginVertical:10,
        marginHorizontal:marginHorMsg,
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    answerAvatar:{
        width:40,
        height:40, 
        borderRadius:20,
        marginLeft:5
    },
    answerMsgView:{
        width:widthMsg-45-45, 
        alignItems:'center', 
        flexDirection:'row',
        justifyContent:'flex-end',
    },
    answerView:{
        borderRadius:5, 
        borderBottomRightRadius:0, 
        paddingHorizontal:10, 
        paddingVertical:5,  
        backgroundColor:'rgb(240, 240, 240)'
    },
    answerText:{
        fontSize:15, 
        lineHeight:22.5, 
        color:'gray'
    },
    // -----------------------节分割线
    sepLine:{
        alignItems: 'center', 
        justifyContent:'center', 
        position: 'relative', 
        height: 40
    },
    line:{
        width:widthMsg * 0.9, 
        height: 1, 
        position: 'absolute', 
        left: widthMsg*0.05,
        top: 19.5
    },
    // --------------------------底部按钮
    btns:{
        height:100, 
        width:width
    },
    actions:{
        flexDirection:'row', 
        justifyContent:'flex-end', 
        marginHorizontal:8, 
        marginVertical:5
    },
    btnSubmit:{
        backgroundColor:'rgb(250, 80, 131)', 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        padding:10, 
        marginLeft:5
    },
    btnOption:{
        backgroundColor:'white', 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        padding:10, 
        marginLeft:5
    },
    // -----------------消息等待
    loadingChat:{
        alignItems:'center', 
        justifyContent:'center',
        width:60, 
        height:30,
        backgroundColor:'white', 
        borderRadius:5, 
        margin:10
    },
    

});

export default MessagePage1;
