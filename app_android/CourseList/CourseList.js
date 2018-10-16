'use strict';
import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SectionList,
  FlatList,
  Alert,
  AsyncStorage,
  Modal,
  ScrollView,
  TextInput
} from 'react-native';
import BCFetchRequest from '../utils/BCFetchRequest.js';
import Utils from '../utils/Utils.js';
import Http from '../utils/Http.js';
import {StackNavigator} from 'react-navigation';
var itemHead = {nostart: require('../assets/Course/nostart.png'), processing:require('../assets/Course/onstudy.png'), finish: require('../assets/Course/onfinish.png')};


class RightBtn extends Component {
  constructor() {
    super();

  }
  render() {
    return (
      <TouchableOpacity onPress={()=>this.props.press()} style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white'}}>{'完成'}</Text>
      </TouchableOpacity>
    )
  }
}
class CourseItem extends Component {
  constructor() {
    super();
  }
  onPress() {
    var _this = this;
    AsyncStorage.getItem('token', function(errs, results) {
      if (results) {
        fetch(Http.domain + '/course/courses/' + _this.props.pk + '/',{headers: {'Authorization': 'Token ' + results, 'content-type': 'application/json'}})
          .then(response => {
            if (response.ok === true) {
              return response.json();
            } else {
              return '失败'
            }
          })
          .then(responseJson => {
            if (responseJson !== '失败') {
              _this.props.refreshItem(responseJson)
            } else {
              alert('获取课程失败，请重新选择');  
            }
          })
      }
    })
    // function toReset() {
    //   var _this = this;
    //     AsyncStorage.getItem("token", function(errs, results) {
    //       if (results) {
    //         fetch(Http.domain + '/userinfo/update_learnextent/',{
    //                   method: "POST",
    //                   headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Token ' + results
    //                   },
    //                   body: JSON.stringify({
    //                     course: _this.props.pk,
    //                     lesson: "0",
    //                   }),
    //                 })
    //                 .then(response=> {
    //                   if (response.status === 200) {
    //                     return response.json()
    //                   } else {
    //                     return 'fail'
    //                   }
    //                 })
    //                 .then(responseJson=> {
    //                   if (responseJson !== 'fail') {
    //                     _this.props.navigation.state.params.callback(_this.props.pk, 0, true, _this.props.total_lesson);
    //                     _this.props.navigation.goBack();
    //                   } else {
    //                     alert('失败，请重试');
    //                   }
    //                 })
    //       }
    //     })
    // }
    // function toBack() {
    //   if (this.props.status === 'finish') {
    //     var _this = this;
    //     AsyncStorage.getItem("token", function(errs, results) {
    //       if (results) {
    //         fetch(Http.domain + '/userinfo/update_learnextent/',{
    //                   method: "POST",
    //                   headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json',
    //                     'Authorization': 'Token ' + results
    //                   },
    //                   body: JSON.stringify({
    //                     course: _this.props.pk,
    //                     lesson: "0",
    //                   }),
    //                 })
    //                 .then(response=> {
    //                   if (response.status === 200) {
    //                     return response.json()
    //                   } else {
    //                     return 'fail'
    //                   }
    //                 })
    //                 .then(responseJson=> {
    //                   if (responseJson !== 'fail') {
    //                     _this.props.navigation.state.params.callback(_this.props.pk, 0, true, _this.props.total_lesson);
    //                     _this.props.navigation.goBack();
    //                   } else {
    //                     alert('失败，请重试');
    //                   }
    //                 })
    //       }
    //     })
    //   } else if (this.props.status === 'processing'){
    //     this.props.navigation.state.params.callback(this.props.pk, this.props.last_lesson, false, this.props.total_lesson);
    //     this.props.navigation.goBack();
    //   } else {
    //     this.props.navigation.state.params.callback(this.props.pk, this.props.last_lesson, false, this.props.total_lesson);
    //     this.props.navigation.goBack();
    //   }
    // }
    // if (this.props.isopen === true) {
    //   if (this.props.status === 'nostart') {
    //     toBack.bind(this)();
    //   } else if (this.props.status === 'processing') {
    //     Alert.alert('','此课程已经开始学习，请选择重新开始学习还是继续上次学习？',
    //     [{text: '继续上次', onPress: () => toBack.bind(this)(), style: 'cancel'},
    //     {text: '重新开始', onPress: () => toReset.bind(this)()}
    //     ],{ cancelable: false })
    //   } else if (this.props.status === 'finish') {
    //     Alert.alert('','你是否确定要再学一遍？',
    //     [{text: '是', onPress: () => toBack.bind(this)(), style: 'cancel'},
    //     {text: '否', onPress: () => {}}
    //     ],{ cancelable: false })
    //   } else {}
    // } else {
    //   Alert.alert('','此课程尚未开放',
    //   [{text: '确认', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
    //   ],{ cancelable: false })
    // }

    // if (this.props.isopen === false) {
    //   alert('课程未开放');
    // } else {
    //  this.props.changeAll(!this.props.isSelected, this.props.pk); 
    // }
  }
  render() {

    return (
        <TouchableOpacity onPress={this.onPress.bind(this)} style={[CourseStyle.itemStyle,this.props.isopen === false?({backgroundColor: 'rgb(230, 230, 230)'}):(this.props.isSelected?({backgroundColor: 'rgb(252, 189, 209)'}):({backgroundColor: 'white'}))]}>
          <Text numberOfLines={1} style={{backgroundColor: 'rgba(255,255,255,0)', fontSize: 11, marginTop: 15}}>{this.props.title}</Text>
          <Image style={{width: 50, height: 50, marginTop: 15}} source={{uri: this.props.headImg}}/>
          <Text numberOfLines={4} style={{marginBottom: 15, letterSpacing: 2, lineHeight: 12, marginTop: 15, width: width / 3 - 20, fontSize: 10, color: 'rgb(150, 151, 152)'}}>{this.props.text}</Text>
          {this.props.isopen === false?(<Image style={CourseStyle.itemImgStyle} source={itemHead['nostart']} />):(this.props.status === 'nostart'?(null):(<Image style={CourseStyle.itemImgStyle} source={itemHead[this.props.status]} />))}
        </TouchableOpacity> 
    )
  }
}
class CourseFlat extends Component {
  constructor() {
    super();
    this.state = {
      title: null,
      titleLength: 0
    }
  }
  componentWillMount() {
    var title = this.props.data.profession + '(' + '共' + this.props.data.dataArr.length.toString() + '门课)';
    var titleLength = title.split("").length;
    this.setState({
      title: title,
      titleLength: titleLength,
      data: this.props.data
    })    
  }
  componentWillReceiveProps(nextProps) {
    var title = nextProps.data.profession + '(' + '共' + nextProps.data.dataArr.length.toString() + '门课)';
    var titleLength = title.split("").length;
    this.setState({
      title: title,
      titleLength: titleLength,
      data: nextProps.data
    })  

  }

