! function () {
  
  'use strict';

  function load (cb) {
    var item = this;

    if ( app.cache.get('/views/Item') ) {
      item.template = $(app.cache.get('/views/Item')[0].outerHTML);
      
      if ( cb ) {
        cb(null, item.template);
      }

      return;
    }

    $.ajax({
      url: '/views/Item'
    })

      .error(cb)

      .success(function (data) {
        item.template = $(data);

        app.cache.set('/views/Item', item.template);

        cb(null, item.template);
      });

    return this;
  }

  module.exports = load;

} ();
