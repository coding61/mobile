'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  AsyncStorage,
  Alert,
  DeviceEventEmitter,
  NativeModules,
  ActivityIndicator,
  FlatList
} from 'react-native';

import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import RewardView from '../Activity/RewardView.js';
import PunchCardAlert from '../Activity/PunchCardAlert.js';

var UMeng = require('react-native').NativeModules.RongYunRN;

const {width, height} = Dimensions.get('window');

class PunchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            num: null,
            bgHeight: width * 520 / 750,
            show: false,            // 打卡规则
            showReward: false,      // 打卡奖励
            showRewardNum: 0,
            pk: this.props.navigation.state.params.pk
            // pk: 38,
        }
    }

    // static navigationOptions = ({ navigation }) => {
    //     const {state, setParams} = navigation;
    //     return {
    //         headerTintColor: "#fff",
    //         headerStyle: { backgroundColor: Utils.btnBgColor,},
    //         headerTitleStyle:{alignSelf:'auto',fontSize:18},
    //         title: '打卡'
    //     };
    // }
    static navigationOptions  = ({ navigation, screenProps }) => ({
        header: null,
        headerTintColor:"#fff"
    })

    componentWillMount() {
        var _this = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result != null){
                _this.setState({token: result}, ()=>{
                    _this._whoami();
                    // _this._getPunchCardRecord();
                });
            }
        });
    }

    componentDidMount() {}

    componentWillUnmount() {}

    _getPunchCardRecord() {
        // 回复背景高度
        // this.setState({bgHeight: width * 520 / 750})
        var type = "GET",
            url = Http.getPunchCardRecord(this.state.pk, this.state.owner),
            token = this.state.token,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            if (!response) {
                Alert.alert('失败，请重试');
                return;
            };
            if (response.status == -4 || response.message) {
                Alert.alert(response.message?response.message:response.detail);
                return;
            }
            // console.log(response);
            // response.punch_days = 30;
            this.setState({data: response},()=>{
                // 只有第一次请求才会刷新高度，避免分享后背景高度跳动
                if (!this.state.moreHeight) {
                    var punchViewW = width - width * 40 / 750 * 1.8;
                    var medianW = width * 30 / 750;
                    var spotW = (punchViewW - medianW * 8) / 9;

                    var totalDays = this.state.data.punch_days;
                    var moreHeight = 0
                    if (totalDays > 9 && totalDays <= 18) {
                        moreHeight = spotW + 10;
                    } else if (totalDays > 18 && totalDays <= 27) {
                        moreHeight = (spotW + 10) * 2;
                    } else {
                        moreHeight = (spotW + 10) * 3;
                    }
                    this.setState({moreHeight: moreHeight}, ()=>{
                        this.setState({bgHeight: this.state.bgHeight + this.state.moreHeight})
                    })
                }
            });
        }, (err) => {
            console.log(err);
            Alert.alert('网络请求失败');
        });
    }

    _punchCard() {
        var type = "GET",
            url = Http.punchCard(this.state.pk),
            token = this.state.token,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            if (!response) {
                Alert.alert('失败，请重试...');
                return;
            };
            if (response.status == -4 || response.message) {
                // Alert.alert(response.message ? response.message : response.detail);
                // 打卡获得钻石时
                if (response.message && response.message == '活动打卡成功') {
                    if (response.diamond_amount && response.diamond_amount != 0) {
                        this.setState({showRewardNum: response.diamond_amount, showType: 'diamond'},() =>{
                            this.setState({showReward: true})
                        })
                    } else if (response.bonus_amount && response.bonus_amount != 0) {
                        this.setState({showRewardNum: response.bonus, showType: 'bonus'},() =>{
                            this.setState({showReward: true})
                        })
                    } else {
                        Alert.alert(response.message);
                    }
                    this._getPunchCardRecord();
                } else {
                    // 多个 modal 会隐藏掉后面的
                    Alert.alert(response.message ? response.message : response.detail);
                }
            }
        }, (err) => {
            console.log(err);
            Alert.alert('网络请求失败');
        });
    }

    _shareWeChat = () => {
        if (!this.state.data) {
            Alert.alert('正在获取数据，请稍后...');
            return;
        }
        if (!this.state.owner) {
            Alert.alert('正在获取个人信息，请稍后...');
            return;
        }
        var count = this.state.data.my_punch ? this.state.data.my_punch.punch_time.length + 1 : 1;
        var title = '我在“程序媛app”学习编程，现在是打卡第' + String(count) +  '天。';
        var content = this.state.data.introduction;
        var shareUrl = Http.sharePunchUrl(this.state.pk, this.state.owner, this.state.head, this.state.name);
        var imgUrl = Http.shareLogoUrl;    // 默认图标
        UMeng.rnShare(title, content, shareUrl, imgUrl, (error, callBackEvents)=>{
            if(error) {
                Alert.alert('分享出错了');
            } else {
                if (callBackEvents == 'success') {
                    this._punchCard();
                };
            }
        })
    }

    _punchCardAlert() {
        // AsyncStorage.removeItem('hidePunchCount', () => {})
        // AsyncStorage.removeItem('hidePunchForever', () => {})
        var _this = this;
        AsyncStorage.getItem('hidePunchForever', function(errs, result) {
            _this.setState({showPunchAlert: result == 'yes' ? false : true},() => {
                if (!_this.state.showPunchAlert) {
                    _this._shareWeChat();
                }
            });
        });
    }

    // 打卡提示，5 次后隐藏
    _hideAfterFiveCount() {
        var _this = this;
        AsyncStorage.getItem('hidePunchCount', function(errs, result) {
            if(result != null){
                if (result == '4') {
                    _this._hideForever();
                    return
                }
                AsyncStorage.setItem('hidePunchCount', String(Number(result) + 1), () => {})
            } else {
                AsyncStorage.setItem('hidePunchCount', String(1), () => {})
            }
            _this.setState({showPunchAlert: false},() => {
                _this._shareWeChat();
            });
        });
    }
    _hideForever(){
        var _this = this;
        AsyncStorage.setItem('hidePunchForever', 'yes', () => {
            _this.setState({showPunchAlert: false},() => {
                _this._shareWeChat();
            });
        })
    }

    _whoami = () => {
        var type = "GET",
            url = Http.whoami,
            token = this.state.token,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            if (!response) {
                Alert.alert('失败，请重试..');
                return;
            };
            if (response.status == -4 || response.message) {
                Alert.alert(response.message ? response.message : response.detail);
                return;
            }
            this.setState({
                head: response.avatar,
                name: response.name,
                owner: response.owner
            },() => {
                this._getPunchCardRecord();
            })
        }, (err) => {
            console.log(err);
            Alert.alert('网络请求失败');
        });
    }

    // 打卡记录
    _recordView() {
        var todayPunchCount = this.state.data && this.state.data.my_punch ? this.state.data.my_punch.today_punch : 0;
        var totalPunchCount = this.state.data && this.state.data.my_punch ? this.state.data.my_punch.all_punch : 0;
        return (
            <View style={{paddingLeft: width * 40 / 750, width: width * (1 - 40 / 750), height: 40, marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#fff', fontSize: 15}}>今日打卡</Text>
                <Text style={{color: 'yellow', fontSize: 25, marginBottom: 2}}>{todayPunchCount}</Text>
                <Text style={{color: '#fff', fontSize: 15}}>次</Text>
                <View style={{flex: 1}}></View>
                <Text style={{color: '#fff', fontSize: 15}}>{'累计打卡' + totalPunchCount + '次'}</Text>
            </View>
        )
    }

    // 获取经过的天数
    _getPassDays(time) {
        var curDate = new Date();
        var diff = Date.parse(curDate) - Date.parse(time);
        var days = Math.floor(diff / (24 * 3600 * 1000))
        return days;
    }

    // 打卡圈圈圆圆圈圈
    _punchView() {
        if (!this.state.data) { return (<View style={{width: width, height: 50}}/>) }

        const whiteColor = '#FDFFFF';
        const darkPinkColor = '#F02A66';
        const lightPinkColor = '#FDA4BB';
        const darkYellowColor = '#FEB504';
        const lightYellowColor = '#F9FF57';
        const textDarkPinkColor = '#F96F96';
        const textLightPinkColor = '#FFAEC2';
        const medianDarkPinkColor = '#F22A68';
        const medianLightPinkColor = '#FDB8CC';

        var margin = width * 40 / 750;
        var punchViewW = width - margin * 1.8;
        var medianW = width * 30 / 750;
        var medianH = 5;
        var spotW = (punchViewW - medianW * 8) / 9;

        // 打卡圆圈的 map
        var spotArr = [];
        // 我的打卡记录
        var punchRecord = !this.state.data.my_punch ? [] : this.state.data.my_punch.punch_time;
        var totalDays = this.state.data.punch_days;
        // 今天至活动创建经过的天数
        var passDays = this._getPassDays(this.state.data.create_time);
        // 打卡日期为第几天的数字
        var arr = [];
        for (var i = 0; i < punchRecord.length; i++) {
            // 今天至打卡记录经过的天数
            var perPassDays = this._getPassDays(punchRecord[i]);
            var indexDay = passDays - perPassDays + 1;
            arr.push(indexDay);
        }

        for (var i = 1; i <= totalDays; i++) {
            // 颜色根据过去天数变化
            var spotBgColor = i <= passDays ? whiteColor : darkPinkColor;
            var spotBrColor = i <= passDays ? lightPinkColor : darkPinkColor;
            var textColor   = i <= passDays ? textDarkPinkColor : textLightPinkColor;
            var medianColor = i <= passDays ? medianLightPinkColor : medianDarkPinkColor;
            // 颜色根据是否打卡变化
            var havePunched = false;
            for (var j = 0; j < arr.length; j++) {
                if (i == arr[j]) {
                    spotBgColor = darkYellowColor;
                    spotBrColor = lightYellowColor;
                    havePunched = true;
                    break;
                }
            }
            /** 视图说明
                if (最右侧 || 最后一天) {
                    spotArr.push(
                        打卡 ? ( 黄色圆圈，对号图片 ) : ( 粉圈，数字 )
                    )
                } else {
                    spotArr.push(
                        打卡 ? ( 黄色圆圈，对号图片，间隔横线 ) : ( 粉圈，数字，间隔横线)
                    )
                }
             */
            if (i == 9 || i == 18 || i == 27 || i == totalDays) {
                spotArr.push(
                    havePunched ? (
                        <View key={i} style={{borderWidth: 3, borderColor: spotBrColor,alignItems: 'center', justifyContent: 'center',borderRadius: (spotW + 1) / 2, width: spotW + 1, height: spotW + 1, backgroundColor: spotBgColor, marginTop: 10}}>
                            <Image resizeMode={'stretch'} style={{marginTop: 5, width: spotW * 0.7, height: spotW * 0.7}} source={require('../images/punch_icon/yes.png')}/>
                        </View>
                    ) : (
                        <View key={i} style={{borderWidth: 1, borderColor: spotBrColor,alignItems: 'center', justifyContent: 'center',borderRadius: spotW / 2, width: spotW, height: spotW, backgroundColor: spotBgColor, marginTop: 10}}>
                            <Text style={{color: textColor, fontWeight: 'bold'}}>{i}</Text>
                        </View>
                    )
                )
            } else {
                spotArr.push(
                    havePunched ? (
                        <View key={i} style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <View style={{borderWidth: 3, borderColor: spotBrColor, alignItems: 'center', justifyContent: 'center',borderRadius: (spotW + 1) / 2, width: spotW + 1, height: spotW + 1, backgroundColor: spotBgColor}}>
                                <Image resizeMode={'stretch'} style={{marginTop: 5, width: spotW * 0.7, height: spotW * 0.7}} source={require('../images/punch_icon/yes.png')}/>
                            </View>
                            <View style={{width: medianW, height: medianH, backgroundColor: medianColor}}>
                            </View>
                        </View>
                    ) : (
                        <View key={i} style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <View style={{borderWidth: 1, borderColor: spotBrColor, alignItems: 'center', justifyContent: 'center',borderRadius: spotW / 2, width: spotW, height: spotW,  backgroundColor: spotBgColor}}>
                                <Text style={{color: textColor, fontWeight: 'bold'}}>{i}</Text>
                            </View>
                            <View style={{width: medianW, height: medianH, backgroundColor: medianColor}}>
                            </View>
                        </View>
                    )
                )
            }
        }
        return (
            <View style={{alignItems: 'center',flexDirection: 'row', flexWrap: 'wrap', marginLeft: margin, width: punchViewW + 10, marginTop: 15}}>
                { spotArr.map((elem, index) => {
                    return elem;
                }) }
            </View>
        )
    }

    _showRule() {
        this.setState({show: !this.state.show},()=>{
            this.setState({bgHeight: this.state.show ? this.state.bgHeight : this.state.bgHeight - this.state.ruleHeight})
        })
    }

    _showBtnView() {
        return (
            <TouchableOpacity style={{marginLeft: width * (1 - 200 / 750), height: 30, width: width * 180 / 750, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} onPress={this._showRule.bind(this)}>
                <Text style={{width: 70, color: 'yellow'}}>打卡规则</Text>
                {this.state.show ? (
                    <Image style={{width: 18, height: 9}} source={require('../images/punch_icon/up.png')}/>
                ) : (
                    <Image style={{width: 18, height: 9}} source={require('../images/punch_icon/down.png')}/>
                )}
            </TouchableOpacity>
        )
    }

    // 获取 ruleView 高度
    _onLayout(event) {
        //获取根View的宽高，以及左上角的坐标值
        let {x, y, width, height} = event.nativeEvent.layout;
        this.setState({ruleHeight: height + 10},() =>{
            this.setState({bgHeight: this.state.bgHeight + this.state.ruleHeight})
        })
    }

    // 打卡规则
    _ruleView() {
        const rule1 = '每天可进行多次打卡，仅首次打卡可获得钻石奖励。';
        const rule2 = '完成连续打卡任务可额外获得钻石的奖励，若中断打卡，则挑战失败无法获取额外奖励，但可继续重新打卡，获得当天钻石奖励。'
        return (
            <View style={styles.ruleView} onLayout={this._onLayout.bind(this)}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.ruleTxt}>1.</Text>
                    <Text style={styles.ruleTxt}>{rule1}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={styles.ruleTxt}>2.</Text>
                    <Text style={styles.ruleTxt}>{rule2}</Text>
                </View>
            </View>
        )
    }

    _goBack() {
        this.props.navigation.goBack();
    }

    _navView() {
        return (
            <View style={{width: width, height: 44, marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity style={{position: 'absolute', width: 60, height: 44, left: 0, justifyContent: 'center', alignItems: 'center'}} onPress={this._goBack.bind(this)}>
                    <Image source={require('../images/back.png')} resizeMode={'contain'}/>
                </TouchableOpacity>
                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(255, 255, 255, 0)'}}>活动打卡</Text>
            </View>
        )
    }

    _infoView() {
        var recordView = this._recordView();
        var punchView = this._punchView();
        var showBtnView = this._showBtnView();
        var ruleView = this._ruleView();
        return (
            <View style={{width: width, height: this.state.bgHeight - 60, backgroundColor: 'rgba(255,255,255,0)'}}>
                {recordView}
                {punchView}
                {showBtnView}
                {this.state.show ? ruleView : null}
            </View>
        )
    }

    // 处理时间
    _handleTime(time) {
        var curDate = new Date();

        var diff = Date.parse(curDate) - Date.parse(time) + 3600 * 1000 * 8;
        var days = Math.floor(diff / (24 * 3600 * 1000))
        var time = null;
        if (days == 0) {
            var hours = Math.floor(diff / (3600 * 1000))
            if (hours == 0) {
                var mins =  Math.floor(diff / (60 * 1000))
                if (mins == 0) {
                    time = '刚刚'
                } else {
                    time = String(mins) + '分钟前';
                }
            } else {
                time =  String(hours) + '小时前';
            }
        } else {
            time = String(days) + '天前';
        }
        return time;
    }

    // 她们也在打卡列表
    _keyExtractor = (item, index) => index;
    _header() {
        return (
            <View style={{width: width, height: 40}}>
                <View style={{marginLeft: width * 40 / 750, width: 112, height: 40, borderBottomWidth: 2, borderColor: '#FE6B95', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: '#FE6B95', fontSize: 17, fontWeight: 'bold'}}>她们也在打卡</Text>
                </View>
            </View>
        )
    }
    _renderItem = (item) => {
        var time = this._handleTime(item.item.create_time);
        return (
            <View style={styles.itemView}>
                <Image style={styles.itemHeadView} source={{uri: item.item.owner.avatar}}/>
                <Text style={styles.itemNameTxt} numberOfLines={1}>{item.item.owner.name}</Text>
                <Text style={styles.itemTimeTxt}>{time}</Text>
            </View>
        );
    }
    _listView() {
        var header = this._header();
        var showText = '正在加载数据...'
        if (this.state.data && this.state.data.punch_record.length == 0) {
            showText = '快来分享，成为第一个打卡的人'
        }
        return (
            this.state.data && this.state.data.punch_record.length != 0 ? (
                <FlatList style={{flex: 1, backgroundColor: '#FEFFFF'}}
                    ref={(flatList) => this._flatList = flatList}
                    ListHeaderComponent={header}
                    // ListFooterComponent={this._footer.bind(this)}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                    // onRefresh={this.refreshing.bind(this)}
                    // refreshing={this.state.refreshing}
                    // onEndReachedThreshold={0.1}
                    // onEndReached={(info)=>{
                    //     this._loadMore();
                    // }}
                    data={this.state.data.punch_record}>
                </FlatList>
            ) : (
                <View style={{flex: 1}}>
                    {header}
                    <Text style={{marginLeft: width * 40 / 750, color: 'gray', lineHeight: 30}}>{showText}</Text>
                </View>
            )
        )
    }

    render() {
        var navView = this._navView();
        var infoView = this._infoView();
        var listView = this._listView();
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
                <View style={{position:'absolute', top:0, width:width, left:0}}>
                    <Image style={{width: width, height: this.state.bgHeight}} source={require('../images/punch_icon/punch_bg.png')} resizeMode={'stretch'}/>
                    <Image style={{position: 'absolute', bottom: -2, width: width, height: width * 100 / 750}} source={require('../images/punch_icon/wave1.png')} resizeMode={'stretch'}/>
                </View>
                {navView}
                {infoView}
                {listView}
                <TouchableOpacity style={styles.shareBtn} onPress={this._punchCardAlert.bind(this)}>
                    <Text style={styles.shareTxt}>分享打卡</Text>
                </TouchableOpacity>
                {
                    this.state.showReward ?
                        <RewardView
                            type={'punchcard'}
                            msg={'恭喜你获得了' + String(this.state.showRewardNum) + '颗钻石'}
                            hide={this._hideRewardView.bind(this)}
                        />:null
                }
                {
                    this.state.showPunchAlert ?
                        <PunchCardAlert
                            type={'punchcard'}
                            msg={'分享后点击返回程序媛才算打卡成功'}
                            // hide={this._hideRewardView.bind(this)}
                            leftEvent={this._hideAfterFiveCount.bind(this)}
                            rightEvent={this._hideForever.bind(this)}
                        />:null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ruleView: {
        width: width * (1 - 80 / 750),
        marginLeft: width * 40 / 750
    },
    ruleTxt: {
        fontSize: 14,
        color: '#fff',
        lineHeight: 28
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        paddingTop: 15,
        paddingBottom: 15,
        borderColor: '#CFD0D1',
        borderBottomWidth: 1
    },
    itemHeadView: {
        width: width * 80 / 750,
        height: width * 80 / 750,
        marginLeft: width * 40 / 750,
        borderRadius: width * 40 / 750
    },
    itemNameTxt: {
        flex: 1,
        marginLeft: 10,
        color: '#3B3D3C'
    },
    itemTimeTxt: {
        marginRight: width * 40 / 750,
        color: '#969798'
    },
    shareBtn: {
        width: width * (1 - 80 / 750),
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#FE6B95',
        alignItems: 'center',
        justifyContent: 'center'
    },
    shareTxt: {
        color: '#fff',
        fontSize: 16
    }
});

export default PunchCard;
