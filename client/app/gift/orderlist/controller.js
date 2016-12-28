'use strict';

angular.module('clientApp')

.controller('GiftMyCtrl', function($scope, $rootScope, $state, GiftOrder) {    
    //$rootScope.title = "我的大礼包列表";
    $scope.apiCfg = window.SONGNI_CFG_API;
            
    $rootScope.bg2 = false;
    $scope.gifts = new GiftOrder({
        my: true
    });
    $scope.link = function(id) {
        $state.go('order.detail.info', {
            id: id
        });
    };
})


// Gift Listen
// $state.is('order.detail.info')
.controller('GiftOrderDetailCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $window, RestGiftOrder, order, Alert) {
    //$rootScope.title = '收听好友的大礼包';
    $scope.innerHeight = $window.innerHeight;
    $scope.innerWidth = $window.innerWidth;

    $scope.apiCfg = window.SONGNI_CFG_API;

    $rootScope.bg2 = true;
    $scope.order = order;

    $scope.receiver = order.receivers[0];

    $scope.receive_num = order.receivers && order.receivers.length || 0;
    $scope.ship_num = order.receivers && order.receivers.filter(function(r){
        return r.status.shipping;
    }).length || 0;
    $scope.listen_num = order.receivers && order.receivers.filter(function(r){
        return r.status.read;
    }).length || 0;

    var receivedTime = order.receivers.reduce(function(acc, curr){
        if(curr.fillinDate){
            if(acc && acc.fillinDate){
                if(moment(curr.fillinDate).isAfter(acc.fillinDate)){
                    return curr;
                }else{
                    return acc;
                }
            }
            return curr;
        }
        return acc;
    }, undefined);
    $scope.receivedTime = receivedTime && receivedTime.fillinDate || "";
    var shippedTime = order.receivers.reduce(function(acc, curr){
        if(curr.status && curr.status.shipping_date){
            if(acc && acc.status && acc.status.shipping_date){
                if(moment(curr.status.shipping_date).isAfter(acc.status.shipping_date)){
                    return curr;
                }else{
                    return acc;
                }
            }
            return curr;
        }
        return acc;
    }, undefined);
    $scope.shippedTime = shippedTime && shippedTime.status.shipping_date || ""
    var readTime = order.receivers.reduce(function(acc, curr){
        if(curr.status && curr.status.read_date){
            if(acc && acc.status && acc.status.read_date){
                if(moment(curr.status.read_date).isAfter(acc.status.read_date)){
                    return curr;
                }else{
                    return acc;
                }
            }
            return curr;
        }
        return acc;
    }, undefined);
    $scope.readTime = readTime && readTime.status.read_date || "";
    $scope.link = function() {
        $state.go('gift.detail.share', {
            id: order.gift.id
        });
    };
    
    $scope.received = function () {
        if (order.receivers.length)
            $state.go('order.detail.received', {
                id: order.id
            });
    };

    $scope.listened = function () {
        if ($scope.listen_num > 0)
            $state.go('order.detail.listened', {
                id: order.id
            });
    };
    
    $scope.shipped = function () {
        if ($scope.ship_num > 0){
            $state.go('order.detail.shipped', {
                id: order.id
            });
        }
    };

    $scope.jumpToAddressCard = function(){
        $state.go('order.detail.fillin', {
            id: order.id
        })
    }
})

.controller('GiftShippedCtrl', function ($scope,$rootScope, order) {
   
   var receivers = [];
    angular.forEach(order.receivers, function (receiver) {
        var status = receiver.status;
        if (status && status.shipping){
            receivers.push(receiver);
        }
    });
//  alert(JSON.stringify(receivers[1]));
    $scope.receivers = receivers;
})

.controller('GiftListenedCtrl', function ($scope,$rootScope, order) {	
    var receivers = [];
    angular.forEach(order.receivers, function (receiver) {
        var status = receiver.status;
        if(status && status.shipping && status.read){
            receivers.push(receiver);
        }
    });
    
    $scope.receivers = receivers;
})

.controller('GiftReceivedCtrl', function ($scope,$rootScope, order) {
    var receivers = [];
    angular.forEach(order.receivers, function (receiver) {
        // var status = receiver.status;
        // if (!(status && status.shipping && status.read))
        receivers.push(receiver);
    });
    
    $scope.receivers = receivers;
})
;
