'use strict';

angular.module('clientApp')
  .controller('InfoCtrl', function ($scope, $rootScope, RestDocument) {
      RestDocument.one('service_phone').get().then(phone => {
        $scope.phone = phone;
      })
  });