  _keyExtractor = (item, index) => index
  _renderItem = ({item}) => {
    return  (<CourseItem refreshItem={this.props.refreshItem} total_lesson={item.total_lesson} navigation={this.props.navigation} last_lesson={item.learn_extent.last_lesson} isSelected={item.isSelected} changeAll={this.props.changeAll} pk={item.pk} isopen={item.isopen} status={item.learn_extent.status} title={item.name} headImg={item.images} text={item.content} />)
  }
  render() {
    return (
      <View>
        <View style={{flexDirection: 'row', marginTop: 10}}>
                <View style={{width: this.state.titleLength * 9, backgroundColor: 'rgb(80, 189, 251)'}}>
                  <Text style={{marginLeft: 5, height: 24, lineHeight: 20, fontSize: 10, color: 'white'}}>{this.state.title}</Text>
                </View>
              <View style={{width: 0, height: 0, borderLeftColor: 'rgb(80, 189, 251)', borderLeftWidth: 12, borderTopColor: 'transparent', borderTopWidth: 12, borderBottomWidth: 12, borderBottomColor: 'transparent'}}/>
            </View>
        <FlatList 
          horizontal={true}
          extraData={this.state}
          data={this.state.data.dataArr}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    )
  }
}


class CourseList extends Component {
  static navigationOptions  = ({ navigation, screenProps }) => ({
    title: '选择课程',
    headerStyle: {
      backgroundColor: 'rgb(251, 109, 150)'
    },
    headerTitleStyle: {
      color: 'white',
      fontWeight: '400'
    },
    headerTintColor: "#fff"
    // headerRight: <RightBtn press={()=>navigation.state.params.navigatePress()} />
  })

