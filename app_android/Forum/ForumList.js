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

var {height, width} = Dimensions.get('window');
var basePath='https://www.cxy61.com/';
//var basePath='https://app.bcjiaoyu.com/'
import WebHtml from './WebHtml';
import AddForum from './AddForum';
import Forum_Details from './Forum_Details';
export default class ForumList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.navigation.state.params.data,
            token:this.props.navigation.state.params.token,
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            tag: 0,
            nextPage: null,
            isLoading: false,
            url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&myposts=false&page=1',  
            loadText: '正在加载...',
            types:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            isRefreshing: false,
        };
    }
    static navigationOptions = {
        title: '论坛列表',
        
    };
    componentWillMount(){
        
        
    }

    componentDidMount(){
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
    detail(index){
        if(index==0){
            this.setState({
                url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&myposts=false&page=1'
            },()=>{
                this._loadAlldata()
            })
        }else if(index==1){
            this.setState({
                url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=true&page=1'
            },()=>{
                this._loadAlldata()
            })
        }else if(index==2){
            this.setState({
                url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&keyword=&myposts=&page=1&status=solved'
            },()=>{
                this._loadAlldata()
            })
        }else if(index==3){
            this.setState({
                url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&keyword=&myposts=&page=1&status=unsolved'
            },()=>{
                this._loadAlldata()
            })
        }else if(index==4){
             this.setState({
                url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&keyword=&myposts=true&page=1&status='
            },()=>{
                this._loadAlldata()
            })
        }else if(index==5){
             this.setState({
                url:basePath+'program_girl/collect/collections/'
            },()=>{
                this._loadAlldata()
            })
        } 
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
       this.props.navigation.navigate('WebHtml', { data: data,token:this.state.token })
        //this.props.navigation.navigate('Forum_Details', { data: data,token:this.state.token })
    }
    renderForumRow(rowData){
        if(rowData.types=='posts'){
            return (
                <TouchableOpacity onPress={this.forumdetail.bind(this,rowData.posts)}
                    style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <View style={{alignItems:'center'}}>
                            <Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={{uri:rowData.posts.userinfo.avatar}}/>
                            <Text style={{paddingTop:10}}>{rowData.posts.userinfo.grade.current_name}</Text>
                        </View>
                        <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.7,}}>
                            <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.posts.title}</Text>
                            <Text style={{paddingBottom:10}} numberOfLines={2}>{rowData.posts.content}</Text>
                            <Text style={{paddingBottom:10}}>{rowData.posts.userinfo.name}  {rowData.posts.create_time}</Text>
                        </View>
                        <View style={{flex:1,paddingLeft:10,alignItems:'center'}}>
                            <Image style={{width:19,height:13,marginTop:20,}} source={require('../assets/Forum/see.png')}/>
                            <Text style={{fontSize:10,}}>{rowData.posts.browse_count}</Text>
                            <Image style={{width:18,height:16,marginTop:20,}} source={require('../assets/Forum/reply.png')}/>
                            <Text style={{fontSize:10,}}>{rowData.posts.reply_count}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }else{
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
                    style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <View style={{alignItems:'center'}}>
                            <Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={{uri:rowData.userinfo.avatar}}/>
                            <Text style={{paddingTop:10}}>{rowData.userinfo.grade.current_name}</Text>
                        </View>
                        <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.7,}}>
                            <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.status=='solved'?(<Text style={{color:'#cccccc'}}>[已解决]</Text>):(<Text style={{color:'red'}}>[未解决]</Text>)}{rowData.title}</Text>
                            <Text style={{paddingBottom:10}} numberOfLines={2}>{rowData.content}</Text>
                            <Text style={{paddingBottom:10}}>{rowData.userinfo.name}  {time}</Text>
                        </View>
                        <View style={{flex:1,paddingLeft:10,alignItems:'center'}}>
                            <Image style={{width:19,height:13,marginTop:20,}} source={require('../assets/Forum/see.png')}/>
                            <Text style={{fontSize:10,}}>{rowData.browse_count}</Text>
                            <Image style={{width:18,height:16,marginTop:20,}} source={require('../assets/Forum/reply.png')}/>
                            <Text style={{fontSize:10,}}>{rowData.reply_count}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }
    AddForum(){
        this.props.navigation.navigate('AddForum',{data:this.state.data,token:this.state.token})
    }
    render(){
        if(!this.state.dataSource){
            return(<Text style={{alignItems:'center'}}>加载中.....</Text>)
        }else{
            return (
                <View style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor='#cccccc'
                                title={this.state.isRefreshing?"正在加载":"轻轻刷新一下"}
                                titleColor='#cccccc' />
                        }
                    >
                        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#DEDEDE',paddingLeft:20,paddingBottom:10,}}>
                            <Image style={{width:50,height:50,marginTop:10,}} source={{uri:this.state.data.icon}}/>
                            <View style={{paddingLeft:20,paddingRight:10,paddingTop:10,}}>
                                <Text style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{this.state.data.name}</Text>
                                <Text style={{}}>帖数:{this.state.data.total}</Text>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',flexWrap:'wrap',borderBottomWidth:1,borderBottomColor:'#cccccc',alignItems:'center',paddingLeft:20,paddingLeft:10,}}>
                            <TouchableOpacity onPress={this.detail.bind(this,0)}
                            style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,marginTop:10,marginBottom:10,alignItems:'center',padding:10,justifyContent:'center',}}>
                                <Text style={{color:'#ffffff'}}>全部</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.detail.bind(this,1)}
                            style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,marginTop:10,marginBottom:10,alignItems:'center',padding:10,justifyContent:'center',}}>
                                <Text style={{color:'#ffffff'}}>精贴</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.detail.bind(this,2)}
                            style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,marginTop:10,marginBottom:10,alignItems:'center',padding:10,justifyContent:'center',}}>
                                <Text style={{color:'#ffffff'}}>已解决</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.detail.bind(this,3)}
                            style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,marginTop:10,marginBottom:10,alignItems:'center',padding:10,justifyContent:'center',}}>
                                <Text style={{color:'#ffffff'}}>未解决</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.detail.bind(this,4)}
                            style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,marginTop:10,marginBottom:10,alignItems:'center',padding:10,justifyContent:'center',}}>
                                <Text style={{color:'#ffffff'}}>我的帖子</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.detail.bind(this,5)}
                            style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,marginTop:10,marginBottom:10,alignItems:'center',padding:10,justifyContent:'center',}}>
                                <Text style={{color:'#ffffff'}}>我的收藏</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <ListView
                            horizontal={false}
                            contentContainerStyle={{width:width,justifyContent:'flex-start',alignItems:'center', }}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderForumRow.bind(this)}
                            automaticallyAdjustContentInsets={false}
                            enableEmptySections={true}
                            onEndReached={this._renderNext.bind(this)}
                            onEndReachedThreshold={3}
                            renderFooter={this._renderFooter.bind(this)}
                            
                        >
                        </ListView>
                    </ScrollView>
                    <TouchableOpacity onPress={this.AddForum.bind(this)} style={{position:'absolute',bottom: 50,alignItems:'center',justifyContent:'center',right: 30,height:50,backgroundColor:'#0db7f5',width: 50,borderRadius: 50,}}>
                        <Text style={{color:'#ffffff',fontSize:40}}>+</Text>
                    </TouchableOpacity>
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

