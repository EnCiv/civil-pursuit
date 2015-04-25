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
    var ButtonLoginButton     =   elem('button.is-out.login-button');
    var linkToProfile         =   elem('a.button.is-in', {
      href                    :   '/page/profile',
      title                   :   'Profile'
    });

    TopBar.children.push(TopBarRight);

    TopBarRight.children.push(ButtonOnlineNow, ButtonLoginButton);

    ButtonOnlineNow.children.push(spanOnlineUsersLabel, spanOnlineUsers);

    ButtonLoginButton.children.push(elem('b', { $text: 'Login' }));

    return [TopBar];
  };

} ();
