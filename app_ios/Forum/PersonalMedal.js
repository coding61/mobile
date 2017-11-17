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

var RNBridgeModule = NativeModules.RNBridgeModule;

const {width, height} = Dimensions.get('window');

class PersonalMedal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            owner: this.props.navigation.state.params.owner
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

    _getUserInfo(username) {
        fetch(Http.userinfo('13263699826'), {
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
            if (responseJson) {
                // 两种类型："竞赛"、"论坛"
                var forumList = [],
                    matchList = [],
                    dataList  = responseJson.medal_record;
                for (var i = 0; i < dataList.length; i++) {
                    if (dataList[i].record_type == "论坛") {
                        // 测试布局
                        for (var j = 0; j < 10; j++) {
                            forumList.push(dataList[i]);
                        }
                    } else if (dataList[i].record_type == "竞赛") {
                        matchList.push(dataList[i]);
                    }
                }
                this.setState({forumList: forumList, matchList: matchList});
            } else {
                Alert.alert('失败，请重试');
            }
        })
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
        // console.log(item.item);
        return (
            <View style={styles.itemView}>
                <Text style={styles.itemTxt}>{item.item.name}</Text>
                <Text style={styles.itemTxt}>{item.item.extra}</Text>
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={{flex: 1, backgroundColor: 'rgb(243, 243, 243)'}}>
                <FlatList style={styles.flatList}
                    ref={(forumList)=>this._forumList = forumList}
                    ListHeaderComponent={this._forumHeader}
                    renderItem={this._renderItem}
                    numColumns={3}
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                    data={this.state.forumList}>
                </FlatList>
                <FlatList style={styles.flatList}
                    ref={(matchList)=>this._matchList = matchList}
                    ListHeaderComponent={this._matchHeader}
                    renderItem={this._renderItem}
                    numColumns={3}
                    keyExtractor={this._keyExtractor}
                    extraData={this.state}
                    data={this.state.matchList}>
                </FlatList>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    flatList: {
        flex: 1,
        marginTop: 20
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
        width: (width - 20 * 4) / 3,
        height: (width - 20 * 4) / 3,
        marginTop: 20,
        marginLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'orange'
    },
    itemTxt: {
        color: '#fff',
        fontSize: 16
    }
});

export default PersonalMedal;
