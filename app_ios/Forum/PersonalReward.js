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
  ActivityIndicator
} from 'react-native';

import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';

var RNBridgeModule = NativeModules.RNBridgeModule;

const {width, height} = Dimensions.get('window');

class PersonalReward extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            num: null,
            owner: this.props.navigation.state.params.owner,
        }
    }

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:18},
            title: '打赏'
        };
    }

    componentWillMount() {
        var _this = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result != null){
                _this.setState({token: result});
            }
        });
    }

    componentDidMount() {}

    componentWillUnmount() {}

    _award() {
        if (this.state.num) {
            // var r = /^[0-9]*[1-9][0-9]*$/;　　//正整数
            // r.test(this.state.num)
            var num = Number(this.state.num);
            if (!isNaN(num)) {
                if (parseInt(num, 10) === num && num > 0) {
                    this._fetchAward(String(num));
                } else {
                    Alert.alert('请输入一个正整数');
                }
            } else {
                Alert.alert('请输入一个数字');
            }
        } else {
            Alert.alert('请输入你要打赏的钻石数');
        }
    }

    _fetchAward(num) {
        console.log(this.state.token);
        console.log(num);
        console.log(this.state.owner);

        fetch(Http.awardDiamond, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + this.state.token
            },
            body: JSON.stringify({
                amount: num,
                to_username: this.state.owner
            }),
        })
        // fetch(Http.addActivity, {
        //     method: "POST",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Token ' + this.state.token
        //     },
        //     body: JSON.stringify({
        //         name: "小明俱ddd乐部",
        //         password:"123456",
        //         introduction:"这是小明的俱乐部"
        //     }),
        // })
        .then((response)=>{
            console.log(response);
            return response.json();
        })
        .then((responseJson)=>{
            console.log(responseJson);
            Alert.alert(responseJson.message);
        })
    }

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', backgroundColor: 'rgb(243, 243, 243)'}}>
                <Image style={styles.imgView} source={require('../images/forum_icon/diamond.png')}/>
                <TextInput style={styles.textInput}
                    placeholder='请输入你要打赏的钻石数'
                    onChangeText={(num) => this.setState({num})}
                    value={this.state.num}
                    keyboardType={'numeric'}
                />
                <TouchableOpacity style={styles.btn} onPress={this._award.bind(this)}>
                    <Text style={{color: '#fff', fontSize: 17}}>确定</Text>
                </TouchableOpacity>
                <Text style={styles.txt}>提示:一次打赏的钻石数最多为200钻石</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
	imgView:{
		width: width * 185 / 750,
        height: width * 185 / 750,
        marginTop: width * 75 / 750
	},
    textInput: {
        width: width * 670 / 750,
        height: width * 95 / 750,
        marginTop: width * 50 / 750,
        backgroundColor: '#fff',
        textAlign: 'center'
    },
    btn: {
        width: width * 670 / 750,
        height: width * 95 / 750,
        marginTop: width * 40 / 750,
        backgroundColor: '#ff6b94',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    txt: {
        marginTop: width * 30 / 750,
        color: 'gray',
        fontSize: 15
    }
});

export default PersonalReward;
