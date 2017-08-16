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
            dataSource: '',
            tag: 0,
            nextPage: null,
            isLoading: false,
            url:basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&myposts=false&page=1',  
            loadText: '正在加载...',
            isRefreshing: false,
        };
    }
 
    
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: state.params.data.name,
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14}
        };
    };

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
    _changeTag(tag) {
        if (tag === 0 && this.state.isLoading === false) {
            this.setState({
                tag: tag,
                url: basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&myposts=false&page=1',
                nextPage: null,
                dataArr: new Array(),
                dataSource: null,
                loadText: '正在加载...',
                
            },()=> {
                this._loadAlldata();
                
            })
        } else if (tag === 1 && this.state.isLoading === false) {
            this.setState({
                tag: tag,
                url: basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&isessence=true&page=1',
                nextPage: null,
                dataArr: new Array(),
                dataSource: null,
                loadText: '正在加载...',
                
            },()=> {
                this._loadAlldata();
                
            })
        } else if (tag === 2 && this.state.isLoading === false){
            this.setState({
                tag: tag,
                url: basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&page=1&status=solved',
                nextPage: null,
                dataArr: new Array(),
                dataSource: null,
                loadText: '正在加载...',
                
            },()=> {
                this._loadAlldata();
                
            })
        }else if (tag === 3 && this.state.isLoading === false){
            this.setState({
                tag: tag,
                url: basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&page=1&status=unsolved',
                nextPage: null,
                dataArr: new Array(),
                dataSource: null,
                loadText: '正在加载...',
                
            },()=> {
                this._loadAlldata();
            })
        }else if (tag === 4 && this.state.isLoading === false){
            this.setState({
                tag: tag,
                url: basePath+'program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&myposts=true&page=1',
                nextPage: null,
                dataArr: new Array(),
                dataSource: null,
                loadText: '正在加载...',
                
            },()=> {
                this._loadAlldata();
            })
        }else if (tag === 5 && this.state.isLoading === false){
            this.setState({
                tag: tag,
                url: basePath+'program_girl/collect/collections/',
                nextPage: null,
                dataArr: new Array(),
                dataSource: null,
                loadText: '正在加载...',
                
            },()=> {
                this._loadAlldata();
            })
        }else if (tag === 6 ){
            this.setState({
                tag: tag
            },()=> {
                this.props.navigation.navigate('NewsCenter', { token:this.state.token })
            })
            
        }else if (tag === 7 ){
            this.setState({
                tag: tag
            },()=> {
                this.props.navigation.navigate('RankingList', { token:this.state.token })
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
        /*this.props.navigation.navigate('WebHtml', { data: data.pk,token:this.state.token,callback:(msg)=>{
            this._onRefresh()
        }})*/
        this.props.navigation.navigate('Forum_Details', { data: data.pk,token:this.state.token,iscollect:data.collect,callback:(msg)=>{
            this._onRefresh()
        }})
    }
    AddForum(){
        this.props.navigation.navigate('AddForum',{data:this.state.data,token:this.state.token,callback:(msg)=>{
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
    renderForumRow(item){
        var rowData=item.item;
        if(rowData.types=='posts'){
            var time_last=this.dealWithTime(rowData.posts.last_replied)
            return (
                <TouchableOpacity onPress={this.forumdetail.bind(this,rowData.posts)}
                    style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <View style={{alignItems:'center'}}>
                            {!rowData.posts.userinfo.avatar?(<Image style={{width:30,height:30,marginTop:10,borderRadius:15,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:30,height:30,marginTop:10,borderRadius:15,}} source={{uri:rowData.posts.userinfo.avatar}}/>)}
                            <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.posts.userinfo.grade.current_name}</Text>
                        </View>
                        <View style={{paddingLeft:16,paddingRight:20,paddingTop:10,width:width*0.86,}}>
                            <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.posts.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.posts.status_display}]</Text>)}  {rowData.posts.title}</Text>
                            <Text style={{paddingBottom:10,color:'#858585'}} numberOfLines={1}>{rowData.posts.content}</Text>
                            <View style={{flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}>
                                <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.posts.userinfo.name}</Text>
                                <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{time_last}</Text>
                                <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.posts.reply_count}回答</Text>
                                <Text style={{fontSize:10,color:'#aaaaaa',marginRight:10,}}>{rowData.posts.browse_count}浏览</Text>
                            </View>
                         </View>
                    </View>
                </TouchableOpacity>
            )
        }else{
           var time_last=this.dealWithTime(rowData.last_replied)
            return (
                <TouchableOpacity onPress={this.forumdetail.bind(this,rowData)}
                    style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,paddingBottom:10,}}>
                    <View style={{flexDirection:'row',}}>
                        <View style={{alignItems:'center'}}>
                            {!rowData.userinfo.avatar?(<Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={{uri:rowData.userinfo.avatar}}/>)}
                            <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.userinfo.grade.current_name}</Text>
                        </View>
                        <View style={{paddingLeft:16,paddingRight:20,paddingTop:10,width:width*0.86,}}>
                            <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.status_display}]</Text>)}  {rowData.title}</Text>
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
    }
    _keyExtractor = (item, index) => index;
    render(){
        if(!this.state.dataSource){
            return( <View style={styles.container}>
                        <SlideView _change={this._changeTag.bind(this)}/>
                        <Text>加载中...</Text>
                    </View>)
        }else{
            return (
                <View style={styles.container}>
                    <View>   
                        <SlideView _change={this._changeTag.bind(this)}/>
                        <FlatList
                            horizontal={false}
                            refreshing={true}
                            data={this.state.dataSource}
                            renderItem={this.renderForumRow.bind(this)}
                            onEndReached={this._renderNext.bind(this)}
                            onEndReachedThreshold={0.2}
                            progressViewOffset={10}
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
                    <TouchableOpacity onPress={this.AddForum.bind(this)} style={{position:'absolute',bottom: 50,alignItems:'center',justifyContent:'center',right: 30,height:50,backgroundColor:'#0db7f5',width: 50,borderRadius: 50,}}>
                        <Text style={{color:'#ffffff',fontSize:40}}>+</Text>
                    </TouchableOpacity>
              </View>
            )
        }
    }
}
class SlideView extends Component {
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
                contentContainerStyle={{height: 44, backgroundColor: 'white',borderBottomWidth:1,borderBottomColor:'#cccccc',marginBottom:3,}}
            >
                <TouchableOpacity onPress={this._onPress.bind(this, 0)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag === 0?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>全部</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 1)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag === 1?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>精贴</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 2)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 2?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>已解决</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 3)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 3?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>未解决</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 4)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag ===4?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>我的帖子</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 5)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 5?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>我的收藏</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 6)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 6?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>消息中心</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPress.bind(this, 7)} style={{width:80,padding:8, height: 38, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[{fontSize: 14},this.state.tag == 7?({color: '#ff6b94'}):({color: '#4a4a4a'})]}>排行榜</Text>
                </TouchableOpacity>
                <View style={{width: 80, height: 2, backgroundColor: '#ff6b94', position: 'absolute', bottom: 1, left: 80 * this.state.tag}}/>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

});

