! function () {
  
  'use strict';

  function Cache () {
    this.entries = {};
  }

  Cache.prototype.get = function (key) {
    return this.entries[key];
  };

  Cache.prototype.set = function (key, value) {
    return this.entries[key] = value;
  };

  module.exports = Cache;

} ();
