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

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';
import BCFlatListView from '../Component/BCFlatListView.js';

export default class ForumClass extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
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
    }
    // -----------------------------------网络请求
    _fetchSections(pagenum, dataSource, callback){
        var type = "get",
            url = Http.forumSections(pagenum),
            token = null,
            data = null;
        BCFetchRequest.fetchData(type, url, token, data, (response) => {
            console.log(response.results);
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
    // -----------------------------------点击事件
    _sectionClickEvent(data){
        this.props.navigation.state.params.callback(data);
        this.props.navigation.goBack();
    }
    // -----------------------------------UI
    _renderItemSection(item){
        var rowData=item;
        return (
            <TouchableOpacity onPress={this._sectionClickEvent.bind(this,rowData)}
                style={{width: width,flex:1, height:40,paddingBottom:10,backgroundColor: 'white',borderBottomColor:'#cccccc',borderBottomWidth:1,paddingLeft:10,paddingRight:10,}}>
                <Text style={{paddingTop:10,fontSize:12,color:'#aaaaaa'}}>{rowData.name}</Text>
            </TouchableOpacity>
        )
    }
    render(){
        return (
            <View style={{flex:1}}>
                <BCFlatListView 
                    fetchData={this._fetchSections.bind(this)} 
                    renderItem={this._renderItemSection.bind(this)} />
            </View>
        )
    }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  }
});
