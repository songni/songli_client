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

    var receive_num = 0;
    var listen_num = 0;
    var ship_num = 0;

    angular.forEach(order.receivers, function (receiver) {
        var status = receiver.status;

        if (status && status.shipping && !status.read)
            ship_num++;

        if (status && status.shipping && status.read)
            listen_num++;

        if (!(status && status.shipping && status.read))
            receive_num++;
    });
    
    $scope.receive_num = receive_num;
    $scope.listen_num = listen_num;
    $scope.ship_num = ship_num;
    
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
        if (listen_num > 0)
            $state.go('order.detail.listened', {
                id: order.id
            });
    };
    
    $scope.shipped = function () {
        if (ship_num > 0)
            $state.go('order.detail.shipped', {
                id: order.id
            });
    };
})

.controller('GiftShippedCtrl', function ($scope, order) {
   var receivers = [];
    
    angular.forEach(order.receivers, function (receiver) {
        var status = receiver.status;
        if (status && status.shipping && !status.read)
            receivers.push(receiver);
    });
    
    $scope.receivers = receivers;
})

.controller('GiftListenedCtrl', function ($scope, order) {
    var receivers = [];
    
    angular.forEach(order.receivers, function (receiver) {
        var status = receiver.status;
        if (status && status.shipping && status.read)
            receivers.push(receiver);
    });
    
    $scope.receivers = receivers;
})

.controller('GiftReceivedCtrl', function ($scope, order) {
    var receivers = [];
    angular.forEach(order.receivers, function (receiver) {
        var status = receiver.status;
        console.warn(status && status.shipping && status.read);
        if (!(status && status.shipping && status.read))
            receivers.push(receiver);
    });
    
    $scope.receivers = receivers;
})
;
