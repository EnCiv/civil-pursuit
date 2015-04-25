! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var e = Html5.elem;

  var config = require('syn/config.json');

  var Page = require('syn/lib/Page');

  module.exports = function (locals) {

    var TopBar = e('.topbar', {}, [
      e('.topbar-right.hide', {}, [
        
        e('button.shy.online-now', {}, [
          e('span', { $text: 'Online now: ' }),
          e('span.online-users')
        ]),

        e('button.is-out.login-button', {
            $condition    :   function (locals) {
              return ! locals.user;
            }
          },
          [
            e('b', { $text: 'Login' })
          ]
        ),

        e('a.button.is-in', {
            href   :   Page('Profile'),
            title  :   'Profile'
          },
          [
            e('i.fa.fa-user')
          ]
        ),

        e('a.button.is-in', {
            href    :   Page('Sign Out'),
            title   :   'Sign out'
          },
          [
            e('i.fa.fa-sign-out')
          ]
        ),

        e('button.is-out.join-button', {
            $condition    :   function (locals) {
              return ! locals.user;
            }
          },
          [
            e('b', { $text: 'Join' })
          ]
        )

      ])
    ]);

    var Logo = e('#logo', {}, [

      e('a.pull-left', 
        {
          href: '/',
          'date-toggle':'tooltip',
          'data-placement': 'bottom',
          'title': 'Synaccord'
        },

        [

          e('img.img-responsive.logo-full', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_name_300x61_xyohja.png'
          }),

          e('img.img-responsive.logo-image.hide', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_64x61_znpxlc.png'
          })

        ]
      ),

      e('a.button.beta', { href: '/' , $text: 'Beta' })

    ]);

    return [TopBar, Logo];
  };

} ();
