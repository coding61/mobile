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
import Http from '../utils/Http.js';
var basePath=Http.domain;
var {height, width} = Dimensions.get('window');
export default class Search extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:this.props.navigation.state.params.token,
            dataArr: new Array(),
            dataSource: '',
            nextPage: null,
            isLoading: false,
            url:basePath+'/collect/collections/',  
            loadText: '',
            isRefreshing: false,
            text:'',
        };
    }
 
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '搜索',
            headerTintColor: "#ff6b94",   
            headerStyle: { backgroundColor: '#fff',borderBottomWidth:0.5,borderBottomColor:'#f1f1f1'},
            headerTitleStyle:{alignSelf:'auto',fontSize:14,},
            headerBackTitle:null,
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:20,alignItems:'center',backgroundColor:'#ffffff',}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginRight:10,backgroundColor:'#edeef0',borderColor: '#f1f1f1', borderRadius:5,borderWidth: 1,}}>
                        <Image style={{width:20,height:20,marginLeft:5,}} source={require('../assets/Forum/sousuo.png')}/>
                        <TextInput
                            style={{height: 30, width:width*0.67,marginRight:10,padding:0,paddingLeft:10,backgroundColor:'#edeef0'}}
                            onChangeText={(text)=>{
                                setParams({keyword:text})
                            }}
                            value={state.params.keyword}
                            placeholder='请输入帖子主题'
                            autoCapitalize='none'
                            placeholderTextColor='#aaaaaa'
                            autoFocus={state.params.auto}
                            onSubmitEditing={()=>{
                                DeviceEventEmitter.emit('searchbutton', state.params.data)
                            }}
                            clearButtonMode='always'
                            blurOnSubmit={state.params.auto}
                        />
                    </View>
                    <TouchableOpacity  onPress={()=>{
                        DeviceEventEmitter.emit('searchbutton', state.params.data)
                    }} style={{alignItems:'center',justifyContent:'center',}}>
                        <Text style={{color:'#ff6b94'}}>搜索</Text>
                    </TouchableOpacity>
                </View>
                )
        };
    };
    componentWillUnmount(){
        this.eventEm.remove();
    }
    componentDidMount(){
        this.eventEm = DeviceEventEmitter.addListener('searchbutton', (value)=>{
            const {setParams,state} = this.props.navigation;
            setParams({auto:false})
            this.setState({
                isLoading: true
            },()=> {
                fetch(basePath+"/forum/posts/?keyword="+state.params.keyword+"",{headers: {Authorization: 'Token ' + this.state.token}})
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
        })
    }  
    _renderNext() {
        if (this.state.nextPage ) {
            this.setState({
                isLoading: true
            },()=> {
                fetch(this.state.nextPage,{headers: {Authorization: 'Token ' + this.state.token}})
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
                            {text: '确定', onPress: ()=> {this.setState({
                                isLoading: false
                            })}, style: 'destructive'},
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
    forumdetail(data){
        //this.props.navigation.navigate('MyCollect', );
        //this.props.navigation.navigate('RankingList', { token:this.state.token });
        this.props.navigation.navigate('Forum_Details',{data:data.pk,token:this.state.token,keyword:'rend',name:'search',iscollect:data.collect,callback:(msg)=>{}})
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
                        <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10,fontWeight: '400',}}>{rowData.status=='unsolved'?(<Text style={{color:'red'}}>[未解决]</Text>):(<Text style={{color:'#cccccc'}}>[{rowData.status_display}]</Text>)}  {rowData.title}</Text>
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
                        contentContainerStyle={{paddingBottom:20,}}
                        keyExtractor={this._keyExtractor}
                        ListFooterComponent={this._renderFooter.bind(this)}
                    >
                    </FlatList>
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

