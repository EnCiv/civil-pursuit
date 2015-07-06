'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

var _domain = require('domain');

var _libAppGetUrlTitle = require('../../../lib/app/get-url-title');

var _libAppGetUrlTitle2 = _interopRequireDefault(_libAppGetUrlTitle);

function preSaveItem(next, done) {
  var _this = this;

  try {
    (function () {
      var ItemModel = _this.constructor;

      var d = new _domain.Domain().on('error', done);

      var packageItem = function packageItem(item) {
        next();

        fetchUrlTitle(item).then(function (title) {
          try {

            if (title) {
              item.references[0].title = title;
            }

            done();
          } catch (error) {
            done(error);
          }
        });
      };

      if (_this.isNew) {
        ItemModel.generateShortId().then(function (id) {
          try {
            _this.id = id;
            packageItem(_this);
          } catch (error) {
            done(error);
          }
        }, done);
      } else {
        packageItem(_this);
      }
    })();
  } catch (error) {
    done(error);
  }
}

function fetchUrlTitle(item) {
  return new Promise(function (ok, ko) {
    try {

      var lookForTitle = undefined;

      var references = item.references;

      var _references = _slicedToArray(references, 1);

      var ref = _references[0];

      if (ref) {
        var _url = ref.url;
        var title = ref.title;

        if (!title) {
          lookForTitle = true;
        }
      }

      if (lookForTitle) {
        (0, _libAppGetUrlTitle2['default'])(url).then(ok, ko);
      } else {
        ok();
      }
    } catch (error) {
      ko(error);
    }
  });
}

exports['default'] = preSaveItem;
module.exports = exports['default'];