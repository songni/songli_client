angular.module('clientApp')

// 送多人
.controller('GiftRecordMultiCtrl', function($scope, $rootScope, $state, $cookies, $timeout, $uibModal, $window, Alert) {
    //$rootScope.title = "录制大礼包";
    $scope.innerHeight = $window.innerHeight;
    $rootScope.moreRecode = {
    	"background" : "#F2F2F2"
    }
    $rootScope.bg2 = true;
    $scope.giftOrderCapacity = null; // 默认是1人，但是要显示placeholder，就
    // 默认设置成null，下单后检查
    $scope.address = {
        name: '' // to be compatible with v1 code
    };

    $scope.status = {
        start: false,
        stop: true,
        record: false,
        playVoice: false,
        stopVoice: true,
        isAlert: true
    };

    $scope.$on('timer-stopped', function(event, data) {
        console.log('Timer Stopped - data = ', data);
    });

    wx.ready(function() {

        // 份数 减一
        $scope.reduCapacity = function() {
            if ($scope.giftOrderCapacity && $scope.giftOrderCapacity > 2) {
                $scope.giftOrderCapacity -= 1;
            } else if ($scope.giftOrderCapacity == 2) {
                Alert.add('warning', '礼物份数至少是2份', 2000);
            }
        }

        // 份数 加一
        $scope.incrCapacity = function() {
            if ($scope.giftOrderCapacity == null) {
                $scope.giftOrderCapacity = 3;
            } else if ($scope.giftOrderCapacity > 0) {
                $scope.giftOrderCapacity += 1;
            }
        }

        //录制
        $scope.record = function() {
            $scope.$broadcast('timer-set-countdown', 60);
            wx.startRecord({
                success: function(res) {
                    $scope.status.start = true;
                    $scope.status.stop = false;
                    $scope.status.record = false;
                    $scope.$broadcast('timer-start');
                    $scope.$apply();
                }
            });
        };
        //结束录音
        $scope.stop = function() {
            wx.stopRecord({
                success: function(res) {
                    $scope.localId = res.localId;
                    $scope.status.start = false;
                    $scope.status.record = true;
                    $scope.$broadcast('timer-stop');
                    $scope.$apply();
                }
            });
        };
        //播放录音
        $scope.playVoice = function() {
            $scope.$broadcast('timer-set-countdown', 60);
            if ($rootScope.isAndroid) {
                if ($scope.status.isAlert) {
                    $uibModal.open({
                        templateUrl: 'app/gift/gift.headphones.modal.html',
                        controller: function($scope, $uibModalInstance) {
                            $scope.close = function() {
                                $uibModalInstance.dismiss('cancel');
                            }
                        },
                        size: 'sm'
                    });
                    $scope.status.isAlert = false;
                    $scope.$apply();
                    return;
                }
            }
            wx.playVoice({
                localId: $scope.localId,
                success: function() {
                    $scope.$broadcast('timer-start');
                    $scope.$apply();
                }
            });
        };

        $scope.rerecord = function() {
            $scope.$broadcast('timer-reset');
            $scope.$broadcast('timer-set-countdown', 60);
            $scope.status = {
                start: false,
                stop: true,
                record: false,
                playVoice: false,
                stopVoice: true
            };
        };
        $scope.save = function() {

            if ($scope.giftOrderCapacity && $scope.giftOrderCapacity < 2) {
                Alert.add('warning', '礼物份数至少是2份', 2000);
                return;
            }

            wx.uploadVoice({
                localId: $scope.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                    $scope.serverId = res.serverId; // 返回音频的服务器端ID
                    var giftOrder = $cookies.getObject('giftOrder') || {};
                    giftOrder.serverId = res.serverId;
                    giftOrder.name = $scope.address.name;
                    giftOrder.capacity = $scope.giftOrderCapacity || 2;
                    // a tag to show the category
                    // [one2one|one2many| ...]
                    giftOrder.type = 'one2many';
                    $cookies.putObject('giftOrder', giftOrder);
                    //跳转支付
                    var url = $state.href('wepay', {
                        module: 'gift',
                        type: giftOrder.type,
                        action: 'pay',
                        block: 'order',
                        id: $scope.gift.id,
                        showwxpaytitle: 1
                    });
                    location.href = url;
                }
            });
        };

        //$scope.$apply();
        wx.onVoiceRecordEnd({
            // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: function(res) {
                $scope.localId = res.localId;
                $scope.status.start = false;
                $scope.status.record = true;
                $scope.$apply();
            }
        });
        wx.onVoicePlayEnd({
            success: function(res) {
                $scope.$broadcast('timer-set-countdown', 60);
                $scope.$broadcast('timer-stop');
                $scope.$apply();
            }
        });
    });

})

