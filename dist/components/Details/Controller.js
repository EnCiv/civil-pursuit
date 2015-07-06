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

var _synComponentsEditAndGoAgainController = require('syn/components/EditAndGoAgain/Controller');

var _synComponentsEditAndGoAgainController2 = _interopRequireDefault(_synComponentsEditAndGoAgainController);

var _synLibUtilNav = require('syn/lib/util/Nav');

var _synLibUtilNav2 = _interopRequireDefault(_synLibUtilNav);

var Details = (function (_Controller) {
  function Details(props, itemParent) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this);

    this.store = {
      item: null,
      details: null
    };

    if (props.item) {
      this.set('item', props.item);
    }

    this.props = props || {};

    this.itemParent = itemParent;

    this.template = itemParent.find('details');
  }

  _inherits(Details, _Controller);

  _createClass(Details, [{
    key: 'find',
    value: function find(name) {
      switch (name) {
        case 'promoted bar':
          return this.template.find('.progress');

        case 'feedback list':
          return this.template.find('.feedback-list');

        case 'votes':
          return this.template.find('.details-votes');

        case 'toggle edit and go again':
          return this.template.find('.edit-and-go-again-toggler');
      }
    }
  }, {
    key: 'render',
    value: function render(cb) {
      var self = this;

      var d = this.domain;

      var item = this.get('item');

      var currentAmount = item.popularity.number;

      if (isNaN(currentAmount)) {
        currentAmount = 0;
      }

      this.find('promoted bar').goalProgress({
        goalAmount: 100,
        currentAmount: currentAmount,
        textBefore: '',
        textAfter: '%'
      });

      this.find('toggle edit and go again').on('click', function () {
        NavProvider.unreveal(self.template, self.itemParent.template, d.intercept(function () {
          if (self.item.find('editor').find('form').length) {
            console.warn('already loaded');
          } else {
            var edit = new EditComponent(self.item);

            edit.get(d.intercept(function (template) {

              self.itemParent.find('editor').find('.is-section').append(template);

              NavProvider.reveal(self.item.find('editor'), self.item.template, d.intercept(function () {
                NavProvider.show(template, d.intercept(function () {
                  edit.render();
                }));
              }));
            }));
          }
        }));
      });

      if (this.socket.synuser) {
        $('.is-in').removeClass('is-in');
      }

      if (!self.details) {
        this.fetch();
      }
    }
  }, {
    key: 'votes',
    value: function votes(criteria, svg) {
      var details = this.get('details');

      setTimeout(function () {
        var vote = details.votes[criteria._id];

        console.info('vote', vote);

        svg.attr('id', 'chart-' + details.item._id + '-' + criteria._id);

        var data = [];

        // If no votes, show nothing

        if (!vote) {
          vote = {
            values: {
              '-1': 0,
              '0': 0,
              '1': 0
            },
            total: 0
          };
        }

        for (var number in vote.values) {
          data.push({
            label: 'number',
            value: vote.values[number] * 100 / vote.total
          });
        }

        var columns = ['votes'];

        data.forEach(function (d) {
          columns.push(d.value);
        });

        var chart = c3.generate({
          bindto: '#' + svg.attr('id'),
          data: {
            x: 'x',
            columns: [['x', -1, 0, 1], columns],
            type: 'bar'
          },
          grid: {
            x: {
              lines: 3
            }
          },
          axis: {
            x: {},
            y: {
              max: 90,
              show: false,
              tick: {
                count: 5,
                format: function format(y) {
                  return y;
                }
              }
            }
          },
          size: {
            height: 80
          },
          bar: {
            width: $(window).width() / 5
          }
        });
      }, 250);
    }
  }, {
    key: 'feedback',
    value: function feedback() {
      console.log('item has feedback?', this.get('item'));
    }
  }, {
    key: 'fetch',
    value: function fetch() {
      var _this = this;

      var self = this;

      var item = this.get('item');

      this.publish('get item details', item._id).subscribe(function (pubsub, details) {
        console.log('got item details', details);

        _this.set('details', details);

        // Feedback

        details.feedbacks.forEach(function (feedback) {
          var tpl = $('<div class="pretext feedback"></div>');
          tpl.text(feedback.feedback);
          _this.find('feedback list').append(tpl).append('<hr/>');
        });

        // Votes

        details.criterias.forEach(function (criteria, i) {
          _this.find('votes').eq(i).find('h4').text(criteria.name);

          _this.votes(criteria, _this.find('votes').eq(i).find('svg'));
        });
      });
    }
  }]);

  return Details;
})(_synLibAppController2['default']);

exports['default'] = Details;
module.exports = exports['default'];