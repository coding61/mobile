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
  Modal,
  ActivityIndicator,
}from 'react-native';
import face from './Content_Rex';
var {height, width} = Dimensions.get('window');
import ImageViewer from 'react-native-image-zoom-viewer';
export default class ForumDeatilCont extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            imgurl:new Array(),
            imgindex:'',
        }
    }
    componentDidMount() {
        
    }
    escape(html){
        return String(html||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    }
    content(content){
        //支持的html标签
        var html = function(end){
            return new RegExp('\\['+ (end||'') +'(pre|div|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)\\]\\n*', 'g');
        };
        content = this.escape(content||'') //XSS
            .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
                return (<Image source={{uri:img.replace(/(^img\[)|(\]$)/g, '')}} style={{width:300,height:200}}/>);
            })
            .replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;" class="fly-aite">$1</a>$2') //转义@
            .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
                var alt = face.replace(/^face/g, '');
                if(typeof(face[alt]) == "undefined"){
                    return face;
                }else{
                    return (<Image  source={{uri: face[alt]}}/>);  
                }
            })
            .replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
                var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
                var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
                if(!href) return str;
                var rel =  /^(http(s)*:\/\/)\b(?!(\w+\.)*(sentsin.com|layui.com))\b/.test(href.replace(/\s/g, ''));
                    return '<a href="'+ href +'" target="_blank"'+ (rel ? ' rel="nofollow"' : '') +'>'+ (text||href) +'</a>';
            })
            .replace(html(), '\<$1\>').replace(html('/'), '\</$1\>') //转移代码
            .replace(/\n/g, '<br>') //转义换行   
        return content;
    }
    LoadImg(index){
        this.setState({
            modalVisible:true,
            imgindex:index,
        })
    }
    _setModalVisible(){
        this.setState({modalVisible:!this.state.modalVisible})
    }
    ContentRex(content){
        text=content.replace(/img\[([^\s]+?)\]/g,'')
        var output=[];
        var contenttext= this.escape(content||'').replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
            var image=img.replace(/(^img\[)|(\]$)/g, '')
            output.push({url:image});
        })
        
        return(
            <View style={{paddingLeft:15,paddingTop:10,paddingRight:15,paddingBottom:10,}}>
                <Text selectable={true} style={{lineHeight:20,color:'#3f3f3f'}}>{text}</Text>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                    {output.map((result,index)=> {
                        return(
                            <TouchableOpacity key={index} onPress={this.LoadImg.bind(this,index)} style={{margin:10,}}>
                                <Image style={{width:80,height:80,}} source={{uri:result.url}}/>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <Modal visible={this.state.modalVisible} transparent={true} onRequestClose={()=>{this.setState({modalVisible:false})}}>
                    <ImageViewer 
                        imageUrls={output} 
                        onClick={this._setModalVisible.bind(this)} 
                        index={this.state.imgindex} 
                        onChange={(index)=>{this.setState({imgindex:index})}}
                        failImageSource={{uri:'../assets/Forum/defaultHeader.png'}}
                        saveToLocalByLongPress={false}
                        loadingRender={()=>{return(<ActivityIndicator size='small' color="white" style={{alignItems:'center',justifyContent:'center',}}/>)}}
                        />
                </Modal>
            </View>
            )
    }

    render() {
        return(
            <View>
                {this.ContentRex(this.props.data)}
            </View>
        )
    }
}
