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
  FlatList,
  RefreshControl,
} from 'react-native';

import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import EmptyView from '../Component/EmptyView.js';

var RNBridgeModule = NativeModules.RNBridgeModule;

const {width, height} = Dimensions.get('window');

class PersonalMedal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            owner: this.props.navigation.state.params.owner,
            show: true,
        }
    }

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:18},
            title: navigation.state.params ? navigation.state.params.title : '勋章',
        };
    }

    componentWillMount() {
        var _this = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result != null){;
                _this.setState({token: result},() => {
                    _this._getUserInfo(_this.state.owner);
                });
            }
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: this.props.navigation.state.params.myself ? '我的勋章' : '她的勋章'
        })
    }

    componentWillUnmount() {}

    _onRefresh() {
        this.setState({
            isRefreshing: true
        },()=> {
            this._getUserInfo(this.state.owner);
        })
    }

    _getUserInfo(username) {
        username = encodeURI(username).replace(/\+/g,'%2B');
        fetch(Http.userinfo(username), {
            method: "get",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            }
        })
        .then((response)=>{
            if (response.ok) {
                return response.json();
            } else {
                return null;
            }
        })
        .then((responseJson)=>{
            this.setState({show: false, isRefreshing: false});
            if (responseJson) {
                this.setState({dataList: responseJson.medal_record});
                /* 分类展示，又改成一起展示了，先不删了以防万一
                    // 两种类型："竞赛"、"论坛"
                    var forumList = [],
                        matchList = [],
                        dataList  = responseJson.medal_record;
                    for (var i = 0; i < dataList.length; i++) {
                        if (dataList[i].record_type == "论坛") {
                            // 测试布局
                            forumList.push(dataList[i]);
                        } else if (dataList[i].record_type == "竞赛") {
                            matchList.push(dataList[i]);
                        }
                    }
                    this.setState({forumList: forumList, matchList: matchList});
                 */
            } else {
                Alert.alert('失败，请重试');
            }
        })
        .catch((err) => {
            Alert.alert('失败，请重试...');
		});
    }

    _loadingView() {
        return (
            this.state.show ? (
                <View style={{position:'absolute',top:(height - 64) / 2 - 100 , width: 120, height: 120, borderRadius: 5, alignSelf: 'center',alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.5)'}}>
    				<ActivityIndicator
    					style={{marginTop: 10}}
    					color={'white'}
    					size={'large'}
    					animating={true}/>
    				<Text style={{color: 'white', alignItems: 'center'}}>请稍后...</Text>
    			</View>
            ) : ( null )
        );
    }

    _keyExtractor = (item, index) => index;

    _forumHeader() {
        return (
            <View style={styles.listHeaderView}>
                <Text style={styles.listHeaderTxt}>社区勋章</Text>
            </View>
        );
    }

    _matchHeader() {
        return (
            <View style={styles.listHeaderView}>
                <Text style={styles.listHeaderTxt}>竞赛勋章</Text>
            </View>
        );
    }

    _renderItem(item, index) {
        /*
            amount:1
            create_time:"2017-11-17T16:09:00.574162"
            extra:"game"
            name:"1竞赛勋章"
            owner:"132..."
            pk:2
            record_type:"竞赛"
         */
        var kind = item.item.record_type;
        if (item.item.record_type == "论坛") {
            kind = "回复";
        } else if (item.item.record_type == "竞赛") {
            kind = "答题";
        }
        return (
            <View style={styles.itemView}>
                <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
                    {kind == "回复" ? (
                        <Image style={{width: 23, height: 23 * 77 / 48}} source={require('../images/forum_icon/forum_medal.png')}/>
                    ) : (
                        kind == "答题" ? (
                            <Image style={{width: 23, height: 23 * 77 / 48}} source={require('../images/forum_icon/match_medal.png')}/>
                        ) : (
                            <Image style={{width: 23, height: 23 * 77 / 48}} source={require('../images/forum_icon/forum_medal.png')}/>
                        )
                    )}
                </View>
                <View style={styles.itemTitleView}>
                    <Text style={styles.itemTxt}>{kind + item.item.amount}</Text>
                </View>
            </View>
        );
    }

    render() {
        var loadingView = this._loadingView();
        return (
            <View style={{flex: 1}}>
                {this.state.dataList && this.state.dataList.length != 0 ? (
                    <ScrollView style={{flex: 1, backgroundColor: 'rgb(243, 243, 243)'}}
                        refreshControl={
                            <RefreshControl
                              refreshing={this.state.isRefreshing ? this.state.isRefreshing : false}
                              onRefresh={this._onRefresh.bind(this)}
                              tintColor='#cccccc'
                              title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                              titleColor='#cccccc' />
                        }>
                        <FlatList style={styles.flatList}
                            ref={(flatList)=>this._flatList = flatList}
                            // ListHeaderComponent={this._forumHeader}
                            renderItem={this._renderItem}
                            numColumns={4}
                            keyExtractor={this._keyExtractor}
                            extraData={this.state}
                            data={this.state.dataList}>
                        </FlatList>
                    </ScrollView>
                ) : (
                    this.state.dataList ? <EmptyView /> : null
                )}
                {loadingView}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
        marginTop: 10
    },
    listHeaderView: {
        width: width,
        height: 50,
        paddingLeft: 10,
        backgroundColor: '#ff6b94',
        justifyContent: 'center'
    },
    listHeaderTxt: {
        color: '#fff',
        fontSize: 16
    },
    itemView: {
        // width: (width - 20 * 4) / 3,
        // height: (width - 20 * 4) / 3,
        width: width / 4,
        height: width / 4,
        // marginTop: 20,
        // marginLeft: 20,
        padding: 20
    },
    itemTitleView: {
        width: 60,
        height: 20,
        marginTop: -2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 2
    },
    itemTxt: {
        color: '#000',
        fontSize: 12
    }
});

export default PersonalMedal;
