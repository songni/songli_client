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
                },
                css: [{
                    href: 'assets/v2/css/gzhh.css',
                }]
            });
    });
