'use strict';

angular.module('clientApp')
	.component('orderReceivedGuide', {
		templateUrl: 'app/gift/order/order.received.guide.html',
		bindings: {
			order: '<',
			scene: '<'
		},
		controller: function OrderReceivedGuide($rootScope, $state, $uibModal, Alert, RestWxPoi, RestGiftOrder){
			this.$onInit = () => {
				
				this.user = $rootScope.user;
				this.isSender = this.order.sender.openid === this.user.openid;
				this.receiver = this.order.receivers.filter(r => r.userOpenId === this.user.openid)[0];
				this.isReceiver = !!this.receiver;				
				this.scene = this.scene || (this.isReceiver && this.receiver.scene || null);
				this.receivedAll = (() => {
					if (this.order.capacity === 1) {
						return !!this.order.receivers[0].telephone;
					}
					return this.order.capacity === this.order.receivers.length;
				})();

				if(this.scene === 'logistics'){
					return $state.go('order.detail.received-result', {
							id: this.order.id
					}, {location: "replace"});
				}
			}

		}
	})