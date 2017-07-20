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
import ForumDetail from './ForumDetail';

var {height, width} = Dimensions.get('window');
export default class ForumList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.navigation.state.params.data,
            dataArr: new Array(),
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            tag: 0,
            nextPage: null,
            isLoading: false,
            url:'https://www.cxy61.com/program_girl/forum/posts/?section='+this.props.navigation.state.params.data.pk+'&types=&isessence=&myposts=false&page=1',  
            loadText: '正在加载...',
            types:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
            isRefreshing: false,
        };
        console.log(this.state.url)
    }
    static navigationOptions = {
        title: '论坛列表',
        
    };
    componentWillMount(){
        
        
    }

    componentDidMount(){
       this._loadAlldata()
       this._loadtype()
    }
    _loadtype(){
        fetch('https://www.cxy61.com/program_girl/forum/types/', {
            method: 'GET',
        })
        .then(response=> {
            if (response.ok) {
                return response.json();
            } else {
                return "失败";
            }
        })
        .then((responseJson) => {
            var dtatArr = [{name:'全部',},{name:'精贴',}];
                    responseJson.results.map(result=> {
                        dtatArr.push(result);
                    })
            this.setState({
                types:new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(dtatArr),
            });    
        })
        .catch((error) => {console.log(error)});
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
    renderKind(rowdata){
        return(
            <TouchableOpacity style={{backgroundColor: '#FF69B4',marginRight:20,padding:10,alignItems:'center',padding:10,justifyContent:'center',borderRadius:10,}}>
                <Text>{rowdata.name}</Text>
            </TouchableOpacity>
            )
    }_renderNext() {

        if (this.state.nextPage && this.state.isLoading === false) {
                this.setState({
                isLoading: true
            },()=> {
                fetch(this.state.nextPage, {
                    
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
        this.props.navigation.navigate('ForumDetail', { data: data })
    }
    renderForumRow(rowData){
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
            <TouchableOpacity 
            onPress={this.forumdetail.bind(this,rowData)}
            style={{width: width,flex:1, backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                <View style={{flexDirection:'row',}}>
                    <View style={{alignItems:'center'}}>
                        <Image style={{width:50,height:50,marginTop:20,borderRadius:25,}} source={{uri:rowData.userinfo.avatar}}/>
                        <Text style={{paddingTop:10}}>{rowData.userinfo.grade.current_name}</Text>
                    </View>
                    <View style={{paddingLeft:10,paddingRight:10,paddingTop:10,width:width*0.7,}}>
                        <Text numberOfLines={2} style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{rowData.title}</Text>
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
    render(){
        if(!this.state.dataSource){
            return(<Text>SSSSS</Text>)
        }else{
            return (
                <View style={styles.container}>
                    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#DEDEDE',paddingLeft:20,paddingBottom:20,}}>
                        <Image style={{width:50,height:50,marginTop:10,}} source={{uri:this.state.data.icon}}/>
                        <View style={{paddingLeft:20,paddingRight:10,paddingTop:10,}}>
                            <Text style={{fontSize:16,color:'#3B3B3B',paddingBottom:10}}>{this.state.data.name}</Text>
                            <Text style={{}}>帖数:{this.state.data.total}</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',borderBottomWidth:2,borderColor:'#cccccc',}}>
                            <ListView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                style={{width:width,paddingLeft:10,paddingTop:15,paddingBottom:15,}}
                                dataSource={this.state.types}
                                enableEmptySections={true}
                                renderRow={this.renderKind.bind(this)}
                                contentContainerStyle={{justifyContent: 'center',alignItems:'center',}}
                                >
                            </ListView>
                        </View>
                        
                        <ListView
                            horizontal={false}
                            contentContainerStyle={{width:width,justifyContent:'flex-start',alignItems:'center', }}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderForumRow.bind(this)}
                            automaticallyAdjustContentInsets={false}
                            enableEmptySections={true}
                            onEndReached={this._renderNext.bind(this)}
                            onEndReachedThreshold={30}
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
                    </ScrollView>
                    <View style={{position:'absolute',bottom: 50,alignItems:'center',justifyContent:'center',right: 30,height:50,backgroundColor:'#0db7f5',width: 50,borderRadius: 50,}}>
                        <Text style={{color:'#ffffff',fontSize:40}}>+</Text>
                    </View>
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

