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
  FlatList,
  Alert,
  RefreshControl,
  WebView,
  DeviceEventEmitter
}from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import ForumDeatilCont from './ForumDeatilCont';
var {height, width} = Dimensions.get('window');
var basePath='https://www.cxy61.com/';
export default class Forum_Details extends Component{
    constructor(props) {
        super(props);
        this.state = {
            dataArr: new Array(),
            dataSource: '',
            tag: 0,
            nextPage: null,
            isLoading: false,
            url: 'https://www.cxy61.com/program_girl/forum/replies/?posts='+this.props.navigation.state.params.data+'&page=1',
            loadText: '正在加载...',
            isRefreshing: false,
            token:this.props.navigation.state.params.token,
            pk:this.props.navigation.state.params.data,
            data:'',
            commentshow:false,
            Maincommentshow:false,
            content:'',
            reply_pk:'',
        }  
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:14},
            headerRight:
                (
                <View style={{flexDirection:'row',marginRight:30,}}>
                    <TouchableOpacity style={{marginRight:30,}} onPress={()=>{
                        DeviceEventEmitter.emit('collec', state.params.data)
                    }}>
                        {state.params.iscollect==true?(<Image style={{width:22,height:20,}} source={require('../assets/Forum/xin.png')} resizeMode={'contain'}/>):(<Image style={{width:22,height:20,}} source={require('../assets/Forum/xinfull.png')} resizeMode={'contain'}/>)}
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop:3,}} onPress={()=>{
                        DeviceEventEmitter.emit('message', state.params.data)
                    }}>
                        <Image style={{width:22,height:20,}} source={require('../assets/Forum/message.png')} resizeMode={'contain'}/>
                    </TouchableOpacity>
                </View>
                )
        };
    }
    componentWillUnmount(){
        this.eventEmss.remove();
    }
    componentDidMount() {
        this._loadforum()
        this._loadData()
        this._loadUserinfo()

        this.eventEmss = DeviceEventEmitter.addListener('collec', (value)=>{
            var data = {};
            data.types = "posts";
            data.pk=value;
            fetch(basePath+"program_girl/collect/collection/",
            {
                method:'put',
                headers: {
                    'Authorization': 'Token ' + this.state.token,
                    'Content-Type': 'application/json'},
                body: JSON.stringify(data),  
            })
            .then((response)=>{
                if (response.status === 200) {
                    return response.json();
                } else {
                    return '加载失败';
                }
            })
            .then((result)=>{
                if (result.message == '取消收藏') {
                    Alert.alert('取消收藏','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
                } else if (result.message == '收藏成功') {
                    Alert.alert('收藏成功','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
                }
                const {setParams,state} = this.props.navigation;
                setParams({iscollect:!state.params.iscollect})
                state.params.callback();
                
            })
            .catch((error) => {
                console.error(error);
            })
        })

        this.eventEm = DeviceEventEmitter.addListener('message', (value)=>{
                  this.Show_Main_Comment()
        })         
    }
    Show_Main_Comment(){
        this.setState({
            Maincommentshow:true,
        })
    }
    Show_Comment(pk){
        this.setState({
            commentshow:true,
            reply_pk:pk,
        })  
    }
    Comment_Main(){
        var data = {};
        data.posts = this.state.pk;
        data.content=this.state.content;
        fetch(basePath+"program_girl/forum/replies_create/",
        {
            method:'post',
            headers: {
                'Authorization': 'Token ' + this.state.token,
                'Content-Type': 'application/json'},
            body: JSON.stringify(data),  
        })
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{
            this.setState({
                content:'',
                Maincommentshow:false,
            })
            Alert.alert('回复成功','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
            this._onRefresh()
        })
        .catch((error) => {
            console.error(error);
        })
    }
    _loadforum(){
        forum_url=basePath+'program_girl/forum/posts/'+this.state.pk+'/';
        fetch(forum_url,{
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
                this.setState({
                    data:responseJson,

                })
            })
            .catch((error) => {
                console.error(error);
            })
    }
    _loadUserinfo(){
        info_url=basePath+'program_girl/userinfo/whoami/';
        fetch(info_url,{
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
            this.setState({
                UserInfo:responseJson,
                UserPk:responseJson.pk,
            })
        })
        .catch((error) => {
            console.error(error);  
        })
    }
    _loadData() {
        this.setState({
            isLoading: true
        },()=> {
            fetch(this.state.url)
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
                        dataSource: resultArr,
                        isLoading: false,
                        loadText: responseJson.next?('正在加载...'):('没有更多了...'),
                        isRefreshing: false
                    })
                }
            })
            .catch((error) => {
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
                            nextPage: responseJson.next,
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
    
    renderForumRow(item){
        var rowData=item.item;
        return (
            <View style={{width: width,flex:1, backgroundColor: '#ffffff',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingRight:10,paddingBottom:10,}}>
                <View style={{flexDirection:'row',paddingTop:10,backgroundColor:'#ffffff',width:width,paddingLeft:15}}>
                    <View style={{alignItems:'center',paddingLeft:20,}}>
                        {!rowData.userinfo.avatar?(<Image style={{width:50,height:30,borderRadius:15,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:30,height:30,borderRadius:15,}} source={{uri:rowData.userinfo.avatar}}/>)}
                        <Text style={{paddingTop:5,fontSize:10,color:'#ff6b94',}}>{rowData.userinfo.grade.current_name}</Text>
                    </View>
                    <View style={{paddingLeft:40,paddingRight:10,width:width*0.7,}}>
                        <Text style={{paddingBottom:10,color:'#858585'}}>{rowData.userinfo.name}</Text>
                        <Text style={{paddingBottom:10,color:'#858585'}}>{rowData.create_time.slice(0, 16).replace("T", " ")}</Text>
                    </View>
                    <View style={{paddingRight:20,}}>
                        <TouchableOpacity style={{marginTop:3,}} onPress={this.Show_Comment.bind(this,rowData.pk)}>
                            <Image style={{width:22,height:20,}} source={require('../assets/Forum/mess.png')} resizeMode={'contain'}/>
                        </TouchableOpacity>
                        {this.state.UserPk==rowData.userinfo.pk?(
                            <Text onPress={this.detele_reply.bind(this,rowData.pk)} style={{fontSize:14,paddingTop:10,color:'red'}} >删除</Text>
                            ):(null)}
                    </View>
                </View>
                <ForumDeatilCont data={rowData.content}></ForumDeatilCont>
                {rowData.replymore.map((result,index)=> {
                    return(
                        <View key={index} style={{backgroundColor:'#f1f1f1',width:width*0.9,marginLeft:width*0.05,marginRight:width*0.05,borderBottomColor:'#D3D3D3',borderBottomWidth:0.5,}}>
                            <View style={{flexDirection:'row',paddingTop:10,paddingLeft:20,}}>
                                <Text style={{paddingBottom:10,color:'#4f99cf',marginRight:30,}}>{result.userinfo.name}</Text>
                                <Text style={{paddingBottom:10,color:'#858585'}}>{result.create_time.slice(0, 16).replace("T", " ")}</Text>
                            </View>
                            <ForumDeatilCont data={result.content}></ForumDeatilCont>
                        </View>
                    )
                })}
            </View>
        )
    }
    detele_reply(pk){
        Alert.alert(
            '确认删除回复？',
            '',
            [
                {text: '确定', onPress: ()=> {
                    var detemore_url=basePath+'program_girl/forum/replies/'+pk+'/';
                    fetch(detemore_url,
                    {
                        method: 'DELETE',
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
                        this._onRefresh()
                    })
                    .catch((error) => {
                        console.error(error);  
                        })
                }, style: 'destructive'},
                {text: '取消', onPress: () => {}, style: 'destructive'},
             ]
        )
    }
    _onRefresh() {
        this.setState({
            isRefreshing: true
        },()=> {
            this._loadData();
        })
    }
    _keyExtractor = (item, index) => index;

    detele_main(){
        Alert.alert(
            '确认删除此贴？',
            '',
            [
                {text: '确定', onPress: ()=> {
                    var dete_url=basePath+'program_girl/forum/posts/'+this.state.pk+'/';
                    fetch(dete_url,
                    {
                        method: 'DELETE',
                        headers: {  
                            'Authorization': 'Token '+ this.state.token,
                            'Content-Type': 'application/json' }
                    })
                    .then(response=>{
                        this.props.navigation.state.params.callback();
                        this.props.navigation.goBack();
                    })
                    .catch((error) => {
                        console.error(error);  
                    })
                }, style: 'destructive'},
                {text: '取消', onPress: () => {}, style: 'destructive'},
             ]
        )
    }
    Comment(){
        var data = {};
        data.replies = this.state.reply_pk;
        data.content=this.state.content;
        fetch(basePath+"program_girl/forum/replymore_create/",
        {
            method:'post',
            headers: {
                'Authorization': 'Token ' + this.state.token,
                'Content-Type': 'application/json'},
            body: JSON.stringify(data),  
        })
        .then((response)=>{
            return response.json();
        })
        .then((result)=>{
            this.setState({
                content:'',
                commentshow:false,
            })
            Alert.alert('回复成功','',[{text:'确定',onPress: () => {}, style: 'destructive'}])
            this._onRefresh()
            
        })
        .catch((error) => {
            console.error(error);
        })
    }
    forum_tag(tag){
        if(tag==0){
            statetag='solved'
        }else if(tag==1){
            statetag='finish'
        }else{
            statetag='unsolved'
        }
        var data = {};
        data.status = statetag;
        fetch(basePath+"program_girl/forum/posts/"+this.state.pk+"/",
        {
            method: 'patch',
            headers: {
                'Authorization': 'Token ' + this.state.token,
                'Content-Type': 'application/json'},
            body: JSON.stringify(data),    
        })
        .then(response=>{
            console.log(response)
            if (response.status === 200) {
                return response.json();
            } else {
                return '加载失败';
            }
        })
        .then(responseJson=>{
            this._loadforum()
        })
        .catch((error) => {
            console.error(error);  
        })
    }
    render() {
        var data=this.state.data;
        if(!data){
            return(<Text>加载中...</Text>)
        }else{
            return(
                <View style={{flex:1,backgroundColor:'#ffffff'}}>
                    <ScrollView>
                    <Text style={{fontSize:16,color:'#292929',padding:15,}}>{data.status_display=='未解决'?(<Text style={{color:'#ff6b94',marginRight:10,}}>[{data.status_display}]</Text>):(<Text style={{color:'#858585',paddingRight:10,}}>[{data.status_display}]</Text>)}   {data.title}</Text>
                    <View style={{flexDirection:'row',padding:10,width:width,alignItems:'center',backgroundColor:'#F2F2F2'}}>
                        <View style={{alignItems:'center',paddingLeft:20,}}>
                            {!data.userinfo.avatar?(<Image style={{width:50,height:50,borderRadius:25,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:50,height:50,borderRadius:25}} source={{uri:data.userinfo.avatar}}/>)}
                            <Text style={{paddingTop:10,color:'#FF69B4',}}>{data.userinfo.grade.current_name}</Text>
                        </View>
                        <View style={{paddingLeft:40,paddingRight:10,width:width*0.87,}}>
                            <Text style={{paddingBottom:10,color:'#858585'}}>{data.userinfo.name}</Text>
                            <Text style={{paddingBottom:5,color:'#858585'}}>{data.create_time.slice(0, 16).replace("T", " ")}</Text>
                            <Text style={{color:'#FF6A6A'}}>[{data.types.name}]</Text>
                        </View>
                    </View>
                    <View style={{marginBottom:10,}}>
                        <ForumDeatilCont data={this.state.data.content} ></ForumDeatilCont>
                        {data.userinfo.pk==this.state.UserPk?(
                                <View style={{flexDirection:'row',marginLeft:30,}}>
                                    {data.status=='unsolved'?(
                                        <View style={{flexDirection:'row'}}>
                                            <Text onPress={this.forum_tag.bind(this,0)} style={{color:'#ff6b94',marginRight:30,}}>标记为已解决</Text>
                                            <Text onPress={this.forum_tag.bind(this,1)} style={{color:'#ff6b94',marginRight:30,}}>关闭问题</Text>    
                                        </View>
                                    ):(
                                        <Text onPress={this.forum_tag.bind(this,2)} style={{color:'#ff6b94',marginRight:30,}}>标记为未解决</Text> 
                                    )}
                                    <Text onPress={this.detele_main.bind(this)} style={{color:'#ff6b94',marginRight:30,fontSize:16,}}>删除此贴</Text>
                                </View>
                            ):(null)}
                        <Text style={{backgroundColor:'#f2f2f2',color:'#292929',paddingTop:8,paddingLeft:20,paddingBottom:8,marginTop:10,}}>回帖数量({data.reply_count})</Text>
                    </View>
                    <FlatList
                            horizontal={false}
                            data={this.state.dataSource}
                            renderItem={this.renderForumRow.bind(this)}
                            keyExtractor={this._keyExtractor}
                            onEndReached={this._renderNext.bind(this)}
                            onEndReachedThreshold={3}
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
                    
                    </ScrollView>
                    {this.state.commentshow?(
                        <View style={{position:'absolute',flexDirection:'row',backgroundColor:'#ffffff',bottom: 0,alignItems:'center',justifyContent:'center',right: 0,height:50,width:width,borderTopWidth:0.5,borderTopColor:'#aaaaaa'}}>
                            <TextInput
                                style={{width:width*0.8,height: 40, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,marginRight:10,}}
                                onChangeText={(content) => this.setState({content})}
                                value={this.state.content}
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholder='输入评论内容'
                                placeholderTextColor='#aaaaaa'
                            />
                            <Text onPress={this.Comment.bind(this)} style={{width:width*0.1,height:30,backgroundColor:'#ff6b94',color:'#ffffff',textAlign:'center',paddingTop:5,borderRadius:5,}}>提交</Text>
                        </View>
                        ):(null)}
                    {this.state.Maincommentshow?(
                        <View style={{position:'absolute',flexDirection:'row',backgroundColor:'#ffffff',bottom: 0,alignItems:'center',justifyContent:'center',right: 0,height:50,width:width,borderTopWidth:0.5,borderTopColor:'#aaaaaa'}}>
                            <TextInput
                                style={{width:width*0.8,height: 40, borderColor: '#f1f1f1', borderWidth: 1,padding:0,paddingLeft:20,marginRight:10,}}
                                onChangeText={(content) => this.setState({content})}
                                value={this.state.content}
                                multiline={true}
                                underlineColorAndroid="transparent"
                                placeholder='输入评论内容'
                                placeholderTextColor='#aaaaaa'
                            />
                            <Text onPress={this.Comment_Main.bind(this)} style={{width:width*0.1,height:30,backgroundColor:'#ff6b94',color:'#ffffff',textAlign:'center',paddingTop:5,borderRadius:5,}}>提交</Text>
                        </View>
                        ):(null)}
                </View>
            )
        }
    }
}
