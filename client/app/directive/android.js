'use strict';

angular.module('clientApp')
.directive('targetForAndroid', function () {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var href = element.href;
          if(navigator.userAgent.match(/Android/i)) {
            element.attr("target", "_self");
          }
        }
    };
})
