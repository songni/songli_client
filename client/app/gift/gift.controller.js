'use strict';

angular.module('clientApp')
    .controller('GiftCtrl', function($scope, $rootScope) {
        $scope.title = '大礼包';
        $rootScope.bg2 = false;
        $rootScope.hideBar = true;
    })
    .controller('GiftListCtrl', function($scope, $rootScope, $state, Gift) {
    	//页面body背景色
        $rootScope.islist = true;
        $rootScope.isBody2 = false;
    	
        $rootScope.bg2 = false;

        console.warn($rootScope.clientWidth + 'px !important');
        /**
         * #FIXME
         * this is a bit ugly, but for the convenient of production setup
         * use this method temporarily
         * Would refactor in near future
         * https://github.com/arrking/songni/issues/146
         */
        $scope.apiCfg = window.SONGNI_CFG_API;
        $scope.gifts = new Gift();
        $scope.link = function() {
            var id = this.gift.id;
            $state.go('gift.detail', {
                id: id
            });
        };
        wx.ready(function(){
            var iconLiImgUrl = 'http://7xkeqi.com1.z0.glb.clouddn.com/songni%2F%E5%9B%BE%E7%89%87-%E4%BA%AB%E9%93%BE%E6%8E%A5.png';
            var leanOptions = {
                title: $rootScope.merchant.info.name + '的礼物货架',
                link: window.location.href,
                imgUrl: iconLiImgUrl 
            };
            var options = {
                title: '一种有新意又有心意的送礼方式',
                desc: $rootScope.merchant.info.name + '的礼物货架',
                link: window.location.href,
                imgUrl: iconLiImgUrl
            };
            wx.onMenuShareTimeline(leanOptions);
            wx.onMenuShareAppMessage(options);
            wx.onMenuShareQQ(options);
            wx.onMenuShareWeibo(options);
        })
    })
    .controller('GiftDetailCtrl', function($scope, $rootScope, $state, $sce, gift, Alert) {
    	//页面body背景色
        $rootScope.isBody1 = true;
        $rootScope.isBody2 = false;
    	
        //$rootScope.title = "大礼包";
        $scope.appid = hostname[0];
        /**
         * #FIXME
         * this is a bit ugly, but for the convenient of production setup
         * use this method temporarily
         * Would refactor in near future
         * https://github.com/arrking/songni/issues/146
         */
        $scope.apiCfg = window.SONGNI_CFG_API;
        if (gift.info.name) {
            $rootScope.title = gift.info.name;
        }
        $rootScope.bg2 = false;
        $scope.gift = gift;
        $scope.tab = 'gift-card';
        
        $scope.tabTap = function(tab) {
            $scope.tab = tab;
        };
        $scope.iWS = function() {
            $state.go('gift.detail.record', {
                id: $scope.gift.id
            });
        }
        $scope.trustAsHtml = function(html){
            return $sce.trustAsHtml(html);
        }
        wx.ready(function(){
            var iconLiImgUrl = gift.info.cover ? 'http://' + SONGNI_CFG_API.imgUri + gift.info.cover : 'http://7xkeqi.com1.z0.glb.clouddn.com/songni%2F%E5%9B%BE%E7%89%87-%E4%BA%AB%E9%93%BE%E6%8E%A5.png';
            var leanOptions = {
                title: gift.info.name,
                imgUrl: iconLiImgUrl 
            };
            var options = {
                title: '让送礼有新意更有心意',
                desc: gift.info.name,
                imgUrl: iconLiImgUrl 
            };
            wx.onMenuShareTimeline(leanOptions);
            wx.onMenuShareAppMessage(options);
            wx.onMenuShareQQ(options);
            wx.onMenuShareWeibo(options);
        })
    })


.controller('ShareModalCtrl', function($scope, $uibModalInstance) {
    $scope.shareSrc = 'https://img.91pintuan.com/songli/gift_share.png';
    $scope.isCloseModal = false;
    $scope.$watch('isCloseModal', function(val) {
        if (val) $uibModalInstance.close();
    });
})

// Gift Share 
.controller('GiftShareCtrl', function($state, $scope, $rootScope, $stateParams, $uibModal, RestGiftOrder, $timeout) {
    //$rootScope.title = "分享大礼包";
    $rootScope.bg2 = false;
    // $scope.preorders = [{
    //         sender: {
    //             info: {
    //                 headimgurl: '/assets/images/user1.png',
    //                 nickname: '李辛'
    //             }
    //         },
    //         receiver: {
    //             name: '刘静'
    //         }
    //     },

    //     {
    //         sender: {
    //             info: {
    //                 headimgurl: '/assets/images/user2.png',
    //                 nickname: '贺函'
    //             }
    //         },
    //         receiver: {
    //             name: '朱益达'
    //         }
    //     }, {
    //         sender: {
    //             info: {
    //                 headimgurl: '/assets/images/user3.png',
    //                 nickname: '樊星'
    //             }
    //         },
    //         receiver: {
    //             name: '壮壮'
    //         }
    //     }, {
    //         sender: {
    //             info: {
    //                 headimgurl: '/assets/images/user4.png',
    //                 nickname: '至尊宝'
    //             }
    //         },
    //         receiver: {
    //             name: '紫霞仙子'
    //         }
    //     },
    // ];
    RestGiftOrder.one('list').one('s').getList('', {
        limit: 20,
        gift: $stateParams.id
    }).then(function(orders) {
        if (orders[1].length) {
            $scope.orders = [];
            _.each(orders[1], function(val) {
                $scope.orders.push(val);
            });
            marquee("marquee_content", "#marquee_content", 40, 40);
        }
    });
    $scope.shareSrc = 'https://img.91pintuan.com/songli/gift_share.png';
    $scope.shareStyle = {
        width: '50%'
    };
    $scope.share = function() {
        $rootScope.modalInstance = $uibModal.open({
            templateUrl: 'app/gift/gift.share.modal.html',
            scope: $scope
        });
    };

    // $scope.$on('$viewContentLoaded', function() {
    //     marquee("marquee_content", "#marquee_content", 40, $scope.orders.length * 8);
    // });
})

