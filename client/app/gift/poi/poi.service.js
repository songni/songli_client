angular.module('clientApp')
	.service('RestWxPoi', function (RestWechat) {
		return RestWechat.one('poi');
	});