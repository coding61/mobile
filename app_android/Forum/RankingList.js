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
var {height, width} = Dimensions.get('window');

export default class RankingList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:this.props.navigation.state.params.token,
            url:'https://www.cxy61.com/program_girl/userinfo/userinfo/diamond/ranking/',
            dataSource: '',
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
        this.loadData()
    }
    loadData(){
        fetch(this.state.url,{headers: {Authorization: 'Token ' + this.state.token}})
            .then((response) =>response.json())
            .then((responseData) => {
                
                this.setState({
                    dataSource: responseData.results,
                });
            })
            .catch((error) => {
                console.error(error);

            });
    }
    renderRank(item){
        let id=item.index+1;
        let rowData=item.item;
            return(
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#ffffff',width:width,padding:10,borderBottomColor:'#cccccc',borderBottomWidth:0.5,}}>
                    {id<4?(<Text style={{fontSize:14,paddingLeft:20,paddingRight:20,color:'red'}}>{id}</Text>):(<Text style={{fontSize:14,paddingLeft:20,paddingRight:20,}}>{id}</Text>)}
                    {!rowData.avatar?(<Image style={{width:40,height:40,borderRadius:20,}} source={require('../assets/Forum/defaultHeader.png')}/>):(<Image style={{width:40,height:40,borderRadius:20,}} source={{uri:rowData.avatar}}/>)}
                    
                    <Text style={{paddingLeft:20,width:width*0.4,}}>{rowData.name}</Text>
                    <View style={{marginLeft:20,}}>
                        <Text style={{fontSize:14,}}>{rowData.grade.current_name} / {rowData.experience}</Text>
                    </View>
                </View>
            )
       
    }
    _keyExtractor = (item, index) => index;
    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    horizontal={false}
                    contentContainerStyle={{width:width,}}
                    data={this.state.dataSource}
                    renderItem={this.renderRank.bind(this)}
                    keyExtractor={this._keyExtractor}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReachedThreshold={3}
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
