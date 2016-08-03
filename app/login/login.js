'use strict';

angular.module('clientApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('exp', {
        url: '/exp?uid',
        templateUrl: 'app/login/login.html',
        controller: 'ExpCtrl'
      })
      ;
  });
