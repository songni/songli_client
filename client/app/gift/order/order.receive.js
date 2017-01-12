'use strict';

angular.module('clientApp')
	.component('orderReceive', {
		templateUrl: 'app/gift/order/order.receive.html',
		bindings: {
			order: '<',
			address: '=',
			isShare: '<',
			poiDisabled: '<',
			logisticsDisabled: '<',
			saveAddr: '<'
		},
		controller: function OrderReceive($rootScope, $state, $uibModal, Alert, RestWxPoi, RestGiftOrder){
			let orderId = this.order.id;
			this.$onInit = () => {
				this.scene = this.order.gift.scene || 'logistics';
			}
			if(!this.saveAddr){
  			this.saveAddr = ctrl => {

          if (ctrl.giftAddrForm.$invalid) {
            ctrl.submitted = true;
            return false;
          }
          if (this.address.poi) {
            this.address.scene = 'poi';
          }
          else if (this.address.address) {
            this.address.scene = 'logistics'; 
          }
					
          RestGiftOrder.one(this.order.id).one('address').post('', this.address).then(data => {
            if (!data.rc)
              console.error('saveAddr', '没有response code !');
            switch (data.rc) {
              case 1:
                Alert.add('success', '你已经保存该礼物了', 2000);
                break;
              case 2:
                Alert.add('success', '手慢了，没有礼物了', 2000);
                break;
              case 3:
                Alert.add('success', '信息不全', 2000);
                break;
              case 4:
                if(this.scene === 'logistics'){
                  location.href = $state.href('gift.detail.share', {
                    id: this.order.gift.id
                  });
                }
                if(this.scene === 'poi'){
									let user = $rootScope.user;
									if(user.subscribe){       // 0未关注， 1 关注
										return $state.reload();	
									}
									location.href = $state.href('order.detail.subscribe', {id: orderId})
                }
                break;
              default:
                Alert.add('warning', '系统内部错误', 2000);
                break;
            }
          }, err => {
            console.log('Get an err, ' + JSON.stringify(err));
          });
        } 
			}
		}
	})
	.component('orderReceivePoi', {
		templateUrl: 'app/gift/order/order.receive.poi.html',
		bindings: {
			order: '<',
			address: '=',
			saveAddr: '<'
		},
		controller: function OrderReceivePoi(appConfig, $scope, $state, $uibModal, RestWxPoi, Alert, RestGiftOrder, Wechat){
			this.$onInit = () => {
				this.appConfig = appConfig;
				this.poiLoaded = false;
				this.errors = [];
				let gift = this.order.gift;
				if(gift.status.lbs){
					Wechat.ready(() => {
						wx.getLocation({
							success: res => {
								RestWxPoi.get({
									tag: gift.poitag,
									latitude: res.latitude,
									longitude: res.longitude
								}).then(pois => {
									this.pois = pois;
									this.poiLoaded = true;
								});
							},
							cancel: () => {
								this.errors.push(new Error('您拒绝授权获取地理位置'));
								Alert.add('warning','您拒绝授权获取地理位置', 2000)
							},
							fail: (err) => {
								alert(JSON.stringify(err))
								this.errors.push(new Error('您拒绝授权获取地理位置'));
								Alert.add('warning','您拒绝授权获取地理位置', 2000)
							}
						});
					});
				}else{
					RestWxPoi.get({
						tag: gift.poitag
					}).then(pois => {
						this.pois = pois;
						this.poiLoaded = true;
					});
				}
			}

			this.share = () => {
				$rootScope.modalInstance = $uibModal.open({
					templateUrl: 'app/gift/gift.share.modal.html',
					controller: 'ShareModalCtrl'
				});
			}

			let originSaveAddr = this.saveAddr;

			this.saveAddr = (...args) => {
				if(this.errors.length){
					this.errors.forEach(e => {
						Alert.add('warning', e.message, 2000)
					})
					return;
				}
				originSaveAddr.apply(null, args);
			}

			this.selPoi = () => {
				var pois = this.pois;
				var address = this.address;
				var modalInstance = $uibModal.open({
					templateUrl: 'app/gift/order/gift.poi.modal.html',
					controller: 'GiftPoiModalCtrl',
					size: 'lg',
					resolve: {
						pois: () => pois,
						address: () => address
					}
				})
				modalInstance.result.then(poi => {
					this.address.poi = poi;
				})
			}
			// 获取页面宽度
			$scope.document = {width:document.getElementById("poi").offsetWidth};
		}
	})
	.component('orderReceiveLogistics', {
		templateUrl: 'app/gift/order/order.receive.logistics.html',
		bindings: {
			order: '<',
			address: '=',
			isShare: '<',
			saveAddr: '<'
		},
		controller: function GiftReceiveLogistics($rootScope, appConfig, $state, $uibModal, RestWxPoi, RestGiftOrder){
			this.$onInit = () => {
				this.appConfig = appConfig;
			}
			
			this.share = () => {
        $rootScope.modalInstance = $uibModal.open({
          templateUrl: 'app/gift/gift.share.modal.html',
          controller: 'ShareModalCtrl'
        });
      }
		}
	})
