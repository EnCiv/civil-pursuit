'use strict';

import Controller from 'syn/lib/app/Controller';

class Sign extends Controller {

  constructor (props) {
    super();

    this.props = props;
  }

  render () {
  }

}

export default Sign;

Sign.dialog = {

  login: function () {

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function ($vexContent) {
        $('.login-button')
          .off('click')
          .on('click', function () {
            vex.close();
          });

        login($vexContent);

        $vexContent.find('.forgot-password-link').on('click', function () {
          Sign.dialog.forgotPassword();
          vex.close($vexContent.data().vex.id);
          return false;
        });
      },

      afterClose: function () {
        $('.login-button').on('click', Sign.dialog.login);
      },

      message: $('#login').text(),

      buttons: [
         //- $.extend({}, vex.dialog.buttons.YES, {
         //-    text: 'Login'
         //-  }),

         $.extend({}, vex.dialog.buttons.NO, {
            text: 'x Close'
          })
      ]
    });
  },

  join: function () {

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function ($vexContent) {
        $('.join-button')
          .off('click')
          .on('click', function () {
            vex.close();
          });

        join($vexContent);
      },

      afterClose: function () {
        $('.join-button').on('click', Sign.dialog.join);
      },

      message: $('#join').text(),
      buttons: [
         //- $.extend({}, vex.dialog.buttons.YES, {
         //-    text: 'Login'
         //-  }),

         $.extend({}, vex.dialog.buttons.NO, {
            text: 'x Close'
          })
      ],
      callback: function(value) {
        return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });
  },

  forgotPassword: function () {

    console.log('helllo')

    vex.defaultOptions.className = 'vex-theme-flat-attack';

    vex.dialog.confirm({

      afterOpen: function ($vexContent) {
        $('.forgot-password-link')
          .off('click')
          .on('click', function () {
            vex.close();
            return false;
          });

        forgotPassword($vexContent);
      },

      afterClose: function () {
        $('.forgot-password-link').on('click', Sign.dialog.forgotPassword);
      },

      message: $('#forgot-password').text(),
      buttons: [
         //- $.extend({}, vex.dialog.buttons.YES, {
         //-    text: 'Login'
         //-  }),

         $.extend({}, vex.dialog.buttons.NO, {
            text: 'x Close'
          })
      ],
      callback: function(value) {
        return console.log(value ? 'Successfully destroyed the planet.' : 'Chicken.');
      },
      defaultOptions: {
        closeCSS: {
          color: 'red'
        }
      }
    });

    return false;
  }

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

//   var Nav             =   require('syn/lib/util/Nav');
//   var login           =   require('syn/components/Login/Controller');
//   var join            =   require('syn/components/Join/Controller');
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
