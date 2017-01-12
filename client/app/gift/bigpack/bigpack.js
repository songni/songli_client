'use strict';

angular.module('clientApp')
	.config(function($stateProvider) {
		$stateProvider
			.state('bigpack', {
				abstract: true,
				url: '/bigpack',
				template: '<ui-view/>'
			})
			.state('bigpack.detail', {
				url: '/:id',
				template: '<ui-view/>',
				resolve: {
					order: ($stateParams, RestGiftOrder) => {　
						return RestGiftOrder.one($stateParams.id).one('detail').get({
							from: $stateParams.from
						});
					}
				},
				controller: 'BigpackDetailCtrl'
			})
			.state('bigpack.detail.index', {
				url: '/index',
				authenticate: true,
				templateUrl: 'app/gift/bigpack/bigpack.detail.html',
				controller: 'BigpackDetailIndexCtrl'
			})
			.state('bigpack.detail.subscribe', {
				url: '/subscribe',
				templateUrl: 'app/gift/bigpack/bigpack.subscribe.html',
				controller: 'BigpackDetailSubscribeCtrl'
			})
			.state('bigpack.detail.record', {
				url: '/record',
				authenticate: true,
				templateProvider: ['$templateRequest', 'order', (templateRequest, order) => {
					if (order.capacity === 1) {
						return templateRequest('app/gift/order/one2one/record.html')
					}
					return templateRequest('app/gift/order/one2many/record.html')
				}],
				controller: 'BigpackDetailRecordCtrl',
				resolve: {
					bigpack: () => true
				}
			})
	})