! function () {
  
  'use strict';

  // var Creator = require('../Creator');

  var Promise = require('promise');

  function render (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      panel.find('title').text(panel.type.name);

      panel.find('toggle creator').on('click', function () {
        panel.toggleCreator($(panel));
      });

      panel.template.attr('id', panel.getId());

      var creator = new (require('../Creator'))(panel);

      creator
        .render()
        .then(fulfill);

      panel.find('load more').on('click', function () {
        panel.fill();
        return false;
      });

      panel.find('create new').on('click', function () {
        panel.find('toggle creator').click();
        return false;
      });

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

  module.exports = render;

} ();
