'use strict';

describe('Service: wechat', function () {

  // load the service's module
  beforeEach(module('clientApp'));

  // instantiate service
  var wechat;
  beforeEach(inject(function (_wechat_) {
    wechat = _wechat_;
  }));

  it('should do something', function () {
    expect(!!wechat).toBe(true);
  });

});
