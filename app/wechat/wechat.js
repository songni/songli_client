'use strict';

angular.module('clientApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('wepay', {
                url: '/wepay/?id&showwxpaytitle&module&block&type&action',
                templateUrl: function($stateParams) {
                    var url = 'app/' + $stateParams.module + '/' + $stateParams.block + '/' + $stateParams.type + '/' + $stateParams.action + '.html';
                    return url;
                },
                authenticate: true
            })
            .state('weapp', {
                url: '/weapp',
                templateUrl: 'app/wechat/app.html',
                controller: 'WcAppCtrl'
            })
    });
