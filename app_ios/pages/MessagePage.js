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
    DeviceEventEmitter,
    ScrollView,
    Modal
}from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer';
import Sound from 'react-native-sound';
import ImageLoad from 'react-native-image-placeholder';

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
            courseTotal:0,               //当前课程的总节数
            courseIndex:0,               //当前课程的进度

            chooseCourse:null,           //选择课程的 pk
            chooseCourseTotal:0,         //选择课程的总节数
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
            showFindHelpView:false,      //是否显示查找帮助组件
            loadStorageMsg:false,        //判断加载的是缓存数据还是新数据

            courseProgressArray:[],
            showQuitLogin:false,         //是否显示退出登录按钮

        };
        this.leftEnterValue = new Animated.Value(0)     //左侧进入动画
        this.growAniValue = new Animated.Value(0)       //经验动画
        this.bottomEnterValue = new Animated.Value(0)   //底部进入动画
    };
    // -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        var json = state.params.userinfo?state.params.userinfo:"";
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
        // Utils.setValue("token", null);
        this._fetchUserInfo();
        this._load(); 
    }
    componentDidMount() {
    
    }
    componentDidUpdate(prevProps, prevState) {
        /*
        console.log("contentHeight:" + this.state.contentHeight);
        if (this.state.contentHeight > height-headerH-90) {
            setTimeout(()=>{
                this._flatList.scrollToEnd();
            }, 10)
        }
        */
    }

    componentWillUnmount() {
        // this.props.navigation.setParams({userinfo:""})
        this.timer && clearTimeout(this.timer);
    }
    _load(){
        var this_ = this
        var chatArray = [];
        Utils.getValue("chatData", (err, result)=>{
            var chatData = JSON.parse(result);
            if (chatData && chatData.length) {
                this_._loadStorageMessages();
                this.setState({
                    showQuitLogin:true
                })
            }else{
                this_.setState({
                    showHeaderComponent:false,
                    showQuitLogin:false
                })
                this_._loadDefaultMessages();
            }
        })
    }
    // -------------------------------------------默认数据&新数据相关
    _loadDefaultMessages(){
        // 有动画标志
        this.setState({
            loadStorageMsg:false
        })

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
        // 有动画标志
        this.setState({
            loadStorageMsg:false
        })

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
        // 有动画标志
        this.setState({
            loadStorageMsg:false
        })

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
                    // this._leftAnimate();

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
                            // this._bottomAnimate();
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
    // -------------------------------------------缓存数据相关
    // 方法1
    _loadStorageMessages1(){
        Utils.getStorageData((chatData, data, index, optionData, optionIndex, currentCourse, currentCourseIndex, currentCourseTotal)=>{
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
                courseIndex:currentCourseIndex,
                courseTotal:currentCourseTotal
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
                            // this._bottomAnimate();
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
        // 无动画标志
        this.setState({
            loadStorageMsg:true
        })

        var this_ = this
        Utils.getStorageData((chatData, data, index, optionData, optionIndex, currentCourse, currentCourseIndex, currentCourseTotal)=>{
            // console.log(chatData);
            // console.log(data);
            // console.log(index);
            // console.log(optionData);
            // console.log(optionIndex);
            
            this_.setState({
                chatData:chatData,
                data:data,
                index:index,
                optionData:optionData,
                optionIndex:optionIndex,
                loading:true,
                loadingChat:false,
                currentItem:chatData[chatData.length - 1],
                course:currentCourse,
                courseIndex:currentCourseIndex,
                courseTotal:currentCourseTotal
            }, ()=>{
                if (currentCourse) {
                    // 先更改数据源，后加载缓存数据
                    this_.setState({
                        loading:false
                    }, ()=>{
                        this_._fetchCourseInfoForInit(currentCourse, "way2");
                    })
                }else{
                    // 加载存储数据中所有的数据（最新10个数据）
                    var array = [];
                    for (var i = this_.state.chatData.length - 1; i > this_.state.chatData.length-1-this_.state.count; i--) {
                        if(this_.state.chatData[i]){
                            array.push(this_.state.chatData[i]);
                        }
                    }
                    array = array.reverse();
                    this_._loadStorageMessage(array, 0, array.length, false);        
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

        if (this.state.currentItem.action) {
            // this._bottomAnimate();
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
    // -------------------------------------------数据存储
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
    // -------------------------------------------动画事件
    _loadAudio(flag){
        var url = flag=="zuan"?"https://static1.bcjiaoyu.com/Diamond%20Drop.wav":"https://static1.bcjiaoyu.com/level_up.mp3";
        // url = "https://static1.bcjiaoyu.com/level_up.mp3"
        const callback = (error, sound) => {
            if (error) {
              console.log(error)
              return;
            }
            // Run optional pre-play callback
            sound.play(() => {
                console.log('play successful!');
              sound.release();
            });
          };
        const sound = new Sound(url, error => callback(error, sound));
    }
    _loadGrowAni(num){
        this._growAni();
        this.setState({
            showGrowAni:true,
            growNum:num
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
            // this._loadAudio("zuan");   //打开钻石音频
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
            // this._loadAudio("grade");   //打开升级音频
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
    _bottomAnimate(){
        this.bottomEnterValue.setValue(0);
        Animated.timing(
            this.bottomEnterValue,
            {
                toValue:1,
                duration:1000,
                easing:Easing.linear
            }
        ).start(()=>{})
    }
    // ------------------------------------------网络请求
    _fetchCourseInfoWithPk(course){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                console.log(1);
                var type = "get",
                    url = Http.courseInfo(course),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (!response) {
                        //请求失败
                    };
                    // console.log(response);
                    try{
                        var array = JSON.parse(response.json);
                    }
                    catch(err){
                        Utils.showMessage("数据格式有问题");
                        return
                    }
                    // this_._loadCourseProgress(response.total_lesson, response.learn_extent.last_lesson);  //加载课程进度信息

                    this_.setState({
                        courseIndex:response.learn_extent.last_lesson    //记录进度
                    }, ()=>{
                        // 存储课程进度下标
                        Utils.setValue("currentCourseIndex", JSON.stringify(this.state.courseIndex));
                        var courseIndex = this_.state.courseIndex;  //进度
                        this_.setState({
                            totalData:array
                        }, ()=>{
                            this_._loadMessages(courseIndex+1)
                        })
                    })
                }, (err) => {
                    console.log(2);
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    _fetchCourseInfoForInit(course, way){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.courseInfo(course),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (!response) {
                        //请求失败
                    };
                    // console.log(response);
                    this_.setState({
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

                    this.setState({
                        courseTotal:response.total_lesson
                    })

                    // this_._loadCourseProgress(response.total_lesson, this.state.courseIndex);  //加载课程进度信息

                    var courseIndex = this_.state.courseIndex;
                    // 更改数据源
                    if(array[courseIndex+1]){
                        this_.setState({
                            data:array[courseIndex+1],
                            optionData:[],
                            optionIndex:0
                        }, ()=>{
                            this_._storeDataIndex();

                            if (way == "way1") {
                                // 方法1
                                this_.setState({
                                    dataSource:this_.state.chatData
                                }, ()=>{
                                    if (this_.state.currentItem.action) {
                                        // this._bottomAnimate();
                                        this_.setState({
                                            showAction:true
                                        })
                                    }else{
                                        this_._loadStorageLastItem();
                                    }
                                })
                            }else{
                                // 方法2
                                // 加载存储数据中所有的数据（最新10个数据）
                                var array = [];
                                for (var i = this_.state.chatData.length - 1; i > this_.state.chatData.length-1-this_.state.count; i--) {
                                    if(this_.state.chatData[i]){
                                        array.push(this_.state.chatData[i]);
                                    }
                                }
                                array = array.reverse();
                                this_._loadStorageMessage(array, 0, array.length);
                            }
                        })
                    }

                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    _fetchUserInfo(){
        var this_ = this
        Utils.isLogin((token)=>{
            if (token) {
                const {setParams} = this_.props.navigation;
                var type = "get",
                    url = Http.whoami,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (!response) {
                        //请求失败
                    };
                    // console.log(response);
                    // Util.updateInfo(json);
                    this_.setState({
                        userInfo:response
                    })
                    setParams({userinfo:response})

                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
        
    }
    _fetchAddReward(course, courseIndex, chapter, growNum, zuanNum){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                const {setParams, state} = this_.props.navigation;
                if (!chapter || chapter == "") {
                    //直接要下一条数据
                    this_._loadClickBtnAction();
                    return
                }
                course = String(course)
                courseIndex = String(courseIndex)
                chapter = String(chapter)

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
                    // this_._loadGrowAni(20);
                    // this_._loadAudio("zuan");   //打开钻石音频
                    // this_._loadZuanAni(GrowAniTime);
                    // this_._loadAudio("grade");   //打开钻石音频
                    // this_._loadGradeAni(GrowAniTime+ZuanAniTime);

                    
                    if (!response) {
                        //请求失败
                        this_._loadClickBtnAction();
                        return
                    };
                    console.log(response);
                    if (response.status == -4) {
                        // 重复领奖
                        this_._loadClickBtnAction();
                        return
                    }
                    var json = state.params.userinfo;
                    // 更新个人信息
                    this_.setState({
                        userInfo:response
                    })
                    setParams({userinfo:response})
                    
                    var growAni = false,
                        zuanAni = false,
                        gradeAni = false;
                    if (response.experience > json.experience) {
                        // 打开经验动画
                        growAni = true
                        this_._loadGrowAni(response.experience-json.experience);
                    }
                    if (response.diamond > json.diamond) {
                        // 打开钻石动画
                        zuanAni = true
                        if (growAni){
                            this_._loadZuanAni(GrowAniTime);
                        }else{
                            this_._loadZuanAni(0);
                        } 
                    }
                    if(json.grade.current_name != response.grade.current_name){
                        // 打开升级动画
                        gradeAni = true
                        if (growAni) {
                            if (zuanAni) {
                                this_._loadGradeAni(GrowAniTime+ZuanAniTime);
                            }else{
                                this_._loadGradeAni(GrowAniTime);
                            }
                        }else{
                            if (zuanAni) {
                                this_._loadGradeAni(ZuanAniTime);
                            }else{
                                this_._loadGradeAni(0);
                            }
                        } 
                    }
                    
                    // // 更新个人信息
                    // this_.setState({
                    //     userInfo:response
                    // })
                    // setParams({userinfo:response})
            
                    this_._loadClickBtnAction();
                    
                    
                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                    this_._loadClickBtnAction();
                });
            }
        })
        
    }
    _fetchUpdateExtent(course, courseIndex){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                var type = "post",
                    url = Http.updateExtent,
                    token = token,
                    data = {
                        course:course,
                        lesson:courseIndex
                    };
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (!response) {
                        //请求失败
                    };
                    // this_._loadUpdateCourseProgress(courseIndex);   //更新课程进度
                    // console.log(response);
                    this_._loadClickBtnAction();

                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                });
            } 
        }) 
    }
    
    // ------------------------------------------点击事件
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
        
        var this_ = this;
        Utils.isLogin((token)=>{
            if (this_.state.actionTag == actionChooseCourseTag && !token){
                // 点击选择课程去登陆的时候
            }else if(this_.state.actionTag == actionChooseCourseTag && !this_.state.chooseCourse){
                //没有选课程
                // this._bottomAnimate();
                this_.setState({
                    showAction:true
                })
            }else{
                // 去掉点选择课程登录的时候，不打印选择课程
                this_._loadAnswer(actionText)    //界面显示人工回复
            }
        })

        //判断按钮的行为
        if (this.state.actionTag == actionChooseCourseTag) {
            // TODO:前后课程是否一致, 一致不改，不一致改
            // TODO:判断是否登录，如果未登录，跳到登录页，否则，跳到选择课程页
            // 选择课程
            
            this._loadChooseCourse(false);
            
            /*
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

                }
            })
            */
            
        }else if (this.state.actionTag == actionBeginStudyTag || this.state.actionTag == actionRestartStudyTag) {
            // 开始学习
            this.setState({
                course:this.state.chooseCourse,
                courseIndex:this.state.chooseCourseIndex,
                courseTotal:this.state.chooseCourseTotal,
                actionTag:actionCommonTag,
                loadingChat:true
            }, ()=>{
                Utils.setValue("currentCourse", JSON.stringify(this.state.course))
                Utils.setValue("currentCourseIndex", JSON.stringify(this.state.courseIndex))
                Utils.setValue("currentCourseTotal", JSON.stringify(this.state.courseTotal))
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
    _loadChooseCourse(help){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                // 已登录
                // console.log("go to chooseCourse");
                this_.props.navigation.navigate('CourseList', {callback:(course, courseIndex, restart, courseTotal)=>{
                    console.log("callback");
                    // this.props.navigation.setParams({userinfo:""})
                    this_.setState({
                        chooseCourse:course,
                        chooseCourseIndex:courseIndex,
                        chooseCourseTotal:courseTotal
                    }, ()=>{
                        // this._bottomAnimate();
                        if (this_.state.chooseCourse) {
                            if (restart == true) {
                                // 按钮由选择课程-->重新学习
                                this_.setState({
                                    actionTag:actionRestartStudyTag,
                                    showAction:true
                                })
                            }else if (this_.state.chooseCourse != this_.state.course) {
                                // 按钮由选择课程-->开始学习
                                this_.setState({
                                    actionTag:actionBeginStudyTag,
                                    showAction:true
                                })
                            }else if(this_.state.chooseCourse == this_.state.course){
                                // 课程相等，继续上次学习, 重新学习/开始学习-->变为原来的
                                if (this_.state.actionTag == actionBeginStudyTag || this_.state.actionTag == actionRestartStudyTag) {
                                    if (this_.state.currentItem.record == true) {
                                        this.setState({
                                            actionTag:actionRecordTag,
                                            showAction:true
                                        })
                                    }else{
                                        this_.setState({
                                            actionTag:actionCommonTag,
                                            showAction:true
                                        })
                                    }
                                }else{
                                    this_.setState({
                                        showAction:true
                                    })
                                }
                            }else{
                                this_.setState({
                                    showAction:true
                                })
                            }
                        }else{
                            this_.setState({
                                showAction:true
                            })                                
                        }
                    })
                }})
            }else{
                // console.log("go to login .");
                // 未登录
                this_.props.navigation.navigate('Login', {callback:()=>{
                    if (help == true) {
                        //点了帮助选择课程
                        this_._fetchUserInfo();
                        this.setState({
                            showQuitLogin:true
                        })
                    }else{
                        // this._bottomAnimate();
                        this_.setState({
                            actionTag:actionChooseCourseTag,
                            showAction:true,
                            showQuitLogin:true
                        })
                        this_._fetchUserInfo();
                    }

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
        
        // var item = this.state.data[this.state.index];
        var item = this.state.currentItem
        for (var i = 0; i < item.action.length; i++) {
            item.action[i]["select"] = false
        }

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
        // console.log(this.state.options)

        this.setState({
            currentItem:item
        }) 
    }
    // 选择课程点击
    _clickChooseCourse = ()=>{
        this.setState({showHelpActions:false})
        this._loadChooseCourse(true);
    }
    // 寻找帮助点击
    _clickFindHelp = ()=>{
        this.setState({
            showHelpActions:false,
            showFindHelpView:true
        })
    }
    // 寻找帮助 shadowview点击
    _clickFindHelpShadow = ()=>{
        this.setState({
            showFindHelpView:false
        })
    }
    // 学习论坛点击
    _clickStudyLuntan = ()=>{
        this.setState({showHelpActions:false})
        this._loadLuntan();
    }
    _loadLuntan(){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                // 已登录
                // console.log("go to luntan");
                this_.props.navigation.navigate('Forum', {callback:()=>{
                    this_._fetchUserInfo();
                }})
            }else{
                // console.log("go to login .");
                // 未登录
                this_.props.navigation.navigate('Login', {callback:()=>{
                    
                    this_._fetchUserInfo();
                    this.setState({
                        showQuitLogin:true
                    })
                }})
            }
        })
    }
    // 退出登录点击
    _clickQuitLogin = ()=>{
        const {setParams} = this.props.navigation;
        setParams({userinfo:""})
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
            courseTotal:0,               //当前课程的总节数
            courseIndex:0,               //当前课程的进度

            chooseCourse:null,           //选择课程的 pk
            chooseCourseTotal:0,         //选择课程的总节数
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
            showFindHelpView:false,      //是否显示查找帮助组件

            courseProgressArray:[],
            showQuitLogin:false,         //是否显示退出登录按钮
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
        var language = link.split("/")[1]?link.split("/")[1]:"python";
        
        link == "www.code.com"
        ?
            // 编辑器
            this.props.navigation.navigate("CodeEditWebView")
        :
            link.indexOf("www.compile.com") > -1
            ?
                //编译器
                this.props.navigation.navigate("CodeCompileWebView", {"language":language})
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
        var subMsg = "(共"+this.state.courseTotal + "节)"
        var dic = {
            "message":msg,
            "subMessage":subMsg
        }
        dic["question"] = false;
        dic["line"] = true;  
        array.push(dic)
        this.setState({
            number:this.state.number+1,
            dataSource:array,
        }, ()=>{
            // this._leftAnimate();

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
            // this._leftAnimate();

            this._storeChatData(dic, "answer");
        })

        // TODO:存储数据
    }
    // 课程进度初始化
    _loadCourseProgress(total, studyN){
        // 1.默认数据加载，2.选择课程
        var unstudyN = total-studyN;
        var array = [];
        for (var i = 0; i < studyN; i++) {
            var dic = {"status":true}   //已经学过
            array.push(dic) 
        }
        for (var i = 0; i < unstudyN; i++) {
            var dic = {"status":false}  //未学过的
            array.push(dic)       
        }
        this.setState({
            courseProgressArray:array
        })
    }
    // 课程进度更新
    _loadUpdateCourseProgress(courseIndex){
        this.state.courseProgressArray[courseIndex-1]["status"] = true
    }

    // ----------------------------------------------------------UI 布局
    _renderItemCourseProgress(item, index){
        var url = item.status?require('../images/cp1.png'):require("../images/cp2.png")
        return (
            <View style={styles.cpPointView}>
                <Image
                  style={styles.cpPointImage}
                  source={url}
                  resizeMode={'contain'}
                />
            </View>
        )
    }
    _renderItemCP = ({item, index}) => (
        this._renderItemCourseProgress(item, index)
    )
    _renderCourseProgress(){
        var total = this.state.courseProgressArray.length
        var studyN = this.state.courseIndex
        var unstudyHeight = studyN==0 ? (total-1)*(cpHeight) : ((total-1)-(studyN-1))*cpHeight
        var unstudyTop = studyN==0 ? cpHeight/2: cpHeight/2+(studyN-1)*cpHeight

        return (
            <View style={styles.courseProgressView}>
                <Image
                  style={[styles.cpLine, {height:(studyN-1)*cpHeight, top:cpHeight/2}]}
                  source={require("../images/pink-line.png")}
                />
                <Image
                  style={[styles.cpLine, {height:unstudyHeight, top:unstudyTop}]}
                  source={require('../images/gray-line.png')}
                />
                
                <FlatList
                    data={this.state.courseProgressArray}
                    renderItem={this._renderItemCP}
                    keyExtractor={this._keyExtractor}
                />
                 
            </View>
        )
    }
    // 寻找帮助
    _renderFindHelp(){
        return (
            <TouchableOpacity onPress={this._clickFindHelpShadow} style={styles.findHelpShadowView}>
                <View style={{}}>
                    <Text style={styles.findHelpText}>如需帮助，请使用学习论坛进行发帖，会有专人帮您解答。</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // 图片放大
    _renderScaleBigImage(){
        var  images = []
        images.push({url:this.state.bigImgUrl})
        return (
            <Modal visible={this.state.showBigImgView} transparent={true} onRequestClose={this._clickBigImg}>
                <ImageViewer imageUrls={images} onClick={this._clickBigImg}/>
            </Modal>
        )
    }
    // 钻石
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
    // 等级
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
    // 经验
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
    // 帮助
    _renderHelpActions(){
        return (
                <View style={styles.helpParentView}>
                    <View style={styles.helpActionsView}>
                        <TouchableOpacity style={[{borderBottomColor:'#d2d2d2', borderBottomWidth:1}, styles.helpActionTextParent]} onPress={this._clickChooseCourse}>
                            <Text style={styles.helpActionText}>{"选择课程"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[{borderBottomColor:'#d2d2d2', borderBottomWidth:1}, styles.helpActionTextParent]} onPress={this._clickStudyLuntan}>
                            <Text style={styles.helpActionText}>{"学习论坛"}</Text>
                        </TouchableOpacity>
                        {
                            this.state.showQuitLogin?
                            <TouchableOpacity style={[{borderBottomColor:'#d2d2d2', borderBottomWidth:1}, styles.helpActionTextParent]} onPress={this._clickQuitLogin}>
                                <Text style={styles.helpActionText}>{"退出登录"}</Text>
                            </TouchableOpacity>
                            : null
                        }
            
                        <TouchableOpacity onPress={this._clickFindHelp} style={styles.helpActionTextParent}>
                            <Text style={styles.helpActionText}>{"寻找帮助"}</Text>
                        </TouchableOpacity>

                    </View>
                    <Image
                      style={styles.helpActionArrow}
                      source={require('../images/arrow-w.png')}
                      resizeMode={"contain"}
                    />
                </View>
                
        )
    }
    // ----------------------------------------action 按钮数据加载
    _renderBtnAction(text){
        return (
            <View style={{}}>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={this._clickBtnActionEvent.bind(this)}>
                        <View style={styles.btnSubmit}>
                            <Text style={{color:'white', fontSize:13}}>
                            {text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    _renderBtnActionOption(item){
        return (
            <View style={{}}>
                <View style={styles.actions}>
                    {
                        item.action.map((a, i)=>{
                            return (
                                <TouchableOpacity style={a.select?styles.btnOptionSelect:styles.btnOption} key={i} onPress={this._clickOptionEvent.bind(this, i, a.content)}>
                                    <Text style={a.select?{color:whiteColor}:{color:pinkColor, fontSize:13}}>{a.content}</Text>
                                </TouchableOpacity>
                                
                            )
                        })
                    }
                    <TouchableOpacity onPress={this._clickOptionSubmitEvent.bind(this)}>
                        <View style={styles.btnSubmit}>
                            <Text style={{color:whiteColor, fontSize:13}}>
                                {"Ok"}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    
                </View>
            </View>
        )
    }
    _renderBtnActions(){
        var item = this.state.data[this.state.index];
        item = this.state.currentItem;
        return (
            this.state.actionTag == actionBeginStudyTag
            ?
                this._renderBtnAction("开始学习")
            :
                this.state.actionTag == actionRestartStudyTag
                ?
                    this._renderBtnAction("重新学习")
                :
                    item.exercises
                    ?
                        this._renderBtnActionOption(item)
                    : 
                        this._renderBtnAction(item.action)
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
    
    // ----------------------------------------无动画消息
    // 文本信息
    _renderItemTextMessage(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        return (
            <View style={[styles.message, {width:widthMsg1}]}>
                <Image
                  style={styles.avatar}
                  source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                />
                <View style={[styles.msgView, {width:widthMsg2}]}>
                    <View style={styles.messageView}>
                        <Text style={styles.messageText}>
                            {item.message}
                        </Text>
                    </View>
                </View>
            </View>
        ) 
    }
    // 图片信息
    _renderItemImgMessage(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        var imgH = Utils.getImgWidthHeight(item.img, widthMsg2*0.5)
        var imgDePlaSty;
        if (widthMsg2*0.5>imgH) {
            imgDePlaSty = {height:imgH-5}
        }else{
            imgDePlaSty = {width:widthMsg2*0.5-10}
        }
        return (
            <TouchableOpacity onPress={this._clickMessageImg.bind(this, item.img)}>
                <View style={[styles.message, {width:widthMsg1}]}>
                    <Image
                      style={styles.avatar}
                      source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                    />
                    <View style={[styles.msgView, {width:widthMsg2}]}>
                        {/*
                        <Image
                          style={{width:(widthMsg2)*0.5, height:Utils.getImgWidthHeight(item.img, (widthMsg2)*0.5)}}
                          source={{uri: item.img}}
                        />
                        */}
                        <ImageLoad
                            style={{width:(widthMsg2)*0.5, height:imgH}}
                            source={{uri: item.img}}
                            resizeMode={'contain'}
                            customImagePlaceholderDefaultStyle={imgDePlaSty}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 链接信息
    _renderItemLinkMessage(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        var text = "点击打开新网页"
        if (item.link == "www.code.com") {
            text = "点击打开编辑器"
        }else if (item.link.indexOf("www.compile.com") > -1) {
            text = "点击打开编译器"
        }
        return (
            <TouchableOpacity onPress={this._clickMessageLink.bind(this, item.link)}>
                <View style={[styles.message, {width:widthMsg1}]}>
                    <Image
                      style={styles.avatar}
                      source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                    />
                    <View style={[styles.msgView, {width:widthMsg2}]}>  
                        <View style={[styles.messageView, {flex:1}]}>
                            <Text style={styles.messageText}>
                              {item.message}
                            </Text>
                            <Text style={{color:'rgb(84, 180, 225)'}}>
                              {text}
                            </Text>
                        </View> 
                        <Image
                          style={{width:15, height:15, marginHorizontal:10}}
                          source={require('../images/arrow.png')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    // 分割线信息 
    _renderItemLineMessage(item){
        return (
            <View style={styles.sepLine}>
                <Image
                  style={styles.line}
                  source={require('../images/line.png')}
                />
                <View style={{paddingHorizontal:10, backgroundColor:'rgb(229, 230, 231)'}}>
                    <Text style={{color: 'rgb(166, 166, 166)'}}>
                        {item.message}
                        {
                            item.subMessage
                            ?
                            <Text style={{color:'rgb(166, 166, 166)', fontSize:12}}>
                              {item.subMessage}
                            </Text>
                            : null
                        }
                    </Text>
                </View>
            </View>
        )
    }
    // 用户回复信息
    _renderItemAnswerMessage(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        const {state, setParams, goBack, navigate} = this.props.navigation;
        return (
            <View style={[styles.answer, {width:widthMsg1}]}>
                <View style={[styles.answerMsgView, {width:widthMsg2}]}>
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
        )
        
    }
    // 消息加载中
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
    // 无动画的消息
    _renderItemMessage(item, index){
        
        return (
            item.line == true
            ?
                this._renderItemLineMessage(item)
            :
                item.question == false
                ?
                    this._renderItemAnswerMessage(item)
                :
                    item.link
                    ?
                        this._renderItemLinkMessage(item)
                    :
                        item.img
                        ?
                            this._renderItemImgMessage(item)
                        :
                            this._renderItemTextMessage(item)

        )
    }


    // ---------------------------------------有动画消息
    // 文本信息
    _renderItemTextMessageAni(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        const translateX = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[-2000, 0]
        })
        return (
            <Animated.View style={[styles.message, {transform:[{translateX:translateX}], width:widthMsg1}]}>
                <Image
                  style={styles.avatar}
                  source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                />
                <View style={[styles.msgView, {width:widthMsg2}]}>
                    <View style={styles.messageView}>
                        <Text style={[styles.messageText, {}]}>
                            {item.message}
                        </Text>
                    </View>
                </View>
            </Animated.View>
        )
    }
    // 图片信息
    _renderItemImgMessageAni(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        const translateX = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[-2000, 0]
        })
        var imgH = Utils.getImgWidthHeight(item.img, widthMsg2*0.5)
        var imgDePlaSty;
        if (widthMsg2*0.5>imgH) {
            imgDePlaSty = {height:imgH-5}
        }else{
            imgDePlaSty = {width:widthMsg2*0.5-10}
        }
        return (
            <TouchableOpacity onPress={this._clickMessageImg.bind(this, item.img)}>
                <Animated.View style={[styles.message, {transform:[{translateX:translateX}], width:widthMsg1}]}>
                    <Image
                      style={styles.avatar}
                      source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                    />
                    <View style={[styles.msgView, {width:widthMsg2}]}>
                        {/*
                        <Image
                          style={{width:(widthMsg2)*0.5, height:Utils.getImgWidthHeight(item.img, (widthMsg2)*0.5)}}
                          source={{uri: item.img}}
                        />
                        */}
                        <ImageLoad
                            style={{width:(widthMsg2)*0.5, height:imgH}}
                            source={{uri: item.img}}
                            resizeMode={'contain'}
                            customImagePlaceholderDefaultStyle={imgDePlaSty}
                        />
                    </View>
                </Animated.View>
            </TouchableOpacity>
        )
    }
    // 链接信息
    _renderItemLinkMessageAni(item){
        var widthMsg1 = this.state.courseProgressArray.length?widthMsg:widthMsg+CourseProgressWidth
        var widthMsg2 = this.state.courseProgressArray.length?widthMsg-45-45:widthMsg-45-45+CourseProgressWidth
        var text = "点击打开新网页"
        if (item.link == "www.code.com") {
            text = "点击打开编辑器"
        }else if (item.link.indexOf("www.compile.com") > -1) {
            text = "点击打开编译器"
        }

        const translateX = this.leftEnterValue.interpolate({
            inputRange:[0, 1],
            outputRange:[-2000, 0]
        })

        return (
            <TouchableOpacity onPress={this._clickMessageLink.bind(this, item.link)}>
                <Animated.View style={[styles.message, {transform:[{translateX:translateX}], width:widthMsg1}]}>
                    <Image
                      style={styles.avatar}
                      source={{uri: 'https://static1.bcjiaoyu.com/binshu.jpg'}}
                    />
                    <View style={[styles.msgView, {width:widthMsg2}]}>  
                        <View style={[styles.messageView, {flex:1}]}>
                            <Text style={styles.messageText}>
                              {item.message}
                            </Text>
                            <Text style={{color:'rgb(84, 180, 225)'}}>
                              {text}
                            </Text>
                        </View> 
                        <Image
                          style={{width:15, height:15, marginHorizontal:10}}
                          source={require('../images/arrow.png')}
                        />
                    </View>
                </Animated.View>
            </TouchableOpacity>
        )
    }
    // 消息加载中
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
    // 有动画的消息
    _renderItemMessageAni(item, index){
        
        return (
            item.line == true
            ?
                this._renderItemLineMessage(item)
            :
                item.question == false
                ?
                    this._renderItemAnswerMessage(item)
                :
                    item.link
                    ?
                        index+1 == this.state.number?this._renderItemLinkMessageAni(item):this._renderItemLinkMessage(item)
                    :
                        item.img
                        ?
                            index + 1 == this.state.number?this._renderItemImgMessageAni(item):this._renderItemImgMessage(item)
                        :
                            index + 1 == this.state.number?this._renderItemTextMessageAni(item):this._renderItemTextMessage(item)

        )
    }

    // ---------------------------------------消息列表
    _renderItem = ({item, index}) => (
        // this.state.loadStorageMsg?this._renderItemMessage(item, index):this._renderItemMessageAni(item, index)
        this._renderItemMessage(item, index)
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
        var MessageWidth1 = this.state.courseProgressArray.length?MessageWidth:MessageWidth+CourseProgressWidth
        return (
            <View style={{flex:1}}>
                <View style={{flexDirection:'row'}}>
                    {/*******课程进度********/}
                    {/*this.state.courseProgressArray.length? this._renderCourseProgress():null*/}
                    
                    {/******会话消息******/}
                    <View style={{width:MessageWidth1, maxHeight:height-headerH-80-10}}>
                        <FlatList 
                            ref={(flatlist)=>this._flatList=flatlist}
                            style={{maxHeight:height-headerH-80-10}}
                            data={this.state.dataSource}
                            renderItem={this._renderItem}
                            ListHeaderComponent={this.state.showHeaderComponent?this._renderHeader:null}
                            // ListFooterComponent={this.state.loadingChat?this._renderFooter:null}
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
                                // console.log(contentHeight);
                                this.setState({
                                    contentHeight:contentHeight
                                })

                                if (this.state.scrollTop == true) {
                                    this._flatList.scrollToOffset({animated: true, offset: 0});
                                    // this._flatList.scrollToIndex({viewPosition: 0, index: 0}); 
                                    // console.log("-----scrollTop");
                                }else{
                                    if (contentHeight > height-headerH-80-10) {
                                        // this._flatList.scrollToIndex({viewPosition: 1, index: this.state.number-1});
                                        this._flatList.scrollToOffset({animated: true, offset: contentHeight-(height-headerH-80-10)});
                                        // console.log("-----scrollEnd");
                                        // this._flatList.scrollToEnd();  //与getItemLayout配合使用
                                    } 
                                } 
                            }}
                        />
                        {
                            this.state.loadingChat?this._renderLoadingChat():null
                        }
                    </View>
                </View>
                {/******底部按钮*****/}
                {this._renderBottomBtns()}
                
                {
                    this.state.showZuanAni? this._renderZuanView() : null
                }
                {
                    this.state.showGradeAni? this._renderGradeView() : null
                }
                {
                    this.state.showGrowAni? this._renderGrowView() : null
                }
                {
                    this.state.showHelpActions? this._renderHelpActions() : null
                }
                {
                    this.state.showBigImgView? this._renderScaleBigImage() : null
                }
                {
                    this.state.showFindHelpView? this._renderFindHelp() : null
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
const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高
const headerH = Utils.headerHeight;                 //导航栏的高度

const CourseProgressMarginVer = 10;                 //左侧课程进度上下边距
const CourseProgressHeight = height-CourseProgressMarginVer*2;                //左侧课程进度的总高, 
const CourseProgressWidth = 30;                     //左侧课程进度总宽
const cpHeight = 30;
const cpMarginVer = 0;

const MessageWidth = width - CourseProgressWidth;   //右侧消息列表的总宽

// 每条消息的宽度
const marginHorMsg = 5;                             //右侧消息列表左右间距
const widthMsg = MessageWidth - marginHorMsg*2;     //右侧消息的宽

const pinkColor = Utils.btnBgColor;
const whiteColor = Utils.btnBgColorS;
const styles = StyleSheet.create({
    // -------------------------------------------------导航栏
    headerStyle:{
        backgroundColor:pinkColor
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
        backgroundColor:'white',
        paddingLeft:10
    },
    messageText:{
        fontSize:15, 
        lineHeight:22.5, 
        color:'rgb(58, 59, 60)',
        textAlign:'justify',
        // backgroundColor:'blue',
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
    btns:{//底部按钮高度80
        // height:60, 
        width:width,
        position:'absolute',
        bottom:0
    },
    help:{//帮助按钮总高40
        width:30, 
        height:30, 
        marginBottom:5,
        marginTop:5, 
        marginLeft:width-40
    },
    actions:{//按钮高度40
        flexDirection:'row', 
        justifyContent:'flex-end', 
        marginHorizontal:8, 
        marginVertical:5
        // justifyContent:'center'
    },
    btnSubmit:{
        backgroundColor:pinkColor, 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        // padding:10, 
        marginLeft:5,
        height:30,
        paddingHorizontal:10,
        alignItems:'center',
        justifyContent:'center'
    },
    // ----------------选项按钮
    btnOption:{
        backgroundColor:whiteColor, 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        // padding:10, 
        marginLeft:5,
        height:30,
        paddingHorizontal:10,
        alignItems:'center',
        justifyContent:'center'
    },
    btnOptionSelect:{
        backgroundColor:pinkColor, 
        borderRadius:5, 
        borderBottomRightRadius:0, 
        // padding:10, 
        marginLeft:5,
        height:30,
        paddingHorizontal:10,
        alignItems:'center',
        justifyContent:'center'
    },
    // ----------------帮助按钮组
    helpParentView:{
        position:'absolute',
        bottom:45,
        right:5
    },
    helpActionsView:{
        // position: 'absolute', 
        // bottom:42, 
        // right:5,
        backgroundColor: 'white', 
        borderWidth:1,
        borderColor:'#d2d2d2',
        borderRadius: 5,
        paddingHorizontal:10
    },
    helpActionTextParent:{
        alignItems:'center', 
        justifyContent:'center', 
        height:40
    },
    helpActionText:{
        width:80,
        // height: 30, 
        // lineHeight: 30, 
        textAlign:'center',
        // backgroundColor:'red'
    },
    helpActionArrow:{
        position:'absolute', 
        right:10,
        height:11, 
        width:16, 
        bottom:-10
        // backgroundColor:'red'
        // overflow:'visible'
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

        position:'absolute',
        bottom:-40
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
        // alignItems:'center',
        // justifyContent:'center'
        // overflow:'scroll'
    },
    imgView:{
        width:width,
        height:height-headerH,
        overflow:'scroll',
        backgroundColor:'red'
    },
    // --------------------------------------寻找帮助
    findHelpShadowView:{
        width:width, 
        height:height-headerH, 
        backgroundColor:'rgba(0,0,0,0.6)',
        position:'absolute', 
        alignItems:'center', 
        // justifyContent:'center'
    },
    findHelpText:{
        color: 'white',
        fontSize: 20,
        width: width*.8,
        marginTop:(height-headerH)*.3
    },
    // -------------------------------------课程进度
    courseProgressView:{
        width:CourseProgressWidth, 
        height:CourseProgressHeight, 
        position:'relative',
        marginVertical:CourseProgressMarginVer,
        overflow:'scroll'
    },
    cpLine:{
        width:2, 
        position:'absolute', 
        left:(CourseProgressWidth-2)/2
    },
    cpPointView:{
        height:cpHeight, 
        alignItems:'center', 
        justifyContent:'center'
    },
    cpPointImage:{
        width:15,
        height:15
    }

});

export default MessagePage;
