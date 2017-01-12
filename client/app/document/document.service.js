'use strict';

angular.module('clientApp')
  .service('RestDocument', function (Restangular) {
    return Restangular.service('document');
  })
;
