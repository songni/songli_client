'use strict';
var debugWx = false;
var hostname = window.location.hostname.split('.');
var token = '';

var req = new XMLHttpRequest();
req.open('GET', '/config', false);
req.send(null);
var response = JSON.parse(req.responseText);
var api = response.api;
window.SONGNI_CFG_API = api;
debugWx = false; //response.debugWx;
function getUrlVars() {
    var vars = [],
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
var code = getUrlVars()["code"];

if (code) {
    req.open('GET', api.uri + '/wechat/token?code=' + code, false);
    req.setRequestHeader('X-API-From', api.from);
    req.setRequestHeader('X-Component', api.component);
    req.send(null);
    token = JSON.parse(req.responseText).token;
}
//*/
//window.ontouchstart = function(e) { e.preventDefault(); };

angular.module('clientApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'restangular',
    'angularMoment',
    'infinite-scroll',
    'currencyFilter',
    'ngTouch',
    'angular-carousel',
    'timer',
    'monospaced.elastic',
    'ngHolder',
    //'ngAudio',
    'swipe',
    // 'door3.css',  deprecated 
    'angularCSS'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $logProvider, RestangularProvider, $cssProvider) {
    angular.extend($cssProvider.defaults, {
        preload: true
    });
    
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $logProvider.debugEnabled('disable'); //disable

    RestangularProvider.setBaseUrl(api.uri);
})
.run(function($rootScope, $cookieStore, $state, $stateParams, Restangular, RestWechat, Wechat, Alert) {
    //$cookieStore.remove('token');
    Restangular.setErrorInterceptor(function(response, deferred, responseHandler) {
        if (response.status === 401) {
            $cookieStore.remove('token');
            RestWechat.one('client').get() //{referer:$state.href($state.current)}
                .then(function(link) {
                    location.href = link.link;
                });
        }
        /*
        if(response.data&&response.data.errmsg){
            Alert.add('danger',response.data.errmsg);
        }else{
            Alert.add('danger','系统错误');
        }
        */
    });
    Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        if (response.status === 205) {
            $cookieStore.remove('token');
            Alert.add('warning', '刷新重新加载本地内容！');
            location.reload();
        }
        return data;
    });
    var headers = {
        'X-API-From': api.from,
        'X-Component': api.component
    };
    Restangular.setDefaultHeaders(headers);
    if (token) {
        $cookieStore.put('token', token);
    }
    if ($cookieStore.get('token')) {
        headers.Authorization = $cookieStore.get('token');
        Restangular.setDefaultHeaders(headers);
        RestWechat.one('userinfo').get().then(function(user) {
            console.warn(user);
            $rootScope.user = user;
        });
    }
    Restangular.one('merchant').get().then(function(data) {
        $rootScope.merchant = data;
    });
    $rootScope.$on('$stateChangeStart', function(event, to, toParams, from, fromParams) {
         
        // $rootScope.bodyStyle = 'body_style_green';
        // $rootScope.bodyStyle = 'body_style_grey';
		// console.log(to)
		
        $rootScope.referer = $state.href(from.name, fromParams);
        if (to.authenticate && !$cookieStore.get('token')) {
            event.preventDefault();
            //$state.go('login');
            RestWechat.one('client').get({
                    referer: $state.href(to.name, toParams)
                }) //{referer:$state.href(to.name,toParams)}
                .then(function(link) {
                    location.href = link.link;
                });
        }
    });
    $rootScope.$on("$stateChangeSuccess", function(event, to, toParams, from, fromParams) {
		// 页面为绿背景
        let bodyStyle1 = [
        	'gift.detail.share',
        	'order.detail.fillin',
       		'order.detail.fillin-one2many',
        	'order.detail.one2one-received',
        	'order.detail.one2one-address',
        	'order.detail.one2many-address'
        ]; 
        $rootScope.referer = $state.href(from.name, fromParams);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        if ($rootScope.isAndroid){
            Wechat.config();
        }
        if(bodyStyle1.indexOf(to.name) >= 0){
            $rootScope.bodyStyle = 'bodyStyle1' 
        }
        else{
            $rootScope.bodyStyle = 'bodyStyle2' 
        }
		// console.log(to)
        //Wechat.config(); //不支持spa history.pushState
    });
    Wechat.config();
    //Wechat.ready();
    wx.error(function(res) {
        Alert.add('warning', res.errMsg);
        console.log(res.errMsg);
    });
    $rootScope.isAndroid = navigator.userAgent.match(/Android/i);
    $rootScope.clientWidth = document.body.clientWidth;
});