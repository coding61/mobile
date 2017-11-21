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
  FlatList,
  DeviceEventEmitter
}from 'react-native';
var {height, width} = Dimensions.get('window');
import Http from '../utils/Http.js';
var basePath=Http.domain;
import ForumAdd from './ForumAdd';
import Utils from '../utils/Utils.js';
import Forum_Details from './Forum_Details';
export default class ForumList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: '',
            tag: 0,
            nextPage: null,
            isLoading: false,
            url:basePath+'/forum/posts/?myposts=false&page=1',
            loadText: '正在加载...',
            isRefreshing: false,
            moreshow:false,
            token:'',
        };
    }

    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '',
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14},
            headerLeft:(
                <View>
                    <TouchableOpacity  onPress={()=>{
                        DeviceEventEmitter.emit('addforum',2)
                    }} style={{width:70,height:30,marginLeft:10,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <Text style={{color:'#ffffff',fontSize:16}}>发布新帖</Text>
                    </TouchableOpacity>
                </View>
                ),
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:20,}}>
                    <TouchableOpacity  onPress={()=>{
                        DeviceEventEmitter.emit('search',2)
                    }} style={{alignItems:'center',justifyContent:'center',marginRight:20,}}>
                       <Image style={{width:20,height:20,}} source={require('../assets/Forum/sousuo-b.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:30,height:30,}} onPress={()=>{
                            DeviceEventEmitter.emit('newsmore', "1")
                        }}>
                            {!state.params || state.params.newscount==0?(<Image style={{width:21,height:30,}} resizeMode="contain" source={require('../assets/Forum/news.png')}/>):(<Image style={{width:29,height:14,}} source={require('../assets/Forum/hasnews.png')}/>)}
                        </TouchableOpacity>
                </View>
                )
        };
    };
    componentWillUnmount(){
        this.eventEmtt.remove();
        this.eventEmttsea.remove();
        this.eventEm.remove();
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},(result)=>{
                    self._loadunread()
                });
            }
        });
    }
    componentWillMount(){
        this.props.navigation.setParams({
            newscount: 0,
        });
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    self._loadunread()
                });
            }

        });
    }
    componentDidMount(){
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    self._loadunread()
                });
            }
        });
        this._loadAlldata()
        this.eventEm = DeviceEventEmitter.addListener('newsmore', (value)=>{
            this.setState({
                moreshow:!this.state.moreshow,
            })
        })
        this.eventEmtt = DeviceEventEmitter.addListener('addforum', (value)=>{
            this.props.navigation.navigate('ForumAdd',{data:value,token:this.state.token,callback:(msg)=>{
                this._onRefresh()
            }})
        })
        this.eventEmttsea = DeviceEventEmitter.addListener('search', (value)=>{
            this.props.navigation.navigate('Search',{token:this.state.token,keyword:'',callback:(msg)=>{
                this._onRefresh()
            }})
        })
    }
    _reloadPage(){
        var self = this;
        AsyncStorage.getItem('token', function(errs, result) {
            if(result!=null){
                self.setState({token: result},()=>{
                    self._loadunread()
                });
            }

        });
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
    _loadunread(){
        fetch(basePath+'/message/messages/?types=forum&status=unread',{
            headers: {Authorization: 'Token ' + this.state.token}
        })
        .then(response=>{
            if (response.status === 200) {
                return response.json();
            } else {
                return '加载失败';
            }
        })
        .then(responseJson=>{
            const {setParams,state} = this.props.navigation;
            setParams({newscount:responseJson.count})
        })
        .catch((error) => {
            console.error(error);
        })
    }
/*    _changeTag(tag) {
        if (tag === 0 && this.state.isLoading === false) {
            this.setState({
                tag: tag,
                url: basePath+'/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&myposts=false&page=1',
                loadText: '正在加载...',
            },()=> {
                this._loadAlldata();
            })
        } else if (tag === 1 && this.state.isLoading === false) {
            this.setState({
                tag: tag,
                url: basePath+'/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&isessence=true&page=1',
                loadText: '正在加载...',
            },()=> {
                this._loadAlldata();
            })
        } else if (tag === 2 && this.state.isLoading === false){
            this.setState({
                tag: tag,
                url: basePath+'/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&page=1&status=solved',
                loadText: '正在加载...',
            },()=> {
                this._loadAlldata();
            })
        }else if (tag === 3 && this.state.isLoading === false){
            this.setState({
                tag: tag,
                url: basePath+'/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&page=1&status=unsolved',
                loadText: '正在加载...',
            },()=> {
                this._loadAlldata();
            })
        }
    }*/

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
            this._reloadPage();
        })
    }
    forumdetail(data){
        this.props.navigation.navigate('Forum_Details', { data: data.pk,token:this.state.token,iscollect:data.collect,name:'list',callback:(msg)=>{
            this._onRefresh()
        }})
    }
    goPersonalPage(userinfo) {
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('PersonalPage', { data: userinfo });
            }else{
                this.props.navigation.navigate("Login");
            }
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
        var time_last=this.dealWithTime(rowData.last_replied?rowData.last_replied:rowData.create_time)
        return (
            <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity style={{width:50,height:50,marginTop:20}} onPress={this.goPersonalPage.bind(this, rowData.userinfo)}>
                            {!rowData.userinfo.avatar?(
                                <Image style={{width:50,height:50,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>
                            ):(
                                <Image style={{width:50,height:50,borderRadius:25,}} source={{uri:rowData.userinfo.avatar}}/>
                            )}
                        </TouchableOpacity>
                        <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.userinfo.grade.current_name}</Text>
                        {this.rendertop(rowData.userinfo.top_rank)}
                    </View>
                    <View style={{paddingLeft:16,paddingRight:20,paddingTop:10,width:width*0.86,}}>
                        <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10,fontWeight: '100',fontFamily:'Noto SansCJK'}}>{rowData.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.status_display}]</Text>)}  {rowData.title}</Text>
                        <Text style={{fontSize:14,paddingBottom:10,color:'#aaaaaa',}}>所属专区：{rowData.section.name}</Text>
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
    _newscenter(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('NewsCenter',{callback:()=>{
                    this._loadunread()
                }});
                this.setState({
                    moreshow:false
                })
            }else{
                this.props.navigation.navigate("Login", {callback:()=>{
                    this._reloadPage();
                }})
            }
        })
    }
    ranklist(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('RankingList', { token:this.state.token });
                this.setState({
                    moreshow:false
                })
            }else{
                this.props.navigation.navigate("Login", {callback:()=>{
                    this._reloadPage();
                }})
            }
        })
    }
    MyCollect(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('MyCollect', );
                this.setState({
                    moreshow:false
                })
            }else{
                this.props.navigation.navigate("Login", {callback:()=>{
                    this._reloadPage();
                }})
            }
        })
    }
    MyForum(){
        Utils.isLogin((token)=>{
            if (token) {
                this.props.navigation.navigate('MyForum', {flag:'我的帖子'});
                this.setState({
                    moreshow:false
                })
            }else{
                this.props.navigation.navigate("Login", {callback:()=>{
                    this._reloadPage();
                }})
            }
        })
    }
    _keyExtractor = (item, index) => index;

    render(){
        if(!this.state.dataSource){
            return( <View style={styles.container}>
                        <Text style={{fontSize:14,}}>正在加载......</Text>
                    </View>)
        }else{
            return (
                <View style={styles.container}>
                    <View>
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
                    {this.state.moreshow?(
                        <View style={{position:'absolute',backgroundColor:'#ffffff',top: 0,borderRadius:5,alignItems:'center',right: 10,borderWidth:0.5,borderColor:'#aaaaaa',paddingLeft:5,paddingRight:5,}}>
                            <View style={{borderBottomWidth:0.5,borderBottomColor:'#aaaaaa'}}>
                                <Text onPress={this._newscenter.bind(this)} style={{padding:15,}}>消息中心</Text>
                                {this.props.navigation.state.params && this.props.navigation.state.params.newscount!=0?(<View style={{position:'absolute',top:13,right:12,width:8,height:8,borderRadius:4,backgroundColor:'red'}}></View>):(null)}
                            </View>
                            <Text onPress={this.MyCollect.bind(this)} style={{padding:15,borderBottomWidth:0.5,borderBottomColor:'#aaaaaa'}}>我的收藏</Text>
                            <Text onPress={this.MyForum.bind(this)} style={{padding:15,borderBottomWidth:0.5,borderBottomColor:'#aaaaaa'}}>我的帖子</Text>
                            <Text onPress={this.ranklist.bind(this)} style={{padding:15,}}>排行榜</Text>
                        </View>
                        ):(null)}
              </View>
            )
        }
    }
}
/*class SlideView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: 0
        }
    }
    _onPress(tag) {
        this.props._change(tag);
        this.setState({
            tag: tag
        })
    }
    render() {
        return(
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{width:width,height: 44, backgroundColor: 'white',borderBottomWidth:1,borderBottomColor:'#cccccc',marginBottom:3,}}
            >
                <TouchableOpacity onPress={this._onPress.bind(this, 0)} style={{width:width/4,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag === 0?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>全部</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 1)} style={{width:width/4,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag === 1?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>精贴</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 2)} style={{width:width/4,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 2?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>已解决</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 3)} style={{width:width/4,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 3?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>未解决</Text>
                </TouchableOpacity>
                <View style={{width: width/4, height: 2, backgroundColor: '#ff6b94', position: 'absolute', bottom: 1, left: width/4 * this.state.tag}}/>
            </ScrollView>
        )
    }
}
SlideView.propTypes = {
    _change: React.PropTypes.func.isRequired
}
*/const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

});
