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
    AsyncStorage,
    DeviceEventEmitter,
    ScrollView,
    Modal,
    Clipboard,
    StatusBar
}from 'react-native'

import DeviceInfo from 'react-native-device-info';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';

class HomeScreen extends Component{
    constructor(props) {
        super(props);
        this.state = {
          showHelpActions:false,       //是否显示帮助组按钮
          showEditorsView:false,       //是否显示编辑器组
          showFindHelpView:false,      //是否显示查找帮助组件
        }
    };
    // -----导航栏自定制
    static navigationOptions = ({navigation}) => {
        const {state, setParams, goBack, navigate} = navigation;
        var json = state.params?state.params.userinfo:"";
        if (json && json != "") {
            var pw = 0;
            if (json.grade.current_all_experience != json.grade.next_all_experience) {
                pw = (parseInt(json.experience)-parseInt(json.grade.current_all_experience))/(parseInt(json.grade.next_all_experience)-parseInt(json.grade.current_all_experience))*(width-200)
            }else{
                pw = width-200
            }
        }

        return {
            headerStyle: styles.headerStyle,
            title:json?null:"程序媛",
            headerTintColor: "#fff",
            headerTitleStyle:{alignSelf:'auto',},
            headerLeft:json?(
                <View style={styles.headerLeftView}>
                    <Image
                      style={styles.headerLeftAvatar}
                      source={{uri: json.avatar.replace("http://", "https://")}}
                    />

                    <View style={styles.headerLeftInfoView}>
                        <View style={{flexDirection:'row', marginBottom:5, alignItems:'center'}}>
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

                    <View style={styles.headerLeftZuanView}>
                        <Image
                          style={styles.headerLeftZuanImg}
                          source={require('../images/zuan.png')}
                          resizeMode={'contain'}
                        />
                        <Text style={styles.headerLeftZuanText}>
                          x{json.diamond}
                        </Text>
                    </View>
                </View>
            ):null,
            headerRight:json?(
                <TouchableOpacity onPress={()=>{DeviceEventEmitter.emit('help',1 )}}>
                    <View style={styles.headerRightView}>
                        <Image
                          style={styles.headerRightImg}
                          source={require('../images/more.png')}
                          resizeMode={'contain'}
                        />
                    </View>
                </TouchableOpacity>  
            ):null
        }

    };
    componentWillMount() {
        //给当前页面设置默认参数
        this.props.navigation.setParams({
            userinfo: '',
        });
        this._fetchUserInfo();
    }
    componentDidMount() {
        //登录
        this.listenLogin = DeviceEventEmitter.addListener('listenLogin',() => {
            console.log("登录监听2");
            this._fetchUserInfo();
        })
        //退出登录
        this.listenlogout = DeviceEventEmitter.addListener('logout', () => {
            this._loadQuitLogin();
        })
        //导航右按钮点击
        this.eventEm = DeviceEventEmitter.addListener('help', (value)=>{
            this._clickHelp();
        })
    }
    componentWillUnmount() {
        // this.props.navigation.setParams({userinfo:""})
        this.timer && clearTimeout(this.timer);

        //移除监听
        this.listenLogin.remove();
        this.listenlogout.remove();
    }
    // ------------------------------------------网络请求
    _fetchUserInfo(){
        var this_ = this;
        Utils.isLogin((token)=>{
            if (token) {
                // const {setParams, state} = this_.props.navigation;
                var type = "get",
                    url = Http.whoami,
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    if (response == 401) {
                        //去登录
                        console.log(401);
                        this._goLogin();
                        return;
                    }
                    if (!response) {
                        //请求失败
                    };
                    console.log(response);
                    // Util.updateInfo(json);
                    this.props.navigation.setParams({
                        userinfo: response,
                    });
                    // setParams({userinfo:response})
                    // console.log(state.params.userinfo);
                    console.log("登录监听3");

                }, (err) => {
                    // console.log(err);
                    // Utils.showMessage('网络请求失败');
                });
            }
        })
    }
    _goLogin(){
        // 未登录
        Utils.clearAllValue();
        const {setParams} = this.props.navigation;
        setParams({userinfo:""})

        this.props.navigation.navigate('Login', {callback:()=>{
            this._fetchUserInfo();
        }})
    }
    // ------------------------------------------点击事件
    _loadQuitLogin(){
        const {setParams} = this.props.navigation;
        setParams({userinfo:""})
        Utils.clearAllValue()
    }
    //隐藏所有弹框
    _hideHelpAlert(){
        this.setState({
            showHelpActions:false,
            showEditorsView:false
        })
    }
    //帮助/更多点击
    _clickHelp = ()=>{
        this.setState({
            showHelpActions:!this.state.showHelpActions, 
            showEditorsView:false
        })
    }
    // 寻找帮助 shadowview点击
    _clickFindHelpShadow = ()=>{
        this.setState({
            showFindHelpView:false
        })
    }
    // 编辑器组每个 item 点击事件
    _clickEditor(item){
        this.setState({
            showEditorsView:false,
            currentEditorType:item.type
        })

        Utils.openURL(item.link)
    }
    // 在线编辑器选项点击 
    _clickChooseEditor = () =>{
        this.setState({
            showHelpActions:false,
            showEditorsView:true
        })
    }
    // 寻找帮助选项点击
    _clickFindHelp = ()=>{
        this.setState({
            showHelpActions:false,
            showFindHelpView:true
        })
    }
    // 每个 tab 项的点击事件
    _clickTab(index){
        switch (index) {
            case 0:
            {
                // 免费学习
                this.props.navigation.navigate("MessagePage", {userinfo:"", callback:(response)=>{
                    console.log("回调更新导航");
                    console.log(response);
                    this.props.navigation.setParams({userinfo:response});
                }});
                break;
            }
            case 1:
            {
                //参加竞赛
                this.props.navigation.navigate("CompeteView", {callback:()=>{
                    console.log("回调更新导航");
                    this._fetchUserInfo();
                }});
                break;
            }
            case 2:
            {
                //在线编辑器
                // this._clickHelp();
                this._clickChooseEditor();
                break;
            }
            case 3:{
                //娃娃机
                Utils.isLogin((token)=>{
                    if (token) {
                        this.props.navigation.navigate("ChildMachineWebView", {token:token, callback:()=>{
                            console.log("回调更新导航");
                            this._fetchUserInfo();
                        }});
                    }else{
                        this.props.navigation.navigate("Login");
                    }
                });
                break;
            }
            case 4:{
                //钻石商城
                this.props.navigation.navigate('Exchange', {callback:()=>{
                    console.log("回调更新导航");
                    this._fetchUserInfo();
                }});
                break;
            }
            default:
            {
                break;
            }
        }
    }
    
    // ----------------------------------------------------------UI 布局
    // 寻找帮助
    _renderFindHelp(){
        return (
            <TouchableOpacity onPress={this._clickFindHelpShadow} style={styles.findHelpShadowView}>
                <View style={{}}>
                    <Text style={styles.findHelpText}>如需帮助，请使用学习论坛进行发帖，会有专人帮您解答。</Text>
                    <Text style={styles.findHelpVersion}>当前版本号:{DeviceInfo.getVersion()}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    // 编辑器组
    _renderEditors(){
        var array = [
            {"type":"html", "name":"HTML 编辑器", link:Http.domainPage+"/app/home/codeEditRN.html"}, 
            {"type":"c", "name":"C 语言编辑器", link:Http.domainPage+"/app/home/compileRN.html?lang=c"}, 
            {"type":"python", "name":"Python 编辑器", link:Http.domainPage+"/app/home/compileRN.html?lang=python"}, 
            {"type":"java", "name":"Java 编辑器", link:Http.domainPage+"/app/home/compileRN.html?lang=java"}
        ]
        return (
            <TouchableOpacity style={styles.helpSuperParent} onPress={this._hideHelpAlert.bind(this)}>
            <View style={styles.editorsView}>
                <ScrollView style={styles.editorsList}>
                    {
                        array.map((item, i)=>{
                            return (
                                <TouchableOpacity key={i} style={[styles.editor, i != 0?{borderTopColor:'#d2d2d2', borderTopWidth:1}:null]} onPress={this._clickEditor.bind(this, item)}>
                                    <Text numberOfLines={1}>
                                      {i+1}.{item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
                <Image
                  style={styles.editorsArrow}
                  source={require('../images/arrow-w.png')}
                  resizeMode={"contain"}
                />
            </View>
            </TouchableOpacity>
        )
    }
    // 帮助
    _renderHelpActions(){
        return (
            <TouchableOpacity style={styles.helpSuperParent} onPress={this._hideHelpAlert.bind(this)}>
                <View style={styles.helpParentView}>
                    <View style={styles.helpActionsView}>
                        
                        <TouchableOpacity style={[{borderBottomColor:'#d2d2d2', borderBottomWidth:1}, styles.helpActionTextParent]} onPress={this._clickChooseEditor}>
                            <Text style={styles.helpActionText}>{"在线编辑器"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.helpActionTextParent]} onPress={this._clickFindHelp} >
                            <Text style={styles.helpActionText}>{"寻找帮助"}</Text>
                        </TouchableOpacity>

                    </View>
                    <Image
                      style={styles.helpActionArrow}
                      source={require('../images/arrow-w.png')}
                      resizeMode={"contain"}
                    />
                </View>
            </TouchableOpacity>
        )
    }
    //按钮
    _renderTabs(){
        return (
            <View style={styles.tabs}>
                <TouchableOpacity style={styles.tab} onPress={this._clickTab.bind(this, 0)}>
                    <Image
                      style={styles.tabImg}
                      source={require('../images/i1.png')}
                      resizeMode={'cover'}
                    />
                    <Text style={styles.tabTitle}>
                      {"开始学习"}
                    </Text>
                    <Text style={styles.tabText}>
                      {"(超过二十门课程可以学习)"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this._clickTab.bind(this, 1)}>
                    <Image
                      style={styles.tabImg}
                      source={require('../images/i2.png')}
                      resizeMode={'cover'}
                    />
                    <Text style={styles.tabTitle}>
                      {"参加竞赛"}
                    </Text>
                    <Text style={styles.tabText}>
                      {"(赢奖学金和钻石)"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this._clickTab.bind(this, 2)}>
                    <Image
                      style={styles.tabImg}
                      source={require('../images/i2.png')}
                      resizeMode={'cover'}
                    />
                    <Text style={styles.tabTitle}>
                      {"在线编辑器"}
                    </Text>
                    <Text style={styles.tabText}>
                      {"(包含Python,Java,C,HTML)"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this._clickTab.bind(this, 3)}>
                    <Image
                      style={styles.tabImg}
                      source={require('../images/i1.png')}
                      resizeMode={'cover'}
                    />
                    <Text style={styles.tabTitle}>
                      {"娃娃机"}
                    </Text>
                    <Text style={styles.tabText}>
                      {"(赢钻石和道具)"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={this._clickTab.bind(this, 4)}>
                    <Image
                      style={styles.tabImg}
                      source={require('../images/i3.png')}
                      resizeMode={'cover'}
                    />
                    <Text style={styles.tabTitle}>
                      {"钻石商城"}
                    </Text>
                    <Text style={styles.tabText}>
                      {"(可以兑换相框道具)"}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    render(){
        return (
            <View style={{flex:1, backgroundColor:"rgb(229, 230, 231)"}}>
                <StatusBar hidden={false} />
                {this._renderTabs()}
                {
                    this.state.showHelpActions? this._renderHelpActions() : null
                }
                {
                    this.state.showEditorsView? this._renderEditors() : null
                }
                {
                    this.state.showFindHelpView? this._renderFindHelp() : null
                }
            </View>
        )
    }
}
const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高
const themeColor = Utils.btnBgColor;
const whiteColor = Utils.btnBgColorS;

const styles = StyleSheet.create({
    // -------------------------------------------------导航栏
    headerStyle:{
        backgroundColor:themeColor
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
    headerLeftZuanView:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:5,
    },
    headerLeftZuanImg:{
        height:20
    },
    headerLeftZuanText:{
        color:'white',
        fontSize:11
    },
    // -----------导航栏右部分
    headerRightView:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginRight:10
    },
    headerRightImg:{
        height:30
    },
    headerRightText:{
        color:'white',
        fontSize:11
    },
    // ------------tabs
    tabs:{
        // marginHorizontal:15,
        marginLeft:15,
        marginTop:20,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    tab:{
        alignItems:'center',
        justifyContent:'center',
    
        height:(height-bottomH-headerH)/3-30,
        marginBottom:20,
        // backgroundColor:'blue',
        borderRadius:10,
        width:(width-45)/2,
        marginRight:15
    },
    tabImg:{
        position:'absolute', 
        // width:width-30, 
        height:(height-bottomH-headerH)/3-30,
        borderRadius:10,
        width:(width-45)/2
    },
    tabTitle:{
        color:'white', 
        fontSize:20, 
        backgroundColor:'transparent', 
        fontWeight:'bold', 
        marginBottom:20
    },
    tabText:{
        color:'#ffdecd', 
        fontSize:15, 
        backgroundColor:'transparent'
    },

    // ----------------------弹框的样式
    // ----------------帮助按钮组
    helpSuperParent:{
        position:'absolute',
        top:0,
        width:width,
        bottom:0,
    },
    helpParentView:{
        position:'absolute',
        // bottom:45,
        // left:5,
        top:0,
        // top:headerH,
        right:5,
        
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
        // width:80,
        // height: 30, 
        // lineHeight: 30, 
        textAlign:'center',
        fontSize:16,
        // backgroundColor:'red'
    },
    helpActionArrow:{
        position:'absolute', 
        height:11, 
        width:16, 
        // bottom:-10,
        // left:10,
        top:-11,
        right:10,  
    },

    // -------------编辑器组
    editorsView:{
        position:'absolute',
        // bottom:45,
        // left:5,
        top:0,
        right:5,
    },
    editorsList:{
        backgroundColor: 'white', 
        borderWidth:1,
        borderColor:'#d2d2d2',
        borderRadius: 5,
        paddingHorizontal:10,
        maxHeight:360,
    },
    editor:{
        // alignItems:'center', 
        justifyContent:'center', 
        height:40,
        maxWidth:160,
    },
    editorTextSelect:{
        color:themeColor
    },
    editorTextUnselect:{
        color:'#333'
    },
    editorsArrow:{
        position:'absolute', 
        height:11, 
        width:16, 
        // bottom:-10,
        // left:10,
        top:-11,
        right:10,
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
    findHelpVersion:{
        color: 'white',
        fontSize: 20,
        width: width*.8,
        marginTop:30,
        textAlign:'center'
    },


});

export default HomeScreen;
