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
export default class ForumClass extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: '',
            nextPage: null,
            isLoading: false,
            url:basePath+'/forum/sections/?page=1',  
            loadText: '正在加载...',
            isRefreshing: false,
            pk:1,
        };
    }
 
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: ' 选择论坛专区',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14},
        };
    };

    componentDidMount(){
        this._loadAlldata();
    }
    _loadAlldata() {
        this.setState({
            isLoading: true
        },()=> {
            fetch(this.state.url)
            .then((response) =>response.json())
            .then((responseData) => {
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
                fetch(this.state.nextPage)
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
    forumdetail(data){
        this.props.navigation.state.params.callback(data);
        this.props.navigation.goBack();
    }

    renderForumRow(item){
        var rowData=item.item;
        return (
            <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                style={{width: width,flex:1, height:40,paddingBottom:10,backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.name}</Text>
            </TouchableOpacity>
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
