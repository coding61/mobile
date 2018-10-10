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
    FlatList,
}from 'react-native';

import Http from '../utils/Http.js';
import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import BCFlatListView from '../Component/BCFlatListView.js';

export default class RankingList extends Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    static navigationOptions = ({ navigation }) => {
        const {state, setParams} = navigation;
        return {
            title: '排行榜',
            headerTintColor: "#fff",   
            headerStyle: { backgroundColor: '#ff6b94',},
            headerTitleStyle:{alignSelf:'auto',fontSize:15,paddingLeft:width*0.25},
            
        };
    }

    componentDidMount() {
    }
    // -----------------------------------网络请求
    // 获取排行榜列表
    _fetchRankList(pagenum, dataSource, callback){
        Utils.isLogin((token)=>{
            if (token) {
                var type = "get",
                    url = Http.forumRankList(pagenum),
                    token = token,
                    data = null;
                BCFetchRequest.fetchData(type, url, token, data, (response) => {
                    console.log("排行榜",response.results);
                    var tag = null
                    if (response.next == null) {
                        //如果 next 字段为 null, 则数据已加载完毕
                        tag = 0
                    }else{
                        // 还有数据，可以加载
                        tag = 1
                    }
                    var array = [];
                    if (pagenum > 1) {
                        array = dataSource.concat(response.results);
                    }else{
                        array = response.results;
                    }
                    callback(array, tag, false);

                }, (err) => {
                    callback(null, null, true);
                    console.log(2);
                });
            }
        }) 
    }
    renderRank(item, index){
        let id=index+1;
        let rowData=item;
            return(
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',width:width,padding:10,borderBottomColor:'#cccccc',borderBottomWidth:0.5,}}>
                    {id<4?(<Text style={{fontSize:14,paddingLeft:20,paddingRight:20,color:'red'}}>{id}</Text>):(<Text style={{fontSize:14,paddingLeft:20,paddingRight:20,color:'#201f1f'}}>{id}</Text>)}
                    {!rowData.avatar?(<Image style={{width:40,height:40,borderRadius:20,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:40,height:40,borderRadius:20,}} source={{uri:rowData.avatar}}/>)}
                    
                    <Text style={{paddingLeft:20,width:width*0.4,color:'#201f1f'}}>{rowData.name}</Text>
                    <View style={{marginLeft:20,}}>
                        <Text style={{fontSize:14,color:'#201f1f'}}>{rowData.grade.current_name} / {rowData.experience}</Text>
                    </View>
                </View>
            )
       
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <BCFlatListView 
                    fetchData={this._fetchRankList.bind(this)} 
                    renderItem={this.renderRank.bind(this)} 
                />
            </View>
        )
    }
}
var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },


});