// Gift Payment
.controller('GiftPayOne2ManyCtrl', function($scope, $rootScope, $window, $state, $stateParams, $cookies, $timeout, RestGift, Alert, $css) {
    // Binds stylesheet(s) to scope create/destroy events (recommended over add/remove)
    //$rootScope.title = '微信支付';

    var module = $stateParams.module;
    var action = $stateParams.action;
    var id = $stateParams.id;
    var block = $stateParams.block;

    $scope.gift = RestGift.one(id).get().$object;
    $scope.capacity = $cookies.getObject('giftOrder').capacity;
    $scope.submiting = false;
    $scope.wxPay = function() {
        var giftOrder = $cookies.getObject('giftOrder');
        $scope.submiting = true;
        $timeout(function() {
            $scope.submiting = false;
        }, 5000);
        RestGift.one(id).one('preorder').post('', giftOrder).then(function(data) {
            wx.chooseWXPay({
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign,
                success: function(res) {
                    var url = $state.href(data.state, {
                        id: data.id
                    });
                    location.href = url;
                },
                cancel: function(res) {
                    $scope.submiting = false;
                    //$state.go(data.state,{id:id});
                },
                fail: function(res) {
                    $scope.submiting = false;
                    //$state.go(data.state,{id:id});
                    Alert.add('warning', res.errMsg);
                }
            });
        }, function(response) {
            Alert.add('danger', response.data.errmsg);
        });
    };
})


.controller('OrderAddressOne2ManySendCtrl', function($scope, $rootScope, $state, $cookies, Wechat, $location, order, $uibModal) {
    //$rootScope.title = "选择大礼包";
    
    $rootScope.bg2 = false;
    $rootScope.hideBar = true;
    $scope.order = order;
    $scope.address = {};
    $scope.user = $rootScope.user;


    var url = 'http://' + $location.host() + $state.href('order.detail.fillin', {
        id: order.id
    });
    var title = order.sender.name + '送给你一份礼物，快快收礼吧～';
    var desc = '会说话的礼物';
    //var img = 'http://p1.ifindu.cn/crop/w_120/h_120'+order.gift.info.cover;
    var img = order.gift.info.cover ? 'http://' + SONGNI_CFG_API.imgUri + order.gift.info.cover : 'http://7xkeqi.com1.z0.glb.clouddn.com/songni%2F%E5%9B%BE%E7%89%87-%E4%BA%AB%E9%93%BE%E6%8E%A5.png';
    var timeline = title + ',' + desc;
    Wechat.ready({
        url: url,
        title: title,
        desc: desc,
        timeline: timeline,
        img: img,
        state: 'gift.detail.share',
        params: {
            id: $scope.order.gift.id
        }
    });
    $scope.share = function() {
        $rootScope.modalInstance = $uibModal.open({
            templateUrl: 'app/gift/gift.share.modal.html',
            controller: 'ShareModalCtrl'
        });
    };
})

