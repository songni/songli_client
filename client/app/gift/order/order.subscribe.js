'use strict';

angular.module('clientApp')
	.component('orderSubscribe', {
		templateUrl: 'app/gift/order/order.subscribe.html',
		bindings: {
			order: '<'
		},
		controller: function orderSubscribe($rootScope, RestGift, $window, appConfig) {
			this.$onInit = () => {
				this.user = $rootScope.user;
				RestGift.one('wx_qrcode')
					.get({ scene: `giftSubToPushUnconsumedSuborder` })
					.then(qr => {
						this.qrcode = qr.response.ticket;
					})
				this.appConfig = appConfig;
				this.$window = $window;
				this.$subscribeWidth = document.getElementById("subscribe").offsetWidth;
			}
		}
	})
