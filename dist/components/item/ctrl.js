'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _libUtilNav = require('../../lib/util/nav');

var _libUtilNav2 = _interopRequireDefault(_libUtilNav);

var _libUtilReadMore = require('../../lib/util/read-more');

var _libUtilReadMore2 = _interopRequireDefault(_libUtilReadMore);

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var _componentsPromoteCtrl = require('../../components/promote/ctrl');

var _componentsPromoteCtrl2 = _interopRequireDefault(_componentsPromoteCtrl);

var _componentsDetailsCtrl = require('../../components/details/ctrl');

var _componentsDetailsCtrl2 = _interopRequireDefault(_componentsDetailsCtrl);

var _componentsPanelCtrl = require('../../components/panel/ctrl');

var _componentsPanelCtrl2 = _interopRequireDefault(_componentsPanelCtrl);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _controllersMedia = require('./controllers/media');

var _controllersMedia2 = _interopRequireDefault(_controllersMedia);

var _controllersToggleArrow = require('./controllers/toggle-arrow');

var _controllersToggleArrow2 = _interopRequireDefault(_controllersToggleArrow);

var _controllersTogglePromote = require('./controllers/toggle-promote');

var _controllersTogglePromote2 = _interopRequireDefault(_controllersTogglePromote);

var ItemCtrl = (function (_Controller) {
  function ItemCtrl(props) {
    _classCallCheck(this, ItemCtrl);

    _get(Object.getPrototypeOf(ItemCtrl.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', this.props.item);
    }

    this.componentName = 'Item';
    this.view = _view2['default'];
  }

  _inherits(ItemCtrl, _Controller);

  _createClass(ItemCtrl, [{
    key: 'listen',
    value: function listen() {
      var _this = this;

      var self = this;

      this.socket.once('item image uploaded ' + this.props.item._id, function (item) {
        _this.set('image', item.image);
      });
    }
  }, {
    key: 'media',
    value: function media() {
      return _controllersMedia2['default'].apply(this);
    }
  }, {
    key: 'makeRelated',
    value: function makeRelated(cls) {
      var button = $('<button class="shy counter"><span class="' + cls + '-number"></span> <i class="fa"></i></button>');

      return button;
    }
  }, {
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'subject':
          return this.template.find('.item-subject a');

        case 'description':
          return this.template.find('.description');

        case 'toggle promote':
          return this.template.find('.item-toggle-promote');

        case 'promote':
          return this.template.find('.promote');

        case 'reference':
          return this.template.find(' > .item-text .item-reference a');

        case 'media':
          return this.template.find('.item-media:first');

        case 'youtube preview':
          return this.template.find('.youtube-preview:first');

        case 'toggle details':
          return this.template.find('.item-toggle-details:first');

        case 'details':
          return this.template.find('.details:first');

        case 'buttons':
          return this.template.find('> .item-buttons');

        case 'editor':
          return this.template.find('.editor:first');

        case 'toggle arrow':
          return this.template.find('.item-arrow:first');

        case 'promotions':
          return this.template.find('.promoted:first');

        case 'promotions %':
          return this.template.find('.promoted-percent:first');

        case 'children':
          return this.template.find('.children:first');

        case 'collapsers':
          return this.template.find('.item-collapsers:first');

        case 'collapsers hidden':
          return this.template.find('.item-collapsers:first:hidden');

        case 'collapsers visible':
          return this.template.find('.item-collapsers:first:visible');

        case 'related count':
          return this.template.find('.related-count');

        case 'related':
          return this.template.find('.related');

        case 'related count plural':
          return this.template.find('.related-count-plural');

        case 'related name':
          return this.template.find('.related-name');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var _this2 = this;

      if (!this.rendered) {
        setTimeout(function () {
          return _this2.listen();
        });
        this.rendered = true;
      }

      var item = this.get('item');

      var self = this;

      self.toggleArrow = this.toggleArrow.bind(this);

      // Create reference to promote if promotion enabled

      this.promote = new _componentsPromoteCtrl2['default'](this.props, this);

      // Create reference to details

      this.details = new _componentsDetailsCtrl2['default'](this.props, this);

      // Set ID

      this.template.attr('id', 'item-' + item._id);

      // Set Data

      this.template.data('item', this);

      // SUBJECT

      this.find('subject').attr('href', '/item/' + item.id + '/' + (0, _string2['default'])(item.subject).slugify().s).text(item.subject).on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        _libUtilNav2['default'].scroll(item, function () {
          history.pushState(null, null, link.attr('href'));
          item.find('.item-text .more').click();
        });

        return false;
      });

      // DESCRIPTION   

      this.find('description').text(item.description);

      // MEDIA

      if (!this.find('media').find('img[data-rendered]').length) {
        this.find('media').empty().append(this.media());
      }

      this.on('set', function (key, value) {
        if (key === 'image') {
          item.image = value;
          _this2.set('item', item);
          _this2.find('media').empty().append(_this2.media());
        }
      });

      // READ MORE

      this.find('media').find('img, iframe').on('load', (function () {
        if (!_this2.template.find('.more').length) {
          (0, _libUtilReadMore2['default'])(item, _this2.template);
        }
      }).bind(item));

      // REFERENCES

      if (item.references && item.references.length) {
        this.find('reference').attr('href', item.references[0].url).text(item.references[0].title || item.references[0].url);
      } else {
        this.find('reference').empty();
      }

      // PROMOTIONS

      this.find('promotions').text(item.promotions);

      // POPULARITY

      var popularity = item.popularity.number;

      if (isNaN(popularity)) {
        popularity = 0;
      }

      this.find('promotions %').text(popularity + '%');

      // CHILDREN / RELATED

      if (!this.find('buttons').find('.related-number').length) {
        var buttonChildren = this.makeRelated('related');
        buttonChildren.addClass('children-count');
        buttonChildren.find('i').addClass('fa-fire');
        buttonChildren.find('.related-number').text(item.children);
        this.find('related').append(buttonChildren);
      }

      this.template.find('.children-count').on('click', function () {
        var $trigger = $(this);
        var $item = $trigger.closest('.item');
        var item = $item.data('item');
        // item.find('toggle arrow').click();
        self.toggleArrow(true, false);
      });

      // HARMONY

      if ('harmony' in item) {
        var buttonHarmony = this.makeRelated('harmony');
        buttonHarmony.addClass('harmony-percent');
        buttonHarmony.find('i').addClass('fa-music');
        buttonHarmony.find('.harmony-number').text(item.harmony);
        this.find('related').append(buttonHarmony);
      }

      this.template.find('.harmony-percent').on('click', function () {
        var $trigger = $(this);
        var $item = $trigger.closest('.item');
        var item = $item.data('item');
        // item.find('toggle arrow').click();
        self.toggleArrow(false, true);
      });

      // TOGGLE PROMOTE

      this.find('toggle promote').on('click', function () {
        self.togglePromote($(this));
      });

      // TOGGLE DETAILS

      this.find('toggle details').on('click', function () {
        self.toggleDetails($(this));
      });

      cb();
    }
  }, {
    key: 'togglePromote',
    value: function togglePromote($trigger) {
      return _controllersTogglePromote2['default'].apply(this, [$trigger]);
    }
  }, {
    key: 'toggleArrow',
    value: function toggleArrow(showSubtype, showHarmony) {
      return _controllersToggleArrow2['default'].apply(this, [showSubtype, showHarmony]);
    }
  }, {
    key: 'toggleDetails',
    value: function toggleDetails($trigger) {

      var $item = $trigger.closest('.item');
      var item = $item.data('item');

      var d = this.domain;

      function showHideCaret() {
        if (item.find('details').hasClass('is-shown')) {
          $trigger.find('.caret').removeClass('hide');
        } else {
          $trigger.find('.caret').addClass('hide');
        }
      }

      if (item.find('promote').hasClass('is-showing')) {
        return false;
      }

      if (item.find('promote').hasClass('is-shown')) {
        item.find('toggle promote').find('.caret').addClass('hide');
        require('../../lib/util/nav').hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      if (item.find('collapsers hidden').length) {
        item.find('collapsers').show();
      }

      require('../../lib/util/nav').toggle(item.find('details'), item.template, d.intercept(function () {

        showHideCaret();

        if (item.find('details').hasClass('is-hidden') && item.find('collapsers visible').length) {
          item.find('collapsers').hide();
        }

        if (item.find('details').hasClass('is-shown')) {

          if (!item.find('details').hasClass('is-loaded')) {
            item.find('details').addClass('is-loaded');

            item.details.render(d.intercept());
          }

          if (hiders.length) {
            require('../../lib/util/nav').hide(hiders);
          }
        }
      }));
    }
  }]);

  return ItemCtrl;
})(_libAppController2['default']);

exports['default'] = ItemCtrl;
module.exports = exports['default'];