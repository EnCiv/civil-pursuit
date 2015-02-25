! function () {
  
  'use strict';

  /**
   *  @function
   *  @return
   *  @arg
   */

  function load (cb) {
    var item = this;

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
