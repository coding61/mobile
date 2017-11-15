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
export default class MyForum extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:'',
            dataArr: new Array(),
            dataSource: '',
            nextPage: null,
            isLoading: false,
            url:basePath+'/forum/posts/?section=&isessence=&myposts=true&page=1',  
            loadText: '正在加载...',
            isRefreshing: false,
        };
    }
 
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '我的帖子',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14},
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
    forumdetail(data){
        this.props.navigation.navigate('Forum_Details', { data: data.pk,token:this.state.token,iscollect:data.collect,name:'my',callback:(msg)=>{
            this._onRefresh()
        }})
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
    rendertop(top){
        if(top==null){
            return;
        }
        if(top=='Top10'){
            return(<Image style={{width:50,height:20,}} resizeMode={'contain'} source={require('../assets/Forum/10.png')}/>)
        }
        if(top=='Top50'){
            return(<Image style={{width:50,height:20,}} resizeMode={'contain'} source={require('../assets/Forum/50.png')}/>)
        }
        if(top=='Top100'){
            return(<Image style={{width:50,height:20,}} resizeMode={'contain'} source={require('../assets/Forum/100.png')}/>)
        }
    }
    renderForumRow(item){
        var rowData=item.item;
        var time_last=this.dealWithTime(rowData.last_replied)
        return (
            <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:'center'}}>
                        {!rowData.userinfo.avatar?(<Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={{uri:rowData.userinfo.avatar}}/>)}
                        <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.userinfo.grade.current_name}</Text>
                        {this.rendertop(rowData.userinfo.top_rank)}
                    </View>
                    <View style={{paddingLeft:16,paddingRight:20,paddingTop:20,width:width*0.86,}}>
                        <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10,fontWeight: '500',}}>{rowData.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.status_display}]</Text>)}  {rowData.title}</Text>
                        <Text style={{paddingBottom:10,color:'#858585'}} numberOfLines={1}>{rowData.content}</Text>
                        <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.userinfo.name}</Text>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{time_last}</Text>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.browse_count}浏览</Text>
                            <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.reply_count}回答</Text>
                        </View>
                     </View>
                </View>
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
