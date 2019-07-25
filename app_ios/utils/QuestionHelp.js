'use strict';

let QuestionHelp = {
	// 选择题，判断option是否被选中在 myAnswers 中
	choiceHasItemInAnswer: function (item, myAnswers){
	    if (myAnswers.indexOf(item) > -1) {
	      	return true
	    } else {
	      	return false
	    }
	},
	// 选择题，显示你选的答案
	choiceMyAnswerToString: function (myAnswers){
	    return myAnswers.join(",");
	},
	// 填空题的action 帮助方法
	blankQuestionAction:function(actions, myAnswers){
	    var array = JSON.parse(JSON.stringify(actions));
	    for (var i = 0; i < myAnswers.length; i++){
	      	if(myAnswers[i].type=="blank" && myAnswers[i].content != ""){
	        	// 如果空白选项中有内容，则把对应 action 中的内容去掉
	        	var index = myAnswers[i].index;
	        	console.log(myAnswers[i].index, myAnswers[i].content, myAnswers[i].type);
	        	// array[index]["content"] = "";
	        	array[index].content = "";
	      	}
	    }
	    console.log("新 action:", array, actions);
	    return array;
	},
	// 填空题显示你选的答案
	blankMyAnswerToString:function(myAnswers){
	    var answers = [];
	    for (var i = 0; i < myAnswers.length; i++) {
	      	if (myAnswers[i].type == "blank") {
	        	// 未知选项，
	        	answers.push(myAnswers[i].content);
	      	}
	    }
	    return answers.join(",");
	},
	// 顺序题显示你选的答案
	sequenceMyAnswerToString: function (myAnswers){
	    var answers = [];
	    for (var i = 0; i < myAnswers.length; i++) {
	      	answers.push(myAnswers[i].content);
	    }
	    return answers.join(",");
	},
	arrayToString:function(arr){
	    var str = arr.join(",");
	    return str;
	},
}
export default QuestionHelp;