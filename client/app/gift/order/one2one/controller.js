angular.module('clientApp')

// 送单人
.controller('GiftRecordSingleCtrl', function($scope, $rootScope, $state, $cookies, $timeout, $uibModal, $window, Alert) {
    //$rootScope.title = "录制大礼包";
    $scope.innerHeight = $window.innerHeight;
    $rootScope.bg2 = true;
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
            if ($scope.giftAddrForm.$invalid) {
                $scope.submitted = true;
                return false;
            }
            wx.uploadVoice({
                localId: $scope.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                    $scope.serverId = res.serverId; // 返回音频的服务器端ID
                    var giftOrder = $cookies.getObject('giftOrder') || {};
                    giftOrder.serverId = res.serverId;
                    giftOrder.name = $scope.address.name;
                    giftOrder.capacity = 1;
                    // a tag to show the category
                    // [one2one|one2many| ...]
                    giftOrder.type = 'one2one';
                    $cookies.putObject('giftOrder', giftOrder);
                    //跳转支付
                    var url = $state.href('wepay', {
                        module: 'gift',
                        type: 'one2one',
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
.controller('GiftPayOne2OneCtrl', function($scope, $rootScope, $window, $state, $stateParams, $cookies, $timeout, RestGift, Alert, $css) {
    // Binds stylesheet(s) to scope create/destroy events (recommended over add/remove)

    //$rootScope.title = '微信支付';
    var module = $stateParams.module;
    var action = $stateParams.action;
    var id = $stateParams.id;
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
.controller('OrderReceivedOne2OneCtrl', function($timeout, $scope, $rootScope, $location, $state, $uibModal, $window, RestGiftOrder, Wechat, order, Alert) {
    $scope.order = order;
    $scope.receiver = order.receivers[0];
})
.controller('OrderAddressOne2OneCtrl', function($timeout, $scope, $rootScope, $location, $state, $uibModal, $window, RestGiftOrder, Wechat, order, Alert) {
    // https://github.com/arrking/songni/issues/41
    // 不管是送多人还是送单人，收礼人都是存储到 receivers中

    // impl for v1
    // if (order.receiver && order.receiver.consignee) {
    //     location.href = $state.href('gift.detail.share', {
    //         id: order.gift.id
    //     });
    // }
    // impl for v1 END
    //

    if (order.capacity == 1 && order.receivers.length == 1) {
        // 检查一下手机号，作为对收礼人有效性的校验
        if (order.receivers[0].telephone) {
            // location.href = $state.href('gift.detail.share', {
            //     id: order.gift.id
            // });
            $scope.order = order;
            return;
        }
    } else {
        // TODO, for debugging
        // should replace with console.log afterward.
        Alert.add('warning', '路径错误，此处为一送一！');
    }

    //$rootScope.title = "填写快递地址";
    $scope.innerHeight = $window.innerHeight;
    
        
    $rootScope.bg2 = false;
    $scope.giftAddrForm = {};
    $scope.order = order;
    $scope.address = {
        consignee: order.receivers[0] ? order.receivers[0].name : '',
        address: null,
        telephone: null
    };
    $scope.saveAddr = function() {
        if ($scope.giftAddrForm.$invalid) {
            $scope.submitted = true;
            return false
        }
        let scene = address.scene = address.poi ? 'poi' : 'logistics'
        RestGiftOrder.one(order.id).one('address').post('', $scope.address).then(function(data) {
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
                    Alert.add('warning', '系统内部错误', 2000);
                    break;
            }
            // location.href = $state.href('gift.detail.share', {
            //     id: $scope.order.gift.id
            // });
            /*
            if($scope.isAndroid){
              var url = $state.href('gift.detail.share',{id:$scope.order.gift.id});
              location.href = url;
            }else{
              $state.go("gift.detail.share",{id:$scope.order.gift.id});
            }
            */
        }, function(err) {
//          alert('Get an err, ' + JSON.stringify(err));
            console.log('Get an err, ' + JSON.stringify(err));
        });
    };
    var url = 'http://' + $location.host() + $state.href('order.detail.fillin', {
        id: order.id
    });
    var title = order.sender.name + '送给你一份礼物，快快收礼吧～';
    var desc = '会说话的礼物';
    //var img = 'http://p1.ifindu.cn/crop/w_120/h_120'+order.gift.info.cover;
    var img = order.gift.info.cover ? 'http://' + SONGNI_CFG_API.phtUri + order.gift.info.cover : 'http://7xkeqi.com1.z0.glb.clouddn.com/songni%2F%E5%9B%BE%E7%89%87-%E4%BA%AB%E9%93%BE%E6%8E%A5.png';
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
    $scope.fill = function(){
        location.href = $state.href('order.detail.fillin-one2one', {id: order.id});
    }
})
.controller('OrderAddressOne2OneRecevAddrCtrl', function($timeout, $scope, $rootScope, $location, $state, $uibModal, $window, RestGiftOrder, Wechat, order, Alert) {
    $scope.order = order;
    $scope.address = {
        consignee: order.receivers[0] ? order.receivers[0].name : '',
        address: null,
        telephone: null
    };
})
