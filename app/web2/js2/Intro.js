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

  var Truncate = require('./Truncate');

  function Intro () {

  }

  Intro.prototype.render = function () {
    app.socket.emit('get intro');

    app.socket.on('got intro', function (intro) {
      $('#intro').find('.panel-title').text(intro.subject);

      $('#intro').find('.item-title').text(intro.subject);

      $('#intro').find('.description').text(intro.description);

      $('#intro').find('.item-references').remove();

      new Truncate($('#intro'));
    });
  };

  module.exports = Intro;

} ();
