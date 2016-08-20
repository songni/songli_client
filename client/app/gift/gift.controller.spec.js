'use strict';

describe('Controller: GiftCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var GiftCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GiftCtrl = $controller('GiftCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
