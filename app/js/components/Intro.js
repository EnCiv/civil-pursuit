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
    console.log('new Intro')
  }

  Intro.prototype.render = function () {

    console.log('rendering intro')

    app.socket.publish('get intro', function (intro) {

      console.log('Got intro', intro)

      $('#intro').find('.panel-title').text(intro.subject);

      $('#intro').find('.item-subject').text(intro.subject);
      // $('#intro').find('.item-title').hide();

      // readMore(intro, $('#intro'));

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
