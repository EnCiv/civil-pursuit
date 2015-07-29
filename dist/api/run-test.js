'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _child_process = require('child_process');

// node dist/bin/test-browser test/web/pages/synchronous-error viewport=tablet vendor=firefox env=production || exit 1;

function runTest(event, test) {
  var _this = this;

  try {

    var env = process.env;
    env.SYNAPP_SELENIUM_TARGET = 'http://localhost:3012';

    var cp = (0, _child_process.spawn)('node', ['dist/bin/test-browser', 'test/web/pages/' + test.ref, 'viewport=tablet', 'vendor=firefox', 'env=development'], { env: env });

    cp.on('error', function (error) {
      return _this.error(error);
    }).on('exit', function (status) {
      return console.log('exit', status);
    });

    cp.stdout.on('data', function (data) {
      return console.log({ out: data.toString() });
    });
    cp.stderr.on('data', function (data) {
      return console.log({ err: data.toString() });
    });
  } catch (e) {} finally {}
}

exports['default'] = runTest;
module.exports = exports['default'];