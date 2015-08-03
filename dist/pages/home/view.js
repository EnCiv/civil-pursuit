'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _componentsLayoutView = require('../../components/layout/view');

var _componentsLayoutView2 = _interopRequireDefault(_componentsLayoutView);

var _componentsIntroView = require('../../components/intro/view');

var _componentsIntroView2 = _interopRequireDefault(_componentsIntroView);

var _componentsTopLevelPanelView = require('../../components/top-level-panel/view');

var _componentsTopLevelPanelView2 = _interopRequireDefault(_componentsTopLevelPanelView);

var _componentsCountdownView = require('../../components/countdown/view');

var _componentsCountdownView2 = _interopRequireDefault(_componentsCountdownView);

var HomePage = (function (_Layout) {
  function HomePage(props) {
    _classCallCheck(this, HomePage);

    _get(Object.getPrototypeOf(HomePage.prototype), 'constructor', this).call(this, props);
    this.props = props;

    var main = this.find('#main').get(0);

    var topPanelProps = props;

    topPanelProps.countdown = true;

    main.add(new _componentsIntroView2['default'](props));

    if (props.discussion) {
      var deadline = new Date(props.discussion.deadline);

      var now = Date.now();

      var interval = deadline - now;

      if (interval < 0) {
        main.add(new _componentsTopLevelPanelView2['default'](topPanelProps));
      } else {
        main.add(new _componentsCountdownView2['default'](props));
      }
    } else {
      main.add(new _componentsTopLevelPanelView2['default'](topPanelProps));
    }
  }

  _inherits(HomePage, _Layout);

  return HomePage;
})(_componentsLayoutView2['default']);

exports['default'] = HomePage;
module.exports = exports['default'];