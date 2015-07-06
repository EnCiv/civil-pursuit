'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _synModelsVote = require('syn/models/vote');

var _synModelsVote2 = _interopRequireDefault(_synModelsVote);

var _synModelsFeedback = require('syn/models/feedback');

var _synModelsFeedback2 = _interopRequireDefault(_synModelsFeedback);

var _synModelsCriteria = require('syn/models/criteria');

var _synModelsCriteria2 = _interopRequireDefault(_synModelsCriteria);

function getItemDetails(itemId) {
  var _this = this;

  return new Promise(function (ok, ko) {
    Promise.all([_synModelsVote2['default'].getAccumulation(itemId), _synModelsFeedback2['default'].find({ item: itemId }).exec()]).then(function (results) {
      try {
        (function () {
          var _results = _slicedToArray(results, 2);

          var votes = _results[0];
          var feedback = _results[1];

          _this.findById(itemId).exec().then(function (item) {
            try {
              _synModelsCriteria2['default'].find({ type: item.type }).exec().then(function (criterias) {
                try {
                  ok({
                    item: item,
                    votes: votes,
                    feedbacks: feedback,
                    criterias: criterias
                  });
                } catch (error) {
                  ko(error);
                }
              }, ko);
            } catch (error) {
              ko(error);
            }
          }, ko);
        })();
      } catch (error) {
        ko(error);
      }
    }, ko);
  });
}

exports['default'] = getItemDetails;
module.exports = exports['default'];