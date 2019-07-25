/**
 * @author: chenwei
 * @description: 分组列表视图
 * @time: 2017-07-18
 */
 /**
  *  item          (必填)习题json
  *  typeView      (可选) exercise 默认，mistake                           
  *  yourAnswerArr (可选)[1,2,3] (错题时) , mistake                                  头部组件(可选)
  *  callback      (可选) 答题时，exercise
  */

'use strict';

import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SectionList,
  NativeModules,
  DeviceEventEmitter,
  TouchableHighlight,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';
import SortableListView from 'react-native-sortable-listview'
import ImageViewer from 'react-native-image-zoom-viewer';

import Utils from '../utils/Utils.js';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Http from '../utils/Http.js';
import QuestionHelp from '../utils/QuestionHelp.js';

import LoadingView from '../Component/LoadingView.js';
import EmptyView from '../Component/EmptyView.js';

class SequenceProblemSortView extends Component{
    sortView(row){
        var that = this;
        var ui = (
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:18, lineHeight:25, color:'#41403E'}}>{row.content}.{row.message}</Text>
                    {
                        row.imgs && row.imgs.length?
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        {
                            row.imgs.map((ite, id)=>{
                                return (
                                    <TouchableOpacity key={id} onPress={that.props.openBigViewer.bind(that, ite)} activeOpacity={1} style={{width:125, height:85}} >
                                        <Image style={{width:120,height:80, marginRight:5, marginTop:5}} source={{uri:ite}} resizeMode={'cover'} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </View>:null
                    }
                    {/*
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                        {
                            [1,2,3].map((ite, id)=>{
                                return (
                                    <TouchableOpacity key={id} onPress={that.props.openBigViewer.bind(that, 'https://static1.bcjiaoyu.com/ChenPic.png')} activeOpacity={1} style={{width:125, height:85}} >
                                        <Image style={{width:120,height:80, marginRight:5, marginTop:5}} source={{uri:'https://static1.bcjiaoyu.com/ChenPic.png'}} resizeMode={'cover'} />
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </View>
                    */}
                </View>
                <Image style={{width:30,height:30}} source={require("../assets/images/move.png")} resizeMode={'contain'}/>
            </View>    
        )
        return (
            that.props.typeView === "exercise"?
                <TouchableHighlight underlayColor={'#eee'} style={{padding: 10, backgroundColor: "#F8F8F8", borderBottomWidth:1, borderBottomColor: '#eee', minHeight:40}} {...this.props.sortHandlers}>  
                    {ui}
                </TouchableHighlight>
            :
                <View style={{padding: 10, backgroundColor: "#F8F8F8", borderBottomWidth:1, borderBottomColor: '#eee', minHeight:40}}>
                    {ui}
                </View>
        )
    }
   
    render(){
        var data = this.props.data;
        return(
            <SortableListView 
                style={{flex:1}}
                data={data}
                onRowMoved={e => {
                    data.splice(e.to, 0, data.splice(e.from, 1)[0]);
                    this.forceUpdate();
                    // alert(JSON.stringify(data));

                    if (this.props.callback) {
                        this.props.callback(data);
                    }
                }}
                renderRow={row => this.sortView(row)}
                onMoveEnd={e => {
                }}
            />
        )
    }
}
class QuestionView extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
	  	item:this.props.item,             //习题 json
        myAnswerArr:[],        //我的答案
        yourAnswerArr:this.props.yourAnswerArr,    //你的答案

        bigImgUrl:'',
        showBigImgView:false,
	  };
	}
	static defaultProps = {
        typeView: "exercise",   //习题展示，mistake, exercise
        yourAnswerArr:[],
    };
    static propTypes = {
        typeView: PropTypes.oneOf(['exercise', 'mistake']).isRequired, //类型
        item:PropTypes.object.isRequired,
        yourAnswerArr:PropTypes.array
    }
    componentWillMount() {
        var that = this;
        var dic1 = { "type": "adaptProblem", "answer": "C", "tag": "1", "exercises": true, "message": "scratch中能够保证角色反弹时不会头朝下的模块是：scratch中能够保证角色反弹时不会头朝下的模块是：", "imgs": [], "options": [{ "message": "scratch中能够保证角色反弹时不会头朝下的模块是", "imgs": ["https://static1.bcjiaoyu.com/%E5%9B%BE%E7%89%87%201.png"], "content": "A" }, { "message": "分解爱福家SD卡接发的撒卡京东方科技", "imgs": ["https://static1.bcjiaoyu.com/%E5%9B%BE%E7%89%87%202.png"], "content": "B" }, { "message": "", "imgs": ["https://static1.bcjiaoyu.com/%E5%9B%BE%E7%89%87%203.png"], "content": "C" }], "action": [{ "type": "text", "content": "A" }, { "type": "text", "content": "B" }, { "type": "text", "content": "C" }], "wrong": [{ "message": "答错了", "action": "下一条" }], "correct": [{ "message": "答对了", "action": "下一条" }] }
        // var dic = { "direction_list": ["AP", "NOIP", "USACO", "IGCSE", "浙江省信息学考生", "android", "IOS开发"], "type": "adaptProblem", "answer": "A,B", "tag": "1", "exercises": true, "message": "学习编程后的目标是什么？（可多选）", "imgs": [], "options": [{ "message": "参加信息学奥赛（NOIP）", "direction": "NOIP", "imgs": [], "content": "A" }, { "message": "参加AP考试", "direction": "AP", "imgs": [], "content": "B" }, { "message": "参加IGCSE", "direction": "IGCSE", "imgs": [], "content": "C" }, { "message": "参加USACO竞赛", "direction": "USACO", "imgs": [], "content": "D" }, { "message": "浙江省信息学考生", "direction": "浙江省信息学考生", "imgs": [], "content": "E" }], "action": [{ "type": "text", "content": "A" }, { "type": "text", "content": "B" }, { "type": "text", "content": "C" }, { "type": "text", "content": "D" }, { "type": "text", "content": "E" }], "wrong": [{ "message": "答错了", "action": "下一条" }], "correct": [{ "message": "答对了", "action": "下一条" }] }
        var dic2 = {"tag":"1","type":"blankProblem","message":"循环一个名为a的列表：","detailMessage":["","","","",""],"options":[{"message":"for"},{"message":"in"},{"message":"a"},{"message":"i"},{"message":":"}],"action":[{"type":"text","content":"for"},{"type":"text","content":"in"},{"type":"text","content":"a"},{"type":"text","content":"i"},{"type":"text","content":":"}],"answer":["for","i","in","a",":"],"exercises":true,"wrong":[{"message":"答错了","action":"下一条"}],"correct":[{"message":"答对了","action":"下一条"}]}
        var dic3 = {
            "type": "sequenceProblem",
            "answer": [
                "1",
                "2",
                "3"
            ],
            "tag": "1",
            "exercises": true,
            "message": "把大象放进冰箱的顺序？",
            "imgs": [],
            "options": [
                {
                    "message": "打开冰箱门",
                    "imgs": [],
                    "content": "1"
                },
                {
                    "message": "大象放进去",
                    "imgs": [],
                    "content": "2"
                },
                {
                    "message": "关闭冰箱门",
                    "imgs": [],
                    "content": "3"
                }
            ],
            "action": [
                {
                    "type": "text",
                    "content": "1"
                },
                {
                    "type": "text",
                    "content": "2"
                },
                {
                    "type": "text",
                    "content": "3"
                }
            ],
            "wrong": [
                {
                    "message": "答错了",
                    "action": "下一条"
                }
            ],
            "correct": [
                {
                    "message": "答对了",
                    "action": "下一条"
                }
            ]
        }
        var dic4 = {
            "tag": "1",
            "type": "blankProblem",
            "message": "请翻译我是一个男孩",
            "detailMessage": [
                "I",
                "",
                "a",
                ""
            ],
            "options": [
                {
                    "message": "am"
                },
                {
                    "message": "boy"
                },
                {
                    "message": "i"
                }
            ],
            "action": [
                {
                    "type": "text",
                    "content": "am"
                },
                {
                    "type": "text",
                    "content": "boy"
                },
                {
                    "type": "text",
                    "content": "i"
                }
            ],
            "answer": [
                "am",
                "boy"
            ],
            "exercises": true,
            "wrong": [
                {
                    "message": "答错了",
                    "action": "下一条"
                }
            ],
            "correct": [
                {
                    "message": "答对了",
                    "action": "下一条"
                }
            ]
        }

        var dic = dic3;
        dic = this.state.item;
        that.adjustExerciseJson(dic, this.state.yourAnswerArr);        
    }
    // -------------------------------图片放大
    openBigViewer(url){
        this.setState({
            showBigImgView:true,
            bigImgUrl:url
        })
    }
    // 大图点击事件
    _clickBigImg = ()=>{
         this.setState({
            showBigImgView:false
         })
    }
    // 图片放大
    _renderScaleBigImage(){
        var  images = []
        images.push({url:this.state.bigImgUrl})
        return (
            <Modal visible={this.state.showBigImgView} transparent={true} onRequestClose={this._clickBigImg}>
                <ImageViewer imageUrls={images} onClick={this._clickBigImg} saveToLocalByLongPress={false} loadingRender={this._renderLoadingBigImage} failImageSource={require('../images/fail2.jpg')}/>
            </Modal>
        )
    }
    _renderLoadingBigImage=()=>{

        var imgW = width;
        var imgH = 200;
        Utils.getImgWH(this.state.bigImgUrl, (wid, hei)=>{
            if (wid && hei){
                wid = parseInt(wid)
                hei = parseInt(hei)
                imgW = wid < width? wid:width
                imgH = imgW*hei/wid
            }
        })
        return (
            <View style={{width:imgW, height:imgH, backgroundColor:'#F5FCFF', alignItems:'center', justifyContent:'center'}}>
                <Image
                  style={{width:100, height:100}}
                  source={require('../images/fail1.png')}
                />
            </View>
        )
    }
    // ----------------------习题
    adjustExerciseJson(item, yourAnswerArr){
        var that = this;
        var dic = item;
        var myAnswers = [];
        // 填空题，对我的答案进行处理
        if (dic.type == "blankProblem") {
            var detailMsg = dic.detailMessage;
            for (var i = 0; i < detailMsg.length; i++) {
                var tempDic = { "content": detailMsg[i], "index": -1 };
                if (detailMsg[i]) {
                    tempDic["type"] = "exist"
                } else {
                    tempDic["type"] = "blank"
                }
                myAnswers.push(tempDic)
            }
            // 判断最初是否有答案
            if (yourAnswerArr && yourAnswerArr.length){
                var tempYourAnswer = [];   //[{"content":"A", "index":0}]
				for (var i = 0; i < yourAnswerArr.length; i++) {
					for (var j = 0; j < dic.action.length; j++) {
						if (dic.action[j].content == yourAnswerArr[i]) {
							tempYourAnswer.push({ "content": yourAnswerArr[i], "index": j });
							break;
						}
					}
				}
				var j = 0;
				for (var i = 0; i < myAnswers.length; i++) {
					if (myAnswers[i].type === "blank") {
						myAnswers[i]["content"] = tempYourAnswer[j]["content"];
						myAnswers[i]["index"] = tempYourAnswer[j]["index"];
						j++;
					}
                }
            }
        } else if (dic.type === "sequenceProblem") {
            // 顺序题，对我的答案进行处理
            var options = dic.options;
            for (var i = 0; i < options.length; i++) {
                options[i]["id"] = i + 1;
                myAnswers.push(options[i]);
            }

            // 判断最初是否有答案
            if (yourAnswerArr && yourAnswerArr.length){
                console.log("yourAnswerArr:", yourAnswerArr);
                var index = 0;
                var array = [];
                for (var i = 0; i < yourAnswerArr.length; i++) {
                    for(var j=0; j<myAnswers.length; j++){
                        if (yourAnswerArr[i] === myAnswers[j].content) {
                            array.push(myAnswers[j]);
                            break;
                        }
                    }
                }
                myAnswers = array;
            }
        }else{
            // 选择题,对我的答案进行处理
            if (yourAnswerArr && yourAnswerArr.length) {
              myAnswers = yourAnswerArr;
            }
        }
        that.setState({
          item: dic,
          myAnswerArr: myAnswers
        })
    }
    componentWillUnmount() {
    }
    componentWillReceiveProps(nextProps) {
        console.log("属性更改:", nextProps);
    }
    
    // 选择题选项点击事件
    optionChoiceClickEvent(choiceType, content){
        var that = this;
        if (that.props.typeView === "mistake") {
            // 点击事件不处理
            return;
        }
        console.log("选项:", content);
        if (choiceType === "single") {
            // 单选
            var myAnswers = []
            myAnswers.push(content);
        }else{
            var myAnswers = that.state.myAnswerArr
            if(myAnswers.indexOf(content) > -1){
              myAnswers.splice(myAnswers.indexOf(content), 1);
            }else{
              myAnswers.push(content);
            }
        }
        // 选择题对用户选的答案排序
        myAnswers = myAnswers.sort();
        that.setState({
          myAnswerArr:myAnswers
        })
        console.log(myAnswers);

        if (this.props.callback) {
            this.props.callback(myAnswers);
        }
    }
    // 填空题 option 点击事件
    bpOptionClickEvent(index, content, id, item){
        // index:option 的 index 键, id:options 中的下标
        var that = this;
        if (that.props.typeView === "exercise") {
            var myAnswers = that.state.myAnswerArr;
            console.log(index, content, id);
            // type:mistake,没有点击事件
            if (index === -1) {
                // 已知选块，或还未选择的空选项
                return
            }
            myAnswers[id]["content"] = "";
            that.setState({
                myAnswerArr:myAnswers
            }, ()=>{
                console.log("新 answers:", myAnswers);

                if (this.props.callback) {
                    this.props.callback(myAnswers);
                }
            })
        }
    }
    // 填空题 action 点击事件
    bpactionClickEvent(index, content){
        // index:actions 中的下标
        var that = this;
        if (that.props.typeView === "exercise") {
            // typeView:mistake，没有点击事件
            var myAnswers = that.state.myAnswerArr;
            for (var i = 0; i < myAnswers.length; i++) {
                var item = myAnswers[i];
                if (item.type === "blank") {
                    // 需要用户填的空，未知选块
                    if (!item.content) {
                        // 如果空格为空，即还没有填入内容
                        // 将点击的内容放进去，同时把点击内容的下标放进去，以便后续复原
                        console.log("改变我的选择");
                        item["content"] = content;
                        item["index"] = index;
                        break
                    }
                }
            }
            that.setState({
                myAnswerArr:myAnswers
            })

            if (this.props.callback) {
                this.props.callback(myAnswers);
            }
        }
    }
    renderChoiceProblemView(item, myAnswer){
        var that = this;
        return (
            <View style={styles.choiceProblemView}>
                <ScrollView style={{flex:1, padding:0}}>
                    <View style={styles.choiceQuestionView}>
                        {
                            item.message?<Text style={styles.choiceQuestionViewTitle}>{item.message}</Text>:null
                        }
                        {
                            item.imgs && item.imgs.length?
                            <View style={styles.choiceQuestionViewImgs}>
                            {
                                item.imgs.map((it, i)=>{
                                    return (
                                        <TouchableOpacity key={i} onPress={that.openBigViewer.bind(that, it)} activeOpacity={1} style={{width:125,height:85}}>
                                            <Image style={styles.choiceQuestionViewImg} source={{uri:it}} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </View>:null
                        } 
                        {/*
                            <View style={styles.choiceQuestionViewImgs}>
                            {
                                [1,2,3].map((it, i)=>{
                                    return (
                                        <TouchableOpacity key={i} onPress={that.openBigViewer.bind(that, 'https://static1.bcjiaoyu.com/ChenPic.png')} activeOpacity={1} style={{width:125,height:85}}>
                                            <Image style={styles.choiceQuestionViewImg} source={{uri:'https://static1.bcjiaoyu.com/ChenPic.png'}} resizeMode={'cover'} />
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            </View>
                        */}
                    </View>
                    
                    <View style={styles.choiceOptions}>
                        {
                            item.options.map((it, i)=>{
                                return (
                                    <TouchableOpacity style={[styles.choiceOption, QuestionHelp.choiceHasItemInAnswer(it.content, myAnswer)?styles.choiceOptionSelect:styles.choiceOptionUnselect]} key={i} onPress={that.optionChoiceClickEvent.bind(that, item.choiceType, it.content)} activeOpacity={1}>
                                        {/*
                                            that.props.typeView === "exercise"?
                                            <View style={styles.choiceOptionRadioView}>
                                                <Image style={styles.choiceOptionRadioImg} source={QuestionHelp.choiceHasItemInAnswer(it.content, myAnswer)?require("../assets/images/select.png"):require("../assets/images/noselect.png")} resizeMode={'contain'}/>
                                            </View>:null
                                        */}
                                        
                                        <Text style={[styles.choiceOptionLetter, QuestionHelp.choiceHasItemInAnswer(it.content, myAnswer)?{color:'white'}:{color:'#41403E'}]}>
                                          {it.content}.
                                        </Text>
                                        <View style={styles.choiceOptionView}>
                                            {
                                                it.message?<Text style={[styles.choiceOptionViewTitle, QuestionHelp.choiceHasItemInAnswer(it.content, myAnswer)?{color:'white'}:{color:'#41403E'}]}>{it.message}{""}</Text>:null
                                            }
                                            {
                                                it.imgs && it.imgs.length?
                                                <View style={styles.choiceOptionViewImgs}>
                                                {
                                                    it.imgs.map((ite, id)=>{
                                                        return (
                                                            <TouchableOpacity key={id} onPress={that.openBigViewer.bind(that, ite)} activeOpacity={1} style={{width:125, height:85}} >
                                                                <Image style={styles.choiceOptionViewImg} source={{uri:ite}} resizeMode={'cover'} />
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                                </View>:null
                                            }
                                            {/*
                                                <View style={styles.choiceOptionViewImgs}>
                                                {
                                                    [1,2,3].map((ite, id)=>{
                                                        return (
                                                            <TouchableOpacity key={id} onPress={that.openBigViewer.bind(that, 'https://static1.bcjiaoyu.com/ChenPic.png')} activeOpacity={1} style={{width:125, height:85}} >
                                                                <Image style={styles.choiceOptionViewImg} source={{uri:'https://static1.bcjiaoyu.com/ChenPic.png'}} resizeMode={'cover'} />
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                                </View>
                                            */}
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </ScrollView>
                
                {
                    that.props.typeView === "mistake"?
                    <View style={styles.answerView}>
                        <View style={styles.correctAnswerView}>
                            <Text>正确答案</Text>
                            <Text style={styles.correctAnswerText}>{item.answer}</Text>
                        </View>
                        <View style={styles.myAnswerView}>
                            <Text>你的答案</Text>
                            <Text style={styles.myAnswerText}>{QuestionHelp.choiceMyAnswerToString(myAnswer)}</Text>
                        </View>
                        <View style={[styles.resultType, item.answer === QuestionHelp.choiceMyAnswerToString(myAnswer)?styles.resultTypeBlue:styles.resultTypeRed]}>
                            <Text style={item.answer === QuestionHelp.choiceMyAnswerToString(myAnswer)?styles.resultTypeBlueText:styles.resultTypeRedText}>{item.answer === QuestionHelp.choiceMyAnswerToString(myAnswer)?"正确":"错误"}</Text>
                        </View>
                    </View>:null
                }
                
            </View>
        )
    }
    renderBlankProblemView(item, myAnswer){
        // console.log(myAnswer);
        if (this.props.typeView === "mistake") {
            console.log("展示结果:", QuestionHelp.arrayToString(item.answer) === QuestionHelp.sequenceMyAnswerToString(myAnswer)?"正确":"错误");
            console.log(QuestionHelp.arrayToString(item.answer));
            console.log(QuestionHelp.blankMyAnswerToString(myAnswer));
        }
        var that = this;
        return (
            <View style={styles.blankProblemView}>
                <ScrollView style={{flex:1}} contentContainerStyle={{}}>
                    <View style={styles.blankQuestionView}>
                        <Text style={styles.blankQuestionViewTitle}>{item.message}</Text>
                    </View>
                    <View style={styles.blankQuestionOptions}>
                        {
                            myAnswer.map((ite, idx)=>{
                                return(
                                    <TouchableOpacity key={idx} onPress={that.bpOptionClickEvent.bind(that, ite.index, ite.content, idx, item)} activeOpacity={1}>
                                        <View style={[styles.blankQuestionOption, ite.type==="blank"?!ite.content?styles.blankQuestionOptionBlank:styles.blankQuestionOptionExist:null]}>
                                            <Text style={[styles.blankQuestionOptionTitle, ite.type==="blank"?{color:'white'}:null]}>{ite.content}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        
                        {/*
                        <View style={[styles.blankQuestionOption, styles.blankQuestionOptionBlank]}>
                            <Text style={[styles.blankQuestionOptionTitle]}></Text>
                        </View>
                        */}
                    </View>
                    <View style={[styles.blankQuestionActions, {justifyContent:'center'}]}>
                        {
                            QuestionHelp.blankQuestionAction(item.action, myAnswer).map((ite, idx)=>{
                                return (
                                    <TouchableOpacity key={idx} onPress={that.bpactionClickEvent.bind(that, idx, ite.content)}>
                                        <View style={[styles.blankQuestionAction, !ite.content?styles.blankQuestionActionUnselect:styles.blankQuestionActionSelect]}>
                                            <Text style={styles.blankQuestionActionTitle}>{ite.content}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                        {/*
                        <View style={[styles.blankQuestionAction, styles.blankQuestionActionSelect]}>
                            <Text style={styles.blankQuestionActionTitle}>{"a"}</Text>
                        </View>
                        */}
                    </View>
                </ScrollView>
                
                {
                    that.props.typeView === "mistake"?
                    <View style={styles.answerView}>
                        <View style={styles.correctAnswerView}>
                            <Text>正确答案</Text>
                            <Text style={styles.correctAnswerText}>{QuestionHelp.arrayToString(item.answer)}</Text>
                        </View>
                        <View style={styles.myAnswerView}>
                            <Text>你的答案</Text>
                            <Text style={styles.myAnswerText}>{QuestionHelp.blankMyAnswerToString(myAnswer)}</Text>
                        </View>
                        <View style={[styles.resultType, QuestionHelp.arrayToString(item.answer) === QuestionHelp.blankMyAnswerToString(myAnswer)?styles.resultTypeBlue:styles.resultTypeRed]}>
                            <Text style={QuestionHelp.arrayToString(item.answer) === QuestionHelp.blankMyAnswerToString(myAnswer)?styles.resultTypeBlueText:styles.resultTypeRedText}>{QuestionHelp.arrayToString(item.answer) === QuestionHelp.blankMyAnswerToString(myAnswer)?"正确":"错误"}</Text>
                        </View>
                    </View> :null
                }
            </View>
        )
    }
    renderSequenceProblemView(item, myAnswer){
        var that = this;
        var data = myAnswer;
        if (this.props.typeView === "mistake") {
            console.log("展示结果:",item.answer, myAnswer);
        }
        return (
            <View style={styles.sequenceProblemView}>
                <View style={{flex:1}}>
                    <View style={styles.sequenceQuestionView}>
                        <Text style={styles.sequenceQuestionViewTitle}>{item.message}</Text>
                        <View style={styles.sequenceQuestionViewImgs}>
                            {
                                item.imgs.map((ite, idx)=>{
                                    return (
                                        <TouchableOpacity key={idx} onPress={that.openBigViewer.bind(that, ite)} activeOpacity={1} style={{width:125,height:85}}>
                                            <Image style={styles.sequenceQuestionViewImg} source={{uri:ite}} resizeMode={'cover'}/>
                                        </TouchableOpacity>
                                    )                                
                                })
                            }
                            {/*
                                [1,2,3].map((ite, idx)=>{
                                    return (
                                        <TouchableOpacity key={idx} onPress={that.openBigViewer.bind(that, 'https://static1.bcjiaoyu.com/ChenPic.png')} activeOpacity={1} style={{width:125,height:85}}>
                                            <Image style={styles.sequenceQuestionViewImg} source={{uri:'https://static1.bcjiaoyu.com/ChenPic.png'}} resizeMode={'cover'}/>
                                        </TouchableOpacity>
                                    )
                                })
                            */}
                        </View>
                    </View>
                    <View style={[styles.sequenceOptions,]}>
                        <SequenceProblemSortView data={data} callback={that.props.callback} openBigViewer={that.openBigViewer.bind(that)} typeView={that.props.typeView}/>
                        {/*
                            myAnswer.map((ite, idx)=>{
                                return (
                                    <View key={idx} style={styles.sequenceOption}>
                                        <Text style={styles.sequenceOptionLetter}>{ite.content}.</Text>
                                        <View style={styles.sequenceOptionView}>
                                            <Text style={styles.sequenceOptionViewTitle}>{ite.message}</Text>
                                        </View>
                                        <Image style={styles.sequenceOptionMove} source={require("../assets/images/move.png")} resizeMode={'contain'}/>
                                    </View>
                                )
                            })
                        */}
                    </View>
                </View>
                {
                    that.props.typeView === "mistake"?
                    <View style={[styles.answerView, ]}>
                        <View style={styles.correctAnswerView}>
                            <Text>正确答案</Text>
                            <Text style={styles.correctAnswerText}>{QuestionHelp.arrayToString(item.answer)}</Text>
                        </View>
                        <View style={styles.myAnswerView}>
                            <Text>你的答案</Text>
                            <Text style={styles.myAnswerText}>{QuestionHelp.sequenceMyAnswerToString(myAnswer)}</Text>
                        </View>
                        <View style={[styles.resultType, QuestionHelp.arrayToString(item.answer) === QuestionHelp.sequenceMyAnswerToString(myAnswer)?styles.resultTypeBlue:styles.resultTypeRed]}>
                            <Text style={QuestionHelp.arrayToString(item.answer) === QuestionHelp.sequenceMyAnswerToString(myAnswer)?styles.resultTypeBlueText:styles.resultTypeRedText}>{QuestionHelp.arrayToString(item.answer) === QuestionHelp.sequenceMyAnswerToString(myAnswer)?"正确":"错误"}</Text>
                        </View>
                    </View>:null
                }
            </View>
        )
    }
    render() {
    	return (
      		<View style={{ flex:1, backgroundColor:'white'}}>
                {
                    this.state.item.type === "blankProblem"?
                        this.renderBlankProblemView(this.state.item, this.state.myAnswerArr)
                    :
                        this.state.item.type === "sequenceProblem"?
                            this.renderSequenceProblemView(this.state.item, this.state.myAnswerArr)
                        :
                            this.renderChoiceProblemView(this.state.item, this.state.myAnswerArr)

                }
                {
                    this.state.showBigImgView? this._renderScaleBigImage() : null
                }
      		</View>
    	);
  	}
}

const width = Utils.width*0.8;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高
const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度
const statusBarH = Utils.statusBarHeight            //状态栏的高度

const styles = StyleSheet.create({
    // -----------------------选择题
    choiceProblemView:{
        flex:1,
        // width:width-30,
        flexDirection:'column',
        marginHorizontal:15,
        marginVertical:20,
    },
	choiceQuestionView:{
        // width:width-30,
        // flexDirection:'row',
        // backgroundColor:'red'  
    },
    choiceQuestionViewTitle:{
        color:'#41403E',
        lineHeight:30,
        fontSize:18,
        // backgroundColor:'yellow'
    },
    choiceQuestionViewImgs:{
        flexDirection:'row',
        flexWrap:'wrap',
        // backgroundColor:'red'
    },
    choiceQuestionViewImg:{
        width:120,
        height:80,
        marginTop:5,
        marginRight:5,
        // backgroundColor:'blue'
    },
    choiceOptions:{
        marginTop:20,
        // backgroundColor:'yellow'
    },
    choiceOption:{
        flexDirection:'row',
        justifyContent:'center',
        marginBottom:10,
        minHeight:40,
        paddingVertical:10,
        paddingHorizontal:10,
        // backgroundColor:'blue'
    },
    choiceOptionUnselect:{
        backgroundColor:'#EEEEEE'
    },
    choiceOptionSelect:{
        backgroundColor:'#25CB83'
    },
    choiceOptionRadioView:{
        width:25,
        marginRight:10
    },
    choiceOptionRadioImg:{
        width:20,
        height:20,
    },
    choiceOptionResultImg:{
        width:20,
        height:20,
        marginLeft:10,
        marginTop:2.5
    },
    choiceOptionLetter:{
        marginRight:5,
        lineHeight:25,
        fontSize:18,
    },
    choiceOptionView:{
        flex:1,
        flexDirection:'column',
        // backgroundColor:'red'
    },
    choiceOptionViewTitle:{
        lineHeight:25,
        fontSize:18,
    },
    choiceOptionViewImgs:{
        // height:100,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    choiceOptionViewImg:{
        width:120,
        height:80,
        marginRight:5,
        marginTop:5,
        // backgroundColor:'orange'
    },
    
    // ---------------填空题
    blankProblemView:{
        flex:1,
        // width:width,
        flexDirection:'column',
        // marginHorizontal:15,
        marginVertical:20,
        // backgroundColor:'red',
    },
    blankQuestionView:{
        marginLeft:15,
        marginRight:15,
        // backgroundColor:'blue',
    },
    blankQuestionViewTitle:{
        color:'#41403E',
        lineHeight:35
    },
    blankQuestionOptions:{
        paddingHorizontal:15,
        paddingVertical:20,
        marginTop:20,
        flexDirection:'row',
        flexWrap:'wrap',
        
        backgroundColor:'#EEEEEE',
        // borderTopWidth:1,
        // borderTopColor:'rgb(220,221,223)',
        // borderBottomWidth:1,
        // borderBottomColor:'rgb(220,221,223)',
    },
    blankQuestionOption:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10,
        // marginRight:10,
        paddingHorizontal:5,
        marginRight:5,
        // paddingVertical:5
        // backgroundColor:'red',
        height:35,
        // backgroundColor:'yellow'
    },
    blankQuestionOptionExist:{
        backgroundColor:'#25CB83',
        minWidth:40,
    },
    blankQuestionOptionBlank:{
        // width:25,
        // height:25
        width:40,
        height:35,
        backgroundColor:'white',
        borderWidth:1,
        borderColor:'#25CB83',
    },
    blankQuestionOptionTitle:{
        // backgroundColor:'blue',
        // height:35,
        // lineHeight:35
    },
    blankQuestionActions:{
        margin:20,
        flexDirection:'row',
        flexWrap:'wrap',
        // backgroundColor:'cyan',
    },
    blankQuestionAction:{
        // paddingVertical:5,
        paddingHorizontal:10,
        marginRight:10,
        marginBottom:10,
        height:35,
        alignItems:'center',
        justifyContent:'center',
    },
    blankQuestionActionSelect:{
        backgroundColor:'#25CB83',
        minWidth:40,
    },
    blankQuestionActionUnselect:{
        backgroundColor:'#EEEEEE',
        width:40,
    },
    blankQuestionActionTitle:{
        // lineHeight:35,
        color:'white'
    },

    // -----------------------顺序题
    sequenceProblemView:{
        // marginLeft:15,
        // marginRight:15,
        marginTop:20,
        marginBottom:20,
        // width:width,
        flex:1
    },
    sequenceQuestionView:{
        marginLeft:15,
        marginRight:15,
    },
    sequenceQuestionViewTitle:{
        color:'#41403E',
        lineHeight:35,
        fontSize:18,
    },
    sequenceQuestionViewImgs:{
        flexDirection:'row',
        flexWrap:'wrap',
    },
    sequenceQuestionViewImg:{
        width:120,
        height:80,
        marginTop:5,
        marginRight:5,
    },
    sequenceOptions:{
        marginTop:20,
        // marginBottom:40,
        // backgroundColor:'red',
        // borderWidth:2,
        // borderColor:'#FFC200',
        // minHeight:200,
        flex:1,
    },
    sequenceOption:{
        // height:80,
        flexDirection:'row',
        justifyContent:'center',
        // marginBottom:10,
        padding:10,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:'#FFC200',
        // backgroundColor:'blue',
        minHeight:40,
    },
    sequenceOptionLetter:{
        color:'#41403E',
        marginRight:10,
        fontSize:18,
        lineHeight:25,
    },
    sequenceOptionView:{
        flex:1,
        flexDirection:'column'
    },
    sequenceOptionViewTitle:{
        color:'#41403E',
        // marginBottom:5,
        fontSize:18,
        lineHeight:25,
    },
    sequenceOptionMove:{
        width:40,
        height:40
    },

    // -----------显示答案
    answerView:{
        borderTopWidth:1,
        borderTopColor:'#dbdbdb',
        paddingTop:20,
        marginTop:20,
        paddingBottom:15,
        marginVertical:0,
        marginHorizontal:20,
        // backgroundColor:'red'
    },
    answerText:{
        color:'#41403E',
    },
    correctAnswerView:{
        flexDirection:'row',
    },
    correctAnswerText:{
        fontSize:16,
        marginLeft:10,
        color:'#FFC200'
    },
    myAnswerView:{
        flexDirection:'row',
        marginTop:10,
    },
    myAnswerText:{
        fontSize:16,
        marginLeft:10,
        color:'#A3A3A3'
    },
    resultType:{
        position:'relative',
        // height:40
    },
    resultTypeRed:{
        position:'absolute',
        top:10,
        right:10,
        borderWidth:3,
        borderColor:'red',
        padding:10,
        justifyContent:'center',
        alignItems:'center'
        // width:52
    },
    resultTypeRedText:{
        fontSize:25,
        color:'red',
    },
    resultTypeBlue:{
        position:'absolute',
        top:10,
        right:10,
        borderWidth:3,
        borderColor:'blue',
        padding:10,
        justifyContent:'center',
        alignItems:'center'
        // width:52
    },
    resultTypeBlueText:{
        color:'blue',
        fontSize:25,
    }



});

export default QuestionView;