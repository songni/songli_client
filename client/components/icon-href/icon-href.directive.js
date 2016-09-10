'use strict';

angular.module('clientApp')
	.directive('iconHref', function(){
		function link(scope, element, attrs) {
			!attrs.theme && (attrs.theme = 'grey'); 
			scope.theme = attrs.theme;
		}
		return {
			restrict: 'E',
			templateUrl: 'components/icon-href/icon-href.html',
			link: link
		};
	})