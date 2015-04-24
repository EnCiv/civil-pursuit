! function () {
  
  'use strict';

  var Html5 = require('syn/lib/html5');
  var elem = Html5.elem;
  var Panel = require('syn/views/Panel');
  var Item = require('syn/views/Item');

  module.exports = function (locals) {

    return [
      
      elem('.panels')

    ];

  };

} ();
