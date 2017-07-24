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
}from 'react-native'
var {height, width} = Dimensions.get('window');
export default class ForumDetail extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.navigation.state.params.data,
        }; 
    }
    static navigationOptions = {
        title: '帖子详情',
        
    };
    componentWillMount(){   
        
    }

    componentDidMount(){
        this._loadforumdata()
    }
    
   _loadforumdata() {
    
    }
    dealContent(){
        
    }
    render(){
        var data=this.state.data;
        var time = data.create_time.slice(0, 19).replace('T', ' ');
        var content=this.state.data.content;
        var imgsource=[];
        var pp=/\[[^\]]+\]/g;
        
        if (content.match(/<[a-zA-Z]+>/g)) { 

        }else{
            content.match(pp)
            content = content.replace(/\r/g,'\n');
            content = content.replace(/\n/g,'\n');
            content = content.replace(/img/,'');
            img = content.replace(/\[/g,'').replace(/\]/g,'');
            imgsource.push(img)
        }
            this.state.data.content=content;
            return (
                <View style={styles.container}>
                    <ScrollView>
                        <View>
                            <Text style={{fontSize:18,padding:10,color:'#303030'}}>{data.title}</Text>
                            <View style={{flexDirection:'row',alignItems:'center',paddingLeft:20,backgroundColor:'#F2F2F2',paddingBottom:10,}}>
                                <View style={{alignItems:'center'}}>
                                    <Image style={{width:40,height:40,marginTop:20,borderRadius:20,}} source={{uri:data.userinfo.avatar}}/>
                                    <Text style={{paddingTop:10}}>{data.userinfo.grade.current_name}</Text>
                                </View>
                                <View style={{paddingLeft:20,paddingRight:10,paddingTop:10,}}>
                                    <View style={{paddingBottom:10,}}>
                                        <Text style={{color:'#4f99cf',fontSize:14,paddingBottom:10}}>{data.userinfo.name}</Text>
                                        <Text>{time}</Text>
                                    </View>
                                    <View style={{alignItems:'center',flexDirection:'row',}}>
                                        <Text style={{color:'#FF7200',marginRight:40,}}>{data.types.name}</Text>
                                        <Image style={{width:19,height:13,marginRight:10,}} source={require('../assets/Forum/see.png')}/>
                                        <Text style={{fontSize:12,marginRight:20}}>{data.browse_count}</Text>
                                        <Image style={{width:18,height:16,marginRight:10,}} source={require('../assets/Forum/reply.png')}/>
                                        <Text style={{fontSize:12,}}>{data.reply_count}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={{padding:10}}>{content}</Text>
                        </View>

                    </ScrollView>
                    
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

