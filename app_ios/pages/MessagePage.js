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
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

const actionChooseCourseTag = 1;    //点击选择课程
const actionBeginStudyTag = 2;      //开始学习
const actionRestartStudyTag = 3;    //重新学习
const actionRecordTag = 4;          //打卡
const actionCommonTag = 0;          //普通按钮

class MessagePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            totalData:[],           //某课程总数据
            data:null,              //节数据
            index:0,                //节下标
            currentItem:null,       //当前消息
            number:0,               //记录加载数据的个数
            dataSource:[],          //页面加载的所有数据源
            loadingChat:true,       //等待符号
            
            optionData:[],          //选项数据
            optionIndex:0,          //选项下标
            options:[],             //用户做出的选择
            actionTag:actionCommonTag,   //默认是普通按钮
            showAction:false,
            contentHeight:0,

            course:1,               //当前课程的 pk
            courseIndex:0,          //当前课程的进度
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
        // this._fetchCourseInfoWithPk(this.state.course);
        // this._loadMessages(this.state.courseIndex+1);
        // this._fetchCourseInfoForInit(1);
        this._loadDefaultMessages();
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState) {
        console.log("contentHeight:" + this.state.contentHeight);
        if (this.state.contentHeight > 503) {
            setTimeout(()=>{
                this._flatList.scrollToEnd();
            })
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }
    _loadDefaultMessages(){
        var array = chatdata["default"];

        for (var i = 0; i < array.length; i++) {
            array[i]["ani"] = false;
            if (array[i]["exercises"] == true) {
                var options = array[i]["action"];
                for(var j = 0; j<options.length; j++){
                    options[j]["select"] = false
                }
            }
        }
        this.setState({
            data:array,
            index:0,
            loading:true
        }, ()=>{
            this._loadMessage(this.state.data, this.state.index, false);
        })  
    }
    _loadMessages(courseIndex){
        if (!this.state.totalData[courseIndex]) {
            Utils.showMessage("恭喜，您已经完成本课程的学习。您可以选择其它课程，再继续");
            return
        }

        this._loadSepLine(courseIndex);  //界面显示节数据

        var array = this.state.totalData[courseIndex];
        for (var i = 0; i < array.length; i++) {
            array[i]["ani"] = false;
            if (array[i]["exercises"] == true) {
                var options = array[i]["action"];
                for(var j = 0; j<options.length; j++){
                    options[j]["select"] = false
                }
            }
        }
        this.setState({
            data:array,
            index:0,
            loading:true
        }, ()=>{
            this._loadMessage(this.state.data, this.state.index, false);
        })  
    }
    _loadMessage(arr, i, opt){
        // this._leftAnimate(this.leftEnterValue);

        //显示等待符号
        this.setState({
            loadingChat:true
        }, ()=>{
            this.timer = setTimeout(()=>{
                
                var array = this.state.dataSource;
                var item = arr[i];
                array.push(item);

                this.setState({
                    number:this.state.number+1,
                    dataSource:array,
                    currentItem:item
                },()=>{
                    // 判断点的是普通消息按钮还是问题按钮
                    if (opt == false) {
                        this.setState({
                            index:i
                        })
                    }else{
                        this.setState({
                            optionIndex:i
                        })
                    }

                    //隐藏等待符号
                    this.setState({
                        loadingChat:false
                    })
                    if (item.action) {
                        // 停止加载, action 显示
                        // 底部按钮行为状态的变化
                        if (item.action == "点击选择课程") {
                            this.setState({
                                actionTag:actionChooseCourseTag
                            })
                        }
                        if (item.record == true) {
                            this.setState({
                                actionTag:actionRecordTag
                            })
                        }

                        this.timer = setTimeout(()=>{
                            this.setState({
                                showAction:true
                            })
                        }, 1000)

                    }else{
                        // 继续加载
                        this.timer=setTimeout(()=>{
                            this._loadMessage(arr, i+1, opt)
                        }, 1000)
                    }
                })
            }, 1000);

        })
    }
    _leftAnimate(target){
        this.leftEnterValue.setValue(0);
        Animated.timing(
            this.leftEnterValue,
            {
                toValue:1,
                duration:500,
                easing:Easing.easeIn
            }
        ).start(()=>{
        })
    }
    // ---------------------网络请求
    _fetchCourseInfoWithPk(course){
        console.log(1);
        var type = "get",
            url = Http.courseInfo(course),
            token = "229f00b183b4390f4d429049941c7259cdba663e",
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response);
            try{
                var array = JSON.parse(response.json);
            }
            catch(err){
                Utils.showMessage("数据格式有问题");
                return
            }
            
            this.setState({
                courseIndex:response.learn_extent.last_lesson    //记录进度
            }, ()=>{
                var courseIndex = this.state.courseIndex;  //进度
                this.setState({
                    totalData:array
                }, ()=>{
                    this._loadMessages(courseIndex+1)
                })
            })
            

        }, (err) => {
            console.log(2);
            // console.log(err);
            Utils.showMessage('网络请求失败');
        });
    }
    _fetchCourseInfoForInit(course){
        var type = "get",
            url = Http.courseInfo(course),
            token = "229f00b183b4390f4d429049941c7259cdba663e",
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response);

        }, (err) => {
            // console.log(err);
            Utils.showMessage('网络请求失败');
        });
    }
    _fetchAddReward(course, courseIndex, chapter, growNum, zuanNum){
        if (!chapter || chapter == "") {
            //直接要下一条数据
            this._loadClickBtnAction();
            return
        }
        var type = "put",
            url = Http.addReward,
            token = "229f00b183b4390f4d429049941c7259cdba663e",
            data = {
                course:course,
                lesson:courseIndex,
                chapter:chapter,
                experience_amount:growNum,
                diamond_amount:zuanNum
            };
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response);
            // if(zuanNum != 0){
            //     // 打开钻石动画
            //     Common.playSoun('https://static1.bcjiaoyu.com/Diamond%20Drop.wav');  //播放钻石音效
            //     Util.zuanAnimate(json.diamond);
                
            // }
            // if(growNum != 0){
            //     // 打开经验动画
            //     Util.growAnimate(growNum);
            // }

            // if(localStorage.currentGrade != json.grade.current_name){
            //     // 打开升级动画
            //     setTimeout(function(){
            //         Common.playSoun('https://static1.bcjiaoyu.com/level_up.mp3');  //播放经验音效
            //         Util.gradeAnimate();
            //     }, 500);
                
            // }

            // // 更新个人信息
            // Util.updateInfo(json);
    
            this._loadClickBtnAction();
        }, (err) => {
            // console.log(err);
            Utils.showMessage('网络请求失败');
            this._loadClickBtnAction();
        });
    }
    _fetchUpdateExtent(course, courseIndex){
        var type = "post",
            url = Http.updateExtent,
            token = "229f00b183b4390f4d429049941c7259cdba663e",
            data = {
                course:course,
                lesson:courseIndex
            };
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response);
            this._loadClickBtnAction();
        }, (err) => {
            // console.log(err);
            Utils.showMessage('网络请求失败');
        });
    }
    
    // ---------------------点击事件
    // action 按钮 点击事件
    _clickBtnActionEvent(){
        this.setState({
            showAction:false
        })
        
        var actionText = this.state.currentItem.action
        if (this.state.actionTag == actionBeginStudyTag){
            actionText = "开始学习"
        }else if (this.state.actionTag == actionRestartStudyTag) {
            actionText = "重新学习"
        }
        this._loadAnswer(actionText)    //界面显示人工回复


        //判断按钮的行为
        if (this.state.actionTag == actionChooseCourseTag) {
            // TODO:前后课程是否一致, 一致不改，不一致改
            // 选择课程
            this.setState({
                course:1,
                courseIndex:0,
                actionTag:actionBeginStudyTag,
            },()=>{
                this.setState({
                    showAction:true
                })
            })
            
            return
        }else if (this.state.actionTag == actionBeginStudyTag) {
            //开始学习
            this.setState({
                actionTag:actionCommonTag,
                loadingChat:true
            }, ()=>{
                this._fetchCourseInfoWithPk(this.state.course);
            })
        }else if(this.state.actionTag == actionRecordTag){
            //打卡
            this.setState({
                actionTag:actionCommonTag,
                loadingChat:true
            })
            this._fetchUpdateExtent(this.state.course, this.state.courseIndex+1);
        }else{
            // 普通按钮
            var item = this.state.currentItem;
            if(item.zuan_number || item.grow_number){
                // 奖励钻石，经验
                var course = this.state.course;
                var courseIndex = this.state.courseIndex;
                courseIndex = parseInt(courseIndex) + 1;
                
                this._fetchAddReward(course, courseIndex, item.chapter, item.grow_number, item.zuan_number);  //奖励钻石
            }else{
                // 下一条数据
                this._loadClickBtnAction();
            }
        }
    }
    // action 按钮
    _loadClickBtnAction(){
        if (this.state.optionData && this.state.optionData.length) {
            // 问题下的普通按钮
            if (this.state.optionData.length == this.state.optionIndex+1) {
                // 选项执行完了， 执行下一条消息, 并重置问题下消息数组及下标
                var opMsg = this.state.optionData[this.state.optionIndex]  //取出选项最后一个元素
                
                this.setState({
                    optionData:[],
                    optionIndex:0
                })

                if (opMsg.again == true) {
                    //重做一遍习题
                    this._loadMessage(this.state.data, this.state.index, false)
                }else{
                    this._loadMessage(this.state.data, this.state.index+1, false)
                }
            }else{
                //选项接着执行下去
                this._loadMessage(this.state.optionData, this.state.optionIndex+1, true)
            }
        }else{
            if (!this.state.data[this.state.index+1] || this.state.data.length == this.state.index+1) {
                // 请求当前课程的下一节课程
                //TODO:
                this._loadMessages(this.state.courseIndex+1);
            }else{
                this._loadMessage(this.state.data, this.state.index+1, false);
            }
        }
    }
    // 选项提交按钮
    _clickOptionSubmitEvent(){
        if (!this.state.options || this.state.options.length == 0) {
            Utils.showMessage("请选择一个选项")
            return
        }
        var actionText = this.state.options.join(',')
        this._loadAnswer(actionText)    //界面显示人工回复

        this.setState({
            showAction:false,
            options:[],
            loadingChat:true
        })

        var item = this.state.currentItem
        if (actionText == item.answer) {
            //正确答案
            this.setState({
                optionData:item.correct,
                optionIndex:0
            }, ()=>{
                this._loadMessage(this.state.optionData, this.state.optionIndex, true)
            })
        }else{
            // 错误答案
            this.setState({
                optionData:item.wrong,
                optionIndex:0
            }, ()=>{
                this._loadMessage(this.state.optionData, this.state.optionIndex, true)
            })
        }

    }
    // 选项按钮
    _clickOptionEvent(index, option){
        var item = this.state.data[this.state.index];
        item = this.state.currentItem
        if (item.action[index]["select"] == false) {
            item.action[index]["select"] = true
            this.state.options.push(option)
        }else{
            item.action[index]["select"] = false
            this.state.options.splice(this.state.options.indexOf(option), 1)
        }
        this.state.options.sort()
        console.log(this.state.options)

        this.setState({
            currentItem:item
        }) 
    }
    _loadSepLine(number){

        // 节分割线，更改数据源，刷新 UI
        var array = this.state.dataSource;
        var msg = "第" + Utils.numberToChinese(number) + "节"
        var dic = {
            "message":msg
        }
        dic["question"] = false;
        dic["line"] = true;  
        array.push(dic)
        this.setState({
            number:this.state.number+1,
            dataSource:array,
        }, ()=>{
            //隐藏等待符号
            this.setState({
                loadingChat:false
            })
        })

        // TODO:存储数据
    }
    _loadAnswer(actionText){
        //人工回复，更改数据源，刷新 UI
        var array = this.state.dataSource;
        var dic = {
            message:actionText
        }
        dic["question"] = false
        dic["line"] = false
        array.push(dic);
        this.setState({
            number:this.state.number+1,
            dataSource:array,
        })

        // TODO:存储数据
    }

    // ---------------------UI 布局
    // action 按钮数据加载
    _renderBtnActions(){
        var item = this.state.data[this.state.index];
        item = this.state.currentItem;
        return (
            item.exercises
            ?
                <View style={styles.btns}>
                    <View style={styles.actions}>
                        {
                            item.action.map((a, i)=>{
                                return (
                                    <TouchableOpacity style={a.select?styles.btnOptionSelect:styles.btnOption} key={i} onPress={this._clickOptionEvent.bind(this, i, a.content)}>
                                        <Text style={a.select?{color:'white'}:{color:'rgb(250, 80, 131)'}}>{a.content}</Text>
                                    </TouchableOpacity>
                                    
                                )
                            })
                        }
                        <TouchableOpacity onPress={this._clickOptionSubmitEvent.bind(this)}>
                            <View style={styles.btnSubmit}>
                                <Text style={{color:'white'}}>
                                    {"Ok"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            :
                <View style={styles.btns}>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._clickBtnActionEvent.bind(this)}>
                            <View style={styles.btnSubmit}>
                                <Text style={{color:'white'}}>
                                {
                                    this.state.actionTag == actionBeginStudyTag
                                    ?
                                        "开始学习"
                                    :
                                        this.state.actionTag == actionRestartStudyTag
                                        ?
                                            "重新学习"
                                        :
                                            item.action
                                }
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>
        )
       
    }

    // 正常数据加载
    _renderLoadingChat(){
        return (
            <View style={[styles.loadingChat,]}>
                <Image
                  style={{height:15}}
                  source={require('../images/chat.gif')}
                  resizeMode='contain'
                />
            </View>
        ) 
    }
    _renderItemMessage(item, index){
        return (
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
        )
    }
    

    // 动画数据加载
    _renderLoadingChatAni(){
        const translateX = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[-2000, 0]
        })
        const opacity = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[0, 1]
        })
        return (
            <Animated.View style={[styles.loadingChat, {transform:[{translateX:translateX}], opacity:opacity}]}>
                <Image
                  style={{height:15}}
                  source={require('../images/chat.gif')}
                  resizeMode='contain'
                />
            </Animated.View>
        )  
    }
    _renderItemMessageAni(item, index){
        const translateX = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[-2000, 0]
        })
        const opacity = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[0, 1]
        })

        return (
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
                    index+1 == this.state.number
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
                                <Text style={{color:'red'}}>
                                    {index+1}{this.state.number}
                                </Text>
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
                                <Text style={{}}>
                                    {index+1}{this.state.number}
                                </Text>
                            </View>
                        </View>
                :
                    index+1 == this.state.number
                    ?
                        <Animated.View style={[styles.message, {transform:[{translateX:translateX}], opacity:opacity}]}>
                            <Image
                              style={styles.avatar}
                              source={{uri: 'https://resource.bcgame-face2face.haorenao.cn/binshu.jpg'}}
                            />
                            <View style={styles.msgView}>
                                <View style={styles.messageView}>
                                    <Text style={[styles.messageText, {color:'red'}]}>
                                        {item.message}{index+1}{this.state.number}
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
                                        {item.message}{index+1}{this.state.number}
                                    </Text>
                                </View>
                            </View>
                        </View>
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
        this._renderItemChatStroage(item, index)
        // this._renderItemMessage(item, index)
        // this._renderItemMessageAni(item, index)
    )
    _keyExtractor = (item, index) => index;
    _renderTableView(){
        return (
            <View style={{flex:1}}>
                <View style={{width:width, maxHeight:height-64-100}}>
                    <FlatList 
                        ref={(flatlist)=>this._flatList=flatlist}
                        style={{maxHeight:height-64-100-50}}
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
                        this.state.loadingChat?this._renderLoadingChat():null
                    }
                </View>
                
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
        width:width,
        position:'absolute',
        bottom:0
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
    // -------选项按钮
    btnOption:{
        backgroundColor:'white', 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        padding:10, 
        marginLeft:5
    },
    btnOptionSelect:{
        backgroundColor:'rgb(250, 80, 131)', 
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

export default MessagePage;
