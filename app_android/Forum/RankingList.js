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

}from 'react-native';
var {height, width} = Dimensions.get('window');


export default class RankingList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token:this.props.navigation.state.params.token,
            url:'https://www.cxy61.com/program_girl/userinfo/userinfo/diamond/ranking/',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows([]),
        }
    }
    static navigationOptions = {
        title: '排行榜',
    }

    componentDidMount() {
        this.loadData()
    }
    loadData(){
        fetch(this.state.url,{headers: {Authorization: 'Token ' + this.state.token}})
            .then((response) =>response.json())
            .then((responseData) => {
                console.log(responseData)
                this.setState({
                    dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}).cloneWithRows(responseData.results),
                });
            })
            .catch((error) => {
                console.error(error);

            });
    }
    renderRank(rowData, sectionID, rowID, highlightRow){
        if(rowID%2==0){
            return(
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:'#f2f2f2',width:width,padding:10,}}>
                    <View style={{justifyContent:'center',alignItems:'center'}}>
                        <Text style={{justifyContent:'center',alignItems:'center',width:20,height:20,borderRadius:10,textAlign:'center',backgroundColor:'#FF69B4',fontSize:14,}}>{rowID}</Text>
                    </View>
                    <Image style={{width:40,height:40,borderRadius:20,}} source={{uri:rowData.avatar}}/>
                    <Text style={{paddingLeft:20,}}>{rowData.name}</Text>
                    <View style={{marginLeft:20,}}>
                        <Text style={{fontSize:14,}}>{rowData.grade.current_name} / {rowData.experience}</Text>
                    </View>
                </View>
            )
        }else {
            return(
                <View style={{flexDirection:'row',backgroundColor:'#f3f3f3'}}>
                    <Text>{rowID}.</Text>
                    <Text>{rowData.name}</Text>
                    <Text>{rowData.grade.current_name}</Text>
                </View>
            )
        }
    }
    render() {
        return (
            <View style={{flex: 1}}>
                <ListView
                    horizontal={false}
                    contentContainerStyle={{width:width,}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRank.bind(this)}
                    automaticallyAdjustContentInsets={false}
                    enableEmptySections={true}
                    onEndReachedThreshold={3}
                >
                </ListView>
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
