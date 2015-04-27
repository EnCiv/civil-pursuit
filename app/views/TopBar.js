! function () {
  
  'use strict';

  var html5     = require('syn/lib/html5');

  var config    = require('syn/config.json');

  var Page        = require('syn/lib/Page');

  module.exports = function (locals) {

    var RightButtons = html5.Element('.topbar-right.hide', {}, [
      html5.Element('button.shy.online-now', {}, [
        html5.Element('span', { $text: 'Online now: ' }),
        html5.Element('span.online-users')
      ]),

      html5.Element('button.is-out.login-button', {
          $condition    :   function (locals) {
            return ! locals.user;
          }
        },
        [
          html5.Element('b', { $text: 'Login' })
        ]
      ),

      html5.Element('a.button.is-in', {
          href   :   Page('Profile'),
          title  :   'Profile'
        },
        [
          html5.Element('i.fa.fa-user')
        ]
      ),

      html5.Element('a.button.is-in', {
          href    :   Page('Sign Out'),
          title   :   'Sign out'
        },
        [
          html5.Element('i.fa.fa-sign-out')
        ]
      ),

      html5.Element('button.is-out.join-button', {
          $condition    :   function (locals) {
            return ! locals.user;
          }
        },
        [
          html5.Element('b', { $text: 'Join' })
        ]
      )
    ]);

    var Logo = html5.Element('#logo', {}, [

      html5.Element('a.pull-left', 
        {
          href: '/',
          'date-toggle':'tooltip',
          'data-placement': 'bottom',
          'title': 'Synaccord'
        },

        [

          html5.Element('img.img-responsive.logo-full', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_name_300x61_xyohja.png'
          }),

          html5.Element('img.img-responsive.logo-image.hide', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_64x61_znpxlc.png'
          })

        ]
      ),

      html5.Element('a.button.beta', { href: '/' , $text: 'Beta' })

    ]);

    return html5.Element('.topbar').add(RightButtons, Logo);
  };

} ();