  constructor() {
    super();
    let dataArr = new Array();
    this.state = {
      data: dataArr,
      selectData: null,
      modalVisible: false,
      tab: 'left',
      item: null,
      catalogs: [],
      startText: '',
      modalVisible2: false,
      searchText: '',
      searchArr: []
    }

  }
  // navigatePress = () => {
  //   if (this.state.selectData !== null) {
  //     if (this.state.selectData.learn_extent.status === 'finish') {
  //       Alert.alert('提示','是否重新学习此课程',
  //       [{text: '否', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
  //       {text: '是', onPress: () => this.goReset()},
  //       ],{ cancelable: false })
  //     } else {
  //     this.props.navigation.state.params.callback(this.state.selectData.pk, this.state.selectData.learn_extent.last_lesson);
  //     this.props.navigation.goBack();
  //     } 
  //   } else {
  //     alert('还未选择课程');
  //   }
  // }
  
  goReset() {
    var _this = this;
    AsyncStorage.getItem("token", function(errs, results) {
      if (results) {
        fetch(Http.domain + '/userinfo/update_learnextent/',{
                  method: "POST",
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + results
                  },
                  body: JSON.stringify({
                    course: _this.state.selectData.pk,
                    lesson: "0",
                  }),
                })
                .then(response=> {
                  if (response.status === 200) {
                    return response.json()
                  } else {
                    return 'fail'
                  }
                })
                .then(responseJson=> {
                  if (responseJson !== 'fail') {
                    _this.props.navigation.state.params.callback(_this.state.selectData.pk, 0);
                    _this.props.navigation.goBack();
                  } else {
                    alert('失败，请重试');
                  }
                })
      }
    })

  }
  changeAll(selected, pk) {
    var data = this.state.data;
    if (selected === false) {
      for (let i=0;i<data.length;i++) {
        for (let j=0;j<data[i].dataArr.length;j++) {
          if (data[i].dataArr[j].pk === pk) {
            data[i].dataArr[j].isSelected = false;
            this.setState({
              selectData: null
            })
            break;
          }
        }
      }
    } else {
      for (let i=0;i<data.length;i++) {
        for (let j=0;j<data[i].dataArr.length;j++) {
          if (data[i].dataArr[j].pk === pk) {
            data[i].dataArr[j].isSelected = true;
            this.setState({
              selectData: data[i].dataArr[j]
            })
          } else {
            data[i].dataArr[j].isSelected = false;
          }
        }
      }
    }
    this.setState({
      data: data
    })

  }
  _loadData() {
    var _this = this;
    AsyncStorage.getItem("token", function(errs, results) {
      fetch(Http.domain + '/course/courses/', {headers: {Authorization: 'Token ' + results, 'content-type': 'application/json'}})
        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            return 'fail';
          }
        })
        .then(responseJson => {
          if (responseJson !== 'fail') {
            var dataSource = new Array();
            responseJson.forEach((item, index) => {
              var isHas = false;
              for (let i=0;i<dataSource.length;i++) {
                if (item.profession === dataSource[i].profession) {
                  item.isSelected = false;
                  dataSource[i].dataArr.push(item);
                  isHas = true;
                  break;
                }
              }
              if (!isHas) {
                var dataArray = new Array();
                dataArray.push(item);
                item.isSelected = false;
                dataSource.push({"profession": item.profession, "dataArr": dataArray})
              } 
            })
            _this.setState({
              data: dataSource
            })
            console.log(dataSource);
          } else {
            
          }
        })
    })

  }
  componentDidMount() {
    this.props.navigation.setParams({
        navigatePress:this.navigatePress
    })
    this._loadData();
  }
  _keyExtractor = (item, index) => index
  _renderItem = ({item}) => {
    return  (<CourseFlat refreshItem={this.refreshItem.bind(this)} navigation={this.props.navigation} changeAll={this.changeAll.bind(this)} data={item} />)
  }
  refreshItem(item) {
    if (item.isopen === true) {
      this.setState({
        startText: item.learn_extent.status
      })
    } else {
      this.setState({
        startText: ''
      })
    }
    if (item.json && JSON.parse(item.json).catalogs) {
      var arr = JSON.parse(item.json).catalogs;
    } else {
      var arr = [{title: '无目录'}]
    }
    this.setState({
      item: item,
      catalogs: arr,
      modalVisible: true,
      modalVisible2: false
    })
  }
  tabLeft() {
    this.setState({
      tab: 'left'
    })
  }
  tabRight() {
    this.setState({
      tab: 'right'
    })
  }
  fetchStartAdaptCourse(pk, tag){
      // 如果自适应课程，中 mycourse_json 是空的，则调该方法给他添加一套自己的课程
      // flag 用于区分是来自getCourseInfoWithPk 还是 getCourse
      console.log("添加自适应课程");
      var this_ = this;
      Utils.isLogin((token)=>{
          if (token) {
              var type = "post",
                  url = Http.beginAdaptCourse,
                  token = token,
                  data = {course:pk};
              BCFetchRequest.fetchData(type, url, token, data, (response) => {
                if (tag=="reset") {
                  // 重置进度再返回
                  this_.toReset();
                } else{
                  this_.props.navigation.state.params.callback(this.state.item.pk, this.state.item.learn_extent.last_lesson, false, this.state.item.total_lesson);
                  this_.props.navigation.goBack();
                }

              }, (err) => {
                  // console.log(err);
                  // Utils.showMessage('网络请求失败');
              });
          }
      })
  }
  fetchResetAdaptCourse(pk){
    console.log("重置自适应课程");
    var this_ = this;
    Utils.isLogin((token)=>{
        if (token) {
            var type = "post",
                url = Http.resetAdaptCourse,
                token = token,
                data = {course:pk};
            BCFetchRequest.fetchData(type, url, token, data, (response) => {
                if(response.detail == "此课程未添加，无法重置"){
                  this_.fetchStartAdaptCourse(pk, "reset");
                }else{
                  this_.toReset();
                }
            }, (err) => {
                // console.log(err);
                // Utils.showMessage('网络请求失败');
            });
        }
    })
  }
  toResetCourse(){
    if(this.state.item.iszishiying){
        this.fetchResetAdaptCourse(this.state.item.pk);
      }else{
       this.toReset();
      }
  }
  toContinueCourse(){
    if(this.state.item.iszishiying){
        this.fetchStartAdaptCourse(this.state.item.pk);
      }else{
        this.props.navigation.state.params.callback(this.state.item.pk, this.state.item.learn_extent.last_lesson, false, this.state.item.total_lesson);
        this.props.navigation.goBack();
      }
  }
  toReset() {
    var _this = this;
      AsyncStorage.getItem("token", function(errs, results) {
        if (results) {
          fetch(Http.domain + '/userinfo/update_learnextent/',{
                    method: "POST",
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': 'Token ' + results
                    },
                    body: JSON.stringify({
                      course: _this.state.item.pk,
                      lesson: "0",
                      types:"reset"
                    }),
                  })
                  .then(response=> {
                    if (response.status === 200) {
                      return response.json()
                    } else {
                      return 'fail'
                    }
                  })
                  .then(responseJson=> {
                    if (responseJson !== 'fail') {
                      _this.props.navigation.state.params.callback(_this.state.item.pk, 0, true, _this.state.item.total_lesson);
                      _this.props.navigation.goBack();
                    } else {
                      alert('失败，请重试');
                    }
                  })
        }
      })
  }
  touchBack(to) {
    var _this = this;
    switch (to)
      {
        case 0:
        {
          _this.toContinueCourse();
          break;
        }
        case 1:
        {
          _this.toResetCourse();
          break;
        }
        case 2:
        {
          _this.toContinueCourse();
          break;
        }
        case 3:
        {
          _this.toResetCourse();
          break;
        }
        default :
        break;
      }
  }
    beginBtnEvent(){
        var that = this;
        if (that.state.startText === "") {
            // 此课程尚未开放
            Utils.showMessage("此课程尚未开放");
        }else if (that.state.startText === "nostart") {
            // 开始学习，从未学过
            that.touchBack(0);
        }else if (that.state.startText === "finish") {
            // 已完成，
            Utils.showAlert("", "你是否确定要再学一遍？", ()=>{
                that.touchBack(1);
            }, ()=>{

            }, "是", "否");
            
        }else if (that.state.startText === "processing") {
            // 进行中
            Utils.showAlert("", "此课程已经开始学习，请选择重新开始学习还是继续上次学习？", ()=>{
                that.touchBack(2);
            }, ()=>{
                that.touchBack(3);
            }, "继续上次", "重新开始");
        }
    }
    renderBottomBtn() {
        if (this.state.startText === '') {
          return <View style={{position: 'absolute',bottom: 0,left: 0,width: width, height: 50, backgroundColor: 'rgb(251, 109, 150)', alignItems: 'center', justifyContent: 'center'}}><Text style={{color: 'white'}}>此课程尚未开放</Text></View>
        } else if (this.state.startText === 'nostart') {
          return (<TouchableOpacity onPress={this.touchBack.bind(this, 0)} style={{position: 'absolute',bottom: 0,left: 0,width: width, height: 50, backgroundColor: 'rgb(251, 109, 150)', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white'}}>{'开始学习'}</Text>
                  </TouchableOpacity>)
        } else if (this.state.startText === 'finish') {
          return (<TouchableOpacity onPress={this.touchBack.bind(this, 1)} style={{position: 'absolute',bottom: 0,left: 0,width: width, height: 50, backgroundColor: 'rgb(251, 109, 150)', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white'}}>{'重新学习'}</Text>
                  </TouchableOpacity>)
        } else if (this.state.startText === 'processing') {
          return (<View style={{position: 'absolute',bottom: 0,left: 0,width: width, height: 50, backgroundColor: 'rgb(251, 109, 150)', flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={this.touchBack.bind(this, 2)} style={{width: width / 2, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{color: 'white'}}>{'继续学习'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.touchBack.bind(this, 3)} style={{width: width / 2, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{color: 'white'}}>{'重新开始'}</Text>
                    </TouchableOpacity>
                  </View>)
        } else {
          return ;
        }
    }
  searchCourse() {
    var _this = this;
    AsyncStorage.getItem("token", function(errs, results) {
      fetch(Http.domain + '/course/courses/?name=' + encodeURI(_this.state.searchText).replace(/\+/g,'%2B'), {headers: {Authorization: 'Token ' + results, 'content-type': 'application/json'}})
        .then(response => {
          if (response.status === 200) {
            return response.json()
          } else {
            return 'fail';
          }
        })
        .then(responseJson => {
          if (responseJson !== 'fail') {
            _this.setState({
              searchArr: responseJson
            })
            if(!responseJson.length){
              Utils.showMessage("课程未找到");
            }
          } else {
            
          }
        })
    })
  }
  render() {
    return (
        <View style={CourseStyle.container}>
            <View style={{width: width, height: 40, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this.setState({modalVisible2: true})} style={{width: width - 30, height: 30, backgroundColor: 'white',flexDirection: 'row', alignItems: 'center'}}>
                    <Image style={{marginLeft: 10, width: 18, height: 18}} source={require('../assets/Forum/sousuo.png')}/>
                    <Text style={{marginLeft: 10, fontSize: 13, color: 'gray'}}>搜索课程</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={this.state.data}
                extraData={this.state}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
            /> 
            <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible2}
                onRequestClose={() => {}}>
                <View style={{width: width, height: height, backgroundColor: 'rgb(242, 243, 244)'}}>
                    <View style={{width: width, height: 64, backgroundColor: 'rgb(251, 109, 150)', alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => this.setState({modalVisible2: false})} style={{position: 'absolute', left: 0, bottom: 0, width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={require('../assets/Login/close.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.searchCourse.bind(this)} style={{position: 'absolute', right: 0, bottom: 0, width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 14}}>搜索</Text>
                        </TouchableOpacity>
                        <Text style={{color: 'white', fontSize: 17, marginTop: 10}}>搜索课程</Text>
                    </View>
                    <TextInput
                        style={{width: width - 30, marginTop: 15, marginBottom: 15, marginLeft: 15, height: 50, fontSize: 13, backgroundColor: 'white', paddingLeft: 10, lineHeight: 30}}
                        onChangeText={(searchText) => this.setState({searchText})}
                        value={this.state.searchText}
                        placeholder={'请输入搜索的课程'}
                        underlineColorAndroid={'transparent'}
                    />
                    <ScrollView>
                        <View style={{width: width, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                            {this.state.searchArr.map((item, index) => {
                                return <CourseItem key={index} refreshItem={this.refreshItem.bind(this)} total_lesson={item.total_lesson} navigation={this.props.navigation} last_lesson={item.learn_extent.last_lesson} pk={item.pk} isopen={item.isopen} status={item.learn_extent.status} title={item.name} headImg={item.images} text={item.content} />
                            })}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
            <Modal 
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}>
                <View style={{width: width, flex:1, position:'relative',}}>

                    <View style={{width: width, height: 50, backgroundColor: 'rgb(251, 109, 150)', flexDirection:'row', alignItems: 'center', justifyContent: 'space-around'}}>
                        <TouchableOpacity onPress={() => this.setState({modalVisible: false})} style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={require('../assets/Login/close.png')}/>
                        </TouchableOpacity>
                        <Text style={{color: 'white', fontSize: 17}}>{this.state.item?(this.state.item.name):(null)}</Text>
                        <TouchableOpacity onPress={this.beginBtnEvent.bind(this)}><Text style={{color:'white', fontSize:15}}>开始学习</Text></TouchableOpacity>
                    </View>
                    <View style={{width: width, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'rgb(239, 238, 239)', borderBottomWidth: 1}}>
                        <TouchableOpacity onPress={this.tabLeft.bind(this)} style={[{width: width / 2, height: 43, alignItems: 'center', justifyContent: 'center'}, this.state.tab === 'left'?({borderBottomWidth: 1, borderBottomColor: 'rgb(253, 109, 156)'}):(null)]}>
                            <Text style={this.state.tab === 'left'?({color: 'rgb(253, 109, 156)'}):(null)}>简介</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.tabRight.bind(this)} style={[{width: width / 2, height: 43, alignItems: 'center', justifyContent: 'center'}, this.state.tab === 'right'?({borderBottomWidth: 1, borderBottomColor: 'rgb(253, 109, 156)'}):(null)]}>
                            <Text style={this.state.tab === 'right'?({color: 'rgb(253, 109, 156)'}):(null)}>目录</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{flex:1,}}>
                        {this.state.tab === 'left'?(
                            <View style={{marginLeft: 25, width: width - 50, alignItems: 'center'}}>
                                <Image resizeMode={'contain'} style={{width: 50, height: 50, marginTop: 30}} source={{uri: this.state.item?(this.state.item.images):(null)}}/>
                                <Text style={{width: width - 50, marginTop: 30, fontSize: 14, color: 'gray', lineHeight: 20}}>{this.state.item?(this.state.item.content):(null)}</Text>
                            </View>
                        ):
                             <View style={{width: width - 50, marginLeft: 25}}>
                            {
                                this.state.catalogs.map((item, index) => {
                                    return <Text key={index} numberOfLines={1} style={{marginTop: 30, width: width - 50, fontSize: 15}}>{(1+index).toString() + '.' + item.title}</Text>
                                })
                            }
                            </View>
                        }
                    </ScrollView>
                    {/*this.renderBottomBtn()*/}
                </View>
            </Modal>
        </View>
    )
  }
}
const headerH = Utils.headerHeight;                 //导航栏的高度
const bottomH = Utils.bottomHeight;                 //tabbar 高度

const width = Utils.width;                          //屏幕的总宽
const height = Utils.height;                        //屏幕的总高

const CourseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(242, 243, 244)'
  },
  itemStyle: {
    marginTop: 10,
    width: width / 3,
    height: (width < 350?(64 * width / 155 + 30):(64 * width / 155 + 15)), 
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: 10,
    marginRight: 5,
    shadowOffset:{ width:-2, height:2}, 
    shadowColor:'black', 
    shadowOpacity:0.1, 
    shadowRadius:1, 
    alignItems: 'center'
  },
  itemImgStyle: {
    position: 'absolute',
    right: 0,
    top: 0
  }
})
export default CourseList;