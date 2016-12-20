'use strict';

angular.module('clientApp')
	.component('orderPreReceive', {
		templateUrl: 'app/gift/order/order.pre.receive.html',
		bindings: {
			order: '<',
			interact: '<',
			fill: '<',
			share: '<'
		},
		controller: function orderPreReceive($rootScope, $state){

			this.$onInit = () => {
				if (!$rootScope.user) {
					return;
				}
				this.isSender = this.order.sender.openid === $rootScope.user.openid;
				this.isReceiver = !this.isSender;
				this.type = this.order.capacity > 1 ? 'one2many' : 'one2one';
				this.isAvailable = (() => {
					if (this.type === 'one2one') {
						return !this.order.receivers[0].telephone;
					}
					else{
						return this.order.capacity - (this.order.receivers && this.order.receivers.length || 0) > 0;
					}
				})()
				this.isReceived = this.order.receivers.filter(r => r.userOpenId === $rootScope.user.openid)[0];
				this.receivedCount = this.type === 'one2many' 
					&& this.order.receivers
					&& this.order.receivers.length
					|| 0;
				this.availableCount = this.type === 'one2many'
					&& (this.order.capacity - (this.order.receivers && this.order.receivers.length || 0))
					|| 0;
				this.isInteract = !!this.interact ? !!this.interact : (this.order.capacity > 1 && this.receivedCount > 1);
				
				this.scene = this.order.gift.scene;

				this.one2oneLogisticsSender = this.order.capacity === 1 && this.scene === 'logistics' && this.isSender;
				if (this.one2oneLogisticsSender) {
					this.address = {
						logistics: true,
						consignee: "",
						telephone: "",
						address: ""
					}
				}

				// 送单人   礼物已经被领取(收礼人 或 送礼人)
				if ( this.order.capacity === 1 && this.receivedCount > 1 && (this.isSender || this.isReceiver) ) {
					// let suborder = this.order.receivers.filter(r => r.userOpenId === $rootScope.user.openid)[0];
					 if (this.scene === 'poi') {
						return location.href = $state.href('order.detail.received-guide', {id: this.order.id});	
					 }
				}
			}
		}
	})
