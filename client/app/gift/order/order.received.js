'use strict';

angular.module('clientApp')
	.component('orderReceived', {
		templateUrl: 'app/gift/order/order.received.html',
		bindings: {
			order: '<'
		},
		controller: function OrderReceive($rootScope, $scope, $window, appConfig, $state, $uibModal, RestWxPoi, RestGiftOrder){
			this.$onInit = () => {
				this.isSender = this.order.sender.openid === $rootScope.user.openid;
				this.scene = this.order.gift.scene || 'logistics';
				this.appConfig = appConfig;
				this.$rootScope = $rootScope;
				this.suborder = this.order.receivers.filter(r => r.userOpenId === $rootScope.user.openid)[0] || null;
				this.isReceiver = !!this.suborder;
				if(!this.isSender && !this.isReceiver){
					this.suborder = null;
				}
			}
			
			this.openLocation = poiOrigin => {
				let poi = poiOrigin.base_info
				wx.ready(function(){
					wx.openLocation({
						latitude: poi.latitude,
						longitude: poi.longitude,
						name: poi.business_name + '' + poi.branch_name,
						address: poi.province + poi.city + poi.district + poi.address,
						scale: 17,
						infoUrl: window.location.href,
						fail: function(res){
							location.reload();
						}
					});
				});
			}
			// 获取页面宽度
			$scope.screen = {height:$window.innerHeight,width:$window.innerWidth};
      $scope.document = {width:document.getElementById("received").offsetWidth};
      // 商家信息页面
      $scope.openMerchant = function() {
        $uibModal.open({
          templateUrl: 'app/gift/order/merchant.info.html',
          size: 'lg',
        });  
      } 
		}
	})
