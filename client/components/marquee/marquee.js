'use strict';

angular.module('clientApp')
	.component('marquee', {
		template: `
			<div>
				<ul>
					<li ng-repeat="item in items">
						
					</li>
				</ul>
			</div>
		`,
		bindings: {
			items: '<'
		},
		controller: function OrderReceive($rootScope, $scope, $window, appConfig, $state, $uibModal, RestWxPoi, RestGiftOrder){
			this.$onInit = () => {
				
			}
			this.$onChanges = () => {

			}
			this.onDestroy = () => {

			}
		}
	})
