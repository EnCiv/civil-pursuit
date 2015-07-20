'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _vote = require('../../vote');

var _vote2 = _interopRequireDefault(_vote);

var _feedback = require('../../feedback');

var _feedback2 = _interopRequireDefault(_feedback);

var _criteria = require('../../criteria');

var _criteria2 = _interopRequireDefault(_criteria);

function getItemDetails(itemId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    try {
      var promises = [_vote2['default'].getAccumulation(itemId), _feedback2['default'].find({ item: itemId }).exec(), _criteria2['default'].find().limit(4).exec()];

      Promise.all(promises).then(function (results) {
        try {
          (function () {
            var _results = _slicedToArray(results, 3);

            var votes = _results[0];
            var feedback = _results[1];
            var criterias = _results[2];

            _this.findById(itemId).exec().then(function (item) {
              try {
                ok({
                  item: item,
                  votes: votes,
                  feedback: feedback,
                  criterias: criterias
                });
              } catch (error) {
                ko(error);
              }
            }, ko);
          })();
        } catch (error) {
          ko(error);
        }
      }, ko);
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = getItemDetails;
module.exports = exports['default'];