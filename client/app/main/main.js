'use strict';

angular.module('clientApp')
    .config(function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'app/gift/gift.lists.html',
                controller: 'GiftListCtrl',
                resolve: {
                    gifts: function(RestGift) {　
                        return RestGift.getList();
                    }
                }
            })
            .state('info', {
                url: '/info',
                templateUrl: 'app/main/info.html'
            });
    });
