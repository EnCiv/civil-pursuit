! function () {
  
  'use strict';

  var html5       =   require('syn/lib/html5');
  var Element     =   html5.Element;
  var config      =   require('syn/config.json');
  var Page        =   require('syn/lib/app/Page');

  module.exports = function (locals) {

    var RightButtons = Element('.topbar-right.hide', {}, [
      Element('button.online-now', {}, [
        Element('span', { $text: 'Online now: ' }),
        Element('span.online-users')
      ]),

      Element('button.is-out.login-button', {
          $condition    :   function (locals) {
            return ! locals.user;
          }
        },
        [
          Element('b', { $text: 'Login' })
        ]
      ),

      Element('a.button.is-in', {
          href   :   Page('Profile'),
          title  :   'Profile'
        },
        [
          Element('i.fa.fa-user')
        ]
      ),

      Element('a.button.is-in', {
          href    :   Page('Sign Out'),
          title   :   'Sign out'
        },
        [
          Element('i.fa.fa-sign-out')
        ]
      ),

      Element('button.is-out.join-button', {
          $condition    :   function (locals) {
            return ! locals.user;
          }
        },
        [
          Element('b', { $text: 'Join' })
        ]
      )
    ]);

    var Logo = Element('#logo', {}, [

      Element('a.pull-left', 
        {
          href: '/',
          'date-toggle':'tooltip',
          'data-placement': 'bottom',
          'title': 'Synaccord'
        },

        [

          Element('img.img-responsive.logo-full', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_name_300x61_xyohja.png'
          }),

          Element('img.img-responsive.logo-image.hide', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_64x61_znpxlc.png'
          })

        ]
      ),

      Element('a.beta', { href: '/' , $text: 'Beta' })

    ]);

    return Element('.topbar').add(RightButtons, Logo);
  };

} ();
