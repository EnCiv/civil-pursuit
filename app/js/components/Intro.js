/*
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 
 *  INTRO

 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
 *  ******************************************************
*/

! function Intro () {

  'use strict';

  var Truncate    =   require('syn/js/providers/Truncate');
  var Item        =   require('syn/js/components/Item');
  var readMore    =   require('syn/js/providers/ReadMore');

  function Intro () {

  }

  Intro.prototype.render = function () {
    app.socket.emit('get intro');

    app.socket.on('got intro', function (intro) {

      $('#intro').find('.panel-title').text(intro.subject);

      $('#intro').find('.item-subject').text(intro.subject);
      // $('#intro').find('.item-title').hide();

      readMore(intro, $('#intro'));

      $('#intro').find('.item-reference').remove();
      $('#intro').find('.item-buttons').remove();
      $('#intro').find('.item-arrow').remove();

      // adjustBox($('#intro .item'));

      $('#intro').find('.item-media')
        .empty().append(new Item(intro).media());

      setTimeout(function () {
        //new Truncate($('#intro'));
      });
    });
  };

  module.exports = Intro;

} ();
