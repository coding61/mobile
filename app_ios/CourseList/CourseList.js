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
  FlatList
} from 'react-native';

const {width, height} = Dimensions.get('window');
import {StackNavigator} from 'react-navigation';
var token = 'ff014f55ad02c8f799d4103b19b436520875ea73';
var itemHead = {nostart: require('../assets/Course/nostart.png'), processing:require('../assets/Course/onstudy.png'), finish: require('../assets/Course/onfinish.png')};


class RightBtn extends Component {
  constructor() {
    super();

  }
  render() {
    return (
      <TouchableOpacity style={{width: 50, height: 50, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: 'white'}}>{'完成'}</Text>
      </TouchableOpacity>
    )
  }
}
class CourseItem extends Component {
  constructor() {
    super();
  }
  render() {
    console.log(this.props.status)
    return (
        <TouchableOpacity style={CourseStyle.itemStyle}>
          <Text numberOfLines={1} style={{backgroundColor: 'rgba(255,255,255,0)', fontSize: 11, marginTop: 15}}>{this.props.title}</Text>
          <Image style={{width: 50, height: 50, marginTop: 15}} source={{uri: this.props.headImg}}/>
          <Text numberOfLines={4} style={{marginBottom: 15, letterSpacing: 2, lineHeight: 12, marginTop: 15, width: width / 3 - 20, fontSize: 10, color: 'rgb(150, 151, 152)'}}>{this.props.text}</Text>
          <Image style={CourseStyle.itemImgStyle} source={itemHead[this.props.status]} />
        </TouchableOpacity> 
    )
  }
}
class CourseList extends Component {
  static navigationOptions = {
    title: '选择课程',
    headerStyle: {
      backgroundColor: 'rgb(251, 109, 150)'
    },
    headerTitleStyle: {
      color: 'white',
      fontWeight: '400'
    },
    headerRight: <RightBtn />
  }
  constructor() {
    super();
    let dataArr = new Array();
    this.state = {
      data: dataArr
    }
  }

  componentDidMount() {
    fetch('https://app.bcjiaoyu.com/program_girl/course/courses/', {headers: {Authorization: 'Token ' + token, 'content-type': 'application/json'}})
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else {
          return 'fail';
        }
      })
      .then(responseJson => {
        if (responseJson !== 'fail') {
          var newData = new Array();
          newData = responseJson.map((item, index) => {
            return {
              index: index,
              status: item.learn_extent.status,
              title: item.name,
              headImg: item.images,
              text: item.content
            }
          })
          this.setState({
            data: newData
          })
          console.log(newData)
        } else {
          
        }
      })

  }
  _keyExtractor = (item, index) => index
  _renderItem = ({item}) => {
    return  (<CourseItem status={item.status} title={item.title} headImg={item.headImg} text={item.text} />)
  }
  render() {
    return (
      <View style={CourseStyle.container}>
        <View>
          <Text style={{width: 60, fontSize: 12, backgroundColor: 'rgb(80, 189, 251)', color: 'white'}}>啊啊啊</Text>
        </View>
        <FlatList 
          horizontal={true}
          data={this.state.data}
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
    marginTop: 64, 
    width: width / 3,
    height: (width < 350?(64 * width / 155 + 30):(64 * width / 155 + 15)), 
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: 20,
    shadowOffset:{ width:-2, height:2}, 
    shadowColor:'black', 
    shadowOpacity:0.1, 
    shadowRadius:1, 
    alignItems: 'center',
  },
  itemImgStyle: {
    position: 'absolute',
    right: 0,
    top: 0
  }
})
const course = StackNavigator({  
    course: {screen: CourseList}    
  
}); 
export default course;