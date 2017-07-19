import React, {Component} from 'react'
import {
  AppRegistry, 
  StyleSheet, 
  Image, 
  Text, 
  TextInput, 
  View, 
  ScrollView,
  Dimensions, 
  TouchableOpacity,
  ListView,
  AsyncStorage,
  Alert,
  RefreshControl,
  InteractionManager,
}from 'react-native';
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';
var {height, width} = Dimensions.get('window');
var token='28d2479302bf86369bcec62939099f40b96a62ee';
export default class Forum extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            tag: 0,
            nextPage: null,
            isLoading: false,
            url: 'https://www.cxy61.com/program_girl/forum/sections/',
            loadText: '正在加载...',
            isRefreshing: false,
            token:null,
        }
    }

    componentDidMount() {
       this._loadData()
    }
    _loadData() {
        this.setState({
            isLoading: true
        },()=> {
            fetch(this.state.url, {
                headers: {
                    Authorization: 'Token '+ token 
                }
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
                        {text: '确定', onPress: ()=> {this.setState({isLoading: false, isRefreshing: false})}, style: 'destructive'},
                      ]
                    )
                } else {
                    var resultArr = new Array();
                    responseJson.results.map(result=> {
                        resultArr.push(result);
                    })
                    this.setState({
                        nextPage: responseJson.next,
                        dataArr: resultArr,
                        dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(resultArr),
                        isLoading: false,
                        loadText: responseJson.next?('正在加载...'):('没有更多了...'),
                        isRefreshing: false
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
    _renderRow(rowData, SectionID, rowID, highlightRow) {
        return <OrderCell data={rowData}  _loadData={this._loadData.bind(this)} navigator={this.props.navigator} _refeshView={this._onRefresh.bind(this)} />
    }
    _renderNext() {
        if (this.state.nextPage && this.state.isLoading === false) {
                this.setState({
                    isLoading: true
            },()=> {
                fetch(this.state.nextPage, {
                    headers: {
                        Authorization: 'Token '+ token
                    }
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
                            loadText: responseJson.next?('正在加载...'):('没有更多了...')
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
    _renderFooter(){
        return <View style={{alignItems:'center', justifyContent: 'center', width: width, height: 30}}><Text style={{fontSize: 12, color: '#cccccc'}}>{this.state.loadText}</Text></View>
    }
    _onRefresh() {
        this.setState({
            isRefreshing: true
        },()=> {
            this._loadData();
        })
    }
    _goBack(){
        if (this.props.navigator) {
            this.props.navigator.pop()
        }   
    }
    render() {
        return(
            <View style={{flex: 1, backgroundColor: 'rgb(242,243,244)'}}>
                <View style={{width:width,height:44,borderBottomWidth:1,borderBottomColor:'#e4e4e4',justifyContent:'flex-start',backgroundColor:'#F7F8F9',alignItems:'center',flexDirection:'row',}}>
                    <TouchableOpacity style={{height:44,width:50,marginLeft:16,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',}} 
                    onPress={this._goBack.bind(this)}>
                       <Image  source={require('./assets/Forum/back.png')}/>
                    </TouchableOpacity>
                    <Text style={{color:'#3e3e3e',fontSize:18,fontWeight:'bold',marginLeft:width*0.25,}}>论坛</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}  
                    renderRow={this._renderRow.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReached={this._renderNext.bind(this)}
                    onEndReachedThreshold={200}
                    renderFooter={this._renderFooter.bind(this)}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor='#cccccc'
                            title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                            titleColor='#cccccc' />
                    }
                />
            </View>
        )
    }
}
class OrderCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        }
    }
    componentWillMount() {
        this._handleData();
    }

    componentWillReceiveProps(nextProps) {
        
    }
    _changeData(data) {
        this.setState({
            data: data
        })
    }

    deteleOrder(){
        this.props.detele();
    }

     _clickGoodsDetail(){
        if (this.props.navigator) {
            this.props.navigator.push({
                component: Goods_Order_Detail,
                params: {
                    data:this.state.data,
                    _receive: this._changeData.bind(this),
                }
            })
        }
    }
    render() {
        return(
            <TouchableOpacity onPress={this._clickGoodsDetail.bind(this)}
                style={{width: width, backgroundColor: 'white', marginTop: 10, alignItems: 'center'}}>
                <View>
                  <Image></Image>
                </View>
            </TouchableOpacity>
        )
    }
}
OrderCell.propTypes = {
    data: React.PropTypes.object.isRequired,
    navigator: React.PropTypes.any.isRequired
}
SlideView.propTypes = {
    _change: React.PropTypes.func.isRequired
}

