'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libMung = require('../../lib/mung');

var _libMung2 = _interopRequireDefault(_libMung);

var _libUtilIsUrl = require('../../lib/util/is/url');

var _libUtilIsUrl2 = _interopRequireDefault(_libUtilIsUrl);

var _libUtilIsLesserThan = require('../../lib/util/is/lesser-than');

var _libUtilIsLesserThan2 = _interopRequireDefault(_libUtilIsLesserThan);

var _user = require('../user');

var _user2 = _interopRequireDefault(_user);

var _type = require('../type');

var _type2 = _interopRequireDefault(_type);

var _methodsGetPopularity = require('./methods/get-popularity');

var _methodsGetPopularity2 = _interopRequireDefault(_methodsGetPopularity);

var _methodsToPanelItem = require('./methods/to-panel-item');

var _methodsToPanelItem2 = _interopRequireDefault(_methodsToPanelItem);

var _methodsGetLineage = require('./methods/get-lineage');

var _methodsGetLineage2 = _interopRequireDefault(_methodsGetLineage);

var _methodsCountHarmony = require('./methods/count-harmony');

var _methodsCountHarmony2 = _interopRequireDefault(_methodsCountHarmony);

var _methodsCountVotes = require('./methods/count-votes');

var _methodsCountVotes2 = _interopRequireDefault(_methodsCountVotes);

var _methodsCountChildren = require('./methods/count-children');

var _methodsCountChildren2 = _interopRequireDefault(_methodsCountChildren);

var _staticsId = require('./statics/id');

var _staticsId2 = _interopRequireDefault(_staticsId);

var _staticsGetPanelItems = require('./statics/get-panel-items');

var _staticsGetPanelItems2 = _interopRequireDefault(_staticsGetPanelItems);

var _migrations2 = require('./migrations/2');

var _migrations22 = _interopRequireDefault(_migrations2);

var Item = (function (_Mung$Model) {
  function Item() {
    _classCallCheck(this, Item);

    if (_Mung$Model != null) {
      _Mung$Model.apply(this, arguments);
    }
  }

  _inherits(Item, _Mung$Model);

  _createClass(Item, [{
    key: 'toPanelItem',
    value: function toPanelItem() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _methodsToPanelItem2['default'].apply(this, args);
    }
  }, {
    key: 'getPopularity',
    value: function getPopularity() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _methodsGetPopularity2['default'].apply(this, args);
    }
  }, {
    key: 'getLineage',
    value: function getLineage() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _methodsGetLineage2['default'].apply(this, args);
    }
  }, {
    key: 'countHarmony',
    value: function countHarmony() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _methodsCountHarmony2['default'].apply(this, args);
    }
  }, {
    key: 'countVotes',
    value: function countVotes() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _methodsCountVotes2['default'].apply(this, args);
    }
  }, {
    key: 'countChildren',
    value: function countChildren() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return _methodsCountChildren2['default'].apply(this, args);
    }
  }], [{
    key: 'schema',
    value: function schema() {
      return {
        'id': {
          'type': String,
          'unique': true
        },

        'image': {
          'type': String
        },

        'references': {
          'type': [{
            'url': {
              'type': String,
              'validate': _libUtilIsUrl2['default']
            },
            'title': String
          }],
          'default': []
        },

        'subject': {
          'type': String,
          'required': true,
          'validate': (0, _libUtilIsLesserThan2['default'])(255)
        },

        'description': {
          'type': String,
          'required': true,
          'validate': (0, _libUtilIsLesserThan2['default'])(5000)
        },

        'type': {
          'type': _type2['default'],
          'required': true
        },

        'parent': {
          'type': this,
          'index': true
        },

        // When created from another item

        'from': {
          'type': this,
          'index': true
        },

        'user': {
          'type': _user2['default'],
          'required': true,
          'index': true
        },

        // The number of times Item has been promoted

        'promotions': {
          'type': Number,
          'index': true,
          'default': 0
        },

        // The number of times Item has been viewed

        'views': {
          'type': Number,
          'index': true,
          'default': 0
        }
      };
    }
  }, {
    key: 'inserting',
    value: function inserting() {
      return [this.generateId.bind(this)];
    }
  }, {
    key: 'generateId',
    value: function generateId() {
      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return _staticsId2['default'].apply(this, args);
    }
  }, {
    key: 'getPanelItems',
    value: function getPanelItems() {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return _staticsGetPanelItems2['default'].apply(this, args);
    }
  }]);

  return Item;
})(_libMung2['default'].Model);

Item.migrations = {
  2: _migrations22['default']
};

exports['default'] = Item;
module.exports = exports['default'];