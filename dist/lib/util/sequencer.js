'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function sequencer() {
  var pipeline = arguments[0] === undefined ? [] : arguments[0];
  var locals = arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (ok, ko) {
    try {
      (function () {
        var cursor = 0;

        var run = function run() {
          try {
            if (pipeline[cursor]) {
              pipeline[cursor](locals).then(function () {
                try {
                  cursor++;
                  run();
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } else {
              ok(locals);
            }
          } catch (error) {
            ko(error);
          }
        };

        run();
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = sequencer;
module.exports = exports['default'];