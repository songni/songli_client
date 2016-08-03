'use strict';

angular.module('clientApp')
  .service('RestGift', function (Restangular) {
    return Restangular.service('gift');
  })
  .service('RestGiftOrder', function (Restangular) {
    return Restangular.service('gift/order');
  })
  .factory('Gift', function(RestGift) {
    var Gift = function(params) {
      this.items = [];
      this.busy = false;
      this.page = 1;
      this.limit = 10;
      this.params = params || {};
    };

    Gift.prototype.nextPage = function() {
      if (this.busy) return;
      this.busy = true;
      var query = {page:this.page,limit:this.limit};
      if(this.params.tips){
        query.tips = true;
      }
      RestGift.getList(query).then(function(data){
        var data = data[1];
        for (var i = 0; i < data.length; i++) {
          this.items.push(data[i]);
        }
        if(data.length<this.limit){
          this.busy = true;
          return;
        }
        this.page++;
        this.busy = false;
      }.bind(this));
    };
    return Gift;
  })
  .factory('GiftOrder', function(RestGiftOrder) {
    var GiftOrder = function(params) {
      this.items = [];
      this.busy = false;
      this.page = 1;
      this.limit = 10;
      this.count = 0;
      this.params = params || {};
    };

    GiftOrder.prototype.nextPage = function() {
      if (this.busy) return;
      this.busy = true;
      this.params.page = this.page;
      this.params.limit = this.limit;
      RestGiftOrder.one('list').one('s').getList('',this.params).then(function(data){
        this.count = data[0];
        var items = data[1];
        for (var i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
        if(items.length<this.limit){
          this.busy = true;
          return;
        }
        this.page++;
        this.busy = false;
      }.bind(this));
    };
    return GiftOrder;
  })
;
