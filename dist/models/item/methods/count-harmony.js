'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _libUtilSequencer = require('../../../lib/util/sequencer');

var _libUtilSequencer2 = _interopRequireDefault(_libUtilSequencer);

var _libGetHarmony = require('../../../lib/get-harmony');

var _libGetHarmony2 = _interopRequireDefault(_libGetHarmony);

function countHarmony() {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      (function () {

        var populateType = function populateType() {
          return new Promise(function (ok, ko) {
            try {
              _this.populate('type').then(ok, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        var getChildren = function getChildren(props) {
          return new Promise(function (ok, ko) {
            try {
              var harmony = _this.__populated.type.harmony;

              var promises = harmony.map(function (side) {
                return new Promise(function (ok, ko) {
                  if (side) {
                    Item.count({
                      parent: _this,
                      type: side
                    }).then(ok, ko);
                  } else {
                    ok(0);
                  }
                });
              });

              Promise.all(promises).then(function (results) {
                try {
                  var _results = _slicedToArray(results, 2);

                  props.pro = _results[0];
                  props.con = _results[1];

                  ok();
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          });
        };

        var calculateHarmony = function calculateHarmony(props) {
          props.harmony = (0, _libGetHarmony2['default'])(props.pro, props.con);
          return props;
        };

        var sequence = [];

        if (!_this.__populated || !_this.__populated.type) {
          sequence.push(populateType);
        }

        sequence.push(getChildren);

        (0, _libUtilSequencer2['default'])(sequence).then(function (props) {
          ok(calculateHarmony(props));
        }, ko);
      })();
    } catch (error) {
      ko(error);
    }
  });
};

exports['default'] = countHarmony;
module.exports = exports['default'];