'use strict';

angular.module('clientApp')
	.component('orderInteract', {
		templateUrl: 'app/gift/order/order.interact.html',
		bindings: {
			order: '<'
		},
		controller: function OrderInteract(){
			this.$onInit = () => {
				this.scene = this.order.gift.scene || 'logistics';
				this.remainCount = this.order.capacity - this.order.receivers.length;
			}
		}
	})
