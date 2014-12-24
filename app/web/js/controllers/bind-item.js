; ! function () {

  'use strict';

  module.exports = function bindItem (item, itemView) {
    console.info('[bind item]', { item: item, view: itemView });

    var app = this;

    itemView.find('.item-title').text(item.subject);
    itemView.find('.description').text(item.description);

    if ( ! item.references.length ) {
      itemView.find('.item-references').hide();
    }

    if ( item.image ) {

      var image = $('<img/>')

      image.addClass('img-responsive');
      image.attr('src', item.image);

      itemView.find('.item-media').append(image);
    }

  };

} ();
