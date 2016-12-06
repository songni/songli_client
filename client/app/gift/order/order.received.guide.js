'use strict';

angular.module('clientApp')
	.component('orderReceivedGuide', {
		templateUrl: 'app/gift/order/order.received.guide.html',
		bindings: {
			order: '<'
		},
		controller: function OrderReceivedGuide($rootScope, $state, $uibModal, Alert, RestWxPoi, RestGiftOrder){
			this.$onInit = () => {
				this.user = $rootScope.user;
				this.receiver = this.order.receivers.filter(r => r.userOpenId === this.user.openid)[0];
				this.scene = this.receiver.scene;
				if(this.scene === 'logistics'){
					return $state.go('order.detail.received-result', {
							id: this.order.id
					}, {location: "replace"});
				}
			}

		}
	})