'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function initValues() {
  var values = {};

  values['-1'] = 0;
  values['+0'] = 0;
  values['+1'] = 0;

  return values;
}

function getAccumulation(itemId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {
        var accumulation = {};

        _this.find({ item: itemId }).exec().then(function (votes) {
          try {
            votes.forEach(function (vote) {

              var value = undefined;

              if (vote.value === 0) {
                value = '-1';
              } else if (vote.value === 1) {
                value = '+0';
              } else if (vote.value === 2) {
                value = '+1';
              }

              if (!accumulation[vote.criteria]) {
                accumulation[vote.criteria] = {
                  total: 0,
                  values: initValues()
                };
              }

              accumulation[vote.criteria].total++;

              accumulation[vote.criteria].values[value]++;
            });

            ok(accumulation);
          } catch (error) {
            ko(error);
          }
        }, ko);
      })();
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getAccumulation;
module.exports = exports['default'];