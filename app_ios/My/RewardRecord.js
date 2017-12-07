import React, {Component} from 'react'
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    ScrollView,
    Dimensions,
    AsyncStorage,
    TouchableOpacity,
    ListView,
    Alert,
    FlatList,
    RefreshControl,
}from 'react-native';
var {height, width} = Dimensions.get('window');
import Http from '../utils/Http.js';
var basePath=Http.domain;
export default class RewardRecord extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:'',
            dataArr: new Array(),
            dataSource: '',
            nextPage: null,
            isLoading: false,
            url:basePath+'/userinfo/play_reward_record/',
            loadText: '正在加载...',
            isRefreshing: false,
        };
    }

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: "打赏记录",
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:16},
        };
    };
    componentWillUnmount(){

    }
    componentDidMount(){
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                        self._loadAlldata();
                    
                });
            }
        }); 
    }
    _loadAlldata() {
        this.setState({
            isLoading: true
        },()=> {
            fetch(this.state.url,{headers: {Authorization: 'Token ' + this.state.token}})
            .then((response) =>response.json())
            .then((responseData) => {
                console.log(responseData)
                var resultArr = new Array();
                    responseData.results.map(result=> {
                        resultArr.push(result);
                })
                this.setState({
                    nextPage: responseData.next?responseData.next.replace("http://", "https://"):null,
                    dataArr: resultArr,
                    dataSource: resultArr,
                    isLoading: false,
                    loadText: responseData.next?('正在加载...'):('没有更多了...'),
                    isRefreshing: false
                 });
            })
            .catch((error) => {
                console.error(error);
            });
        })
    }

    _renderNext() {
        if (this.state.nextPage && this.state.isLoading === false) {
            this.setState({
                isLoading: true
            },()=> {
                fetch(this.state.nextPage, {
                    headers: {Authorization: 'Token ' + this.state.token}
                })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        return '加载失败';
                    }
                })
                .then(responseJson=> {
                    if (responseJson === '加载失败') {
                        Alert.alert(
                          '加载失败,请重试',
                          '',
                          [
                            {text: '确定', onPress: ()=> {this.setState({isLoading: false})}, style: 'destructive'},
                          ]
                        )
                    } else {
                        var resultArr;
                        resultArr = this.state.dataArr.concat();
                        responseJson.results.map(result=> {
                            resultArr.push(result);
                        })
                        this.setState({
                            nextPage: responseJson.next?responseJson.next.replace("http://", "https://"):null,
                            dataArr: resultArr,
                            dataSource: resultArr,
                            isLoading: false,
                            loadText: responseJson.next?('正在加载...'):('没有更多了')
                        })
                    }
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        isLoading: false,
                        isRefreshing: false
                    })
                })
            })
        }
    }
    _renderFooter(){
        return <View style={{alignItems:'center', justifyContent: 'center', width: width, height: 30}}><Text style={{fontSize: 12, color: '#cccccc'}}>{this.state.loadText}</Text></View>
    }
    _onRefresh() {
        this.setState({
            isRefreshing: true
        },()=> {
                this._loadAlldata();
        })
    }

    dealWithTime(Time){
        var timeArray = Time.split('.')[0].split('T');
        var year = timeArray[0].split('-')[0];
        var month = timeArray[0].split('-')[1];
        var day = timeArray[0].split('-')[2];
        var hour = timeArray[1].split(':')[0];
        var minute = timeArray[1].split(':')[1];
        var second = timeArray[1].split(':')[2];
        var create = new Date(year, month-1, day, hour, minute, second);
        var current = new Date();
        var s1 = current.getTime() - create.getTime(); //相差的毫秒
        var time = null;
        if (s1 / (60 * 1000) < 1) {
            time = "刚刚";
        }else if (s1 / (60 * 1000) < 60){
            time = parseInt(s1 / (60 * 1000)) + "分钟前";
        }else if(s1 / (60 * 1000) < 24 * 60){
            time = parseInt(s1 / (60 * 60 * 1000)) + "小时前";
        }else if(s1 / (60 * 1000) < 24 * 60 * 2){
            time = "昨天 " + Time.slice(11, 16);
        }else{
            time = Time.slice(0, 10).replace('T', ' ');
        }
        return time;

    }
renderForumRow(item){
        var rowData=item.item;
        var time_last=this.dealWithTime(rowData.create_time)
        return (
            <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#D3D3D3',borderBottomWidth:0.5,paddingLeft:20,paddingTop:10,paddingBottom:10,}}>
                <View style={{width:width*0.7,}}>
                    <Text style={{paddingBottom:10,fontSize:14,}}>{rowData.remake}</Text>
                    <Text  style={{color:'#999',fontSize:12,}}>{rowData.create_time.slice(0, 16).replace("T", " ")}</Text>
                </View>
                <View style={{alignItems:'center',justifyContent:'center',paddingLeft:10,}}> 
                    <Text style={{color:'rgb(247, 99, 146)',fontSize:16,}}>{rowData.amount+'钻石'}</Text>
                </View>
            </View>
        )

    }
    _keyExtractor = (item, index) => index;
    render(){
        if(!this.state.dataSource){
            return( <View style={styles.container}>
                        <Text style={{justifyContent:'center',alignItems:'center',paddingTop:20,}}>正在加载...</Text>
                    </View>)
        }else{
            return (
                <View style={styles.container}>
                    <FlatList
                        horizontal={false}
                        refreshing={true}
                        data={this.state.dataSource}
                        renderItem={this.renderForumRow.bind(this)}
                        onEndReached={this._renderNext.bind(this)}
                        onEndReachedThreshold={0.2}
                        progressViewOffset={10}
                        contentContainerStyle={{paddingBottom:50,}}
                        keyExtractor={this._keyExtractor}
                        ListFooterComponent={this._renderFooter.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor='#cccccc'
                                title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                                titleColor='#cccccc' />
                        }
                    >
                    </FlatList>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

});
