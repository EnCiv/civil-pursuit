; ! function () {

  'use strict';

  module.exports = function bindItem (item, view) {
    console.info('[⇆]', 'bind item', { item: item, view: view });

    var app = this;

    view.find('.item-title').text(item.subject);
    view.find('.description').text(item.description);

    if ( ! item.references.length ) {
      view.find('.item-references').hide();
    }

    if ( item.image ) {

      var image = $('<img/>')

      image.addClass('img-responsive');
      image.attr('src', item.image);

      view.find('.item-media').append(image);
    }

  };

} ();