// Gift Orders
.controller('GiftOrdersCtrl', function($scope, $rootScope, $stateParams, RestGiftOrder) {
    //$rootScope.title = "订单列表";
    $rootScope.bg2 = true;
    RestGiftOrder.one('list').one('s').getList('', {
        limit: 10,
        gift: $stateParams.id
    }).then(function(orders) {
        $scope.orders = orders[1];
        var l = $scope.orders.length;
        var i = 0;
        $scope.empty_line = [];
        for (var i = 0; i < 3 - $scope.orders.length; i++) {
            $scope.empty_line.push(i);
        }
    });
})

// Gift Listen
.controller('GiftListenCtrl', function($scope, $rootScope, $state, $stateParams, $timeout, $window, RestGiftOrder, order, Alert) {
    //$rootScope.title = '收听好友的大礼包';
    $scope.innerHeight = $window.innerHeight;
    $scope.innerWidth = $window.innerWidth;

    if ($state.is('order.detail.info')) {
        //$rootScope.title = '订单详情';
    }
    $rootScope.bg2 = true;
    $scope.order = order;
    $scope.status = {
        downloading: false,
        downloaded: false,
        play: false,
        pause: false,
        stop: false
    };

    RestGiftOrder.one($stateParams.id).one('media').get({
        from: $stateParams.from
    }).then(function(media) {
        $scope.media = media;
    }).catch(function(e){
        console.error(e);
    })

    $scope.play = function() {
        wx.downloadVoice({
            serverId: $scope.media.media_id,
            isShowProgressTips: 1,
            success: function(res) {
                $scope.localId = res.localId;
                $scope.status.play = true;
                $scope.status.pause = false;
                wx.playVoice({
                    localId: res.localId,
                    success: function(res) {
                        $scope.$broadcast('timer-start');
                    }
                });
                $scope.pause = function() {
                    wx.pauseVoice({
                        localId: res.localId,
                        success: function(res) {
                            $scope.$broadcast('timer-stop');
                            $scope.status.play = false;
                            $scope.status.pause = true;
                            $scope.$apply();
                        }

                    });
                };
                $scope.resume = function() {
                    wx.playVoice({
                        localId: res.localId,
                        success: function(res) {
                            $scope.$broadcast('timer-start');
                            $scope.status.play = true;
                            $scope.status.pause = false;
                            $scope.$apply();
                        }
                    });
                };
                $scope.stop = function() {
                    wx.stopVoice({
                        localId: res.localId
                    });
                    $scope.$broadcast('timer-stop');
                    $scope.$broadcast('timer-set-countdown', 60);
                };
                $scope.$apply();
            }
        });

        wx.ready(function() {
            wx.onVoicePlayEnd({
                success: function(res) {
                    $scope.$broadcast('timer-set-countdown', 60);
                    $scope.$broadcast('timer-stop');
                    $scope.status.play = false;
                    $scope.status.pause = true;
                    $scope.status.stop = true;
                    $scope.$apply();
                }
            });
        });
    };
    $scope.link = function() {
        $state.go('gift.detail.share', {
            id: order.gift.id
        })
    }
})

// Gift QR codes
.controller('GiftQrcodeCtrl', function($scope, $rootScope) {
    //$rootScope.title = "大礼包";
})

// Gift Audio
.controller('GiftAudioCtrl', function($scope, ngAudio) {
    $scope.audio = ngAudio.load('http://media.songni.cc/2015-7/JBDl12DpTjFIZFg3OCl7-529Aaqj7UHsXVBsfEAW9Cxtgo8UekdyrVxT9FizKcW2.amr');
})


// Gift Guide
.controller('GiftGuideCtrl', function($scope, $rootScope, $stateParams, $window) {
    //$rootScope.title = '礼物引导';
    $rootScope.bg2 = true;
    $scope.selection = 0;
    $scope.innerHeight = $window.innerHeight;
    $scope.innerWidth = $window.innerWidth;
    $scope.swipe = function(direct) {
        if (direct === 'up' && $scope.selection < 2) {
            $scope.selection++;
        }
        if (direct === 'down' && $scope.selection > 0) {
            $scope.selection--;
        }
    };
    $scope.items = [0, 1, 2];
    $scope.selection = $scope.items[0];

});
