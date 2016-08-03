'use strict';

angular.module('clientApp')
.controller('WePayCtrl',function($scope, $rootScope, $window, $state, $stateParams,$timeout,$cookies, RestWechat, RestGift,Alert){
  $rootScope.title = '微信支付';
  var module = $stateParams.module;
  var action = $stateParams.action;
  var id = $stateParams.id;
  switch(module){
    case 'gift':
      switch(action){
        case 'buy':
          $scope.gift = RestGift.one(id).get().$object;
          break;
      }
      break;
  }

  $scope.wxPay = function(){
    var wxCallback = function(data){
      wx.chooseWXPay({
        timestamp: data.timestamp,
        nonceStr : data.nonceStr,
        package  : data.package,
        signType : data.signType,
        paySign  : data.paySign,
        success  : function(res) {
          var url = $state.href(data.state,{id:data.id});
          location.href = url;
        },
        cancel   : function(res) {
          //$state.go(data.state,{id:id});
        },
        fail     : function(res) {
          //$state.go(data.state,{id:id});
          Alert.add('warning',res.errMsg);
        }
      });
    };
    var wxError = function(response){
      Alert.add('danger',response.data.errmsg);
      //$window.history.go(-2);
    };
    switch(module){
      case 'gift':
        switch(action){
          case 'buy':
            var giftOrder = $cookies.getObject('giftOrder');
            RestGift.one(id).post('',giftOrder).then(wxCallback,wxError);
            break;
        }
        break;
    }
  };
})
.controller('WcAppCtrl',function($scope){
    var timeout;
    function open_appstore() {
        window.location='http://itunes.com/';
    }

    $scope.try_to_open_app = function() {
        timeout = setTimeout('open_appstore()', 300);
    }
})
