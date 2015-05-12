! function Component_Intro_Controller () {

  'use strict';

  var Item        =   require('syn/components/Item/Controller');
  var readMore    =   require('syn/lib/util/ReadMore');

  function Intro () {}

  Intro.prototype.render = function () {

    app.socket.publish('get intro', function (intro) {

      $('#intro').find('.panel-title').text(intro.subject);

      $('#intro').find('.item-subject').text(intro.subject);

      $('#intro').find('.item-reference').remove();
      $('#intro').find('.item-buttons').remove();
      $('#intro').find('.item-arrow').remove();

      // adjustBox($('#intro .item'));

      $('#intro').find('.item-media')
        .empty().append(new Item(intro).media());

      $('#intro').find('.item-media img').load(function () {
        readMore(intro, $('#intro'));
      });

      setTimeout(function () {
        //new Truncate($('#intro'));
      });
    });
  };

  module.exports = Intro;

} ();
