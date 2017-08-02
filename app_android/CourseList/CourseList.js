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
  AsyncStorage
} from 'react-native';

const {width, height} = Dimensions.get('window');
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
    if (this.props.status === 'nostart') {
      alert('课程未开放');
    } else {
     this.props.changeAll(!this.props.isSelected, this.props.pk); 
    }
  }
  render() {

    return (
        <TouchableOpacity onPress={this.onPress.bind(this)} style={[CourseStyle.itemStyle,this.props.status === 'nostart'?({backgroundColor: 'rgb(230, 230, 230)'}):(this.props.isSelected?({backgroundColor: 'rgb(252, 189, 209)'}):({backgroundColor: 'white'}))]}>
          <Text numberOfLines={1} style={{backgroundColor: 'rgba(255,255,255,0)', fontSize: 11, marginTop: 15}}>{this.props.title}</Text>
          <Image style={{width: 50, height: 50, marginTop: 15}} source={{uri: this.props.headImg}}/>
          <Text numberOfLines={4} style={{marginBottom: 15, letterSpacing: 2, lineHeight: 12, marginTop: 15, width: width / 3 - 20, fontSize: 10, color: 'rgb(150, 151, 152)'}}>{this.props.text}</Text>
          <Image style={CourseStyle.itemImgStyle} source={itemHead[this.props.status]} />
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
    return  (<CourseItem isSelected={item.isSelected} changeAll={this.props.changeAll} pk={item.pk} status={item.learn_extent.status} title={item.name} headImg={item.images} text={item.content} />)
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
    headerRight: <RightBtn press={()=>navigation.state.params.navigatePress()} />
  })
  constructor() {
    super();
    let dataArr = new Array();
    this.state = {
      data: dataArr,
      selectData: null
    }

  }
  navigatePress = () => {
    if (this.state.selectData !== null) {
      this.props.navigation.state.params.callback(this.state.selectData.pk, this.state.selectData.learn_extent.last_lesson);
      this.props.navigation.goBack();
    } else {
      alert('还未选择课程');
    }
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
      fetch('https://www.cxy61.com/program_girl/course/courses/', {headers: {Authorization: 'Token ' + results, 'content-type': 'application/json'}})
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
            console.log(responseJson);
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
    return  (<CourseFlat changeAll={this.changeAll.bind(this)} data={item} />)
  }
  render() {
    return (
      <View style={CourseStyle.container}>
         <FlatList 
          data={this.state.data}
          extraData={this.state}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        /> 
      </View>
    )
  }
}

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