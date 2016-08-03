'use strict';

angular.module('clientApp')
  .controller('LoginCtrl', function ($scope,$rootScope, RestWechat) {
    $scope.wechat = function(){
      RestWechat.one('client').get({referer:$rootScope.referer})
        .then(function(link) {
          location.href = link.link;
        });
    };
  })
  .controller('ExpSetCtrl', function ($cookieStore,$state,$stateParams,Alert) {
  	if(!$stateParams.token){
  		Alert.add('warning','请设置token');
  		return;
  	}
		$cookieStore.put('token', $stateParams.token);
		if($cookieStore.get('token')){
			location.href = '/';
		}
  })
  .controller('ExpCtrl', function ($cookieStore,$stateParams,RestWechat) {
    RestWechat.one('experience').get({uid:$stateParams.uid}).then(function(data){
      $cookieStore.put('token', data.token);
      location.href = '/';
    });
  });
