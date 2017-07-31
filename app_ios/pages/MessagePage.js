/**
 * @author: chenwei
 * @description: 主页，会话消息页
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

const GrowAniTime = 2000;           //经验动画时间
const ZuanAniTime = 1000;           //钻石动画时间
const GradeAniTime = 2000;          //升级动画时间

const LoadMore = 1;           //点击加载更多
const LoadNoMore = 0;         //已经到头了
const LoadMoreIng = -1;       //加载中

class MessagePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            totalData:[],                //某课程总数据
            chatData:[],                 //缓存数据
            data:null,                   //节数据
            index:0,                     //节下标
            currentItem:null,            //当前消息
            number:0,                    //记录加载数据的个数
            dataSource:[],               //页面加载的所有数据源
            loadingChat:true,            //等待符号
            
            optionData:[],               //选项数据
            optionIndex:0,               //选项下标
            options:[],                  //用户做出的选择
            actionTag:actionCommonTag,   //默认是普通按钮
            showAction:false,
            contentHeight:0,

            course:null,                 //当前课程的 pk
            courseIndex:0,               //当前课程的进度

            chooseCourse:null,           //选择课程的 pk
            chooseCourseIndex:0,         //选择课程的进度

            showGradeAni:false,          //是否显示升级动画
            showZuanAni:false,           //是否显示钻石动画
            showGrowAni:false,           //是否显示经验动画
            growNum:0,                   //经验值

            userinfo:null,               //用户信息
            count:10,                    //缓存数据一次加载的个数

            showHelpActions:false,       //是否显示帮助组按钮
            showHeaderComponent:false,   //是否显示头部的组件（加载更多）
            headerLoadTag:LoadMore,      //默认是点击加载更多

            scrollTop:false,             //是否要向上滚动
            scrollTopLastItem:false,     //向上滚动，最后一个元素

            itemHeight:0,                //item的高度
            bigImgUrl:"",                //放大图片的 url
            showBigImgView:false,        //是否显示大图组件
        };
        this.leftEnterValue = new Animated.Value(0)     //左侧进入动画
        this.growAniValue = new Animated.Value(0)       //经验动画
    };
    // -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        var json = state.params.userinfo;
        if (json && json != "") {
            var pw = 0;
            if (json.grade.current_all_experience != json.grade.next_all_experience) {
                pw = (parseInt(json.experience)-parseInt(json.grade.current_all_experience))/(parseInt(json.grade.next_all_experience)-parseInt(json.grade.current_all_experience))*(width-200)
            }else{
                pw = width-200
            }
        }
        return {
            headerStyle: json?styles.headerStyle:{backgroundColor:'white'},
            title:json?null:"程序媛",
            headerLeft:json?(
                <View style={styles.headerLeftView}>
                    <Image
                      style={styles.headerLeftAvatar}
                      source={{uri: json.avatar.replace("http://", "https://")}}
                    />

                    <View style={styles.headerLeftInfoView}>
                        <View style={{flexDirection:'row', marginBottom:5}}>
                            <Text style={styles.headerLeftGradeText}>
                              {json.grade.current_name}
                            </Text>
                            <Text style={styles.headerLeftExperText}>
                              {json.experience}/{json.grade.next_all_experience}
                            </Text>
                        </View>
                        <View style={styles.headerLeftProgressView}>
                            <Image
                              style={[styles.headerLeftProgressImg, {width:pw}]}
                              source={require('../images/progress.png')}
                            />
                        </View>
                    </View>
                </View>
            ):null,
            headerRight:json?(
                <View style={styles.headerRightView}>
                    <Image
                      style={styles.headerRightImg}
                      source={require('../images/zuan.png')}
                      resizeMode={'contain'}
                    />
                    <Text style={styles.headerRightText}>
                      x{json.diamond}
                    </Text>
                </View>
            ):null
        }
        
    };
    static propTypes = {
      // prop: React.PropTypes.Type
    };
    static defaultProps = {
      // prop: 'value'
    }
    componentWillMount() {
        // var chatArray = [];
        // Utils.setValue("chatData", JSON.stringify(chatArray));
        // Utils.setValue("token", "");

        this._fetchUserInfo();
        this._load();
        // this._loadDefaultMessages();
    }
    componentDidMount() {
    }
    componentDidUpdate(prevProps, prevState) {
        // console.log("contentHeight:" + this.state.contentHeight);
        // if (this.state.contentHeight > height-headerH-90) {
        //     if (this.state.scrollTopLastItem == true) {
        //         this.setState({
        //             scrollTop:false,
        //             scrollTopLastItem:false
        //         })
        //     }

        //     if (this.state.scrollTop == true) {
        //         this._flatList.scrollToIndex({viewPosition: 0, index: 0}); 
        //         console.log("-----scrollTop");
        //     }else{
        //         console.log("-----scrollEnd");

        //         setTimeout(()=>{
        //             this._flatList.scrollToEnd();
        //         }, 10)
        //     } 
        // }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    _load(){
        var chatArray = [];
        Utils.getValue("chatData", (err, result)=>{
            var chatData = JSON.parse(result);
            if (chatData && chatData.length) {
                this._loadStorageMessages();
            }else{
                this.setState({
                    showHeaderComponent:false
                })
                this._loadDefaultMessages();
            }
        })
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
                    // 1.存储消息
                    this._storeChatData(item, "message");

                    // 2.存储下标
                    // 判断点的是普通消息按钮还是问题按钮
                    if (opt == false) {
                        this.setState({
                            index:i
                        }, ()=>{
                            this._storeDataIndex();
                        })
                    }else{
                        this.setState({
                            optionIndex:i
                        }, ()=>{
                            this._storeDataIndex();
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
    // -----------------缓存数据相关
    // 方法1
    _loadStorageMessages1(){
        Utils.getStorageData((chatData, data, index, optionData, optionIndex, currentCourse, currentCourseIndex)=>{
            // console.log(chatData);
            // console.log(data);
            // console.log(index);
            // console.log(optionData);
            // console.log(optionIndex);
            
            this.setState({
                chatData:chatData,
                data:data,
                index:index,
                optionData:optionData,
                optionIndex:optionIndex,
                loading:true,
                number:chatData.length,
                loadingChat:false,
                currentItem:chatData[chatData.length - 1],
                course:currentCourse,
                courseIndex:currentCourseIndex
            }, ()=>{
                console.log("way1...")
                if (currentCourse) {
                    this.setState({
                        loading:false
                    }, ()=>{
                        this._fetchCourseInfoForInit(currentCourse, "way1");
                    })
                }else{
                    this.setState({
                        dataSource:this.state.chatData
                    }, ()=>{
                        if (this.state.currentItem.action) {
                            this.setState({
                                showAction:true
                            })
                        }else{
                            this._loadStorageLastItem();
                        }
                    })
                }
            })
        })
    }
    // 方法2
    _loadStorageMessages(){
        Utils.getStorageData((chatData, data, index, optionData, optionIndex, currentCourse, currentCourseIndex)=>{
            // console.log(chatData);
            // console.log(data);
            // console.log(index);
            // console.log(optionData);
            // console.log(optionIndex);
            
            this.setState({
                chatData:chatData,
                data:data,
                index:index,
                optionData:optionData,
                optionIndex:optionIndex,
                loading:true,
                loadingChat:false,
                currentItem:chatData[chatData.length - 1],
                course:currentCourse,
                courseIndex:currentCourseIndex
            }, ()=>{
                if (currentCourse) {
                    // 先更改数据源，后加载缓存数据
                    this.setState({
                        loading:false
                    }, ()=>{
                        this._fetchCourseInfoForInit(currentCourse, "way2");
                    })
                }else{
                    // 加载存储数据中所有的数据（最新10个数据）
                    var array = [];
                    for (var i = this.state.chatData.length - 1; i > this.state.chatData.length-1-this.state.count; i--) {
                        if(this.state.chatData[i]){
                            array.push(this.state.chatData[i]);
                        }
                    }
                    array = array.reverse();
                    this._loadStorageMessage(array, 0, array.length, false);        
                }
                
            })
        })
    }
    _loadStorageMessage(arr, i, arrLen, agoData){
        //显示等待符号
        if (i >= arrLen) {
            //已经执行过数组的最后一个元素（规定的前10条数据中的最后一条）
            if (agoData == true) {
                // 加载中-->点击加载更多
                if (this.state.number < this.state.chatData.length) {
                    this.setState({
                        headerLoadTag:LoadMore
                    })
                }else{
                    this.setState({
                        headerLoadTag:LoadNoMore
                    })
                }
            }else{
                this._loadStorageLastItem();
            }
            return;
        }
        var array = this.state.dataSource;
        var item = arr[i];
        if (agoData == true) {
            array.unshift(item);
        }else{
            array.push(item);
        }

        this.setState({
            number:this.state.number+1,
            dataSource:array
        },()=>{
            this.timer = setTimeout(()=>{
                this._loadStorageMessage(arr, i+1, arrLen, agoData);
            }, 0)                    
        })

    }
    _loadStorageLastItem(){
        // 判断头部加载状态
        if (this.state.number < this.state.chatData.length) {
            this.setState({
                showHeaderComponent:true,
                headerLoadTag:LoadMore
            })
        }else{
            this.setState({
                showHeaderComponent:true,
                headerLoadTag:LoadNoMore
            })
        }

        // 判断底部 action
        if (this.state.currentItem.action) {
            if (this.state.currentItem.action == "点击选择课程") {
                this.setState({
                    actionTag:actionChooseCourseTag,
                    showAction:true
                })
            }else if (this.state.currentItem.record == true) {
                this.setState({
                    actionTag:actionRecordTag,
                    showAction:true
                })
            }else{
                this.setState({
                    showAction:true
                })
            }
        }else{
            if (this.state.optionData == null || !this.state.optionData.length || this.state.optionData.length == this.state.optionIndex + 1) {
                if (this.state.data.length == this.state.index+1) {
                    //请求当前课程的，下一节数据
                    // TODO:
                    this._fetchCourseInfoWithPk(this.state.course);
                } else{
                    this._loadMessage(this.state.data, this.state.index+1, false);
                }
            }else{
                // 选项接着执行下去
                this._loadMessage(this.state.optionData, this.state.optionIndex+1, true);
            }
        }
    }
    // ------------------数据存储
    _storeChatData(item, tag){
        // 1.存储数据
        var chatArray = [];
        Utils.getValue("chatData", (err, result)=>{
            if (err) {
                return;
            }
            if (result) {
                chatArray = JSON.parse(result)
            }
            // console.log(chatArray);
            if (tag == "message") {
                item['question'] = true;  //当前消息是否是机器回复
                item['line'] = false;
            }else if (tag == "answer") {
                item['question'] = false;  //当前消息是否是机器回复
                item['line'] = false;
            }else if (tag == "line") {
                item['question'] = false;  //当前消息是否是机器回复
                item['line'] = true;
            }
            
            chatArray.push(item)
            Utils.setValue("chatData", JSON.stringify(chatArray));
        })
    }
    _storeDataIndex(){
        Utils.setValue("data", JSON.stringify(this.state.data));
        Utils.setValue("index", JSON.stringify(this.state.index));
        Utils.setValue("optionData", JSON.stringify(this.state.optionData));
        Utils.setValue("optionIndex", JSON.stringify(this.state.optionIndex));
    }
    // ---------------------动画事件
    _loadGrowAni(){
        this._growAni();
        this.setState({
            showGrowAni:true,
            growNum:40
        }, ()=>{
            this.timer = setTimeout(()=>{
                this.setState({
                    showGrowAni:false,
                    growNum:0
                })
            }, GrowAniTime)
        })
    }
    _loadZuanAni(waittime){
        this.timer = setTimeout(()=>{
            this.setState({
                showZuanAni:true
            }, ()=>{
                this.timer = setTimeout(()=>{
                    this.setState({
                        showZuanAni:false
                    })
                }, ZuanAniTime)
            })
        }, waittime)
    }
    _loadGradeAni(waittime){
        this.timer = setTimeout(()=>{
            this.setState({
                showGradeAni:true
            }, ()=>{
                this.timer = setTimeout(()=>{
                    this.setState({
                        showGradeAni:false
                    })
                }, GradeAniTime)
            })
        }, waittime)
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
    _growAni(){
        this.growAniValue.setValue(0);
        Animated.timing(
            this.growAniValue,
            {
                toValue:1,
                duration:GrowAniTime,
                easing:Easing.spring
            }
        ).start(()=>{})
    }
    // ---------------------网络请求
    _fetchCourseInfoWithPk(course){
        Utils.isLogin((token)=>{
            token = "229f00b183b4390f4d429049941c7259cdba663e";
            if (token) {
                console.log(1);
                var type = "get",
                    url = Http.courseInfo(course),
                    token = token,
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
                        // 存储课程进度下标
                        Utils.setValue("currentCourseIndex", JSON.stringify(this.state.courseIndex));
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
        })
    }
    _fetchCourseInfoForInit(course, way){
        Utils.isLogin((token)=>{
            token = "229f00b183b4390f4d429049941c7259cdba663e";
            if (token) {
                var type = "get",
                    url = Http.courseInfo(course),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    console.log(response);
                    this.setState({
                        loading:true
                    })
                    // 方法1，捕获异常
                    try {
                       var array = JSON.parse(response.json);
                    }
                    catch(err){
                        Utils.showMessage("数据格式有问题!");
                        return;
                    }
                    
                    var courseIndex = this.state.courseIndex;
                    // 更改数据源
                    if(array[courseIndex+1]){
                        this.setState({
                            data:array[courseIndex+1],
                            optionData:[],
                            optionIndex:0
                        }, ()=>{
                            this._storeDataIndex();

                            if (way == "way1") {
                                // 方法1
                                this.setState({
                                    dataSource:this.state.chatData
                                }, ()=>{
                                    if (this.state.currentItem.action) {
                                        this.setState({
                                            showAction:true
                                        })
                                    }else{
                                        this._loadStorageLastItem();
                                    }
                                })
                            }else{
                                // 方法2
                                // 加载存储数据中所有的数据（最新10个数据）
                                var array = [];
                                for (var i = this.state.chatData.length - 1; i > this.state.chatData.length-1-this.state.count; i--) {
                                    if(this.state.chatData[i]){
                                        array.push(this.state.chatData[i]);
                                    }
                                }
                                array = array.reverse();
                                this._loadStorageMessage(array, 0, array.length, false);
                            }
                        })
                    }

                }, (err) => {
                    // console.log(err);
                    Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    _fetchUserInfo(){
        Utils.isLogin((token)=>{
            token = "229f00b183b4390f4d429049941c7259cdba663e";
            if (token) {
                const {setParams} = this.props.navigation;
                var type = "get",
                    url = Http.whoami,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    // console.log(response);
                    // Util.updateInfo(json);
                    this.setState({
                        userInfo:response
                    })
                    setParams({userinfo:response})

                }, (err) => {
                    // console.log(err);
                    Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    _fetchAddReward(course, courseIndex, chapter, growNum, zuanNum){
        Utils.isLogin((token)=>{
            token = "229f00b183b4390f4d429049941c7259cdba663e";
            if (token) {
                if (!chapter || chapter == "") {
                    //直接要下一条数据
                    this._loadClickBtnAction();
                    return
                }
                var type = "put",
                    url = Http.addReward,
                    token = token,
                    data = {
                        course:course,
                        lesson:courseIndex,
                        chapter:chapter,
                        experience_amount:growNum,
                        diamond_amount:zuanNum
                    };
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    console.log(response);
                    // this._loadGrowAni();
                    // this._loadZuanAni(GrowAniTime);
                    // this._loadGradeAni(GrowAniTime+ZuanAniTime);
                    
                    
                    var growAni = false,
                        zuanAni = false;
                    if (json.experience > this.state.userinfo.experience) {
                        // 打开经验动画
                        growAni = true
                        this._loadGrowAni();
                    }
                    if (json.diamond > this.state.userinfo.diamond) {
                        // 打开钻石动画
                        zuanAni = true
                        if (growAni){
                            this._loadZuanAni(GrowAniTime);
                        }else{
                            this._loadZuanAni(0);
                        } 
                    }
                    if(this.state.userinfo.grade.current_name != json.grade.current_name){
                        // 打开升级动画
                        if (growAni) {
                            if (zuanAni) {
                                this._loadGradeAni(GrowAniTime+ZuanAniTime);
                            }else{
                                this._loadGradeAni(GrowAniTime);
                            }
                        }else{
                            if (zuanAni) {
                                this._loadGradeAni(ZuanAniTime);
                            }else{
                                this._loadGradeAni(0);
                            }
                        } 
                    }

                    // 更新个人信息
                    this.setState({
                        userInfo:response
                    })
                    setParams({userinfo:response})
            
                    this._loadClickBtnAction();
                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                    this._loadClickBtnAction();
                });
            }
        })
    }
    _fetchUpdateExtent(course, courseIndex){
        Utils.isLogin((token)=>{
            token = "229f00b183b4390f4d429049941c7259cdba663e";
            if (token) {
                var type = "post",
                    url = Http.updateExtent,
                    token = token,
                    data = {
                        course:course,
                        lesson:courseIndex
                    };
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    console.log(response);
                    this._loadClickBtnAction();
                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    
    // ---------------------点击事件
    // action 按钮 点击事件
    _clickBtnActionEvent(){
        //向下滚动
        this.setState({
            scrollTop: false
        }) 

        this.setState({
            showAction:false
        })
        
        var actionText = this.state.currentItem.action
        if (this.state.actionTag == actionBeginStudyTag){
            actionText = "开始学习"
        }else if (this.state.actionTag == actionRestartStudyTag) {
            actionText = "重新学习"
        }
        Utils.isLogin((token)=>{
            token="111"
            if (this.state.actionTag == actionChooseCourseTag && !token){
            }else{
                // 去掉点选择课程登录的时候，不打印选择课程
                this._loadAnswer(actionText)    //界面显示人工回复
            }
        })


        //判断按钮的行为
        if (this.state.actionTag == actionChooseCourseTag) {
            // TODO:前后课程是否一致, 一致不改，不一致改
            // TODO:判断是否登录，如果未登录，跳到登录页，否则，跳到选择课程页
            // 选择课程
            
            // this._loadChooseCourse();
            
            this.setState({
                chooseCourse:2,
                chooseCourseIndex:0
            }, ()=>{
                if (this.state.chooseCourse != this.state.course) {
                    // 按钮由选择课程-->开始学习
                    this.setState({
                        actionTag:actionBeginStudyTag,
                        showAction:true
                    })
                }else{
                    this.setState({
                        // actionTag:actionBeginStudyTag,
                        showAction:true
                    })
                }
            })
            
        }else if (this.state.actionTag == actionBeginStudyTag) {
            //开始学习
            this.setState({
                course:this.state.chooseCourse,
                courseIndex:this.state.chooseCourseIndex,
                actionTag:actionCommonTag,
                loadingChat:true
            }, ()=>{
                Utils.setValue("currentCourse", JSON.stringify(this.state.course))
                Utils.setValue("currentCourseIndex", JSON.stringify(this.state.courseIndex))
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
    // 选择课程点击
    _loadChooseCourse(){
        Utils.isLogin((token)=>{
            if (token) {
                // 已登录
                this.props.navigation.navigate('CourseList', {user:'', callback:(course, courseIndex)=>{
                    this.setState({
                        chooseCourse:course,
                        chooseCourseIndex:courseIndex
                    }, ()=>{
                        if (this.state.chooseCourse != this.state.course) {
                            // 按钮由选择课程-->开始学习
                            this.setState({
                                actionTag:actionBeginStudyTag,
                                showAction:true
                            })
                        }else{
                            this.setState({
                                // actionTag:actionBeginStudyTag,
                                showAction:true
                            })
                        }
                    })
                }})
            }else{
                // 未登录
                this.props.navigation.navigate('Login', {user:'', callback:()=>{
                     this.setState({
                        actionTag:actionChooseCourseTag,
                        showAction:true
                    })
                    this._fetchUserInfo();
                }})
            }  
        })
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
                this._fetchCourseInfoWithPk(this.state.course);
            }else{
                this._loadMessage(this.state.data, this.state.index+1, false);
            }
        }
    }
    // 选项提交按钮
    _clickOptionSubmitEvent(){
        //向下滚动
        this.setState({
            scrollTop:false
        }) 

        if (!this.state.options || this.state.options.length == 0) {
            Utils.showMessage("请选择一个选项")
            return
        }
        var actionText = this.state.options.join(',')
        this._loadAnswer(actionText)    //界面显示人工回复
        
        var item = this.state.data[this.state.index];
        item = this.state.currentItem
        item.action[index]["select"] = false

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
    // 选项按钮点击 
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
    // 选择课程点击
    _clickChooseCourse = ()=>{
        this.setState({showHelpActions:false})
        this._loadChooseCourse();
    }
    // 寻找帮助点击
    _clickFindHelp = ()=>{
        this.setState({showHelpActions:false})
    }
    // 学习论坛点击
    _clickStudyLuntan = ()=>{
        this.setState({showHelpActions:false})
    }
    // 退出登录点击
    _clickQuitLogin = ()=>{
        this.setState({
            loading:false,
            totalData:[],                //某课程总数据
            chatData:[],                 //缓存数据
            data:null,                   //节数据
            index:0,                     //节下标
            currentItem:null,            //当前消息
            number:0,                    //记录加载数据的个数
            dataSource:[],               //页面加载的所有数据源
            loadingChat:true,            //等待符号
            
            optionData:[],               //选项数据
            optionIndex:0,               //选项下标
            options:[],                  //用户做出的选择
            actionTag:actionCommonTag,   //默认是普通按钮
            showAction:false,
            contentHeight:0,

            course:null,                 //当前课程的 pk
            courseIndex:0,               //当前课程的进度

            chooseCourse:null,           //选择课程的 pk
            chooseCourseIndex:0,         //选择课程的进度

            showGradeAni:false,          //是否显示升级动画
            showZuanAni:false,           //是否显示钻石动画
            showGrowAni:false,           //是否显示经验动画
            growNum:0,                   //经验值

            userinfo:null,               //用户信息
            count:10,                    //缓存数据一次加载的个数

            showHelpActions:false,       //是否显示帮助组按钮
            showHeaderComponent:false,   //是否显示头部的组件（加载更多）
            headerLoadTag:LoadMore,      //默认是点击加载更多

            scrollTop:false,             //是否要向上滚动
            scrollTopLastItem:false,     //向上滚动，最后一个元素

            itemHeight:0,                //item的高度
            bigImgUrl:"",                //放大图片的 url
            showBigImgView:false,
        })
        Utils.clearAllValue()
        this.setState({showHelpActions:false})
        this._fetchUserInfo();
        this._load();
    }
    // 消息图片点击
    _clickMessageImg(url){
        this.setState({
            showBigImgView:true,
            bigImgUrl:url
        })
    }
    // 消息链接点击
    _clickMessageLink(link){
        link == "www.code.com"
        ?
            this.props.navigation.navigate("CodeEditWebView")
        :
            Utils.openURL(link)
            // this.props.navigation.navigate('ThirdSiteWebView', {url:link})
    }
    // 大图点击事件
    _clickBigImg = ()=>{
         this.setState({
            showBigImgView:false
         })
    }
    // 点击加载更多
    _clickLoadMore(){
        if (this.state.headerLoadTag == LoadMore) {
            //// 判断存储数据是否已全部加载完
            Utils.getValue("chatData", (err, result)=>{
                var chatData = JSON.parse(result);
                if (chatData && chatData.length) {
                    if (this.state.number < chatData.length) {
                        //存储数据源还没有加载完, 继续加载(靠后的10条数据)。 判断已加载数据个数与存储个数是否相同
                        var array = [];
                        var originIndex = chatData.length-1-this.state.number,
                            lastIndex = chatData.length-1-this.state.number-this.state.count;
                        for (var i = originIndex; i > lastIndex; i--) {
                            if (chatData[i]) {
                                array.push(chatData[i]);
                            }
                        } 
                        //向上滚动
                        this.setState({
                            scrollTop:true,
                            headerLoadTag:LoadMoreIng
                        }) 
                        this._loadStorageMessage(array, 0, array.length, true);
                    }   
                }
            })
        }
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
            this._storeChatData(dic, "line");
            
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
        }, ()=>{
            this._storeChatData(dic, "answer");
        })

        // TODO:存储数据
    }

    // ---------------------UI 布局
    _renderScaleBigImage(){
        return (
            <TouchableOpacity onPress={this._clickBigImg} style={styles.imgShadowView}>
                <Image
                  resizeMode={'contain'}
                  style={{width:width, height:Utils.getImgWidthHeight(this.state.bigImgUrl, width)}}
                  source={{uri:this.state.bigImgUrl}}
                />
            </TouchableOpacity>
        )
    }
    _renderZuanView(){
        return(
            <View style={styles.zuanShadowView}>
                <View style={styles.zuanView}>
                    <Image
                      style={styles.zuanImg}
                      source={require('../images/zuan2.gif')}
                    />
                    
                </View>
            </View>
        )
    }
    _renderGradeView(){
        return(
            <View style={styles.gradeShadowView}>
                <View style={styles.gradeView}>
                    <Image
                      style={styles.gradeImg}
                      source={require('../images/growup.gif')}
                    />
                    
                </View>
            </View>
        )
    }
    _renderGrowView(){
        // 字体放大之后再恢复到最初(放大/缩小)
        const textSize = this.growAniValue.interpolate({
            inputRange:[0, 0.25, 0.5, 1],
            outputRange:[20, 30, 50, 20]
        })
        const translateY = this.growAniValue.interpolate({
            inputRange:[0, 0.25, 0.5, 1],
            outputRange:[140, 0, 0, -140]
        })
        const opacity = this.growAniValue.interpolate({
            inputRange:[0, 0.25, 0.5, 1],
            outputRange:[0, 0.6, 1, 0]
        })
        return (
            <View style={styles.growShadowView}>
                <Animated.Text style={[{transform:[{translateY:translateY}], opacity:opacity, fontSize:textSize}, styles.growText]}>
                    {"经验 +"}{this.state.growNum}
                </Animated.Text>
            </View>
            
        )
    }
    _renderHelpActions(){
        return (
            <View style={styles.helpActionsView}>
                <TouchableOpacity style={{borderBottomColor:'#d2d2d2', borderBottomWidth:1}} onPress={this._clickChooseCourse}>
                    <Text style={styles.helpActionText}>{"选择课程"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{borderBottomColor:'#d2d2d2', borderBottomWidth:1}} onPress={this._clickStudyLuntan}>
                    <Text style={styles.helpActionText}>{"学习论坛"}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={{borderBottomColor:'#d2d2d2', borderBottomWidth:1}} onPress={this._clickQuitLogin}>
                    <Text style={styles.helpActionText}>{"退出登录"}</Text>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={this._clickFindHelp}>
                    <Text style={styles.helpActionText}>{"寻找帮助"}</Text>
                </TouchableOpacity>
                
                <Image
                  style={styles.helpActionArrow}
                  source={require('../images/arrow-w.png')}
                  resizeMode={"contain"}
                />
                
            </View>
        )
    }
    // action 按钮数据加载
    _renderBtnActions(){
        var item = this.state.data[this.state.index];
        item = this.state.currentItem;
        return (
            item.exercises
            ?
                <View style={{}}>
                    <View style={styles.actions}>
                        {
                            item.action.map((a, i)=>{
                                return (
                                    <TouchableOpacity style={a.select?styles.btnOptionSelect:styles.btnOption} key={i} onPress={this._clickOptionEvent.bind(this, i, a.content)}>
                                        <Text style={a.select?{color:'white'}:{color:'rgb(250, 80, 131)', fontSize:13}}>{a.content}</Text>
                                    </TouchableOpacity>
                                    
                                )
                            })
                        }
                        <TouchableOpacity onPress={this._clickOptionSubmitEvent.bind(this)}>
                            <View style={styles.btnSubmit}>
                                <Text style={{color:'white', fontSize:13}}>
                                    {"Ok"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            :
                <View style={{}}>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={this._clickBtnActionEvent.bind(this)}>
                            <View style={styles.btnSubmit}>
                                <Text style={{color:'white', fontSize:13}}>
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
    _renderBottomBtns(){
        return (
            <View style={styles.btns}>
                {
                    this.state.showAction? this._renderBtnActions() : null
                }
                <TouchableOpacity onPress={()=>{this.setState({showHelpActions:!this.state.showHelpActions})}}>
                    <Image
                      style={styles.help}
                      source={require('../images/help.png')}
                      resizeMode={'contain'}
                    />
                </TouchableOpacity>
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
                <TouchableOpacity onPress={this._clickMessageLink.bind(this, item.link)}>
                    <View style={styles.message}>
                        <Image
                          style={styles.avatar}
                          source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
                </TouchableOpacity>
            :
                item.img
                ?   
                    <TouchableOpacity onPress={this._clickMessageImg.bind(this, item.img)}>
                        <View style={styles.message}>
                            <Image
                              style={styles.avatar}
                              source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                            />
                            <View style={styles.msgView}>
                                <Image
                                  style={{width:(widthMsg-45-45)*0.5, height:Utils.getImgWidthHeight(item.img, (widthMsg-45-45)*0.5)}}
                                  source={{uri: item.img}}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                :
                    <View style={[styles.message, ]} >
                        <Image
                          style={styles.avatar}
                          source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
                      source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
                              source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
                              source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
                              source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
                              source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
        const {state, setParams, goBack, navigate} = this.props.navigation;
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
                          source={{uri: state.params.userinfo?state.params.userinfo.avatar.replace("http://", "https://"):'https://static1.bcjiaoyu.com/binshu.jpg'}}
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
    _renderHeader = ()=>{
        return  <TouchableOpacity onPress={this._clickLoadMore.bind(this)}>
                    <Text style={styles.headerLoadMore}>{
                        this.state.headerLoadTag==LoadMore?"点击加载更多":this.state.headerLoadTag==LoadNoMore?"已经到头了":"加载中..."}
                    </Text>
                </TouchableOpacity>
    }
    _renderFooter = ()=>{
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
    _keyExtractor = (item, index) => index;
    _renderTableView(){
        return (
            <View style={{flex:1}}>
                <View style={{width:width, maxHeight:height-headerH-60}}>
                    <FlatList 
                        ref={(flatlist)=>this._flatList=flatlist}
                        style={{maxHeight:height-headerH-60-30}}
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                        ListHeaderComponent={this.state.showHeaderComponent?this._renderHeader:null}
                        // ListFooterComponent={this._renderFooter}
                        extraData={this.state.loadingChat}
                        keyExtractor={this._keyExtractor}
                        onLayout={ (e) => {
                           const height = e.nativeEvent.layout.height
                           // console.log(e.nativeEvent.layout);
                        }}
                        // getItemLayout={(data, index) => (
                        //     { length: this.state.itemHeight, offset: (this.state.itemHeight + 2) * index, index }
                        // )}
                        onContentSizeChange={ (contentWidth, contentHeight) => {
                            console.log(contentHeight);
                            this.setState({
                                contentHeight:contentHeight
                            })

                            if (this.state.scrollTop == true) {
                                this._flatList.scrollToOffset({animated: true, offset: 0});
                                // this._flatList.scrollToIndex({viewPosition: 0, index: 0}); 
                                console.log("-----scrollTop");
                            }else{
                                if (contentHeight > height-headerH-90) {
                                    // this._flatList.scrollToIndex({viewPosition: 1, index: this.state.number-1});
                                    this._flatList.scrollToOffset({animated: true, offset: contentHeight-(height-headerH-60-30)});
                                    console.log("-----scrollEnd");
                                    // this._flatList.scrollToEnd();  //与getItemLayout配合使用
                                }
                                
                            } 
                        }}
                    />
                    {
                        this.state.loadingChat?this._renderLoadingChat():null
                    }
                </View>
                
                {/*
                    this.state.showAction? this._renderBtnActions() : null
                */}
                {
                    this.state.showZuanAni? this._renderZuanView() : null
                }
                {
                    this.state.showGradeAni? this._renderGradeView() : null
                }
                {
                    this.state.showGrowAni? this._renderGrowView() : null
                }
                {this._renderBottomBtns()}
                {
                    this.state.showHelpActions? this._renderHelpActions() : null
                }
                {
                    this.state.showBigImgView? this._renderScaleBigImage() : null
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
const headerH = Utils.headerHeight;

// 每条消息的宽度
const marginHorMsg = 5;
const widthMsg = width - 10;
const styles = StyleSheet.create({
    // -------------------------------------------------导航栏
    headerStyle:{
        backgroundColor:'rgb(250, 80, 131)'
    },
    // ----------导航栏左部分
    headerLeftView:{
        flexDirection:'row'
    },
    headerLeftAvatar:{
        marginHorizontal:5, 
        width:25, 
        height:25, 
        borderRadius:12.5
    },
    headerLeftInfoView:{
        flexDirection:'column', 
        justifyContent:'center', 
        width:width-200
    },
    headerLeftGradeText:{
        color:'white', 
        fontSize:11, 
        marginRight:5
    },
    headerLeftExperText:{
        color:'white',
        fontSize:11
    },
    headerLeftProgressView:{
        backgroundColor: 'white', 
        height: 3, 
        position: 'relative'
    },
    headerLeftProgressImg:{
        position: 'absolute', 
        left: 0, 
        top: 0, 
        height:3
    },
    // -----------导航栏右部分
    headerRightView:{
        flexDirection:'row', 
        justifyContent:'center', 
        alignItems:'center', 
        marginRight:5
    },
    headerRightImg:{
        height:20
    },
    headerRightText:{
        color:'white', 
        fontSize:11
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
        backgroundColor:'rgb(229, 230, 231)'
    },
    item:{
        padding:10,
        fontSize:18,
        height:44,
    },
    // ----------------------------------------------FlatList 的头部
    headerLoadMore:{
        height:30, 
        lineHeight:30, 
        color:'gray', 
        textAlign:'center'
    },
    // ----------------------------------------------message(机器回复)
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
    // --------------------------------------------人工回复
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
    // ------------------------------------------节分割线
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
    // ------------------------------------------底部按钮
    btns:{
        // height:60, 
        width:width,
        position:'absolute',
        bottom:0
    },
    help:{
        width:25, 
        height:25, 
        marginBottom:5,
        marginTop:5, 
        marginLeft:width-35
    },
    actions:{
        flexDirection:'row', 
        justifyContent:'flex-end', 
        marginHorizontal:8, 
        marginVertical:5
        // justifyContent:'center'
    },
    btnSubmit:{
        backgroundColor:'rgb(250, 80, 131)', 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        padding:10, 
        marginLeft:5
    },
    // ----------------选项按钮
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
    // ----------------帮助按钮组
    helpActionsView:{
        position: 'absolute', 
        bottom:42, 
        backgroundColor: 'white', 
        borderWidth:1,
        borderColor:'#d2d2d2',
        borderRadius: 5,
        right:5,
        paddingHorizontal:10
    },
    helpActionText:{
        width:60, 
        height: 30, 
        lineHeight: 30, 
        textAlign:'center'
    },
    helpActionArrow:{
        position:'absolute', 
        height:11, 
        width:16, 
        bottom:-11, 
        right:10
    },

    // ----------------------------------------消息等待
    loadingChat:{
        alignItems:'center', 
        justifyContent:'center',
        width:60, 
        height:30,
        backgroundColor:'white', 
        borderRadius:5, 
        marginHorizontal:10,
        marginTop:10,
    },

    // ----------------------------------------钻石动画
    zuanShadowView:{
        width:width, 
        height:height, 
        backgroundColor:'rgba(0,0,0,0.6)', 
        position:'absolute', 
        alignItems:'center', 
        justifyContent:'center'
    },
    zuanView:{
        width:200, 
        height:200, 
        alignItems:'center', 
        justifyContent:'center'
    },
    zuanImg:{
        width:100,
        height:100
    },
    // ---------------------------------------升级动画
    gradeShadowView:{
        width:width, 
        height:height, 
        backgroundColor:'rgba(0,0,0,0.6)', 
        position:'absolute', 
        alignItems:'center', 
        justifyContent:'center'
    },
    gradeView:{
        width:200, 
        height:200, 
        alignItems:'center', 
        justifyContent:'center'
    },
    gradeImg:{
        width:200,
        height:200
    },
    // ---------------------------------------经验动画
    growShadowView:{
        width:width, 
        height:height, 
        position:'absolute', 
        alignItems:'center', 
        justifyContent:'center'
    },
    growText:{
        paddingHorizontal:15, 
        paddingVertical:8, 
        color:'gray', 
        backgroundColor:'transparent'
    },
    // ---------------------------------------图片放大
    imgShadowView:{
        width:width,
        height:height-headerH,
        position:'absolute',
        backgroundColor:'rgba(0,0,0,0.6)',
        top:0,
        left:0,
        alignItems:'center',
        justifyContent:'center'
        // overflow:'scroll'
    },
    imgView:{
        width:width,
        height:height-headerH,
        overflow:'scroll',
        backgroundColor:'red'
    }

});

export default MessagePage;
