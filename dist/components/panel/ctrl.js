'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synLibUtilNav = require('syn/lib/util/nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synComponentsCreatorCtrl = require('syn/components/creator/ctrl');

var _synComponentsCreatorCtrl2 = _interopRequireDefault(_synComponentsCreatorCtrl);

var _synComponentsItemCtrl = require('syn/components/item/ctrl');

var _synComponentsItemCtrl2 = _interopRequireDefault(_synComponentsItemCtrl);

var _synComponentsTopBarCtrl = require('syn/components/top-bar/ctrl');

var _synComponentsTopBarCtrl2 = _interopRequireDefault(_synComponentsTopBarCtrl);

var _synComponentsPanelView = require('syn/components/panel/view');

var _synComponentsPanelView2 = _interopRequireDefault(_synComponentsPanelView);

var _synLibAppCache = require('syn/lib/app/cache');

var _synLibAppCache2 = _interopRequireDefault(_synLibAppCache);

var Panel = (function (_Controller) {
  function Panel(props) {
    _classCallCheck(this, Panel);

    _get(Object.getPrototypeOf(Panel.prototype), 'constructor', this).call(this);

    this.props = props;

    this.componentName = 'Panel';
    this.view = _synComponentsPanelView2['default'];

    if (this.props.panel) {
      this.set('panel', this.props.panel);
      this.panel = this.props.panel;
    }

    if (this.props.panel) {
      this.type = this.props.panel.type;
      this.parent = this.props.panel.parent;
      this.skip = this.props.panel.skip || 0;
      this.size = this.props.panel.size || synapp.config['navigator batch size'];
      this.id = Panel.getId(this.props.panel);
    }
  }

  _inherits(Panel, _Controller);

  _createClass(Panel, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'title':
          return this.template.find('.panel-title:first');

        case 'toggle creator':
          return this.template.find('.toggle-creator:first');

        case 'creator':
          return this.template.find('.creator:first');

        case 'items':
          return this.template.find('.items:first');

        case 'load more':
          return this.template.find('.load-more:first');

        case 'create new':
          return this.template.find('.create-new:first');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var _this = this;

      var q = new Promise(function (fulfill, reject) {

        var d = _this.domain;

        d.run(function () {

          var panel = _this.panel;

          // Fill title                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

          _this.find('title').text(panel.type.name);

          // Toggle Creator

          _this.find('toggle creator').on('click', function () {
            console.log('clicked', _this.socket.synuser);
            if (_this.socket.synuser) {
              _synLibUtilNav2['default'].toggle(_this.find('creator'), _this.template, d.intercept());
            } else {
              var topbar = new _synComponentsTopBarCtrl2['default']();
              topbar.find('join button').click();
            }
          });

          // Panel ID

          if (!_this.template.attr('id')) {
            _this.template.attr('id', _this.id);
          }

          var creator = new _synComponentsCreatorCtrl2['default'](_this.props, _this);

          creator.render().then(fulfill, d.intercept.bind(d));

          _this.find('load more').on('click', function () {
            _this.fill();
            return false;
          });

          _this.find('create new').on('click', function () {
            _this.find('toggle creator').click();
            return false;
          });

          // Done

          fulfill();
        }, reject);
      });

      if (typeof cb === 'function') {
        q.then(cb.bind(null, null), cb);
      }

      return q;
    }
  }, {
    key: 'fill',
    value: function fill(item, cb) {
      var _this2 = this;

      if (typeof item === 'function' && !cb) {
        cb = item;
        item = undefined;
      }

      var panel = this.toJSON();

      if (item) {
        panel.item = item;
        panel.type = undefined;
      }

      this.publish('get items', panel).subscribe(function (pubsub, _panel, items) {
        if (Panel.getId(panel) !== Panel.getId(_panel)) {
          return;
        }

        pubsub.unsubscribe();

        console.log('got panel items', items);

        _this2.template.find('.hide.pre').removeClass('hide');
        _this2.template.find('.show.pre').removeClass('show').hide();

        _this2.template.find('.loading-items').hide();

        if (items.length) {

          _this2.find('create new').hide();
          _this2.find('load more').show();

          if (items.length < synapp.config['navigator batch size']) {
            _this2.find('load more').hide();
          }

          _this2.skip += items.length;

          _this2.preInsertItem(items, cb);
        } else {
          _this2.find('create new').show();
          _this2.find('load more').hide();
        }
      });
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var json = {
        type: this.type,
        size: this.size,
        skip: this.skip };

      if (this.parent) {
        json.parent = this.parent;
      }

      return json;
    }
  }, {
    key: 'preInsertItem',
    value: function preInsertItem(items, cb) {
      var _this3 = this;

      var d = this.domain;

      /** Load template */

      // if ( ! cache.getTemplate('Item') ) {
      new _synComponentsItemCtrl2['default']().load();
      // return this.preInsertItem(items, cb);
      // }

      /** Items to object */

      items = items.map(function (item) {
        var props = {};

        for (var _i in _this3.props) {
          props[_i] = _this3.props;
        }

        props.item = item;

        var itemComponent = new _synComponentsItemCtrl2['default'](props);

        itemComponent.load();

        _this3.find('items').append(itemComponent.template);

        return itemComponent;
      });

      var i = 0;
      var len = items.length;

      function next() {
        i++;

        if (i === len && cb) {
          cb();
        }
      }

      items.forEach(function (item) {
        return item.render(d.intercept(next));
      });
    }
  }]);

  return Panel;
})(_synLibAppController2['default']);

Panel.getId = function (panel) {
  var id = 'panel-' + (panel.type._id || panel.type);

  if (panel.parent) {
    id += '-' + panel.parent;
  }

  return id;
};

exports['default'] = Panel;
module.exports = exports['default'];
/** This is about another panel */
// item: app.location.item