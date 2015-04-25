! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;

  var config = require('syn/config.json');

  module.exports = function (locals) {

    var TopBar                =   elem('.topbar');
    var TopBarRight           =   elem('.topbar-right.hide');
    var ButtonOnlineNow       =   elem('button.shy.online-now');
    var spanOnlineUsers       =   elem('span.online-users');
    var spanOnlineUsersLabel  =   elem('span', { $text: 'Online now: ' });
    var ButtonLoginButton     =   elem('button.is-out.login-button', {}, [
      elem('b', { $text: 'Login' }) ]);
    var ButtonJoinButton     =   elem('button.is-out.join-button', {}, [
      elem('b', { $text: 'Join' }) ]);
    var LinkToProfile         =   elem('a.button.is-in', {
      href                    :   '/page/profile',
      title                   :   'Profile'
    }, [elem('i.fa.fa-user')]);
    var LinkToSignOut         =   elem('a.button.is-in', {
      href                    :   '/sign/out',
      title                   :   'Sign out'
    }, [elem('i.fa.fa-user')]);

    TopBar.children.push(TopBarRight);

    TopBarRight.children.push(
      ButtonOnlineNow,
      ButtonLoginButton,
      LinkToProfile,
      LinkToSignOut,
      ButtonJoinButton
    );

    ButtonOnlineNow.children.push(spanOnlineUsersLabel, spanOnlineUsers);

    var Logo = elem('#logo', {}, [

      elem('a.pull-left', 
        {
          href: '/',
          'date-toggle':'tooltip',
          'data-placement': 'bottom',
          'title': 'Synaccord'
        },

        [

          elem('img.img-responsive.logo-full', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_name_300x61_xyohja.png'
          }),

          elem('img.img-responsive.logo-image.hide', {
            alt   :   'Synapp',
            src   :   'http://res.cloudinary.com/hscbexf6a/image/upload/e_make_transparent/v1415218424/Synaccord_logo_64x61_znpxlc.png'
          })

        ]
      ),

      elem('a.button.beta', { href: '/' , $text: 'Beta' })

    ]);

    return [TopBar, Logo];
  };

} ();
