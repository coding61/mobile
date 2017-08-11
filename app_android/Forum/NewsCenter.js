import React, {Component} from 'react'
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ListView,
    Alert,
    RefreshControl,
}from 'react-native';
var {height, width} = Dimensions.get('window');
import WebHtml from './WebHtml';
var default_url='https://www.cxy61.com/girl/cxyteam_forum_moblie/detail.html';

export default class NewsCenter extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:this.props.navigation.state.params.token,
            url:'https://www.cxy61.com/program_girl/message/messages/?types=forum',
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            nextPage: null,
            isLoading: false,
            loadText: '正在加载...',
            isRefreshing: false,
        }
    }
    static navigationOptions = {
        title: '消息中心',
    }

    componentDidMount() {
        this._loadAlldata()
    }
    _loadAlldata() {
        this.setState({
            isLoading: true
        },()=> {
            fetch(this.state.url,{headers: {Authorization: 'Token ' + this.state.token}})
                .then((response) =>response.json())
                .then((responseData) => {
                    var resultArr = new Array();
                    responseData.results.map(result=> {
                        resultArr.push(result);
                    })
                    this.setState({
                        nextPage: responseData.next,
                        dataArr: resultArr,
                        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(resultArr),
                        isLoading: false,
                        loadText: responseData.next?('正在加载...'):('没有更多了...'),
                        isRefreshing: false

                    });
                })
                .catch((error) => {
                    console.error(error);
                    this.setState({
                        isLoading: false,
                        isRefreshing: false
                    })
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
                                nextPage: responseJson.next,
                                dataArr: resultArr,
                                dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(resultArr),
                                isLoading: false,
                                loadText: responseJson.next?('正在加载...'):('没有更多了')
                            })
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        Alert.alert(
                            '加载失败,请重试',
                            '',
                            [
                                {text: '确定', onPress: ()=> {}, style: 'destructive'},
                            ]
                        )
                        this.setState({
                            isLoading: false,
                            isRefreshing: false
                        })
                    })
            })
        }
    }
    forumdetail(data){
        this.props.navigation.navigate('WebHtml', { data: data.from_id,token:this.state.token })
        //this.props.navigation.navigate('Forum_Details', { data: data,token:this.state.token })
    }
    renderNews(rowData){
        var timeArray = rowData.create_time.split('.')[0].split('T');
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
            time = "昨天 " + rowData.create_time.slice(11, 16);
        }else{
            time = rowData.create_time.slice(0, 10).replace('T', ' ');
        }
        return (
            <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                              style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,padding:10}}>
                <View>
                    <Text numberOfLines={2} style={{fontSize:14,paddingBottom:10,}}>{rowData.status=='read'?(<Text style={{color:'#cccccc',marginRight:8,}}>[已读]</Text>):(<Text style={{color:'red',marginRight:8,}}>[未读]</Text>)}{rowData.text}</Text>
                    <Text style={{marginLeft:width*0.74}}>{time}</Text>
                </View>
            </TouchableOpacity>
        )
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
    render() {

        return (
            <View style={{flex: 1}}>
                <ListView
                    horizontal={false}
                    contentContainerStyle={{width:width,justifyContent:'flex-start',alignItems:'center', }}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderNews.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReached={this._renderNext.bind(this)}
                    onEndReachedThreshold={3}
                    renderFooter={this._renderFooter.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor='#cccccc'
                            title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                            titleColor='#cccccc' />
                    }
                >
                </ListView>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },


});
