var demo = angular.module("demo", ["RongWebIMWidget"]);
var Token = "d0KQMVVNtrc++OMsJxYhSef+i1UOjzgpndhljWvccn+RtBxM0jOqi0ECcl5V2gtGWw9TPxGKgbvyV31kXCsVHQ==";

demo.controller("main", ["$scope","$http","RongCustomerService", function($scope,$http,RongCustomerService) {
    var domain = location.href.split('static')[0] + 'server/';
    // var domain = 'http://localhost:8088/server/';
    // var Token = getToken('IMToken');
    // var userToken = getToken('Token');

    if (!Token) {
        if (userToken) {
            $.ajax({
                type: 'get',
                url: domain + 'im/user_get_token/',
                headers: {
                    Authorization: 'Token ' + userToken
                },
                dataType: 'json',
                success: function(json){
                    var Token = json;
                    console.log(Token);
                    setAllYearToken('IMToken', Token);
                    $scope.title="asdf";
                    RongCustomerService.init({
                        appkey:"z3v5yqkbzchy0",//selfe
                        token:Token,//selfe kefu
                        customerServiceId:"KEFU148116869676090",//selfe
                        reminder:"在线咨询",
                        displayMinButton: false,
                        __isKefu:true,
                        position:RongCustomerService.Position.right,
                        positionFixed: true,
                        style:{
                            height:440,
                            width:220,
                            right:0,
                            bottom: 45,
                        },
                        onSuccess:function(e){
                          // console.log(e);
                          // $('#rong-widget-minbtn-kefu').css({right: '0px'});
                            $('#rong-sendBtn').click(function(){
                                alert('111');
                                document.activeElement.blur();
                            });
                        }
                    });
                    $scope.show = function() {
                      RongCustomerService.show();
                    }

                },
                error: function(json){
                    console.log(json);
                }
            });
        } else {
            $.ajax({
                type: 'get',
                url: domain + 'im/user_get_token/',
                dataType: 'json',
                success: function(json){
                    var Token = json;
                    console.log(Token);
                    setToken('IMToken', Token);
                    $scope.title="asdf";
                    RongCustomerService.init({
                        appkey:"z3v5yqkbzchy0",//selfe
                        token:Token,//selfe kefu
                        customerServiceId:"KEFU148116869676090",//selfe
                        reminder:"在线咨询",
                        displayMinButton: false,
                        __isKefu:true,
                        position:RongCustomerService.Position.right,
                        style:{
                          height:440,
                          width:220,
                          right:0,
                          bottom: 44
                        },
                        onSuccess:function(e){
                            $('#rong-sendBtn').click(function(){
                                document.activeElement.blur();
                            });
                        }
                    });
                    $scope.show = function() {
                      RongCustomerService.show();
                    }
                },
                error: function(json){
                    console.log(json);
                }
            });
        }
    } else {
        $scope.title="asdf";
        RongCustomerService.init({
            appkey:"z3v5yqkbzchy0",//selfe
            token:Token,//selfe kefu
            customerServiceId:"KEFU148116869676090",//selfe
            reminder:"在线咨询",
            displayMinButton: false,
            __isKefu:true,
            position:RongCustomerService.Position.right,
            style:{
              height:440,
              width:220,
              right:0,
              bottom: 44
            },
            onSuccess:function(e){
                // console.log(e);
                // $('#rong-widget-minbtn-kefu').css({right: '0px'});
                $('#rong-sendBtn').click(function(){
                    document.activeElement.blur();
                });
            }
        });
        $scope.show = function() {
          RongCustomerService.show();
        }
    }

}]);

function getToken(key){
    var token = document.cookie.split(key + '=')[1];
    if (token) {
        token = token.split('; ')[0];
        return token;
    } else {
        return false;
    }
}

function setToken(key, value){
    var date = new Date();
    date.setDate(date.getDate() + 1);
    document.cookie = key + '= ' + value + ';expires=' + date;
}

function setAllYearToken(key, value){
    var date = new Date();
    date.setDate(date.getDate() + 730);
    document.cookie = key + '= ' + value + ';expires=' + date;
}
