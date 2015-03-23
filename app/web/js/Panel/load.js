! function () {
  
  'use strict';

  function load (cb) {
    var panel = this;

    if ( app.cache.template.panel ) {
      panel.template = $(app.cache.template.panel[0].outerHTML);
      
      if ( cb ) {
        cb(null, panel.template);
      }

      return;
    }

    $.ajax({
      url: '/partial/panel'
    })

      .error(cb)

      .success(function (data) {
        panel.template = $(data);

        app.cache.template.panel = panel.template;

        cb(null, panel.template);
      });

    return this;
  }

  module.exports = load;

} ();