.controller('OrderAddressOne2ManyRecevCtrl', function($scope, $rootScope, $state, $stateParams, $cookies, Wechat, RestWechat, $location, order, $uibModal) {
    
    //$rootScope.title = "选择大礼包";
    $scope.order = order;
    $scope.user = $rootScope.user;


    // 如果没有 user, 需要跳转到认证界面
    // 
    if ($scope.user === undefined)
        RestWechat.one('client').get({
            referer: $state.href('order.detail.fillin', $stateParams)
        })
        .then(function(link) {
            window.location.href = link.link;
        });
    if($rootScope.user.id === (order.sender.id || order.sender._id)){
        $state.go('order.detail.one2many-address', null, {location: "replace"})
        return;
    };

    $rootScope.bg2 = false;
    $rootScope.hideBar = true;
    $scope.address = {};
    $scope.isReceived = false;
    $scope.isAvailble = true;
    $scope.isSender = false;
    // this is a flag for the order's status
    $scope.orderStatus = 0;

    // check the person who open the link is the sender
    if ($scope.user.id === order.sender.id) {
        $scope.isSender = true;
    }

    if (_.some(order.receivers, function(receiver) {
            return receiver.userOpenId == $rootScope.user.openid;
        })) {
        // 已经领了礼物了
        $scope.isReceived = true;
    }

    $scope.orderReserved = order.receivers.length;
    $scope.orderSurplus = order.capacity - order.receivers.length;
    // if order.receivers.length == 0, 抢完了
    if ($scope.orderSurplus === 0) {
        // 礼物没有了
        $scope.isAvailble = false;
    }

    // 还没有领，而且有余量
    $scope.fill = function() {
        if ($scope.isAndroid) {
            var url = $state.href('order.detail.fillin-one2many', {
                id: $scope.order.id
            });
            location.href = url;
        } else {
            $state.go("order.detail.fillin-one2many", {
                id: $scope.order.id
            });
        }
    }

    /**
     * resolve what status is this order
     * @return {[type]} [description]
     * 
     */
    function _computeStatus() {
        var result = 0;
        var a = 1;
        var b = 10;
        var c = 100;

        if ($scope.isAvailble) {
            result = a;
        }
        if ($scope.isReceived) {
            result += b;
        }
        if ($scope.isSender) {
            result += c;
        }

        $scope.orderStatus = result;
    }

    _computeStatus();

    /**
     * 分享的内容
     */
    var url = 'http://' + $location.host() + $state.href('order.detail.fillin', {
        id: order.id
    });
    var title = order.sender.name + '送给你一份礼物，快快收礼吧～';
    var desc = '会说话的礼物';
    //var img = 'http://p1.ifindu.cn/crop/w_120/h_120'+order.gift.info.cover;
    var img = order.gift.info.cover ? 'http://' + SONGNI_CFG_API.imgUri + order.gift.info.cover : 'http://7xkeqi.com1.z0.glb.clouddn.com/songni%2F%E5%9B%BE%E7%89%87-%E4%BA%AB%E9%93%BE%E6%8E%A5.png';
    var timeline = title + ',' + desc;
    Wechat.ready({
        url: url,
        title: title,
        desc: desc,
        timeline: timeline,
        img: img,
        state: 'gift.detail.share',
        params: {
            id: $scope.order.gift.id
        }
    });

    /**
     * 送礼人第二次打开链接，此时还有礼物，可以再次分享
     */
    $scope.shareAsSender = function() {
        $rootScope.modalInstance = $uibModal.open({
            templateUrl: 'app/gift/gift.share.modal.html',
            controller: 'ShareModalCtrl'
        });
    }

})

.controller('OrderAddressOne2ManyRecevAddrCtrl', function($scope, $rootScope, $state, $cookies, Wechat, $location, order, Alert, RestGiftOrder) {

    $rootScope.bg2 = false;
    $rootScope.hideBar = true;
	$scope.addressFriendForm = {};
    $scope.data = {
        consignee: "",
        telephone: "",
        address: ""
    }
    
    $scope.saveAddr = function() {
        if ($scope.addressFriendForm.$invalid) {
            $scope.submitted = true;
            return false;
			//Alert.add('warning', '收礼人信息不能为空！', 2000);
        } else {
        	 Alert.add('success', '领取成功等待收礼吧！', 2000);
            // post request to save receiver info
            // post(subElement, elementToPost, [queryParams, headers])
            RestGiftOrder.one(order.id).one('address').post('', $scope.data).then(function(data) {
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
                        location.href = $state.href('gift.detail.share', {
                            id: order.gift.id
                        });
                        break;
                    default:
                        Alert.add('warning', '服务器走神了', 2000);
                        break;
                }
            }, function(err) {
//                  alert('Get an err, ' + JSON.stringify(err));
                console.log('Get an err, ' + JSON.stringify(err));
            });
        };
    }
})

;
