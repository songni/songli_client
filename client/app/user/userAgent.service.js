
angular.module('clientApp')
.service('UserAgent', function () {
	var u = navigator.userAgent;
	return {
		isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
		isiOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
	}
});