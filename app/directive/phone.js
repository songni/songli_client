'use strict';

angular.module('clientApp')
.directive('phone', function () {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue) {
          var PHONE_REGEXP = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/;
          if (PHONE_REGEXP.test(viewValue)) {
            ctrl.$setValidity('phone', true);
            return viewValue;
          } else {
            ctrl.$setValidity('phone', false);
            return undefined;
          }
        });
      }
    };
  })
