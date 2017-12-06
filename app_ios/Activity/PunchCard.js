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

var RNBridgeModule = NativeModules.RNBridgeModule;

const {width, height} = Dimensions.get('window');

class PunchCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            num: null,
            pk: 38,
            bgHeight: width * 520 / 750,
            show: false
            // pk: this.props.navigation.state.params.pk,
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
                    console.log(_this.state.token);
                    _this._getPunchCardRecord();
                });
            }
        });
    }

    componentDidMount() {}

    componentWillUnmount() {}

    _getPunchCardRecord() {
        var type = "GET",
            url = Http.getPunchCardRecord(this.state.pk),
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
            // this.setState({data: response});
        }, (err) => {
            console.log(err);
            Alert.alert('网络请求失败');
        });

        var dict = {
            "pk": 8,
            "name": "活动打卡俱乐部",
            "introduction": "这是活动打卡俱乐部",
            "ispunch": true,
            "punch_days": 10,
            "my_punch": {
                "today_punch": 2,
                "all_punch": 2,
                "punch_time": [
                    "2017-12-04T17:58:15.526769"
                ]
            },
            "punch_record": [
                {
                    "pk": 4,
                    "owner": {
                        "pk": 7,
                        "owner": "18519791946",
                        "name": "LEON",
                        "avatar": "http://wx.qlogo.cn/mmopen/Miayzv8oDnvAkFvJ5EyYKh6iaG4uXEIkna1YduZ48Ok66SU5ewJkK5gzqkdMJDHicGE8VJ1Qf8pcibAXPjtZUlRotxcSrEEszUbY/0",
                        "experience": 18000,
                        "diamond": 110,
                        "remark": "",
                        "olduser": false,
                        "grade": {
                            "next_name": "钻石4",
                            "current_name": "钻石5",
                            "current_all_experience": 17807,
                            "next_all_experience": 20007
                        },
                        "is_staff": false,
                        "isactive": false,
                        "top_rank": "Top100",
                        "medal_record": []
                    },
                    "quantity": 2,
                    "create_time": "2017-12-04T17:58:15.526769"
                }
            ],
            "create_time": "2017-12-04T17:48:16.060590"
        }
        var moreHeight = 0
        if (dict.punch_days > 9 && dict.punch_days <= 18) {
            moreHeight = 20;
        } else if (dict.punch_days > 18 && dict.punch_days <= 27) {
            moreHeight = 40
        } else {
            moreHeight = 60
        }
        this.setState({moreHeight: moreHeight}, ()=>{
            this.setState({bgHeight: this.state.bgHeight + this.state.moreHeight})
        })
        this.setState({data: dict},()=>{
            console.log(this.state.data);
        })
    }

    _showRule() {
        this.setState({show: !this.state.show},()=>{
            this.setState({bgHeight: this.state.show ? this.state.bgHeight : this.state.bgHeight - this.state.ruleHeight})
        })
    }

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
                <Text style={styles.itemNameTxt}>{item.item.owner.name}</Text>
                <Text style={styles.itemTimeTxt}>{time}</Text>
            </View>
        );
    }

    _onLayout(event) {
        //获取根View的宽高，以及左上角的坐标值
        let {x, y, width, height} = event.nativeEvent.layout;
        this.setState({ruleHeight: height},() =>{
            this.setState({bgHeight: this.state.bgHeight + this.state.ruleHeight})
        })
    }

    _punchView() {
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
        var punchViewW = width - margin * 2;
        var medianW = width * 30 / 750;
        var medianH = 5;
        var spotW = (punchViewW - medianW * 8) / 9;

        var spotArr = [];
        if (!this.state.data) { return }

        // test 需计算
        var passDays = 6;
        var arr = [1, 3, 4]

        for (var i = 1; i <= this.state.data.punch_days; i++) {

            var spotBgColor = i <= passDays ? whiteColor : darkPinkColor;
            var spotBrColor = i <= passDays ? lightPinkColor : darkPinkColor;
            var textColor   = i <= passDays ? textLightPinkColor : textDarkPinkColor;
            var medianColor = i <= passDays ? medianLightPinkColor : medianDarkPinkColor;

            var havePunched = false;
            for (var j = 0; j < arr.length; j++) {
                if (i == arr[j]) {
                    spotBgColor = darkYellowColor;
                    spotBrColor = lightYellowColor;
                    havePunched = true;
                    break;
                }
            }

            if (i == 9 || i == 18 || i == 27 || i == this.state.data.punch_days) {
                spotArr.push(
                    havePunched ? (
                        <View key={i} style={{borderWidth: 2, borderColor: spotBrColor,alignItems: 'center', justifyContent: 'center',borderRadius: (spotW + 1) / 2, width: spotW + 1, height: spotW + 1, backgroundColor: spotBgColor, marginTop: 10}}>
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
                            <View style={{borderWidth: 2, borderColor: spotBrColor, alignItems: 'center', justifyContent: 'center',borderRadius: (spotW + 1) / 2, width: spotW + 1, height: spotW + 1, backgroundColor: spotBgColor}}>
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

    _ruleView() {
        const rule1 = '每天可进行多次打卡，仅首次打卡可获得钻石奖励。';
        const rule2 = '完成连续打卡任务可额外获得100钻石的奖励，若中断打卡，则挑战失败无法获取额外奖励，但可继续重新打卡，获得当天钻石奖励。'
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

    render() {
        var punchView = this._punchView()
        var ruleView = this._ruleView()
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
                <View style={{position:'absolute', top:0, width:width, left:0}}>
                    <Image style={{width: width, height: this.state.bgHeight}}
                        source={require('../images/punch_icon/punch_bg.png')}
                        resizeMode={'stretch'}
                    />
                    <Image style={{position: 'absolute', bottom: -2, width: width, height: width * 100 / 750}}
                        source={require('../images/punch_icon/wave.png')}
                        resizeMode={'stretch'}
                    />
                </View>
                <View style={{width: width, height: 60, backgroundColor: 'rgba(255,255,255,0)'}}>
                    <Text>活动打卡</Text>
                </View>
                <View style={{width: width, height: this.state.bgHeight - 60, backgroundColor: 'rgba(255,255,255,0)'}}>
                    <View style={{paddingLeft: width * 40 / 750, width: width * (1 - 40 / 750), height: 40, marginTop: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: '#fff', fontSize: 15}}>今日打卡</Text>
                        <Text style={{color: 'yellow', fontSize: 25, marginBottom: 2}}>0</Text>
                        <Text style={{color: '#fff', fontSize: 15}}>次</Text>
                        <View style={{flex: 1}}></View>
                        <Text style={{color: '#fff', fontSize: 15}}>累计打卡 次</Text>
                    </View>
                    {this.state.data ? punchView : null}
                    <View style={{width: width, alignItems: 'flex-end'}}>
                        <TouchableOpacity style={{width: 100, height: 30}} onPress={this._showRule.bind(this)}>
                            <Text style={{color: 'yellow'}}>打卡规则</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.show ? ruleView : null}
                </View>
                {this.state.data ? (
                    <FlatList style={{flex: 1, backgroundColor: '#FEFFFF'}}
                        ref={(flatList) => this._flatList = flatList}
                        ListHeaderComponent={this._header}
                        // ListFooterComponent={this._footer.bind(this)}
                        renderItem={this._renderItem}
                        keyExtractor={this._keyExtractor}
                        extraData={this.state}
                        // onRefresh={this.refreshing.bind(this)}
                        // refreshing={this.state.refreshing}
                        onEndReachedThreshold={0.1}
                        onEndReached={(info)=>{
                            // this._loadMore();
                        }}
                        data={this.state.data.punch_record}>
                    </FlatList>
                ) : ( null )}
                <TouchableOpacity style={styles.shareBtn}>
                    <Text style={styles.shareTxt}>分享打卡</Text>
                </TouchableOpacity>
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
