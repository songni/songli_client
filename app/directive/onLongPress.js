'use strict';

angular.module('clientApp')
.directive('onLongPress', function ($timeout, $parse) {
  return {
    restrict: 'A',
    link: function ($scope, $elm, $attrs) {
      $elm.bind('touchstart', function (evt) {
        //evt.preventDefault();
        $scope.longPress = true;
        var functionHandler = $parse($attrs.onLongPress);
        $timeout(function () {
          if ($scope.longPress) {
            $scope.$apply(function () {
              functionHandler($scope, {$event: evt});
            });
          }
        }, 600);
      });
      $elm.bind('touchend', function (evt) {
        $scope.longPress = false;
        var functionHandler = $parse($attrs.onLongPress);
        if ($attrs.onTouchEnd) {
          $scope.$apply(function () {
            functionHandler($scope, {$event: evt});
          });
        }
      });
    }
  };
});