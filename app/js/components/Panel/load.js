! function () {
  
  'use strict';

  var Promise = require('promise');

  function load (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      if ( app.cache.get('/views/Panel') ) {
        panel.template = $(app.cache.get('/views/Panel')[0].outerHTML);
        
        return fulfill(panel.template);
      }

      $.ajax({
        url: '/views/Panel'
      })

        .error(console.log.bind(console, 'error'))

        .success(function (data) {
          console.log('well yes', data);
          panel.template = $(data);

          app.cache.set('/views/Panel', $(data));

          fulfill(panel.template);
        });

    });

    if ( typeof cb === 'function' ) {
      q.then(cb.bind(null, null), cb);
    }

    return q;
  }

  module.exports = load;

} ();
