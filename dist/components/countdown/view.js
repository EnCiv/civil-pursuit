'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _cincoDist = require('cinco/dist');

var _panelView = require('../panel/view');

var _panelView2 = _interopRequireDefault(_panelView);

var CountDownView = (function (_Element) {
  function CountDownView(props) {
    var _this = this;

    _classCallCheck(this, CountDownView);

    _get(Object.getPrototypeOf(CountDownView.prototype), 'constructor', this).call(this, '#countdown');

    this.props = props;

    this.add(function () {
      var panel = new _panelView2['default']({ creator: false, title: 'Countdown' });

      panel.find('.items').get(0).add(new _cincoDist.Element('#countdown-panel').add(new _cincoDist.Element('header').add(new _cincoDist.Element('h2').text('Countdown to discussion'), new _cincoDist.Element('h1').text('Aug. 12, 2015 4:00 pm Pacific Standard Time'), new _cincoDist.Element('h2.dynamic-countdown').add(new _cincoDist.Element('span.countdown-days').text('0'), new _cincoDist.Element('span.countdown-days-label').text(' days T '), new _cincoDist.Element('span.countdown-hours').text('0'), new _cincoDist.Element('span').text(':'), new _cincoDist.Element('span.countdown-minutes').text('0'), new _cincoDist.Element('span').text(':'), new _cincoDist.Element('span.countdown-seconds').text('0')), new _cincoDist.Element('.row').add(new _cincoDist.Element('.watch-30.watch-push-20').add(new _cincoDist.Element('h4').text('Registered participants')), new _cincoDist.Element('.watch-30').add(new _cincoDist.Element('h4').text('Goal'))), new _cincoDist.Element('.row').add(new _cincoDist.Element('.watch-30.watch-push-20').add(new _cincoDist.Element('h2.discussion-registered').text('0')), new _cincoDist.Element('.watch-30').add(new _cincoDist.Element('h2.discussion-goal').text('0')))), new _cincoDist.Element('.row').add(new _cincoDist.Element('.phone-60.phone-push-20').add(new _cincoDist.Element('.gutter').add(new _cincoDist.Element('button.large.block.primary.radius.discussion-register_button').text('Register'), new _cincoDist.Element('h4.text-center.success.discussion-is_registered.hide').text('Thank you for registering!'))))), new _cincoDist.Element('.hide.discussion-invite_people.gutter-bottom').add(new _cincoDist.Element('h4.text-center').text('Invite the diverse people you know'), new _cincoDist.Element('.row').add(new _cincoDist.Element('.watch-50.watch-push-25').add(new _cincoDist.Element('a.button.primary.block.discussion-invite_people-button_email', { href: 'mailto:?subject=Democracy+Needs+You+-+Join+Me+in+Finding+the+Most+Important+Issues+in+our+Country&Body=Hi%0D%0A%0D%0AJoin+me+and+a+politically+diverse+group+of+people+on+http%3A%2F%2F' + _this.props.req.hostname + '+to+find+consensus+on+the+most+important+issues+in+our+country%2C+and+then+find+the+solutions+that+unit+us.+Synaccord+is+beta+testing+a+web+app+that+helps+people+have+structured+conversations+in+diverse+groups+so+they+find+the+solutions+that+unite+us+and+disrupt+the+polarization+and+paralysis+that+we+are+getting+now.+Try+it+out%2C+democracy+needs+you.%0D%0ABut+sign+up+quickly%2C+the+test+group+closes+and+the+discussion+starts+on+8%2F12%2F2015+at+4%3A00PM+PDT.%0D%0A%0D%0AThanks%21', target: '_blank' }).text('Email')))));

      return panel;
    });
  }

  _inherits(CountDownView, _Element);

  return CountDownView;
})(_cincoDist.Element);

exports['default'] = CountDownView;
module.exports = exports['default'];