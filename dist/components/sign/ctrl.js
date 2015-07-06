'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _libAppController = require('../../lib/app/controller');

var _libAppController2 = _interopRequireDefault(_libAppController);

var Sign = (function (_Controller) {
  function Sign(props) {
    _classCallCheck(this, Sign);

    _get(Object.getPrototypeOf(Sign.prototype), 'constructor', this).call(this);

    this.props = props;
  }

  _inherits(Sign, _Controller);

  _createClass(Sign, [{
    key: 'render',
    value: function render() {}
  }]);

  return Sign;
})(_libAppController2['default']);

exports['default'] = Sign;

Sign.dialog = {

  login: (function (_login) {
    function login() {
      return _login.apply(this, arguments);
    }

    login.toString = function () {
      return _login.toString();
    };

    return login;
  })(function () {

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function afterOpen($vexContent) {
        $('.login-button').off('click').on('click', function () {
          vex.close();
        });

        login($vexContent);

        $vexContent.find('.forgot-password-link').on('click', function () {
          Sign.dialog.forgotPassword();
          vex.close($vexContent.data().vex.id);
          return false;
        });
      },

      afterClose: function afterClose() {
        $('.login-button').on('click', Sign.dialog.login);
      },

      message: $('#login').text(),

      buttons: [
      //- $.extend({}, vex.dialog.buttons.YES, {
      //-    text: 'Login'
      //-  }),

      $.extend({}, vex.dialog.buttons.NO, {
        text: 'x Close'
      })]
    });
  }),

  join: (function (_join) {
    function join() {
      return _join.apply(this, arguments);
    }

    join.toString = function () {
      return _join.toString();
    };

    return join;
  })(function () {

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function afterOpen($vexContent) {
        $('.join-button').off('click').on('click', function () {
          vex.close();
        });

        join($vexContent);
      },

      afterClose: function afterClose() {
        $('.join-button').on('click', Sign.dialog.join);
      },

      message: $('#join').text(),
      buttons: [
      //- $.extend({}, vex.dialog.buttons.YES, {
      //-    text: 'Login'
      //-  }),

      $.extend({}, vex.dialog.buttons.NO, {
        text: 'x Close'
      })],
      callback: function callback(value) {
        return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });
  }),

  forgotPassword: (function (_forgotPassword) {
    function forgotPassword() {
      return _forgotPassword.apply(this, arguments);
    }

    forgotPassword.toString = function () {
      return _forgotPassword.toString();
    };

    return forgotPassword;
  })(function () {

    console.log('helllo');

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function afterOpen($vexContent) {
        $('.forgot-password-link').off('click').on('click', function () {
          vex.close();
          return false;
        });

        forgotPassword($vexContent);
      },

      afterClose: function afterClose() {
        $('.forgot-password-link').on('click', Sign.dialog.forgotPassword);
      },

      message: $('#forgot-password').text(),
      buttons: [
      //- $.extend({}, vex.dialog.buttons.YES, {
      //-    text: 'Login'
      //-  }),

      $.extend({}, vex.dialog.buttons.NO, {
        text: 'x Close'
      })],
      callback: function callback(value) {
        return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });

    return false;
  })

};

// export default Sign;

// /*
//  *  ******************************************************
//  *  ******************************************************
//  *  ******************************************************

//  *  S   I   G   N

//  *  ******************************************************
//  *  ******************************************************
//  *  ******************************************************
// */

// ! function () {

//   'use strict';

//   var Nav             =   require('syn/lib/util/nav');
//   var login           =   require('syn/components/login/Controller');
//   var join            =   require('syn/components/join/Controller');
//   var forgotPassword  =   require('syn/components/ForgotPassword/Controller');

//   function Sign () {

//   }

//   Sign.prototype.render = function () {
//     // this.signIn();
//     // this.signUp();
//     // this.forgotPassword();

//     app.socket.on('online users', function (online) {
//       $('.online-users').text(online);
//     });

//     $('.topbar-right').removeClass('hide');

//     if ( ! app.socket.synuser ) {
//       $('.login-button').on('click', Sign.dialog.login);
//       $('.join-button').on('click', Sign.dialog.join);
//       $('.topbar .is-in').hide();
//     }

//     else {
//       $('.topbar .is-out').remove();
//     }
//   };

//   module.exports = Sign;

// } ();
module.exports = exports['default'];