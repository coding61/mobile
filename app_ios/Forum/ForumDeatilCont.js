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
import face from './Content_Rex';
var {height, width} = Dimensions.get('window');

export default class ForumDeatilCont extends Component{
    constructor(props) {
        super(props);
        this.state = {
            
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
    render() {
        var Content=this.content(this.props.data);
        return(
            <View style={{padding:20}}>{Content}</View>
        )
    }
}
