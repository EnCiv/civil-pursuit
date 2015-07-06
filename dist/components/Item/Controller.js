'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _synLibAppController = require('syn/lib/app/Controller');

var _synLibAppController2 = _interopRequireDefault(_synLibAppController);

var _synComponentsItemControllersMedia = require('syn/components/Item/controllers/media');

var _synComponentsItemControllersMedia2 = _interopRequireDefault(_synComponentsItemControllersMedia);

var _synComponentsItemView = require('syn/components/Item/View');

var _synComponentsItemView2 = _interopRequireDefault(_synComponentsItemView);

var _synComponentsPromoteController = require('syn/components/Promote/Controller');

var _synComponentsPromoteController2 = _interopRequireDefault(_synComponentsPromoteController);

var _synComponentsDetailsController = require('syn/components/Details/Controller');

var _synComponentsDetailsController2 = _interopRequireDefault(_synComponentsDetailsController);

var _string = require('string');

var _string2 = _interopRequireDefault(_string);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var _synLibUtilReadMore = require('syn/lib/util/ReadMore');

var _synLibUtilReadMore2 = _interopRequireDefault(_synLibUtilReadMore);

var _synComponentsItemControllersToggleArrow = require('syn/components/Item/controllers/toggle-arrow');

var _synComponentsItemControllersToggleArrow2 = _interopRequireDefault(_synComponentsItemControllersToggleArrow);

var _synComponentsItemControllersTogglePromote = require('syn/components/Item/controllers/toggle-promote');

var _synComponentsItemControllersTogglePromote2 = _interopRequireDefault(_synComponentsItemControllersTogglePromote);

var Item = (function (_Controller) {
  function Item(props) {
    var _this = this;

    _classCallCheck(this, Item);

    _get(Object.getPrototypeOf(Item.prototype), 'constructor', this).call(this);

    this.props = props || {};

    if (this.props.item) {
      this.set('item', this.props.item);
      this.socket.on('item changed ' + this.props.item._id, function (item) {
        _this.set('item', item);
        _this.render(function () {});
      });
    }

    this.componentName = 'Item';
    this.view = _synComponentsItemView2['default'];
  }

  _inherits(Item, _Controller);

  _createClass(Item, [{
    key: 'media',
    value: function media() {
      return _synComponentsItemControllersMedia2['default'].apply(this);
    }
  }, {
    key: 'makeRelated',
    value: function makeRelated() {
      var button = $('<button class="shy counter"><span class="related-number"></span> <i class="fa"></i></button>');

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

      var item = this.get('item');

      var self = this;

      // Create reference to promote if promotion enabled

      this.promote = new _synComponentsPromoteController2['default'](this.props, this);

      // Create reference to details

      this.details = new _synComponentsDetailsController2['default'](this.props, this);

      // Set ID

      this.template.attr('id', 'item-' + item._id);

      // Set Data

      this.template.data('item', this);

      // SUBJECT

      this.find('subject').attr('href', '/item/' + item.id + '/' + (0, _string2['default'])(item.subject).slugify().s).text(item.subject).on('click', function (e) {
        var link = $(this);

        var item = link.closest('.item');

        _synLibUtilNav2['default'].scroll(item, function () {
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

      // READ MORE

      this.find('media').find('img, iframe').on('load', (function () {
        if (!_this2.template.find('.more').length) {
          (0, _synLibUtilReadMore2['default'])(item, _this2.template);
        }
      }).bind(item));

      // REFERENCES

      if (item.references && item.references.length) {
        console.warn('has references', this.find('reference'));
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

      // CHILDREN

      if (!this.find('buttons').find('.related-number').length) {
        var buttonChildren = this.makeRelated();
        buttonChildren.addClass('children-count');
        buttonChildren.find('i').addClass('fa-fire');
        buttonChildren.find('.related-number').text(item.children);
        this.find('related').append(buttonChildren);
      }

      // HARMONY

      if ('harmony' in item) {
        var buttonHarmony = this.makeRelated();
        buttonHarmony.find('i').addClass('fa-music');
        buttonHarmony.find('.related-number').text(item.harmony);
        this.find('related').append(buttonHarmony);
      }

      this.template.find('.counter').on('click', function () {
        var $trigger = $(this);
        var $item = $trigger.closest('.item');
        var item = $item.data('item');
        item.find('toggle arrow').click();
      });

      // TOGGLE PROMOTE

      this.find('toggle promote').on('click', function () {
        self.togglePromote($(this));
      });

      // TOGGLE DETAILS

      this.find('toggle details').on('click', function () {
        self.toggleDetails($(this));
      });

      // TOGGLE ARROW

      this.find('toggle arrow').removeClass('hide').on('click', function () {
        self.toggleArrow($(this));
      });

      cb();
    }
  }, {
    key: 'togglePromote',
    value: function togglePromote($trigger) {
      return _synComponentsItemControllersTogglePromote2['default'].apply(this, [$trigger]);
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
        require('syn/lib/util/Nav').hide(item.find('promote'));
      }

      var hiders = $('.details.is-shown');

      if (item.find('collapsers hidden').length) {
        item.find('collapsers').show();
      }

      require('syn/lib/util/Nav').toggle(item.find('details'), item.template, d.intercept(function () {

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
            require('syn/lib/util/Nav').hide(hiders);
          }
        }
      }));
    }
  }, {
    key: 'toggleArrow',
    value: function toggleArrow($trigger) {
      return _synComponentsItemControllersToggleArrow2['default'].apply(this, [$trigger]);
    }
  }]);

  return Item;
})(_synLibAppController2['default']);

exports['default'] = Item;
module.exports = exports['default'];