! function () {
  
  'use strict';

  function load (cb) {
    var item = this;

    if ( app.cache.template.item ) {
      item.template = $(app.cache.template.item[0].outerHTML);
      
      if ( cb ) {
        cb(null, item.template);
      }

      return;
    }

    $.ajax({
      url: '/partial/item'
    })

      .error(cb)

      .success(function (data) {
        item.template = $(data);

        app.cache.template.item = item.template;

        cb(null, item.template);
      });

    return this;
  }

  module.exports = load;

} ();
