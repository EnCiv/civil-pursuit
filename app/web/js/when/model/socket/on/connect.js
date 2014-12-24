! function () {

  'use strict';

  module.exports = function onModelSocketConnect (conn) {
    console.info('[✔]', "\tsocket \t", 'connected to web socket server');

    this.controller('get intro')();

    this.model('panels').push({ type: 'Topic' });
  };

} ();
