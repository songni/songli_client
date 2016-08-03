'use strict';

angular.module('clientApp')
  .controller('MainCtrl', function ($scope,$rootScope,gifts) {
    $rootScope.title = "大礼包列表";
    $rootScope.hideBar = true;
    $scope.gifts = gifts;
  });
