'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _domain = require('domain');

var run = function run(fn, catcher) {
  var d = new _domain.Domain().on('error', function (error) {
    return catcher;
  });

  d.run(function () {
    try {
      fn(d);
    } catch (error) {
      catcher(error);
    }
  });
};

run.next = function (fn, catcher) {
  process.nextTick(function () {
    run(fn, catcher);
  });
};

exports['default'] = run;
module.exports = exports['default'];