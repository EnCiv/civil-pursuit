! function () {
  
  'use strict';

  var Promise = require('promise');

  function load (cb) {
    var panel = this;

    var q = new Promise(function (fulfill, reject) {

      if ( app.cache.template.panel ) {
        panel.template = $(app.cache.template.panel[0].outerHTML);
        
        return fulfill(panel.template);
      }

      $.ajax({
        url: '/partial/panel'
      })

        .error(reject)

        .success(function (data) {
          panel.template = $(data);

          app.cache.template.panel = $(data);

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
