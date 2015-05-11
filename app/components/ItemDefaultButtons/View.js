! function () {
  
  'use strict';

  var html5               =   require('syn/lib/html5');

  module.exports = function () {

    var LoginButton = html5.Element('button.item-toggle-promote.shy');
      
    LoginButton.add(
      html5.Element('span.promoted', { $text: '0' }),
      html5.Element('i.fa.fa-bullhorn')
    );

    var JoinButton = html5.Element('button.item-toggle-details.shy');

    JoinButton.add(
      html5.Element('span.promoted-percent', { $text: '0%' }),
      html5.Element('i.fa.fa-signal')
    );

    var Related = html5.Element('div', {}, [html5.Element('span.related')]);

    return html5.Elements(
      LoginButton,
      html5.Element('div'),
      JoinButton,
      Related
    );

  };

} ();
