'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var Details = (function (_Element) {
  function Details(props) {
    _classCallCheck(this, Details);

    _get(Object.getPrototypeOf(Details.prototype), 'constructor', this).call(this, 'section');

    this.add(this.invitePeople(), this.progressBar()).add(this.votes()).add(this.feedback());
  }

  _inherits(Details, _Element);

  _createClass(Details, [{
    key: 'invitePeople',
    value: function invitePeople() {
      return new _cincoDist.Element('section.feedback-pending.hide').add(new _cincoDist.Element('h4').text('Feedback pending'), new _cincoDist.Element('p').text('While you are waiting for your feedback this is a great time to invite the people you know to join the effort to bring synergy to democracy.'), new _cincoDist.Element('textarea.invite-people-body', {
        placeholder: 'Hey! I am participating in bringing synergy to democracy. Join me at '
      }), new _cincoDist.Element('button.invite-people').text('Send'), new _cincoDist.Element('hr'));
    }
  }, {
    key: 'progressBar',
    value: function progressBar() {
      return new _cincoDist.Element('.row').add(new _cincoDist.Element('.tablet-30.middle').add(new _cincoDist.Element('h4').text('Promoted')), new _cincoDist.Element('.tablet-70.middle').add(new _cincoDist.Element('.progress')));
    }
  }, {
    key: 'feedback',
    value: function feedback() {
      return new _cincoDist.Element('.details-feedbacks').add(new _cincoDist.Element('h4').text('Feedback'), new _cincoDist.Element('.feedback-list'));
    }
  }, {
    key: 'votes',
    value: function votes() {
      var votes = new _cincoDist.Elements();

      for (var i = 0; i < 4; i++) {
        votes.add(new _cincoDist.Element('.row.details-votes').add(new _cincoDist.Element('.tablet-30.middle').add(new _cincoDist.Element('h4', {
          'data-toggle': 'tooltip',
          'data-placement': 'top'
        }).text('Criteria')), new _cincoDist.Element('.tablet-70.middle').add(new _cincoDist.Element('svg.chart'))));
      }

      return votes;
    }
  }]);

  return Details;
})(_cincoDist.Element);

exports['default'] = Details;
module.exports = exports['default'];