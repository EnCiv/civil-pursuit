! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;

  var config = require('syn/config.json');

  module.exports = function (locals) {

    var $ = {
      '.topbar'             :   elem('.topbar'),
      '.topbar-right'       :   elem('.topbar-right.hide'),
      'button.online-now'   :   elem('button.shy.online-now'),
      'span.online-users'   :   elem('span.online-users'),
      'onlineNowLabel'      :   elem('span', { $text: 'Online now: ' }),
      'button.login-button' :   elem('button.is-out.login-button'),
      'link to profile'     :   elem('a.button.is-in', {
        href                :   '/page/profile',
        title               :   'Profile'
      })
    }

    $('.topbar').children.push($('.topbar-right'));

    $('.topbar-right').children.push($('button.online-now'),
      $('button.login-button'));

    $('button.login-button').children.push(
      elem('b', { $text: 'Login' })
    );

    return [topbar];
  };

} ();
