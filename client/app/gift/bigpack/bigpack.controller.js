angular.module('clientApp')
	.controller('BigpackDetailCtrl', ($rootScope, $state, order) => {
		$rootScope.$watch('user', user => {
			if (user) {
				if (!user.subscribe) {
					return $state.go('bigpack.detail.subscribe')
				}
				if (order.sender && order.sender.openid === user.openid) {
					return $state.go('order.detail.fillin', {id: order.id})
				}
				return $state.go('bigpack.detail.index')
			}
		})
	})
	.controller('BigpackDetailIndexCtrl', ($scope, $rootScope, $window, order, $state) => {
		$scope.order = order;
		$scope.apiCfg = window.SONGNI_CFG_API;
		$rootScope.$watch('user', user => {
			$scope.isUnavailable = order.sender && order.sender.oppenid != user.openid;
		})
		$scope.screen = { width:$window.innerWidth, height:$window.innerHeight };
	})
	.controller('BigpackDetailSubscribeCtrl', ($scope, $window, order) => {
		$scope.order = order;
		$scope.screen = { width:$window.innerWidth, height:$window.innerHeight };
	})
	.controller('BigpackDetailRecordCtrl', ($scope, $controller, $state, order, RestGiftOrder, Alert, Wechat) => {
		$scope.order = order;
		let ctrlToExtend = order.capacity === 1 ? 'GiftRecordSingleCtrl' : 'GiftRecordMultiCtrl';
		$controller(ctrlToExtend, { $scope })
		Wechat.ready(function() {
			$scope.save = () => {
				if ($scope.giftAddrForm && $scope.giftAddrForm.$invalid) {
					$scope.submitted = true;
					return false;
				}
				wx.uploadVoice({
					localId: $scope.localId,
					isShowProgressTips: 1,
					success: res => {
						order.serverId = res.serverId;
						if ($scope.address.name) {
							order.name = $scope.address.name;
						}
						RestGiftOrder.one(order.id).one('complete').post(null, order)
							.then(data => {
								return $state.go('order.detail.fillin', {id: order.id})
							})
					},
					fail: function fail(res) {
						//$state.go(data.state,{id:id});
						Alert.add('warning', res.errMsg);
					}
				});
			}
		})
		
	})
	